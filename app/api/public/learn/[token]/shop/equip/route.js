// POST /api/public/learn/[token]/shop/equip
// body: { cosmeticId } -> echipează (deautomat înlocuiește vechiul de același tip)
// body: { type, unequip: true } -> dezechipează
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'

export async function POST(req, { params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  const body = await req.json()

  if (body.unequip && body.type) {
    await prisma.equippedCosmetic.deleteMany({
      where: { studentId: student.id, type: body.type },
    })
    // Dacă dezechipăm tema, curățăm și activeThemeId
    if (body.type === 'THEME') {
      await prisma.student.update({
        where: { id: student.id },
        data: { activeThemeId: null },
      })
    }
    revalidateTag('leaderboard')
    return NextResponse.json({ ok: true })
  }

  const { cosmeticId } = body
  if (!cosmeticId) return NextResponse.json({ error: 'cosmeticId required' }, { status: 400 })

  const inv = await prisma.cosmeticInventory.findUnique({
    where: { studentId_cosmeticId: { studentId: student.id, cosmeticId } },
    include: { cosmetic: true },
  })
  if (!inv) return NextResponse.json({ error: 'Nu deții acest item' }, { status: 400 })

  await prisma.equippedCosmetic.upsert({
    where: { studentId_type: { studentId: student.id, type: inv.cosmetic.type } },
    update: { cosmeticId, equippedAt: new Date() },
    create: { studentId: student.id, type: inv.cosmetic.type, cosmeticId },
  })

  // Dacă e theme, salvează activeThemeId — încearcă themeId direct, apoi fallback pe nume
  if (inv.cosmetic.type === 'THEME') {
    let themeId = inv.cosmetic.themeId
    if (!themeId) {
      // Încearcă să găsești tema după nume (seed-ul poate să nu fi legat cosmeticul)
      const themeName = inv.cosmetic.name
        .replace(/^Tema\s+/i, '')  // scoate prefixul "Tema "
        .trim()
      const found = await prisma.theme.findFirst({
        where: { name: { contains: themeName, mode: 'insensitive' } },
        select: { id: true },
      })
      // Al doilea fallback: potrivire pe numele complet al cosmeticului
      if (!found) {
        const found2 = await prisma.theme.findFirst({
          where: { name: { contains: inv.cosmetic.name, mode: 'insensitive' } },
          select: { id: true },
        })
        themeId = found2?.id || null
      } else {
        themeId = found.id
      }
    }
    if (themeId) {
      await prisma.student.update({
        where: { id: student.id },
        data: { activeThemeId: themeId },
      })
    } else {
      // Log pentru debugging pe production
      console.error('[equip] THEME fără themeId găsit:', inv.cosmetic.name, inv.cosmetic.id)
    }
  }

  // Invalidează cache-ul leaderboard (XP-ul nu se schimbă la equip, dar ranked include cosmetics)
  revalidateTag('leaderboard')

  return NextResponse.json({ ok: true, type: inv.cosmetic.type, cosmeticId })
}