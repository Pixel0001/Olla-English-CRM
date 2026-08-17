import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Bulk delete pentru submisii. Body: { ids: [string, ...] }
// Folosit de pagina admin/teacher pentru "Șterge selecția".
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(session.user.role)
  const body = await req.json().catch(() => ({}))
  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : []
  if (ids.length === 0) return NextResponse.json({ error: 'Nimic de șters' }, { status: 400 })

  const subs = await prisma.problemSubmission.findMany({
    where: { id: { in: ids } },
    select: { id: true, studentId: true },
  })
  if (subs.length === 0) return NextResponse.json({ deleted: 0 })

  if (!isAdmin) {
    const studentIds = [...new Set(subs.map(s => s.studentId))]
    const allowed = await prisma.groupStudent.findMany({
      where: { studentId: { in: studentIds }, group: { teacherId: session.user.id, active: true } },
      select: { studentId: true }, distinct: ['studentId'],
    })
    const allowedSet = new Set(allowed.map(a => a.studentId))
    const ok = subs.filter(s => allowedSet.has(s.studentId))
    const result = await prisma.problemSubmission.deleteMany({ where: { id: { in: ok.map(s => s.id) } } })
    return NextResponse.json({ deleted: result.count, skipped: subs.length - ok.length })
  }

  const result = await prisma.problemSubmission.deleteMany({ where: { id: { in: subs.map(s => s.id) } } })
  return NextResponse.json({ deleted: result.count })
}
