import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Exact codul din cron
const DAY_MAP = {
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6,
  'Dum': 0, 'Lun': 1, 'Mar': 2, 'Mie': 3, 'Joi': 4, 'Vin': 5, 'Sâm': 6, 'Sam': 6,
  'Duminică': 0, 'Luni': 1, 'Marți': 2, 'Miercuri': 3, 'Joi': 4, 'Vineri': 5, 'Sâmbătă': 6, 'Sambata': 6
}

const DAY_NAMES_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']

function parseScheduleTime(scheduleTime) {
  if (!scheduleTime) return {}
  try {
    if (scheduleTime.startsWith('{')) {
      return JSON.parse(scheduleTime)
    }
  } catch {}
  return { default: scheduleTime }
}

function getTimeForDay(scheduleTime, day) {
  const times = parseScheduleTime(scheduleTime)
  return times[day] || times.default || '00:00'
}

async function main() {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDayIndex = yesterday.getDay()
  const yesterdayDayName = DAY_NAMES_RO[yesterdayDayIndex]

  console.log('Yesterday:', yesterday.toISOString())
  console.log('Day index:', yesterdayDayIndex)
  console.log('Day name:', yesterdayDayName)

  const yesterdayStart = new Date(yesterday)
  yesterdayStart.setHours(0, 0, 0, 0)
  const yesterdayEnd = new Date(yesterday)
  yesterdayEnd.setHours(23, 59, 59, 999)

  console.log('\nDate range:')
  console.log('Start:', yesterdayStart.toISOString())
  console.log('End:', yesterdayEnd.toISOString())

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

  console.log('\nGroups found:', groups.length)

  const missedCreated = []

  for (const group of groups) {
    if (!group.scheduleDays || group.scheduleDays.length === 0) continue

    const wasScheduledYesterday = group.scheduleDays.some(day => DAY_MAP[day] === yesterdayDayIndex)
    
    if (!wasScheduledYesterday) continue

    const hasSession = group.lessonSessions.length > 0
    const hasMissedSession = group.missedSessions.length > 0

    if (hasSession || hasMissedSession) continue

    // Creează missed session
    const scheduledTime = getTimeForDay(group.scheduleTime, yesterdayDayName)
    const [hours, minutes] = scheduledTime.split(':').map(Number)
    
    const scheduledDate = new Date(yesterday)
    scheduledDate.setHours(hours || 0, minutes || 0, 0, 0)

    console.log(`\nCreating missed session for: ${group.name}`)
    console.log('  scheduledTime:', scheduledTime)
    console.log('  scheduledDate:', scheduledDate.toISOString())

    const missedSession = await prisma.missedSession.create({
      data: {
        groupId: group.id,
        scheduledDate,
        scheduledDay: yesterdayDayName,
        scheduledTime: scheduledTime || '00:00',
        reason: 'Profesorul nu a pornit lecția'
      }
    })

    console.log('  Created with ID:', missedSession.id)

    missedCreated.push({
      groupId: group.id,
      groupName: group.name,
      date: scheduledDate
    })
  }

  console.log('\n=== RESULT ===')
  console.log('Missed sessions created:', missedCreated.length)
  console.log('Details:', missedCreated)

  await prisma.$disconnect()
}

main().catch(console.error)
