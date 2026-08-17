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
    const chests = await prisma.chest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { rewards: { include: { cosmetic: true } } },
    })
    return NextResponse.json(chests)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function POST(req) {
  try {
    await guard()
    const body = await req.json()
    const created = await prisma.chest.create({
      data: {
        name: body.name,
        description: body.description || null,
        tier: body.tier || 'COMMON',
        currency: body.currency || 'COINS',
        price: Number(body.price) || 100,
        imageUrl: body.imageUrl || null,
        active: body.active ?? true,
        guaranteedRarity: body.guaranteedRarity || null,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
