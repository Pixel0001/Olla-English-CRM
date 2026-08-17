import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

// GET ?chestId=...
export async function GET(req) {
  try {
    await guard()
    const { searchParams } = new URL(req.url)
    const chestId = searchParams.get('chestId')
    const where = chestId ? { chestId } : {}
    const items = await prisma.chestReward.findMany({
      where,
      include: { cosmetic: true, chest: true },
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
    const created = await prisma.chestReward.create({
      data: {
        chestId: body.chestId,
        cosmeticId: body.cosmeticId || null,
        weight: Number(body.weight) || 10,
        coinsAmount: body.coinsAmount ? Number(body.coinsAmount) : null,
        gemsAmount: body.gemsAmount ? Number(body.gemsAmount) : null,
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
    await prisma.chestReward.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
