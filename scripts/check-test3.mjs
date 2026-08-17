import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Găsește grupa test 3
  const group = await prisma.group.findFirst({
    where: { name: { contains: 'test 3' } },
    include: {
      teacher: true,
      lessonSessions: {
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          attendances: true
        }
      },
      missedSessions: {
        orderBy: { scheduledDate: 'desc' }
      }
    }
  })

  if (!group) {
    console.log('Grupa nu a fost găsită!')
    return
  }

  console.log('=== Detalii grupa test 3 ===\n')
  console.log('Nume:', group.name)
  console.log('Profesor:', group.teacher?.name || 'N/A')
  console.log('Schedule Days:', group.scheduleDays)
  console.log('Schedule Time:', group.scheduleTime)
  console.log('')

  console.log('=== Sesiuni recente ===')
  for (const s of group.lessonSessions) {
    console.log(`- ${s.date.toLocaleDateString('ro-RO')} ${s.date.toLocaleTimeString('ro-RO')}`)
    console.log(`  lessonsDeducted: ${s.lessonsDeducted}`)
    console.log(`  attendances: ${s.attendances.length}`)
  }

  console.log('\n=== Missed Sessions ===')
  for (const m of group.missedSessions) {
    console.log(`- ${m.scheduledDate.toLocaleDateString('ro-RO')} ${m.scheduledTime}`)
    console.log(`  reason: ${m.reason}`)
    console.log(`  acknowledged: ${m.acknowledged}`)
  }

  // Verifică dacă există sesiune de ieri (29 dec)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  
  const yesterdayEnd = new Date(yesterday)
  yesterdayEnd.setHours(23, 59, 59, 999)

  console.log('\n=== Verificare sesiune de ieri (29 dec) ===')
  console.log('Range:', yesterday.toISOString(), '-', yesterdayEnd.toISOString())
  
  const yesterdaySessions = group.lessonSessions.filter(s => {
    const d = new Date(s.date)
    return d >= yesterday && d <= yesterdayEnd
  })
  
  console.log('Sesiuni găsite pentru ieri:', yesterdaySessions.length)
  for (const s of yesterdaySessions) {
    console.log(`  - ${s.date.toISOString()} deducted=${s.lessonsDeducted}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
