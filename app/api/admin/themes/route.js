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

export async function GET() {
  try {
    await guard()
    const items = await prisma.theme.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function POST(req) {
  try {
    await guard()
    const body = await req.json()
    const created = await prisma.theme.create({
      data: {
        name: body.name,
        description: body.description || null,
        rarity: body.rarity || 'COMMON',
        currency: body.currency || 'COINS',
        price: Number(body.price) || 0,
        active: body.active ?? true,
        primary: body.primary || '#6366f1',
        secondary: body.secondary || '#8b5cf6',
        accent: body.accent || '#ec4899',
        bgGradient: body.bgGradient || null,
        cardBg: body.cardBg || null,
        textColor: body.textColor || null,
        glowColor: body.glowColor || null,
        animationCss: body.animationCss || null,
        previewUrl: body.previewUrl || null,
      },
    })

    // Creează automat și Cosmeticul corespunzător (cel afișat în shop)
    await prisma.cosmetic.create({
      data: {
        name: created.name,
        description: created.description,
        type: 'THEME',
        rarity: created.rarity,
        currency: created.currency,
        price: created.price,
        active: created.active,
        shopVisible: true,
        themeId: created.id,
        previewUrl: created.previewUrl,
        cssPayload: {
          primary: created.primary,
          secondary: created.secondary,
          accent: created.accent,
          bgGradient: created.bgGradient,
          cardBg: created.cardBg,
          textColor: created.textColor,
          glowColor: created.glowColor,
          animationCss: created.animationCss,
        },
      },
    })
    revalidateTag('themes')
    revalidateTag('cosmetics')
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
