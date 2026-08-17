import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST { problemId, lessonId } - marchează că elevul a apăsat „Hint" pentru această problemă
// Persistă în LessonProgress.hintsUsed (array de problemId-uri)
export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const { problemId, lessonId } = await req.json()
  if (!problemId || !lessonId) {
    return NextResponse.json({ error: 'problemId și lessonId obligatorii' }, { status: 400 })
  }

  // Verifică problema să existe și să aibă hint
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { hint: true },
  })
  if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })

  const existing = await prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId: student.id, lessonId } },
    select: { hintsUsed: true },
  })

  const current = Array.isArray(existing?.hintsUsed) ? existing.hintsUsed : []
  if (current.includes(problemId)) {
    return NextResponse.json({ ok: true, hint: problem.hint, hintUsed: true })
  }

  await prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId: student.id, lessonId } },
    update: { hintsUsed: [...current, problemId] },
    create: { studentId: student.id, lessonId, hintsUsed: [problemId] },
  })

  return NextResponse.json({ ok: true, hint: problem.hint, hintUsed: true })
}
