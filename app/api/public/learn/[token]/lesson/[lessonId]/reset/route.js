import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - resetează complet lecția pentru elev:
// - șterge toate submisiile (problem_submissions) pe această lecție
// - resetează LessonProgress.hintsUsed = []
// - opțional: păstrează theoryCompleted (nu obligă teoria din nou) — la cerere
export async function POST(req, { params }) {
  const { token, lessonId } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true },
  })
  if (!lesson) return NextResponse.json({ error: 'Lecție inexistentă' }, { status: 404 })

  // șterge submisiile din această lecție pentru acest elev
  const deleted = await prisma.problemSubmission.deleteMany({
    where: { studentId: student.id, lessonId },
  })

  // resetează hintsUsed și completedAt
  await prisma.lessonProgress.updateMany({
    where: { studentId: student.id, lessonId },
    data: { hintsUsed: [], completedAt: null, currentProblemIndex: 0 },
  })

  return NextResponse.json({ ok: true, deletedSubmissions: deleted.count })
}
