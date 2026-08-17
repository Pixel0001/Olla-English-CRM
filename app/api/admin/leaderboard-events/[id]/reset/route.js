// Reset toate scorurile la 0 pentru un eveniment (pornire "fresh")
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

async function guard() {
  await requireAdmin()
  const p = await checkPermission('gamification.manage')
  if (!p.allowed) { const e = new Error('Forbidden'); e.status = 403; throw e }
}

export async function POST(_req, { params }) {
  try {
    await guard()
    const { id } = await params
    await prisma.leaderboardEntry.deleteMany({ where: { eventId: id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 })
  }
}
