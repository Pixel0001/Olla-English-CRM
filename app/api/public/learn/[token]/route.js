import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PAYMENT_LOCK_MESSAGE } from '@/lib/learning-access'

// Date dashboard pentru elev: modulele cu accesul lui + lecții free pe modulele fără acces
export async function GET(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true, active: true, superStudent: true, grade: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) {
    return NextResponse.json({ error: 'Cont dezactivat', locked: true, reason: 'INACTIVE' }, { status: 403 })
  }

  const [latestPayment, modules, accesses, advances, progresses, bonusPoints] = await Promise.all([
    prisma.learningPayment.findFirst({
      where: { studentId: student.id },
      orderBy: { paymentDate: 'desc' },
    }),
    prisma.learningModule.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        lessons: {
          where: { active: true },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, slug: true, order: true, isFree: true, _count: { select: { problems: true } } },
        },
      },
    }),
    prisma.moduleAccess.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.moduleAdvance.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.lessonProgress.findMany({
      where: { studentId: student.id },
      select: { lessonId: true, theoryCompleted: true, currentProblemIndex: true, completedAt: true },
    }),
    prisma.bonusPoint.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      include: { addedBy: { select: { name: true } } },
    }),
  ])

  const accessSet = new Set(accesses.map(a => a.moduleId))
  const advanceSet = new Set(advances.map(a => a.moduleId))
  const progressMap = new Map(progresses.map(p => [p.lessonId, p]))

  // Filtrare module dupa clasa elevului
  // Daca grades=[] → modul vizibil pentru toți; altfel doar pentru clasele specificate
  const studentGrade = student.grade
  const visibleModules = modules.filter(m => {
    if (!m.grades || m.grades.length === 0) return true // fara restrictie de clasa
    if (!studentGrade) return true // elevul nu are clasa setata → vede tot
    return m.grades.includes(studentGrade)
  })

  // Subscription state
  const isSuper = !!student.superStudent
  const expiresAtMs = latestPayment ? new Date(latestPayment.expiresAt).getTime() : null
  const daysLeft = expiresAtMs !== null
    ? Math.ceil((expiresAtMs - Date.now()) / 86400000)
    : null
  const subscriptionActive = expiresAtMs !== null && expiresAtMs > Date.now()
  const expired = expiresAtMs !== null && expiresAtMs <= Date.now()
  const noPayment = !latestPayment
  const showPaymentLock = !isSuper && (expired || noPayment)
  const hasAnyManualAccess = accessSet.size > 0
  const canAccessRandom = isSuper || subscriptionActive || hasAnyManualAccess

  const subscription = {
    isSuper,
    hasPayment: !!latestPayment,
    expiresAt: latestPayment?.expiresAt ?? null,
    amount: latestPayment?.amount ?? null,
    currency: latestPayment?.currency ?? null,
    daysLeft,
    active: subscriptionActive,
    expired,
    expiringSoon: daysLeft !== null && daysLeft >= 0 && daysLeft <= 3,
    showPaymentLock,
    canAccessRandom,
    lockMessage: PAYMENT_LOCK_MESSAGE,
  }

  // Modulele sunt independente — nu necesită terminarea modulului anterior
  const enriched = visibleModules.map((m) => {
    const hasManualAccess = accessSet.has(m.id)
    const hasFullAccess = isSuper || subscriptionActive || hasManualAccess
    const unlocked = true // modulele sunt mereu vizibile
    return {
      id: m.id,
      slug: m.slug,
      title: m.title,
      description: m.description,
      language: m.language,
      coverImage: m.coverImage,
      order: m.order,
      unlocked,
      hasFullAccess,
      hasManualAccess,
      advanceGranted: advanceSet.has(m.id),
      lessons: m.lessons.map(l => ({
        ...l,
        accessible: hasFullAccess || l.isFree,
        progress: progressMap.get(l.id) || null,
      })),
    }
  })

  return NextResponse.json({ student, modules: enriched, subscription, bonusPoints })
}
