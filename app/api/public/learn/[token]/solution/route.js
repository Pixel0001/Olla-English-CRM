import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'

// POST { problemId, lessonId } - elevul cere să vadă rezolvarea
// → creează submisie cu grade=0, locked=true, solutionViewed=true
// → returnează correctAnswer + explanation
// După asta problema e blocată; doar reset lecție o redeschide
export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const { problemId, lessonId, source = 'lesson' } = await req.json()
  if (!problemId) {
    return NextResponse.json({ error: 'problemId obligatoriu' }, { status: 400 })
  }
  if (source !== 'random' && !lessonId) {
    return NextResponse.json({ error: 'lessonId obligatoriu' }, { status: 400 })
  }

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, correctAnswer: true, explanation: true, type: true, difficulty: true, options: true, points: true },
  })
  if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })

  const prevSubs = await prisma.problemSubmission.findMany({
    where: {
      studentId: student.id,
      problemId,
      lessonId: lessonId || null,
      ...(source === 'random' ? { source: 'random' } : {}),
    },
    orderBy: { createdAt: 'asc' },
    select: { id: true, locked: true, status: true, grade: true, autoCorrect: true },
  })

  // dacă deja blocată sau deja corectă → returnează rezolvarea fără modificări
  const alreadyLocked = prevSubs.some(s => s.locked)
  const alreadyCorrect = prevSubs.some(s => s.status === 'GRADED' && (s.grade ?? 0) >= 60 && s.autoCorrect !== false)

  if (alreadyLocked || alreadyCorrect) {
    return NextResponse.json({
      ok: true,
      correctAnswer: problem.correctAnswer,
      explanation: problem.explanation,
      alreadyLocked: true,
    })
  }

  const attemptNumber = prevSubs.length + 1

  await prisma.problemSubmission.create({
    data: {
      studentId: student.id,
      problemId,
      lessonId: lessonId || null,
      answer: null,
      code: null,
      source,
      difficulty: problem.difficulty,
      autoCorrect: false,
      status: 'GRADED',
      grade: 0,
      gradedAt: new Date(),
      attemptNumber,
      hintUsed: false,
      solutionViewed: true,
      locked: true,
    },
  })

  revalidateTag('submissions')

  return NextResponse.json({
    ok: true,
    correctAnswer: problem.correctAnswer,
    explanation: problem.explanation,
  })
}
