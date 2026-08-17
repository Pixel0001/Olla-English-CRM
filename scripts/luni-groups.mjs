import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  
  const yesterdayEnd = new Date(yesterday)
  yesterdayEnd.setHours(23, 59, 59, 999)

  const groups = await prisma.group.findMany({
    where: { 
      active: true,
      scheduleDays: { has: 'Luni' }
    },
    include: {
      teacher: true,
      lessonSessions: {
        where: {
          date: { gte: yesterday, lte: yesterdayEnd }
        }
      }
    }
  })

  console.log('=== Grupe cu Luni programat ===\n')
  
  for (const g of groups) {
    let scheduleTime = g.scheduleTime
    try {
      const parsed = JSON.parse(scheduleTime)
      scheduleTime = parsed.Luni || parsed.default || scheduleTime
    } catch {}
    
    const hadSession = g.lessonSessions.length > 0
    const status = hadSession ? '✅ A avut sesiune' : '❌ NU a avut sesiune'
    
    console.log(`📚 ${g.name}`)
    console.log(`   Profesor: ${g.teacher?.name || 'N/A'}`)
    console.log(`   Ora Luni: ${scheduleTime}`)
    console.log(`   Status ieri: ${status}`)
    if (hadSession) {
      const s = g.lessonSessions[0]
      console.log(`   Sesiune: ${s.date.toLocaleTimeString('ro-RO')} - deducted: ${s.lessonsDeducted}`)
    }
    console.log('')
  }

  await prisma.$disconnect()
}

main().catch(console.error)
