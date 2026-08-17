import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const makeupId = '6954158e2e22a2a28b87e4b7'
  
  console.log('=== Căutare notificare pentru makeupId ===')
  
  // Cum caută cron-ul
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const startOfYesterday = new Date(yesterday)
  startOfYesterday.setHours(0, 0, 0, 0)
  
  const existingNotification = await prisma.notification.findFirst({
    where: {
      type: 'MISSED_SESSION',
      data: {
        path: ['makeupId'],
        equals: makeupId
      },
      createdAt: {
        gte: startOfYesterday
      }
    }
  })
  
  console.log('Găsită:', existingNotification)
  
  // Verificăm toate notificările cu makeupId
  console.log('\n=== Toate notificările cu orice makeupId ===')
  const allWithMakeup = await prisma.notification.findMany({
    where: {
      type: 'MISSED_SESSION',
      NOT: { data: { equals: null } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  
  for (const n of allWithMakeup) {
    const data = n.data
    if (data && data.makeupId) {
      console.log('- makeupId:', data.makeupId, '| Title:', n.title, '| Created:', n.createdAt)
    }
  }

  await prisma.$disconnect()
}

main().catch(console.error)
