import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

/**
 * Pachete lunare de lecții per grupă (de regulă 8 lecții/lună).
 * Lecțiile efectuate se numără din sesiunile lunii; pachetul e informativ
 * și nu atinge contorul de lecții per elev.
 *
 * Acces: adminii cu permisiunea groups.view (groups.edit pentru modificări)
 * sau profesorul care deține grupa.
 */

const ACTIVE_STUDENT_STATUSES = ['ACTIVE', 'PAUSED']

async function resolveAccess(groupId) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Neautentificat', status: 401 }
  if (!groupId) return { error: 'groupId lipsește', status: 400 }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { id: true, name: true, teacherId: true },
  })
  if (!group) return { error: 'Grupa nu există', status: 404 }

  const isAdmin = ['SUPERADMIN', 'ADMIN'].includes(session.user.role)

  if (isAdmin) {
    const canView = await checkPermission('groups.view')
    if (!canView.allowed) return { error: 'Nu ai permisiunea să vezi grupele', status: 403 }
    const canEditPerm = await checkPermission('groups.edit')
    return { group, canEdit: canEditPerm.allowed, userId: session.user.id }
  }

  if (group.teacherId === session.user.id) {
    return { group, canEdit: true, userId: session.user.id }
  }

  return { error: 'Nu ai acces la această grupă', status: 403 }
}

function monthRange(year, month) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const end = new Date(year, month, 1, 0, 0, 0, 0)
  return { start, end }
}

function parseMonthParams(searchParams) {
  const now = new Date()
  const year = parseInt(searchParams.get('year') ?? '', 10) || now.getFullYear()
  const month = parseInt(searchParams.get('month') ?? '', 10) || now.getMonth() + 1
  return { year, month }
}

// ── GET: pachetul lunii + sesiunile lunii + prezențele elevilor ──────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const access = await resolveAccess(groupId)
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status })

    const { year, month } = parseMonthParams(searchParams)
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Lună invalidă' }, { status: 400 })
    }
    const { start, end } = monthRange(year, month)

    const [pkg, groupStudents, sessions, allPackages] = await Promise.all([
      prisma.groupLessonPackage.findFirst({ where: { groupId, year, month } }),
      prisma.groupStudent.findMany({
        where: { groupId, status: { in: ACTIVE_STUDENT_STATUSES } },
        include: { student: { select: { id: true, fullName: true } } },
        orderBy: { enrolledAt: 'asc' },
      }),
      prisma.lessonSession.findMany({
        where: { groupId, date: { gte: start, lt: end } },
        include: { attendances: { select: { studentId: true, status: true } } },
        orderBy: { date: 'asc' },
      }),
      prisma.groupLessonPackage.findMany({
        where: { groupId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        select: { id: true, year: true, month: true, totalLessons: true },
      }),
    ])

    const students = groupStudents.map((gs) => ({
      groupStudentId: gs.id,
      studentId: gs.studentId,
      name: gs.student.fullName,
      status: gs.status,
    }))

    const formattedSessions = sessions.map((s) => {
      const byStudent = {}
      for (const a of s.attendances) byStudent[a.studentId] = a.status
      return {
        id: s.id,
        date: s.date.toISOString(),
        locked: s.lessonsDeducted,
        attendance: byStudent,
      }
    })

    const held = formattedSessions.length
    const total = pkg?.totalLessons ?? null

    return NextResponse.json({
      group: { id: access.group.id, name: access.group.name },
      canEdit: access.canEdit,
      package: pkg
        ? {
            id: pkg.id,
            year: pkg.year,
            month: pkg.month,
            totalLessons: pkg.totalLessons,
            notes: pkg.notes,
          }
        : null,
      months: allPackages,
      year,
      month,
      students,
      sessions: formattedSessions,
      stats: {
        total,
        held,
        remaining: total === null ? null : Math.max(total - held, 0),
        extra: total === null ? 0 : Math.max(held - total, 0),
      },
    })
  } catch (error) {
    console.error('Eroare la citirea pachetului de lecții:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

// ── POST: creează sau actualizează pachetul lunii ────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { groupId, totalLessons, notes } = body

    const access = await resolveAccess(groupId)
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status })
    if (!access.canEdit) {
      return NextResponse.json({ error: 'Nu ai permisiunea să modifici grupele' }, { status: 403 })
    }

    const now = new Date()
    const year = parseInt(body.year, 10) || now.getFullYear()
    const month = parseInt(body.month, 10) || now.getMonth() + 1
    const lessons = parseInt(totalLessons, 10)

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Lună invalidă' }, { status: 400 })
    }
    if (!Number.isFinite(lessons) || lessons < 1 || lessons > 60) {
      return NextResponse.json({ error: 'Numărul de lecții trebuie să fie între 1 și 60' }, { status: 400 })
    }

    const existing = await prisma.groupLessonPackage.findFirst({ where: { groupId, year, month } })

    const pkg = existing
      ? await prisma.groupLessonPackage.update({
          where: { id: existing.id },
          data: { totalLessons: lessons, notes: notes?.trim() || null },
        })
      : await prisma.groupLessonPackage.create({
          data: {
            groupId,
            year,
            month,
            totalLessons: lessons,
            notes: notes?.trim() || null,
            createdById: access.userId,
          },
        })

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Eroare la salvarea pachetului de lecții:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

// ── DELETE: șterge pachetul unei luni ────────────────────────────────────
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    const access = await resolveAccess(groupId)
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status })
    if (!access.canEdit) {
      return NextResponse.json({ error: 'Nu ai permisiunea să modifici grupele' }, { status: 403 })
    }

    const { year, month } = parseMonthParams(searchParams)
    const existing = await prisma.groupLessonPackage.findFirst({ where: { groupId, year, month } })
    if (!existing) return NextResponse.json({ error: 'Pachetul nu există' }, { status: 404 })

    await prisma.groupLessonPackage.delete({ where: { id: existing.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Eroare la ștergerea pachetului de lecții:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
