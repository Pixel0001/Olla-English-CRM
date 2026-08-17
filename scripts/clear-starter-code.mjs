// Șterge starterCode din toate problemele (elevii încep de la cod gol)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const r = await prisma.problem.updateMany({
  where: {
    OR: [
      { starterCode: { not: null } },
      { starterCode: { not: '' } },
    ],
  },
  data: { starterCode: '' },
})

console.log(`✅ Șters starterCode din ${r.count} probleme`)

await prisma.$disconnect()
