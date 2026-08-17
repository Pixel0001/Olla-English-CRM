import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapare zile: toate formatele posibile -> index (Duminică = 0, Luni = 1, etc.)
const DAY_MAP = {
  // Format englezesc scurt
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6,
  // Format românesc scurt
  'Dum': 0, 'Lun': 1, 'Mar': 2, 'Mie': 3, 'Joi': 4, 'Vin': 5, 'Sâm': 6, 'Sam': 6,
  // Format românesc complet (cum salvează formularul)
  'Duminică': 0, 'Luni': 1, 'Marți': 2, 'Miercuri': 3, 'Joi': 4, 'Vineri': 5, 'Sâmbătă': 6, 'Sambata': 6
}

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDayIndex = yesterday.getDay()
  
  console.log('Yesterday day index:', yesterdayDayIndex)
  console.log('Expected day name for index 1 (Luni):', DAY_MAP['Luni'])

  const yesterdayStart = new Date(yesterday)
  yesterdayStart.setHours(0, 0, 0, 0)
  const yesterdayEnd = new Date(yesterday)
  yesterdayEnd.setHours(23, 59, 59, 999)

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

  console.log('\n=== Debugging cron logic ===\n')

  for (const group of groups) {
    console.log(`\n📚 ${group.name}`)
    console.log(`   scheduleDays: ${JSON.stringify(group.scheduleDays)}`)
    
    if (!group.scheduleDays || group.scheduleDays.length === 0) {
      console.log('   ❌ SKIP: no scheduleDays')
      continue
    }

    // Test each day in scheduleDays
    for (const day of group.scheduleDays) {
      console.log(`   - Day "${day}" maps to index: ${DAY_MAP[day]}`)
    }

    const wasScheduledYesterday = group.scheduleDays.some(day => DAY_MAP[day] === yesterdayDayIndex)
    console.log(`   wasScheduledYesterday (index ${yesterdayDayIndex}): ${wasScheduledYesterday}`)

    if (!wasScheduledYesterday) {
      console.log('   ❌ SKIP: not scheduled yesterday')
      continue
    }

    const hasSession = group.lessonSessions.length > 0
    const hasMissedSession = group.missedSessions.length > 0
    console.log(`   hasSession: ${hasSession}, hasMissedSession: ${hasMissedSession}`)

    if (hasSession || hasMissedSession) {
      console.log('   ❌ SKIP: already has session or missed session')
      continue
    }

    console.log('   ✅ SHOULD CREATE MISSED SESSION!')
  }

  await prisma.$disconnect()
}

main().catch(console.error)
