import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { computeStudentStats } from '@/lib/problem-utils'

export const dynamic = 'force-dynamic'

// GET /api/admin/problems/stats?studentId=...
export async function GET(request) {
  const { allowed } = await checkPermission('problems.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId') || undefined

  if (studentId) {
    const attempts = await prisma.problemAttempt.findMany({
      where: { studentId },
      include: { problem: { select: { topic: true, difficulty: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const stats = computeStudentStats(attempts)
    return NextResponse.json({ studentId, ...stats, attempts: attempts.slice(0, 50) })
  }

  // Stats globale
  const [problemCount, setCount, attemptCount, correctCount] = await Promise.all([
    prisma.problem.count({ where: { active: true } }),
    prisma.generatedSet.count(),
    prisma.problemAttempt.count(),
    prisma.problemAttempt.count({ where: { isCorrect: true } }),
  ])

  return NextResponse.json({
    problemCount,
    setCount,
    attemptCount,
    correctCount,
    accuracy: attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0,
  })
}
