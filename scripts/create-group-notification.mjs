import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Găsește grupa "Test pe mâine"
  const group = await prisma.group.findFirst({
    where: { name: { contains: 'Test pe mâine' } },
    include: {
      teacher: true,
      groupStudents: { where: { status: 'ACTIVE' } }
    }
  })

  if (!group) {
    console.log('Grupa nu a fost găsită!')
    return
  }

  console.log('Creez notificare pentru:', group.name)

  // Creează notificarea pentru admini
  const notification = await prisma.notification.create({
    data: {
      type: 'MISSED_SESSION',
      title: `❌ Lecție neefectuată: ${group.name}`,
      message: `Profesorul ${group.teacher.name} nu a înregistrat lecția pentru grupa "${group.name}" (${group.level || 'N/A'}) programată ieri (Luni) la ora ${group.scheduleTime || 'neprecizată'}. Verificați situația.`,
      link: `/admin/groups/${group.id}`,
      recipientId: null,
      groupId: group.id,
      data: {
        teacherName: group.teacher.name,
        teacherId: group.teacherId,
        groupName: group.name,
        levelName: group.level,
        scheduledDay: 'Luni',
        scheduledTime: group.scheduleTime,
        studentsAffected: group.groupStudents.length
      }
    }
  })

  console.log('✅ Notificare creată:', notification.id)

  await prisma.$disconnect()
}

main().catch(console.error)
