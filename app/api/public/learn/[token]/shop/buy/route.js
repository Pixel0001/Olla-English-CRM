// POST /api/public/learn/[token]/shop/buy
// body: { cosmeticId } sau { themeId }
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'
import { spendCurrency } from '@/lib/economy'

export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  const { cosmeticId } = await req.json()
  if (!cosmeticId) return NextResponse.json({ error: 'cosmeticId required' }, { status: 400 })

  const cosmetic = await prisma.cosmetic.findUnique({ where: { id: cosmeticId } })
  if (!cosmetic || !cosmetic.active || !cosmetic.shopVisible) {
    return NextResponse.json({ error: 'Item indisponibil' }, { status: 404 })
  }

  // Already owned?
  const owned = await prisma.cosmeticInventory.findUnique({
    where: { studentId_cosmeticId: { studentId: student.id, cosmeticId } },
  })
  if (owned) return NextResponse.json({ error: 'Item deja deținut' }, { status: 400 })

  // Spend
  const spend = await spendCurrency({ studentId: student.id, currency: cosmetic.currency, amount: cosmetic.price })
  if (!spend.ok) {
    return NextResponse.json({ error: `Fonduri insuficiente (${cosmetic.currency})`, balance: spend.balance }, { status: 400 })
  }

  // Add to inventory
  const inv = await prisma.cosmeticInventory.create({
    data: { studentId: student.id, cosmeticId, source: 'shop' },
    include: { cosmetic: true },
  })

  // Invalidează cache-ul shop (inventory s-a schimbat)
  revalidateTag('cosmetics')

  return NextResponse.json({ ok: true, item: inv.cosmetic, newBalance: spend.balance })
}
