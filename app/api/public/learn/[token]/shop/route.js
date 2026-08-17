import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  getShopCosmetics,
  getShopChests,
  getAllThemes,
  getStudentShopData,
} from '@/lib/student-cache'

export async function GET(_req, { params }) {
  const { token } = await params

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Cosmetics / chests / themes — cached 5 min (se schimbă rar)
  // Date personale student — fresh per request
  const [cosmetics, chests, themes, { econ, inventory, equipped, activeEvents }] =
    await Promise.all([
      getShopCosmetics(),
      getShopChests(),
      getAllThemes(),
      getStudentShopData(student.id),
    ])

  return NextResponse.json({
    economy: econ,
    cosmetics,
    chests,
    themes,
    inventory: inventory.map(i => ({ ...i.cosmetic, acquiredAt: i.acquiredAt })),
    equipped: equipped.map(e => ({ type: e.type, cosmeticId: e.cosmeticId, cosmetic: e.cosmetic })),
    activeEvents,
  })
}
