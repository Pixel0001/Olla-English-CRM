import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
}

export async function GET() {
  try {
    await guard()
    const items = await prisma.cosmetic.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { theme: true, _count: { select: { inventory: true } } },
    })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function POST(req) {
  try {
    await guard()
    const body = await req.json()
    const created = await prisma.cosmetic.create({
      data: {
        name: body.name,
        description: body.description || null,
        type: body.type,
        rarity: body.rarity || 'COMMON',
        currency: body.currency || 'COINS',
        price: Number(body.price) || 0,
        imageUrl: body.imageUrl || null,
        previewUrl: body.previewUrl || null,
        cssPayload: body.cssPayload || null,
        active: body.active ?? true,
        shopVisible: body.shopVisible ?? true,
        themeId: body.themeId || null,
        sortOrder: Number(body.sortOrder) || 0,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
