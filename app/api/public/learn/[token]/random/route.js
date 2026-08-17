import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { smartRandomSelect, suggestNextDifficulty } from '@/lib/problem-utils'
import { getStudentLearningAccess, PAYMENT_LOCK_MESSAGE } from '@/lib/learning-access'

// Generează probleme random pentru elev când nu are acces la modulul următor
// GET ?difficulty=EASY|MEDIUM|HARD|RANDOM&count=3&topic=...
export async function GET(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })

  // Probleme random necesită abonament activ (sau super-elev)
  const access = await getStudentLearningAccess(student.id)
  if (!access.isActive) {
    return NextResponse.json({ error: 'Cont dezactivat', locked: true, reason: 'INACTIVE' }, { status: 403 })
  }
  if (!access.canAccessRandom) {
    return NextResponse.json({
      error: PAYMENT_LOCK_MESSAGE,
      locked: true,
      reason: 'PAYMENT_REQUIRED',
    }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  let difficulty = searchParams.get('difficulty') || 'RANDOM'
  const count = Math.min(10, Math.max(1, parseInt(searchParams.get('count') || '5', 10)))
  const moduleId = searchParams.get('moduleId') || undefined
  const onlyCompleted = searchParams.get('onlyCompleted') !== 'false' // default true

  // Sugestie auto-progresie
  const recent = await prisma.problemSubmission.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { problem: { select: { difficulty: true } } },
  })
  const suggestion = suggestNextDifficulty(
    recent.map(r => ({ isCorrect: !!r.autoCorrect || (r.grade ?? 0) >= 60, problem: r.problem })),
    recent[0]?.problem?.difficulty || 'EASY',
  )

  if (difficulty === 'RANDOM') difficulty = ['EASY', 'MEDIUM', 'HARD'][Math.floor(Math.random() * 3)]

  // Lecțiile completate de elev (theory done sau lesson finished)
  let completedLessonIds = null
  if (onlyCompleted) {
    const progresses = await prisma.lessonProgress.findMany({
      where: {
        studentId: student.id,
        OR: [{ completedAt: { not: null } }, { theoryCompleted: true }],
      },
      select: { lessonId: true },
    })
    completedLessonIds = progresses.map(p => p.lessonId)
    if (completedLessonIds.length === 0) {
      return NextResponse.json({
        student,
        problems: [],
        suggestion,
        empty: true,
        emptyReason: 'NO_COMPLETED_LESSONS',
      })
    }
  }

  const where = { active: true }
  if (difficulty !== 'ANY') where.difficulty = difficulty
  if (completedLessonIds) where.lessonId = { in: completedLessonIds }
  if (moduleId) where.lesson = { moduleId }

  // Evită problemele deja submise recent (ultimele 30 zile)
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentSubs = await prisma.problemSubmission.findMany({
    where: { studentId: student.id, createdAt: { gte: cutoff } },
    select: { problemId: true },
  })
  const recentSet = new Set(recentSubs.map(r => r.problemId))

  const candidates = await prisma.problem.findMany({
    where, take: 150,
    select: {
      id: true, title: true, description: true, type: true, difficulty: true, topic: true,
      options: true, starterCode: true, hint: true, points: true, language: true,
    },
  })
  const picked = smartRandomSelect(candidates, { count, recentProblemIds: recentSet })

  return NextResponse.json({ student, problems: picked, suggestion })
}
