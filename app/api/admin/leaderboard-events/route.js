import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

export async function GET() {
  try {
    await guard()
    const events = await prisma.leaderboardEvent.findMany({
      orderBy: { startsAt: 'desc' },
      include: {
        rewards: { include: { /* expansions handled in client */ } },
        _count: { select: { entries: true } },
      },
    })
    return NextResponse.json(events)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function POST(req) {
  try {
    await guard()
    const body = await req.json()
    const created = await prisma.leaderboardEvent.create({
      data: {
        name: body.name,
        description: body.description || null,
        type: body.type || 'XP',
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        active: body.active ?? true,
        bannerUrl: body.bannerUrl || null,
        themeColor: body.themeColor || null,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
