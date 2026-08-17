import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET notifications for student (unread + recent)
export async function GET(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })

  const notifications = await prisma.notification.findMany({
    where: {
      studentId: student.id,
      type: { in: ['REVISION_REQUEST'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const unreadCount = notifications.filter(n => !n.read).length
  return NextResponse.json({ notifications, unreadCount })
}

// PATCH { ids: [...] } sau { all: true } → marchează ca citite
export async function PATCH(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const where = { studentId: student.id, read: false }
  if (Array.isArray(body?.ids) && body.ids.length > 0) {
    where.id = { in: body.ids }
  }
  const result = await prisma.notification.updateMany({ where, data: { read: true } })
  return NextResponse.json({ updated: result.count })
}
