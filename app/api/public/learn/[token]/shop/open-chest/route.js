// POST /api/public/learn/[token]/shop/open-chest
// body: { chestId }
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { spendCurrency } from '@/lib/economy'

const RARITY_RANK = { COMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4, MYTHIC: 5 }

function pickWeighted(items) {
  const total = items.reduce((s, r) => s + Math.max(1, r.weight), 0)
  let roll = Math.random() * total
  for (const r of items) {
    roll -= Math.max(1, r.weight)
    if (roll <= 0) return r
  }
  return items[items.length - 1]
}

export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  const { chestId } = await req.json()
  if (!chestId) return NextResponse.json({ error: 'chestId required' }, { status: 400 })

  const chest = await prisma.chest.findUnique({
    where: { id: chestId },
    include: { rewards: { include: { cosmetic: true } } },
  })
  if (!chest || !chest.active) return NextResponse.json({ error: 'Cufăr indisponibil' }, { status: 404 })
  if (!chest.rewards.length) return NextResponse.json({ error: 'Cufăr fără recompense' }, { status: 400 })

  // Spend
  const spend = await spendCurrency({ studentId: student.id, currency: chest.currency, amount: chest.price })
  if (!spend.ok) return NextResponse.json({ error: 'Fonduri insuficiente', balance: spend.balance }, { status: 400 })

  // Selecție recompensă (cu rarity guarantee)
  let pool = chest.rewards
  if (chest.guaranteedRarity) {
    const minRank = RARITY_RANK[chest.guaranteedRarity] || 1
    const eligible = pool.filter(r => !r.cosmetic || (RARITY_RANK[r.cosmetic.rarity] || 0) >= minRank)
    if (eligible.length) pool = eligible
  }
  const reward = pickWeighted(pool)

  let resultCosmetic = null
  let coins = null, gems = null

  if (reward.cosmeticId && reward.cosmetic) {
    // Adaugă în inventar dacă nu îl are deja
    const exists = await prisma.cosmeticInventory.findUnique({
      where: { studentId_cosmeticId: { studentId: student.id, cosmeticId: reward.cosmeticId } },
    })
    if (exists) {
      // Convertește în "duplicate compensation": coins
      coins = Math.max(10, Math.round(reward.cosmetic.price * 0.25))
      await prisma.studentEconomy.update({
        where: { studentId: student.id },
        data: { coins: { increment: coins }, totalCoinsEarned: { increment: coins } },
      })
    } else {
      const inv = await prisma.cosmeticInventory.create({
        data: { studentId: student.id, cosmeticId: reward.cosmeticId, source: 'chest' },
        include: { cosmetic: true },
      })
      resultCosmetic = inv.cosmetic
    }
  } else if (reward.coinsAmount) {
    coins = reward.coinsAmount
    await prisma.studentEconomy.update({
      where: { studentId: student.id },
      data: { coins: { increment: coins }, totalCoinsEarned: { increment: coins } },
    })
  } else if (reward.gemsAmount) {
    gems = reward.gemsAmount
    await prisma.studentEconomy.update({
      where: { studentId: student.id },
      data: { gems: { increment: gems }, totalGemsEarned: { increment: gems } },
    })
  }

  await prisma.chestOpening.create({
    data: {
      studentId: student.id,
      chestId,
      rewardCosmeticId: resultCosmetic?.id || null,
      rewardCoins: coins,
      rewardGems: gems,
    },
  })

  return NextResponse.json({
    ok: true,
    cosmetic: resultCosmetic,
    coins,
    gems,
    duplicate: reward.cosmeticId && !resultCosmetic,
  })
}
