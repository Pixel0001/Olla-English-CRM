import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { packageCycles, packageSize, packagePayment, payablePackageNumber } from '@/lib/package-cycles'

/**
 * Pachete lunare de lecții per grupă.
 *
 * Regula de bază: grupa are un număr de lecții pe lună (implicit 8), achitate
 * indiferent dacă un elev vine sau nu. Numărul implicit stă pe grupă
 * (Group.monthlyLessons); o lună anume poate fi suprascrisă cu un
 * GroupLessonPackage — deci nu trebuie creat nimic manual în fiecare lună.
 *
 * Lecțiile efectuate se numără din sesiunile lunii. Prezențele sunt
 * informative: nu schimbă ce se achită.
 *
 * Grupele cu „Pachet de lecții" (billingType PACKAGE) nu urmează luna: pachetul
 * se reia când s-au ținut toate cele N lecții (vezi lib/package-cycles.js).
 * Prezențele rămân informative, la fel ca la cele lunare.
 *
 * Acces: adminii cu groups.view (groups.edit pentru modificări) sau
 * profesorul care deține grupa.
 */

const ACTIVE_STUDENT_STATUSES = ['ACTIVE', 'PAUSED']

async function resolveAccess(groupId) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Neautentificat', status: 401 }
  if (!groupId) return { error: 'groupId lipsește', status: 400 }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      id: true, name: true, teacherId: true, billingType: true,
      monthlyLessons: true, startDate: true, createdAt: true,
      packageLessons: true, packageStartedAt: true,
    },
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

// ── GET pentru grupele cu pachet fix: pachetul ales + istoricul pachetelor ──
async function packageResponse(group, access, searchParams) {
  const size = packageSize(group)

  const [groupStudents, allSessions] = await Promise.all([
    prisma.groupStudent.findMany({
      where: { groupId: group.id, status: { in: ACTIVE_STUDENT_STATUSES } },
      include: { student: { select: { id: true, fullName: true } } },
      orderBy: { enrolledAt: 'asc' },
    }),
    prisma.lessonSession.findMany({
      where: { groupId: group.id },
      select: {
        id: true,
        date: true,
        lessonsDeducted: true,
        attendances: { select: { studentId: true, status: true } },
      },
      orderBy: { date: 'asc' },
    }),
  ])

  const { cycles, current } = packageCycles(allSessions, size, group.packageStartedAt)
  const wanted = parseInt(searchParams.get('cycle') ?? '', 10)
  const selected = cycles.find((c) => c.number === wanted) || current

  // Plățile legate de pachetul afișat (forPackage), per elev
  const paymentRows = groupStudents.length
    ? await prisma.payment.findMany({
        where: {
          groupStudentId: { in: groupStudents.map((gs) => gs.id) },
          forPackage: selected.number,
        },
        select: { groupStudentId: true, forPackage: true, amount: true, paymentDate: true, debt: true },
      })
    : []
  const paymentsByStudent = {}
  for (const r of paymentRows) (paymentsByStudent[r.groupStudentId] ||= []).push(r)

  const attendanceOf = (session) => {
    const byStudent = {}
    for (const a of session.attendances) byStudent[a.studentId] = a.status
    return byStudent
  }

  const totalsByStudent = {}
  for (const ses of allSessions) {
    for (const a of ses.attendances) {
      const t = (totalsByStudent[a.studentId] ||= { present: 0, absent: 0 })
      if (a.status === 'PRESENT') t.present++
      else t.absent++
    }
  }

  const students = groupStudents.map((gs) => {
    const paid = packagePayment(paymentsByStudent[gs.id], selected.number)
    return {
      groupStudentId: gs.id,
      studentId: gs.studentId,
      name: gs.student.fullName,
      status: gs.status,
      lessonsRemaining: gs.lessonsRemaining,
      payment: paid && {
        amount: paid.amount,
        count: paid.count,
        lastDate: new Date(paid.lastDate).toISOString(),
        debt: paid.debt,
      },
      // Cine s-a înscris după ce pachetul s-a terminat n-avea cum să-l plătească
      notEnrolled: !!(selected.complete && selected.lastDate && gs.enrolledAt > selected.lastDate),
    }
  })

  const counted = students.filter((st) => !st.notEnrolled)
  const paidStats = {
    // achitat integral, achitat cu datorie rămasă, neachitat
    paid: counted.filter((st) => st.payment && !(st.payment.debt > 0)).length,
    withDebt: counted.filter((st) => st.payment && st.payment.debt > 0).length,
    unpaid: counted.filter((st) => !st.payment).length,
  }

  const sessions = selected.sessions.map((ses) => ({
    id: ses.id,
    date: ses.date.toISOString(),
    locked: ses.lessonsDeducted,
    attendance: attendanceOf(ses),
  }))

  const iso = (d) => (d ? new Date(d).toISOString() : null)

  return NextResponse.json({
    group: {
      id: group.id,
      name: group.name,
      billingType: 'PACKAGE',
      monthlyLessons: group.monthlyLessons ?? 8,
      packageLessons: size,
      startDate: (group.startDate || group.createdAt).toISOString(),
    },
    canEdit: access.canEdit,
    package: { total: size, isOverride: false, notes: null },
    students,
    sessions,
    stats: {
      total: size,
      held: selected.held,
      remaining: selected.remaining,
      extra: 0,
    },
    cycle: {
      number: selected.number,
      current: current.number,
      isCurrent: selected.number === current.number,
      // Pachetul pe care îl acoperă o plată făcută acum (cel curent, sau următorul dacă e plin)
      payableNumber: payablePackageNumber(current),
      size,
      held: selected.held,
      remaining: selected.remaining,
      complete: selected.complete,
      firstDate: iso(selected.firstDate),
      lastDate: iso(selected.lastDate),
      startedAt: iso(group.packageStartedAt),
    },
    completedCycles: cycles.filter((c) => c.complete).length,
    paidStats,
    cycleHistory: [...cycles].reverse().map((c) => ({
      number: c.number,
      total: c.total,
      held: c.held,
      remaining: c.remaining,
      complete: c.complete,
      firstDate: iso(c.firstDate),
      lastDate: iso(c.lastDate),
    })),
    history: [],
    studentTotals: students.map((st) => ({
      studentId: st.studentId,
      present: totalsByStudent[st.studentId]?.present || 0,
      absent: totalsByStudent[st.studentId]?.absent || 0,
    })),
    totalSessions: allSessions.length,
  })
}

