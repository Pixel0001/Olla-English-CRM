import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const group = await prisma.group.findFirst({
    where: { name: { contains: 'Test pe mâine' } },
    include: {
      teacher: true,
      lessonSessions: {
        orderBy: { date: 'desc' },
        take: 10,
        include: { attendances: true }
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

  console.log('=== Detalii grupa "Test pe mâine" ===\n')
  console.log('Nume:', group.name)
  console.log('Profesor:', group.teacher?.name || 'N/A')
  console.log('Schedule Days:', group.scheduleDays)
  console.log('Schedule Time:', group.scheduleTime)
  console.log('')

  console.log('=== Toate sesiunile ===')
  if (group.lessonSessions.length === 0) {
    console.log('  (nicio sesiune)')
  }
  for (const s of group.lessonSessions) {
    console.log(`- ${s.date.toLocaleDateString('ro-RO')} ${s.date.toLocaleTimeString('ro-RO')}`)
    console.log(`  lessonsDeducted: ${s.lessonsDeducted}, attendances: ${s.attendances.length}`)
  }

  console.log('\n=== Missed Sessions ===')
  if (group.missedSessions.length === 0) {
    console.log('  (nicio lecție ratată înregistrată)')
  }
  for (const m of group.missedSessions) {
    console.log(`- ${m.scheduledDate.toLocaleDateString('ro-RO')} ${m.scheduledTime}`)
    console.log(`  reason: ${m.reason}`)
    console.log(`  acknowledged: ${m.acknowledged}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
