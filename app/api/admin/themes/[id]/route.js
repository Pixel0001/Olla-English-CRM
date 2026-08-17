import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'

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
    const data = {}
    for (const k of ['name','description','rarity','currency','price','active','primary','secondary','accent','bgGradient','cardBg','textColor','glowColor','animationCss','previewUrl']) {
      if (body[k] !== undefined) data[k] = (k === 'price') ? Number(body[k]) : body[k]
    }
    const updated = await prisma.theme.update({ where: { id }, data })

    // Sync cosmeticul asociat (dacă există)
    const cosmeticData = {}
    if (data.name !== undefined) cosmeticData.name = data.name
    if (data.description !== undefined) cosmeticData.description = data.description
    if (data.rarity !== undefined) cosmeticData.rarity = data.rarity
    if (data.currency !== undefined) cosmeticData.currency = data.currency
    if (data.price !== undefined) cosmeticData.price = data.price
    if (data.active !== undefined) cosmeticData.active = data.active
    if (data.previewUrl !== undefined) cosmeticData.previewUrl = data.previewUrl
    const cssFields = ['primary','secondary','accent','bgGradient','cardBg','textColor','glowColor','animationCss']
    if (cssFields.some(f => data[f] !== undefined)) {
      cosmeticData.cssPayload = {
        primary: updated.primary,
        secondary: updated.secondary,
        accent: updated.accent,
        bgGradient: updated.bgGradient,
        cardBg: updated.cardBg,
        textColor: updated.textColor,
        glowColor: updated.glowColor,
        animationCss: updated.animationCss,
      }
    }
    if (Object.keys(cosmeticData).length > 0) {
      await prisma.cosmetic.updateMany({ where: { themeId: id }, data: cosmeticData })
    }

    revalidateTag('themes')
    revalidateTag('cosmetics')
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    await prisma.theme.delete({ where: { id } })
    revalidateTag('themes')
    revalidateTag('cosmetics')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