// ── GET: luna curentă + istoricul lunar + totalurile per elev ────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const access = await resolveAccess(groupId)
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status })

    const { group } = access
    if (group.billingType === 'PACKAGE') return await packageResponse(group, access, searchParams)

    const { year, month } = parseMonthParams(searchParams)
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Lună invalidă' }, { status: 400 })
    }
    const { start, end } = monthRange(year, month)

    const [pkg, groupStudents, sessions, overrides, allSessions] = await Promise.all([
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
        select: { year: true, month: true, totalLessons: true },
      }),
      // Pentru istoric și totaluri: doar data + prezențele, fără alte relații
      prisma.lessonSession.findMany({
        where: { groupId },
        select: {
          id: true,
          date: true,
          lessonsDeducted: true,
          attendances: { select: { studentId: true, status: true } },
        },
        orderBy: { date: 'asc' },
      }),
    ])

    // Plățile lunii, per elev — luna nouă începe neachitată
    const monthPayments = await prisma.payment.findMany({
      where: {
        groupStudentId: { in: groupStudents.map((gs) => gs.id) },
        ...{
        OR: [
          { forYear: year, forMonth: month },
          {
            AND: [
              { forMonth: null },
              { paymentDate: { gte: start, lt: end } },
            ],
          },
        ],
      },
      },
      select: { groupStudentId: true, amount: true, paymentDate: true, lessonsAdded: true, debt: true },
      orderBy: { paymentDate: "desc" },
    })

    const paidByStudent = {}
    for (const p of monthPayments) {
      const acc = (paidByStudent[p.groupStudentId] ||= { amount: 0, count: 0, lastDate: null, lessons: 0, debt: 0 })
      acc.amount += p.amount || 0
      acc.debt = p.debt || acc.debt
      acc.count += 1
      acc.lessons += p.lessonsAdded || 0
      if (!acc.lastDate) acc.lastDate = p.paymentDate.toISOString()
    }

    const isIndividual = (group.billingType || 'MONTHLY') === 'INDIVIDUAL'

    const paymentsByStudent = {}
    if (isIndividual) {
      const rows = await prisma.payment.findMany({
        where: { groupStudentId: { in: groupStudents.map((gs) => gs.id) } },
        select: { groupStudentId: true, amount: true, paymentDate: true, lessonsAdded: true, debt: true },
        orderBy: { paymentDate: 'desc' },
      })
      for (const r of rows) {
        ;(paymentsByStudent[r.groupStudentId] ||= []).push({
          date: r.paymentDate.toISOString(),
          amount: r.amount || 0,
          lessons: r.lessonsAdded || 0,
        })
      }
    }

    const students = groupStudents.map((gs) => ({
      groupStudentId: gs.id,
      studentId: gs.studentId,
      name: gs.student.fullName,
      status: gs.status,
      lessonsRemaining: gs.lessonsRemaining,
      payment: paidByStudent[gs.id] || null,
      payments: isIndividual ? (paymentsByStudent[gs.id] || []) : undefined,
      lessonsBought: isIndividual
        ? (paymentsByStudent[gs.id] || []).reduce((sum, r) => sum + r.lessons, 0)
        : undefined,
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

    // Numărul implicit al grupei, suprascris doar dacă luna are pachet propriu
    const defaultLessons = group.monthlyLessons ?? 8
    const total = pkg?.totalLessons ?? defaultLessons
    const held = formattedSessions.length

    // ── Istoric lunar, din luna de start a grupei până în luna curentă ────
    const overrideMap = new Map(overrides.map((o) => [`${o.year}-${o.month}`, o.totalLessons]))
    const heldByMonth = new Map()
    const totalsByStudent = {}

    for (const s of allSessions) {
      const key = `${s.date.getFullYear()}-${s.date.getMonth() + 1}`
      heldByMonth.set(key, (heldByMonth.get(key) || 0) + 1)
      for (const a of s.attendances) {
        const t = (totalsByStudent[a.studentId] ||= { present: 0, absent: 0 })
        if (a.status === 'PRESENT') t.present++
        else t.absent++
      }
    }

    const firstDate = group.startDate || group.createdAt
    const history = []
    const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    while (cursor <= lastMonth) {
      const y = cursor.getFullYear()
      const m = cursor.getMonth() + 1
      const key = `${y}-${m}`
      const monthTotal = overrideMap.get(key) ?? defaultLessons
      const monthHeld = heldByMonth.get(key) || 0
      history.push({
        year: y,
        month: m,
        total: monthTotal,
        held: monthHeld,
        remaining: Math.max(monthTotal - monthHeld, 0),
        isOverride: overrideMap.has(key),
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }
    history.reverse() // cele mai recente primele

    const studentTotals = students.map((st) => ({
      studentId: st.studentId,
      present: totalsByStudent[st.studentId]?.present || 0,
      absent: totalsByStudent[st.studentId]?.absent || 0,
    }))

    const responseSessions = isIndividual
      ? allSessions.map((ses) => {
          const byStudent = {}
          for (const a of ses.attendances) byStudent[a.studentId] = a.status
          return {
            id: ses.id,
            date: ses.date.toISOString(),
            locked: ses.lessonsDeducted,
            attendance: byStudent,
          }
        })
      : formattedSessions

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        billingType: group.billingType || 'MONTHLY',
        monthlyLessons: defaultLessons,
        startDate: (group.startDate || group.createdAt).toISOString(),
      },
      canEdit: access.canEdit,
      year,
      month,
      package: {
        total,
        isOverride: !!pkg,
        notes: pkg?.notes || null,
      },
      students,
      sessions: responseSessions,
      stats: {
        total,
        held,
        remaining: Math.max(total - held, 0),
        extra: Math.max(held - total, 0),
      },
      history,
      studentTotals,
      totalSessions: allSessions.length,
    })
  } catch (error) {
    console.error('Eroare la citirea pachetului de lecții:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

// ── POST: suprascrie numărul de lecții pentru o lună anume ───────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { groupId, totalLessons, notes } = body

    const access = await resolveAccess(groupId)
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status })
    if (!access.canEdit) {
      return NextResponse.json({ error: 'Nu ai permisiunea să modifici grupele' }, { status: 403 })
    }
    if (access.group.billingType === 'PACKAGE') {
      return NextResponse.json({ error: 'Grupa are pachet fix — numărul de lecții se schimbă din formularul grupei' }, { status: 400 })
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

// ── DELETE: revine la numărul implicit al grupei pentru luna respectivă ──
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
    if (!existing) return NextResponse.json({ error: 'Luna nu are un număr propriu de lecții' }, { status: 404 })

    await prisma.groupLessonPackage.delete({ where: { id: existing.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Eroare la ștergerea pachetului de lecții:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
