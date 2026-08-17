import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

export async function GET(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    const event = await prisma.leaderboardEvent.findUnique({
      where: { id },
      include: {
        rewards: true,
        entries: {
          orderBy: { score: 'desc' },
          take: 100,
          include: { student: { select: { id: true, fullName: true } } },
        },
      },
    })
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(event)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    await guard()
    const { id } = await params
    const body = await req.json()
    const data = {}
    for (const k of ['name','description','type','active','bannerUrl','themeColor']) {
      if (body[k] !== undefined) data[k] = body[k]
    }
    if (body.startsAt !== undefined) data.startsAt = new Date(body.startsAt)
    if (body.endsAt !== undefined) data.endsAt = new Date(body.endsAt)
    const updated = await prisma.leaderboardEvent.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    await prisma.leaderboardEvent.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
