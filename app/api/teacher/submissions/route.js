import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkAnyPermission } from '@/lib/permissions'

// Submisii de probleme - cabinetul profesorului/admin-ului
// GET ?status=PENDING&studentId=...&lessonId=...&q=...

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(session.user.role)
  const { allowed } = await checkAnyPermission(['submissions.view'])

  // Profesorii fără permisiune granulară văd doar submisiile elevilor din grupele lor
  if (!isAdmin && !allowed) {
    // continuă - filtrăm pe teacher mai jos
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || undefined
  const studentId = searchParams.get('studentId') || undefined
  const lessonId = searchParams.get('lessonId') || undefined
  const source = searchParams.get('source') || undefined
  const q = searchParams.get('q') || undefined

  const where = {}
  if (status) where.status = status
  if (studentId) where.studentId = studentId
  if (lessonId) where.lessonId = lessonId
  if (source) where.source = source

  // Pentru profesori (non-admin): doar submisii ale elevilor din grupele lor
  if (!isAdmin) {
    const teacherStudents = await prisma.groupStudent.findMany({
      where: { group: { teacherId: session.user.id, active: true } },
      select: { studentId: true },
      distinct: ['studentId'],
    })
    where.studentId = { in: teacherStudents.map(s => s.studentId) }
  }

  if (q) {
    // căutare după problem.title sau student.fullName
    where.OR = [
      { problem: { title: { contains: q, mode: 'insensitive' } } },
      { student: { fullName: { contains: q, mode: 'insensitive' } } },
    ]
  }

  const submissions = await prisma.problemSubmission.findMany({
    where,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 200,
    include: {
      student: { select: { id: true, fullName: true } },
      problem: { select: { id: true, title: true, difficulty: true, topic: true, type: true } },
      lesson: { select: { id: true, title: true, module: { select: { id: true, title: true, slug: true } } } },
    },
  })

  // Statistici rapide
  const counts = await prisma.problemSubmission.groupBy({
    by: ['status'],
    where: !isAdmin ? { studentId: where.studentId } : {},
    _count: true,
  })

  return NextResponse.json({ submissions, counts })
}
