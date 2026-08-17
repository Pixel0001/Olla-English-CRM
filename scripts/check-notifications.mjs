import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Notificări MISSED_SESSION recente ===\n')
  
  const notifications = await prisma.notification.findMany({
    where: { type: 'MISSED_SESSION' },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  for (const n of notifications) {
    console.log('---')
    console.log('Data:', n.createdAt.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' }))
    console.log('Title:', n.title)
    console.log('Message:', n.message)
    console.log('Data JSON:', JSON.stringify(n.data, null, 2))
  }

  await prisma.$disconnect()
}

main().catch(console.error)
