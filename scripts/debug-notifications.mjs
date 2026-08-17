import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map day index to Romanian day names
const DAY_MAP = {
  0: 'Duminică',
  1: 'Luni', 
  2: 'Marți',
  3: 'Miercuri',
  4: 'Joi',
  5: 'Vineri',
  6: 'Sâmbătă'
}

async function main() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDayOfWeek = DAY_MAP[yesterday.getDay()]

  const startOfYesterday = new Date(yesterday)
  startOfYesterday.setHours(0, 0, 0, 0)
  const endOfYesterday = new Date(yesterday)
  endOfYesterday.setHours(23, 59, 59, 999)

  console.log('=== Debugging notifications cron ===')
  console.log('Yesterday:', yesterday.toLocaleDateString('ro-RO'))
  console.log('Day of week:', yesterdayDayOfWeek)
  console.log('Range:', startOfYesterday.toISOString(), '-', endOfYesterday.toISOString())

  // Ce caută cron-ul
  console.log('\n=== Query: grupe cu lecții ieri ===')
  const groupsWithLessonsYesterday = await prisma.group.findMany({
    where: {
      active: true,
      scheduleDays: { has: yesterdayDayOfWeek }
    },
    include: {
      teacher: true,
      groupStudents: {
        where: { status: 'ACTIVE' },
        select: { id: true }
      },
      lessonSessions: {
        where: {
          date: {
            gte: startOfYesterday,
            lte: endOfYesterday
          },
          lessonsDeducted: true  // <-- ASTA E PROBLEMA?
        }
      }
    }
  })

  console.log(`Grupe găsite cu ${yesterdayDayOfWeek}:`, groupsWithLessonsYesterday.length)

  for (const group of groupsWithLessonsYesterday) {
    console.log(`\n📚 ${group.name}`)
    console.log(`   Profesor: ${group.teacher?.name}`)
    console.log(`   Elevi activi: ${group.groupStudents.length}`)
    console.log(`   Sesiuni ieri (cu lessonsDeducted=true): ${group.lessonSessions.length}`)
    
    const hadSession = group.lessonSessions.length > 0
    console.log(`   hadSession: ${hadSession}`)
    
    if (group.groupStudents.length === 0) {
      console.log(`   ❌ SKIP: no active students`)
      continue
    }

    if (hadSession) {
      console.log(`   ❌ SKIP: had session with deducted lessons`)
      continue
    }

    // Verifică dacă există notificare
    const existingNotification = await prisma.notification.findFirst({
      where: {
        type: 'MISSED_SESSION',
        groupId: group.id,
        createdAt: {
          gte: startOfYesterday
        }
      }
    })

    console.log(`   Notificare existentă: ${existingNotification ? 'DA - ' + existingNotification.id : 'NU'}`)

    if (!existingNotification) {
      console.log(`   ✅ AR TREBUI SĂ CREEZE NOTIFICARE!`)
    }
  }

  // Verifică toate notificările MISSED_SESSION
  console.log('\n=== Toate notificările MISSED_SESSION ===')
  const allMissedNotifications = await prisma.notification.findMany({
    where: { type: 'MISSED_SESSION' },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  for (const n of allMissedNotifications) {
    console.log(`- ${n.createdAt.toLocaleString('ro-RO')}: ${n.title}`)
    console.log(`  groupId: ${n.groupId}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
