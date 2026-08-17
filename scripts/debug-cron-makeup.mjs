import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Simulăm ce face cron-ul când rulează
  const today = new Date()
  console.log('Azi (now):', today.toISOString())
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const startOfYesterday = new Date(yesterday)
  startOfYesterday.setHours(0, 0, 0, 0)
  
  const endOfYesterday = new Date(yesterday)
  endOfYesterday.setHours(23, 59, 59, 999)

  console.log('\n=== Interval căutat de cron ===')
  console.log('Start:', startOfYesterday.toISOString())
  console.log('End:', endOfYesterday.toISOString())
  
  // Recuperarea care lipsește
  const makeup = await prisma.makeupLesson.findUnique({
    where: { id: '6954158e2e22a2a28b87e4b7' },
    include: { teacher: true, group: true }
  })
  
  console.log('\n=== Recuperarea în discuție ===')
  console.log('ID:', makeup.id)
  console.log('scheduledAt (raw):', makeup.scheduledAt)
  console.log('scheduledAt (ISO):', makeup.scheduledAt.toISOString())
  console.log('Status:', makeup.status)
  console.log('lessonsDeducted:', makeup.lessonsDeducted)
  
  const scheduledDate = makeup.scheduledAt
  console.log('\n=== Comparații ===')
  console.log('scheduledAt >= startOfYesterday?', scheduledDate >= startOfYesterday)
  console.log('scheduledAt <= endOfYesterday?', scheduledDate <= endOfYesterday)
  console.log('In range?', scheduledDate >= startOfYesterday && scheduledDate <= endOfYesterday)

  // Ce găsește query-ul exact
  console.log('\n=== Query ca în cron ===')
  const missedMakeupLessons = await prisma.makeupLesson.findMany({
    where: {
      scheduledAt: {
        gte: startOfYesterday,
        lte: endOfYesterday
      },
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      lessonsDeducted: false
    },
    include: {
      teacher: true,
      group: true,
      students: { include: { student: { select: { fullName: true } } } }
    }
  })

  console.log('Găsite:', missedMakeupLessons.length)
  for (const m of missedMakeupLessons) {
    console.log('- ID:', m.id, '| Grupa:', m.group?.name, '| Programat:', m.scheduledAt.toISOString())
  }

  await prisma.$disconnect()
}

main().catch(console.error)
