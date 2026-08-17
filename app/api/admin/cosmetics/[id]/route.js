import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

export async function PATCH(req, { params }) {
  try {
    await guard()
    const { id } = await params
    const body = await req.json()
    const updated = await prisma.cosmetic.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.rarity !== undefined && { rarity: body.rarity }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.previewUrl !== undefined && { previewUrl: body.previewUrl }),
        ...(body.cssPayload !== undefined && { cssPayload: body.cssPayload }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.shopVisible !== undefined && { shopVisible: body.shopVisible }),
        ...(body.themeId !== undefined && { themeId: body.themeId }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    await prisma.cosmetic.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
