import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const yesterdayStart = new Date(yesterday)
  yesterdayStart.setHours(0, 0, 0, 0)
  const yesterdayEnd = new Date(yesterday)
  yesterdayEnd.setHours(23, 59, 59, 999)

  console.log('=== Verificare grupe pentru Luni, 29 decembrie 2025 ===\n')

  // Toate grupele active
  const groups = await prisma.group.findMany({
    where: { active: true },
    include: {
      lessonSessions: {
        where: {
          date: {
            gte: yesterdayStart,
            lte: yesterdayEnd
          }
        }
      },
      missedSessions: {
        where: {
          scheduledDate: {
            gte: yesterdayStart,
            lte: yesterdayEnd
          }
        }
      }
    }
  })

  console.log(`Total grupe active: ${groups.length}\n`)

  for (const g of groups) {
    console.log(`📚 ${g.name}`)
    console.log(`   scheduleDays: ${JSON.stringify(g.scheduleDays)}`)
    console.log(`   Are "Luni"? ${g.scheduleDays?.includes('Luni') ? '✅ DA' : '❌ NU'}`)
    console.log(`   Sesiuni ieri: ${g.lessonSessions.length}`)
    console.log(`   MissedSessions ieri: ${g.missedSessions.length}`)
    console.log('')
  }

  // Grupe cu Luni
  const luniGroups = groups.filter(g => g.scheduleDays?.includes('Luni'))
  console.log(`\n=== Grupe cu Luni programat: ${luniGroups.length} ===`)
  for (const g of luniGroups) {
    console.log(`- ${g.name}: sesiuni=${g.lessonSessions.length}, missed=${g.missedSessions.length}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
