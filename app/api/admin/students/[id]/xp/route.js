import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['ADMIN', 'SUPERADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const submissions = await prisma.problemSubmission.findMany({
    where: { studentId: id, status: 'GRADED', grade: { gte: 60 } },
    include: { problem: { select: { points: true } } },
  })
  const xp = submissions.reduce(
    (sum, s) => sum + Math.round((s.problem?.points ?? 10) * (s.grade / 100)),
    0
  )
  return NextResponse.json({ xp })
}
