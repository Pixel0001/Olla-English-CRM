import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Găsește makeup-ul ratat
  const makeup = await prisma.makeupLesson.findFirst({
    where: {
      id: '6952ccf4a5ac332fcb725f0e' // ID-ul makeup-ului ratat de la test 3
    },
    include: {
      teacher: true,
      group: { include: {} },
      students: { include: { student: true } }
    }
  })

  if (!makeup) {
    console.log('Makeup-ul nu a fost găsit!')
    return
  }

  console.log('=== Creez notificare pentru makeup ratat ===')
  console.log('Makeup:', makeup.group.name, '-', new Date(makeup.scheduledAt).toLocaleString('ro-RO'))

  const studentNames = makeup.students.map(s => s.student.fullName).join(', ')
  const scheduledTime = new Date(makeup.scheduledAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })

  // Creează notificarea
  const notification = await prisma.notification.create({
    data: {
      type: 'MISSED_SESSION',
      title: `❌ Recuperare neefectuată: ${makeup.group.name}`,
      message: `Profesorul ${makeup.teacher.name} nu a înregistrat lecția de recuperare pentru grupa "${makeup.group.name}" programată pe 29.12.2025 la ${scheduledTime}.\n\nElevi: ${studentNames || 'Nespecificați'}`,
      link: `/admin/makeup`,
      recipientId: null,
      groupId: makeup.groupId,
      data: {
        makeupId: makeup.id,
        teacherName: makeup.teacher.name,
        teacherId: makeup.teacherId,
        groupName: makeup.group.name,
        levelName: makeup.group.level,
        scheduledTime,
        studentNames,
        isRecuperare: true
      }
    }
  })

  console.log('✅ Notificare creată cu ID:', notification.id)

  await prisma.$disconnect()
}

main().catch(console.error)
