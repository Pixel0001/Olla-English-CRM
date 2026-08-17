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
  const bonusPoints = await prisma.bonusPoint.findMany({
    where: { studentId: id },
    orderBy: { createdAt: 'desc' },
    include: { addedBy: { select: { name: true } } },
  })
  return NextResponse.json({ bonusPoints })
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['ADMIN', 'SUPERADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { points, reason } = await req.json()

  if (!points || !reason?.trim()) {
    return NextResponse.json({ error: 'Puncte și motiv obligatorii' }, { status: 400 })
  }

  try {
    const bp = await prisma.bonusPoint.create({
      data: {
        studentId: id,
        points: Math.round(Number(points)),
        reason: reason.trim(),
        addedById: session.user.id,
      },
      include: { addedBy: { select: { name: true } } },
    })
    return NextResponse.json({ bonusPoint: bp })
  } catch (err) {
    console.error('[bonus/POST] Prisma error:', err)
    return NextResponse.json({ error: err.message || 'Eroare la salvare' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['ADMIN', 'SUPERADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const bpId = searchParams.get('bpId')
  if (!bpId) return NextResponse.json({ error: 'Missing bpId' }, { status: 400 })

  await prisma.bonusPoint.delete({ where: { id: bpId } })
  return NextResponse.json({ ok: true })
}
