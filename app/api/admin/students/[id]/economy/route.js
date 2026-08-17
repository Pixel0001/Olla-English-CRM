import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET  → returnează economia curentă a elevului (coins, gems, totals, streak)
 * POST → { currency: 'COINS'|'GEMS', amount: number, reason?: string }  (admin grant / debit)
 *        amount poate fi pozitiv sau negativ
 */

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['ADMIN', 'SUPERADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const econ = await prisma.studentEconomy.findUnique({ where: { studentId: id } })
  const streak = await prisma.studentStreak.findUnique({ where: { studentId: id } })
  return NextResponse.json({
    economy: {
      coins: econ?.coins || 0,
      gems: econ?.gems || 0,
      totalCoinsEarned: econ?.totalCoinsEarned || 0,
      totalGemsEarned: econ?.totalGemsEarned || 0,
      streak: streak?.current || 0,
      bestStreak: streak?.best || 0,
      multiplier: streak?.multiplier || 1.0,
      problemsToday: streak?.problemsToday || 0,
    },
  })
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['ADMIN', 'SUPERADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const { currency, amount, reason } = await req.json()

  if (!['COINS', 'GEMS'].includes(currency)) {
    return NextResponse.json({ error: 'currency invalid' }, { status: 400 })
  }
  const delta = Math.round(Number(amount))
  if (!Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ error: 'amount invalid' }, { status: 400 })
  }

  // Asigură rândul existent
  const existing = await prisma.studentEconomy.findUnique({ where: { studentId: id } })
  if (!existing) {
    await prisma.studentEconomy.create({ data: { studentId: id } })
  }

  const field = currency === 'COINS' ? 'coins' : 'gems'
  const totalField = currency === 'COINS' ? 'totalCoinsEarned' : 'totalGemsEarned'

  const updateData = { [field]: { increment: delta } }
  // Dacă acordăm (delta pozitiv), incrementăm și totalul
  if (delta > 0) updateData[totalField] = { increment: delta }

  const updated = await prisma.studentEconomy.update({
    where: { studentId: id },
    data: updateData,
  })

  // Dacă ar fi devenit negativ, prevenim cu o normalizare
  if (updated[field] < 0) {
    await prisma.studentEconomy.update({
      where: { studentId: id },
      data: { [field]: 0 },
    })
  }

  // Log în BonusPoint pentru audit (opțional, ca să apară în istoric dacă vrei)
  if (reason && reason.trim()) {
    try {
      await prisma.bonusPoint.create({
        data: {
          studentId: id,
          points: 0, // nu afectează XP
          reason: `[${currency} ${delta > 0 ? '+' : ''}${delta}] ${reason.trim()}`,
          addedById: session.user.id,
        },
      })
    } catch {}
  }

  const fresh = await prisma.studentEconomy.findUnique({ where: { studentId: id } })
  return NextResponse.json({
    ok: true,
    economy: {
      coins: fresh?.coins || 0,
      gems: fresh?.gems || 0,
      totalCoinsEarned: fresh?.totalCoinsEarned || 0,
      totalGemsEarned: fresh?.totalGemsEarned || 0,
    },
  })
}
