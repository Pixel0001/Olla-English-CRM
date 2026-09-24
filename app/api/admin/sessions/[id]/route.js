import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { guardTeacherAction } from '@/lib/teacher-actions'
import { notifyCancelledLesson } from '@/lib/telegram'

/**
 * Corectarea unei lecții deja înregistrate, din panoul administrației.
 *
 * Partea delicată nu e formularul, ci contabilitatea: dacă lecția a fost
 * procesată („orele deduse"), atunci fiecare prezență schimbată trebuie să
 * întoarcă și cifrele — pachetul elevului și numărul de absențe. Altfel
 * corectarea ar arăta bine pe ecran și ar minți în rapoarte.
 */

const sessionInclude = {
  group: {
    include: {
      teacher: { select: { id: true, name: true } },
      groupStudents: { where: { status: { notIn: ['LEFT', 'TRANSFERRED'] } } },
    },
  },
  attendances: { include: { student: { select: { id: true, fullName: true } } } },
}

async function loadSession(id) {
  return prisma.lessonSession.findUnique({ where: { id }, include: sessionInclude })
}

/** Ce se întâmplă cu pachetul și absențele când o prezență se schimbă. */
async function applyAttendanceChange(lessonSession, attendance, nextStatus) {
  const groupStudent = lessonSession.group.groupStudents.find(
    (gs) => gs.studentId === attendance.studentId
  )
  const individual = lessonSession.group.billingType === 'INDIVIDUAL'

  if (nextStatus === attendance.status) return

  if (attendance.status === 'PRESENT' && nextStatus === 'ABSENT') {
    if (groupStudent) {
      await prisma.groupStudent.update({
        where: { id: groupStudent.id },
        data: {
          ...(individual ? { lessonsRemaining: { increment: 1 } } : {}),
          absences: { increment: 1 },
        },
      })
    }
    // Scăderea de atunci nu mai are obiect
    await prisma.lessonTransaction.deleteMany({
      where: { sessionId: lessonSession.id, studentId: attendance.studentId, delta: -1 },
    })
  } else if (attendance.status === 'ABSENT' && nextStatus === 'PRESENT') {
    if (groupStudent) {
      await prisma.groupStudent.update({
        where: { id: groupStudent.id },
        data: {
          ...(individual ? { lessonsRemaining: { decrement: 1 } } : {}),
          absences: { decrement: Math.min(1, groupStudent.absences || 0) },
        },
      })
    }
    await prisma.lessonTransaction.create({
      data: {
        studentId: attendance.studentId,
        groupId: lessonSession.groupId,
        sessionId: lessonSession.id,
        delta: -1,
        reason: `Lecție prezent (corectat) - ${new Date(lessonSession.date).toLocaleDateString('ro-RO')}`,
      },
    })
  }
}

// PATCH — data, notițele și prezența
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || !['SUPERADMIN', 'ADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const lessonSession = await loadSession(id)
    if (!lessonSession) {
      return NextResponse.json({ error: 'Sesiunea nu există' }, { status: 404 })
    }

    // Profesorul umblă doar la grupele lui
    if (
      !['SUPERADMIN', 'ADMIN'].includes(session.user.role) &&
      lessonSession.group.teacherId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Nu ai acces la această grupă' }, { status: 403 })
    }

    const denied = await guardTeacherAction(NextResponse, 'teacher.session.edit', lessonSession.createdAt)
    if (denied) return denied

    // Prezențele, una câte una, cu contabilitatea la zi
    if (Array.isArray(body.attendances)) {
      for (const change of body.attendances) {
        const current = lessonSession.attendances.find((a) => a.id === change.id)
        if (!current) continue

        const nextStatus = change.status === 'PRESENT' ? 'PRESENT' : 'ABSENT'

        // Cifrele se mișcă doar dacă lecția fusese deja procesată; altfel
        // deducerea de mai târziu va citi statusul corect oricum.
        if (lessonSession.lessonsDeducted) {
          await applyAttendanceChange(lessonSession, current, nextStatus)
        }

        await prisma.attendance.update({
          where: { id: current.id },
          data: {
            status: nextStatus,
            ...(change.notes !== undefined ? { notes: change.notes || null } : {}),
          },
        })
      }
    }

    const data = {}
    if (body.notes !== undefined) data.notes = body.notes || null
    if (body.date) {
      const parsed = new Date(body.date)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: 'Data nu e validă' }, { status: 400 })
      }
      data.date = parsed
    }

    if (Object.keys(data).length > 0) {
      await prisma.lessonSession.update({ where: { id }, data })
    }

    return NextResponse.json({ success: true, session: await loadSession(id) })
  } catch (error) {
    console.error('Eroare la corectarea sesiunii:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — șterge lecția și dă înapoi ce s-a scăzut pentru ea
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Neautentificat' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lessonSession = await loadSession(id)
    if (!lessonSession) {
      return NextResponse.json({ error: 'Sesiunea nu există' }, { status: 404 })
    }

    if (
      !['SUPERADMIN', 'ADMIN'].includes(session.user.role) &&
      lessonSession.group.teacherId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Nu ai acces la această grupă' }, { status: 403 })
    }

    const denied = await guardTeacherAction(NextResponse, 'teacher.session.delete', lessonSession.createdAt)
    if (denied) return denied

    // Lecția procesată se desface înainte de ștergere: orele se întorc în
    // pachete, absențele se scad.
    if (lessonSession.lessonsDeducted) {
      const individual = lessonSession.group.billingType === 'INDIVIDUAL'
      for (const attendance of lessonSession.attendances) {
        const groupStudent = lessonSession.group.groupStudents.find(
          (gs) => gs.studentId === attendance.studentId
        )
        if (!groupStudent) continue

        if (attendance.status === 'PRESENT' && individual) {
          await prisma.groupStudent.update({
            where: { id: groupStudent.id },
            data: { lessonsRemaining: { increment: 1 } },
          })
        } else if (attendance.status === 'ABSENT') {
          await prisma.groupStudent.update({
            where: { id: groupStudent.id },
            data: { absences: { decrement: Math.min(1, groupStudent.absences || 0) } },
          })
        }
      }
      await prisma.lessonTransaction.deleteMany({ where: { sessionId: id } })
    }

    await notifyCancelledLesson(
      lessonSession.group.name,
      lessonSession.group.teacher?.name || '—',
      lessonSession.group.level,
      new Date(lessonSession.date).toLocaleTimeString('ro-RO', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest',
      }),
      false
    ).catch(() => {})

    await prisma.notification.create({
      data: {
        type: 'CANCELLED_SESSION',
        title: `🚫 Lecție ștearsă: ${lessonSession.group.name}`,
        message:
          `Lecția din ${new Date(lessonSession.date).toLocaleDateString('ro-RO')} ` +
          `(grupa „${lessonSession.group.name}") a fost ștearsă de ${session.user.name}.`,
        link: `/admin/groups/${lessonSession.groupId}`,
        recipientId: null,
        groupId: lessonSession.groupId,
      },
    }).catch(() => {})

    await prisma.lessonSession.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Eroare la ștergerea sesiunii:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
