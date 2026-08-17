import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

// GET ?eventId=...
export async function GET(req) {
  try {
    await guard()
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const where = eventId ? { eventId } : {}
    const items = await prisma.leaderboardReward.findMany({ where, orderBy: { rank: 'asc' } })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function POST(req) {
  try {
    await guard()
    const body = await req.json()
    const created = await prisma.leaderboardReward.create({
      data: {
        eventId: body.eventId,
        rank: Number(body.rank),
        rankTo: body.rankTo ? Number(body.rankTo) : null,
        xp: body.xp ? Number(body.xp) : null,
        coins: body.coins ? Number(body.coins) : null,
        gems: body.gems ? Number(body.gems) : null,
        cosmeticId: body.cosmeticId || null,
        chestId: body.chestId || null,
        title: body.title || null,
        customReward: body.customReward || null,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function DELETE(req) {
  try {
    await guard()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.leaderboardReward.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
