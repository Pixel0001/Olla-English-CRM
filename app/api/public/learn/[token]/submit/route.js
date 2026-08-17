import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAnswer } from '@/lib/problem-utils'
import { getStudentLearningAccess, PAYMENT_LOCK_MESSAGE } from '@/lib/learning-access'
import { getMaxAttempts, gradeForAttempt, applyHintPenalty } from '@/lib/problem-scoring'
import { checkCooldown, computeXpAward, markProblemSolved } from '@/lib/student-limits'
import { awardEconomy } from '@/lib/economy'

// Trimite o submisie de problemă (din lecție sau random)
// POST { problemId, lessonId?, answer?, code?, source: 'lesson'|'random', timeSpent? }

export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const body = await req.json()
  const { problemId, lessonId, answer, code, source = 'lesson', timeSpent = 0, hintUsed: bodyHintUsed = false } = body
  if (!problemId) return NextResponse.json({ error: 'problemId obligatoriu' }, { status: 400 })

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, type: true, difficulty: true, correctAnswer: true, options: true, lessonId: true, points: true },
  })
  if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })

  // Verifică acces
  const access = await getStudentLearningAccess(student.id)
  if (source === 'random') {
    if (!access.canAccessRandom) {
      return NextResponse.json({ error: PAYMENT_LOCK_MESSAGE, locked: true, reason: 'PAYMENT_REQUIRED' }, { status: 403 })
    }
  } else if (lessonId) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { isFree: true, moduleId: true } })
    if (lesson && !access.canAccessLesson(lesson)) {
      return NextResponse.json({ error: PAYMENT_LOCK_MESSAGE, locked: true, reason: 'PAYMENT_REQUIRED' }, { status: 403 })
    }
  }

  // Submisii anterioare pentru aceeași problemă din aceeași lecție/source
  const prevSubs = await prisma.problemSubmission.findMany({
    where: {
      studentId: student.id,
      problemId,
      lessonId: lessonId || null,
      ...(source === 'random' ? { source: 'random' } : {}),
    },
    orderBy: { createdAt: 'asc' },
    select: { id: true, locked: true, status: true, grade: true, hintUsed: true, attemptNumber: true, autoCorrect: true },
  })

  if (prevSubs.some(s => s.locked)) {
    return NextResponse.json({
      error: source === 'random'
        ? 'Problemă blocată — generează altele.'
        : 'Problemă blocată. Resetează lecția pentru a încerca din nou.',
      locked: true,
    }, { status: 403 })
  }

  // Pentru lecții — blocăm rejucarea după ce e corectă; pentru random — permit retry
  if (source !== 'random') {
    const alreadyCorrect = prevSubs.some(s => s.status === 'GRADED' && (s.grade ?? 0) >= 60 && s.autoCorrect !== false)
    if (alreadyCorrect) {
      return NextResponse.json({
        error: 'Problemă deja rezolvată corect.',
        locked: true,
      }, { status: 403 })
    }
  }

  // Hint folosit pentru această problemă în această lecție
  let hintUsed = !!bodyHintUsed
  if (lessonId) {
    const progress = await prisma.lessonProgress.findUnique({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      select: { hintsUsed: true },
    })
    if (Array.isArray(progress?.hintsUsed) && progress.hintsUsed.includes(problemId)) hintUsed = true
  }
  if (prevSubs.some(s => s.hintUsed)) hintUsed = true

  const attemptNumber = prevSubs.length + 1
  const maxAttempts = getMaxAttempts(problem)

  // ── COOLDOWN: doar la PRIMA tentativă a unei probleme noi (nu pe retry-uri)
  // Cooldown per lecție: problemele din aceeași lecție nu sunt blocate între ele
  // La antrenament (random) sau lecții gratuite cooldown-ul nu se aplică deloc
  const lessonFree = lessonId ? (await prisma.lesson.findUnique({ where: { id: lessonId }, select: { isFree: true } }))?.isFree : false
  const lessonGranted = lessonId ? !!(await prisma.lessonAccess.findFirst({ where: { studentId: student.id, lessonId } })) : false
  if (attemptNumber === 1 && source !== 'random' && !lessonFree && !lessonGranted) {
    const cd = await checkCooldown(student.id, lessonId || null)
    if (!cd.allowed) {
      return NextResponse.json({
        error: `Așteaptă ${cd.remainingMin} min până la următoarea problemă.`,
        cooldown: true,
        remainingMin: cd.remainingMin,
        remainingMs: cd.remainingMs,
        cooldownMin: cd.cooldownMin,
        nextAllowedAt: cd.nextAllowedAt,
      }, { status: 429 })
    }
  }

  // Dacă vine cod (fără answer text), tratează mereu ca CODING → merge la profesor
  const isCoding = problem.type === 'CODING' || (code && !answer)

  let autoCorrect = null
  let status = 'PENDING'
  let grade = null
  let gradedAt = null
  let locked = false

  if (!isCoding) {
    const v = verifyAnswer(problem, answer || '')
    autoCorrect = v.isCorrect
    status = 'GRADED'
    gradedAt = new Date()
    if (problem.type === 'MULTIPLE_SELECT') {
      const pg = v.partialGrade ?? (v.isCorrect ? 100 : 0)
      grade = applyHintPenalty(Math.round(gradeForAttempt(problem, attemptNumber) * pg / 100), hintUsed)
      if (autoCorrect || attemptNumber >= maxAttempts) locked = true
    } else if (autoCorrect) {
      grade = applyHintPenalty(gradeForAttempt(problem, attemptNumber), hintUsed)
      locked = true
    } else {
      grade = 0
      if (attemptNumber >= maxAttempts) locked = true
    }
  }

  // ── XP cap zilnic — calculează xpAwarded pentru submisia auto-gradată
  let xpAwarded = null
  let xpInfo = null
  // MULTIPLE_SELECT: acordă XP și pentru răspunsuri parțiale (grade > 0)
  const xpThreshold = problem.type === 'MULTIPLE_SELECT' ? 1 : 60
  if (status === 'GRADED' && (grade ?? 0) >= xpThreshold) {
    const baseXp = Math.round((problem.points ?? 10) * (grade / 100))
    const award = await computeXpAward(student.id, baseXp)
    xpAwarded = award.awarded
    xpInfo = award
  }

  const sub = await prisma.problemSubmission.create({
    data: {
      studentId: student.id,
      problemId,
      lessonId: lessonId || null,
      answer: answer || null,
      code: code || null,
      source,
      difficulty: problem.difficulty,
      timeSpent: Number(timeSpent) || 0,
      autoCorrect,
      status,
      grade,
      gradedAt,
      attemptNumber,
      hintUsed,
      locked,
      xpAwarded,
    },
  })

  // ── Marchează cooldown după o rezolvare reușită
  if (status === 'GRADED' && (grade ?? 0) >= 60) {
    await markProblemSolved(student.id, lessonId || null)
  }

  // ── Gamification: Coins/Gems + Streak
  let economy = null
  if (status === 'GRADED') {
    economy = await awardEconomy({
      studentId: student.id,
      baseXp: xpAwarded || 0,
      problem: { type: problem.type, points: problem.points },
      grade: grade ?? 0,
      passed: (grade ?? 0) >= 60,
    })
  }

  // Marchează ca citite notificările REVISION_REQUEST pentru această problemă
  // (când elevul reia o problemă cerută la refacere, notificarea persistentă dispare)
  try {
    await prisma.notification.updateMany({
      where: {
        studentId: student.id,
        type: 'REVISION_REQUEST',
        read: false,
        AND: [
          { data: { path: ['problemId'], equals: problemId } },
        ],
      },
      data: { read: true },
    })
  } catch (e) {
    // Pe MongoDB filtrarea pe data JSON poate eșua silențios; fallback manual
    try {
      const notifs = await prisma.notification.findMany({
        where: { studentId: student.id, type: 'REVISION_REQUEST', read: false },
        select: { id: true, data: true },
      })
      const idsToRead = notifs.filter(n => n.data?.problemId === problemId).map(n => n.id)
      if (idsToRead.length > 0) {
        await prisma.notification.updateMany({
          where: { id: { in: idsToRead } },
          data: { read: true },
        })
      }
    } catch {}
  }

  return NextResponse.json({
    submission: sub,
    autoCorrect,
    attemptNumber,
    maxAttempts,
    locked,
    hintUsed,
    xpAwarded,
    xpInfo,
    economy,
  }, { status: 201 })
}
