import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const themes = await prisma.theme.findMany()
for (const t of themes) {
  const existing = await prisma.cosmetic.findFirst({ where: { themeId: t.id } })
  if (!existing) {
    await prisma.cosmetic.create({
      data: {
        name: t.name,
        description: t.description,
        type: 'THEME',
        rarity: t.rarity,
        currency: t.currency,
        price: t.price,
        active: t.active,
        shopVisible: true,
        themeId: t.id,
        previewUrl: t.previewUrl,
        cssPayload: {
          primary: t.primary, secondary: t.secondary, accent: t.accent,
          bgGradient: t.bgGradient, cardBg: t.cardBg, textColor: t.textColor,
          glowColor: t.glowColor, animationCss: t.animationCss,
        },
      },
    })
    console.log('✅ Creat cosmetic pentru theme:', t.name)
  } else {
    console.log('⚠️  Există deja cosmetic pentru:', t.name)
  }
}
await prisma.$disconnect()
