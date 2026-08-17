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
    const data = {}
    for (const k of ['name','description','tier','currency','price','imageUrl','active','guaranteedRarity']) {
      if (body[k] !== undefined) data[k] = (k === 'price') ? Number(body[k]) : body[k]
    }
    const updated = await prisma.chest.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    await prisma.chest.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
