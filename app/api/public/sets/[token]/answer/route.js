import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAnswer } from '@/lib/problem-utils'

export const dynamic = 'force-dynamic'

/**
 * POST /api/public/sets/[token]/answer
 * Body: { problemId, answer, timeSpent? }
 * Răspunde cu { isCorrect, pointsAwarded, attempt, explanation? }
 */
export async function POST(request, { params }) {
  const { token } = await params
  try {
    const body = await request.json()
    const { problemId, answer, timeSpent = 0 } = body
    if (!problemId || answer === undefined) {
      return NextResponse.json({ error: 'problemId și answer sunt obligatorii' }, { status: 400 })
    }

    const set = await prisma.generatedSet.findUnique({
      where: { accessToken: token },
      include: { setProblems: true },
    })
    if (!set) return NextResponse.json({ error: 'Set inexistent' }, { status: 404 })

    if (set.completedAt) {
      return NextResponse.json({ error: 'Setul a fost deja finalizat' }, { status: 400 })
    }

    const inSet = set.setProblems.find(sp => sp.problemId === problemId)
    if (!inSet) {
      return NextResponse.json({ error: 'Problema nu face parte din acest set' }, { status: 400 })
    }

    const problem = await prisma.problem.findUnique({ where: { id: problemId } })
    if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })

    const { isCorrect, normalizedAnswer } = verifyAnswer(problem, answer)
    const pointsAwarded = isCorrect ? (problem.points || 10) : 0

    // Caută atempt anterior pentru aceeași problemă în acest set
    const existing = await prisma.problemAttempt.findFirst({
      where: { setId: set.id, problemId, studentId: set.studentId || undefined },
      orderBy: { createdAt: 'desc' },
    })

    let attempt
    if (existing && !existing.isCorrect) {
      // Update — incrementăm încercările
      attempt = await prisma.problemAttempt.update({
        where: { id: existing.id },
        data: {
          answer: String(answer),
          isCorrect,
          attempts: existing.attempts + 1,
          timeSpent: existing.timeSpent + (Number(timeSpent) || 0),
          pointsAwarded,
        },
      })
    } else if (existing && existing.isCorrect) {
      // Deja corect — nu mai modificăm
      attempt = existing
    } else {
      // Primul attempt
      attempt = await prisma.problemAttempt.create({
        data: {
          studentId: set.studentId || undefined,
          problemId,
          setId: set.id,
          answer: String(answer),
          isCorrect,
          attempts: 1,
          timeSpent: Number(timeSpent) || 0,
          pointsAwarded,
        },
      })
    }

    // Marcăm startedAt dacă nu e setat
    if (!set.startedAt) {
      await prisma.generatedSet.update({ where: { id: set.id }, data: { startedAt: new Date() } })
    }

    // Decidem dacă includem explicația în răspuns
    let canSeeExplanation = false
    if (set.explanationPolicy === 'ALWAYS') canSeeExplanation = true
    else if (set.explanationPolicy === 'AFTER_ANSWER') canSeeExplanation = true
    else if (set.explanationPolicy === 'AFTER_SET') canSeeExplanation = false

    return NextResponse.json({
      isCorrect,
      pointsAwarded,
      attempt: {
        id: attempt.id,
        attempts: attempt.attempts,
        isCorrect: attempt.isCorrect,
        pointsAwarded: attempt.pointsAwarded,
      },
      explanation: canSeeExplanation ? problem.explanation : null,
      correctAnswer: canSeeExplanation ? problem.correctAnswer : null,
    })
  } catch (e) {
    console.error('Answer submit error:', e)
    return NextResponse.json({ error: 'Eroare la trimitere' }, { status: 500 })
  }
}
