import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST { problemId }
 * Resetează DOAR o singură problemă din lecție:
 *  - șterge submisiile pentru problema respectivă
 *  - scoate problema din hintsUsed (dacă e acolo)
 *  - NU resetează restul lecției
 */
export async function POST(req, { params }) {
  const { token, lessonId } = await params

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { problemId } = body
  if (!problemId || typeof problemId !== 'string') {
    return NextResponse.json({ error: 'problemId obligatoriu' }, { status: 400 })
  }

  // Verifică că problema aparține lecției (anti-IDOR)
  const problem = await prisma.problem.findFirst({
    where: { id: problemId, lessonId },
    select: { id: true },
  })
  if (!problem) return NextResponse.json({ error: 'Problema nu aparține lecției' }, { status: 403 })

  // Șterge submisiile pentru această problemă
  const deleted = await prisma.problemSubmission.deleteMany({
    where: { studentId: student.id, problemId, lessonId },
  })

  // Scoate problema din hintsUsed
  const progress = await prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId: student.id, lessonId } },
    select: { hintsUsed: true },
  })
  if (progress && Array.isArray(progress.hintsUsed) && progress.hintsUsed.includes(problemId)) {
    await prisma.lessonProgress.update({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
      data: { hintsUsed: progress.hintsUsed.filter(id => id !== problemId) },
    })
  }

  return NextResponse.json({ ok: true, deletedSubmissions: deleted.count })
}
