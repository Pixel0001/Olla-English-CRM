import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/public/sets/[token]
 * Public endpoint — elev accesează un set prin token, fără cont.
 * Returnează problemele (FĂRĂ explicații/corectAnswer dacă policy nu permite),
 * status sesiune și attempt-urile existente.
 */
export async function GET(_req, { params }) {
  const { token } = await params

  const set = await prisma.generatedSet.findUnique({
    where: { accessToken: token },
    include: {
      student: { select: { id: true, fullName: true } },
      setProblems: {
        orderBy: { order: 'asc' },
        include: { problem: true },
      },
      attempts: true,
    },
  })

  if (!set) return NextResponse.json({ error: 'Set inexistent' }, { status: 404 })

  // Construim mapping problemId -> attempt (cea mai recentă)
  const attemptByProblem = new Map()
  for (const a of set.attempts) {
    const cur = attemptByProblem.get(a.problemId)
    if (!cur || new Date(a.createdAt) > new Date(cur.createdAt)) {
      attemptByProblem.set(a.problemId, a)
    }
  }

  const isCompleted = !!set.completedAt
  const policy = set.explanationPolicy

  // Sanitizăm fiecare problemă în funcție de policy
  const problems = set.setProblems.map(sp => {
    const p = sp.problem
    const attempt = attemptByProblem.get(p.id) || null

    // Decidem dacă afișăm explicația / răspunsul corect
    let canSeeExplanation = false
    if (policy === 'ALWAYS') canSeeExplanation = true
    else if (policy === 'AFTER_ANSWER') canSeeExplanation = !!attempt
    else if (policy === 'AFTER_SET') canSeeExplanation = isCompleted

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      topic: p.topic,
      subtopic: p.subtopic,
      type: p.type,
      options: p.options,
      starterCode: p.starterCode,
      hint: p.hint,
      estimatedTime: p.estimatedTime,
      points: p.points,
      language: p.language,
      order: sp.order,
      // Atenție: nu trimitem correctAnswer decât când e permis
      explanation: canSeeExplanation ? p.explanation : null,
      correctAnswer: canSeeExplanation ? p.correctAnswer : null,
      canSeeExplanation,
      attempt: attempt ? {
        id: attempt.id,
        answer: attempt.answer,
        isCorrect: attempt.isCorrect,
        attempts: attempt.attempts,
        pointsAwarded: attempt.pointsAwarded,
        createdAt: attempt.createdAt,
      } : null,
    }
  })

  // Scor: suma pointsAwarded + total puncte posibile
  const totalPoints = set.setProblems.reduce((s, sp) => s + (sp.problem.points || 0), 0)
  const earnedPoints = problems.reduce((s, p) => s + (p.attempt?.pointsAwarded || 0), 0)
  const correctCount = problems.filter(p => p.attempt?.isCorrect).length

  return NextResponse.json({
    set: {
      id: set.id,
      title: set.title,
      explanationPolicy: set.explanationPolicy,
      timeLimit: set.timeLimit,
      startedAt: set.startedAt,
      completedAt: set.completedAt,
      student: set.student,
    },
    problems,
    score: {
      correct: correctCount,
      total: problems.length,
      earnedPoints,
      totalPoints,
    },
  })
}

/**
 * POST /api/public/sets/[token]
 * Acțiuni: { action: 'start' | 'complete' }
 */
export async function POST(request, { params }) {
  const { token } = await params
  const { action } = await request.json()

  const set = await prisma.generatedSet.findUnique({ where: { accessToken: token } })
  if (!set) return NextResponse.json({ error: 'Set inexistent' }, { status: 404 })

  if (action === 'start' && !set.startedAt) {
    const updated = await prisma.generatedSet.update({
      where: { id: set.id },
      data: { startedAt: new Date() },
    })
    return NextResponse.json({ ok: true, startedAt: updated.startedAt })
  }
  if (action === 'complete' && !set.completedAt) {
    const updated = await prisma.generatedSet.update({
      where: { id: set.id },
      data: { completedAt: new Date() },
    })
    return NextResponse.json({ ok: true, completedAt: updated.completedAt })
  }

  return NextResponse.json({ ok: true })
}
