/**
 * Utilități pentru validarea programului grupelor
 */

// Mapare zile: toate formatele posibile -> index (Duminică = 0, Luni = 1, etc.)
const DAY_MAP = {
  // Format englezesc scurt
  'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6,
  // Format românesc scurt
  'Dum': 0, 'Lun': 1, 'Mar': 2, 'Mie': 3, 'Joi': 4, 'Vin': 5, 'Sâm': 6, 'Sam': 6,
  // Format românesc complet (cum salvează formularul)
  'Duminică': 0, 'Luni': 1, 'Marți': 2, 'Miercuri': 3, 'Joi': 4, 'Vineri': 5, 'Sâmbătă': 6, 'Sambata': 6
}

// Zile în română pentru afișare
const DAY_NAMES_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']

/**
 * Parsează scheduleTime (poate fi string simplu sau JSON)
 */
function parseScheduleTime(scheduleTime) {
  if (!scheduleTime) return {}
  
  try {
    if (scheduleTime.startsWith('{')) {
      return JSON.parse(scheduleTime)
    }
  } catch {
    // E string simplu
  }
  
  // String simplu - aceeași oră pentru toate zilele
  return { default: scheduleTime }
}

/**
 * Obține ora programată pentru o zi specifică
 */
function getTimeForDay(scheduleTime, day) {
  const times = parseScheduleTime(scheduleTime)
  return times[day] || times.default || null
}

/**
 * Verifică dacă profesorul poate porni lecția astăzi
 * @param {string[]} scheduleDays - zilele programate (ex: ["Mon", "Wed"])
 * @param {string} scheduleTime - ora (poate fi JSON sau string simplu)
 * @param {Date} now - momentul curent (opțional, default = now)
 * @returns {{canStart: boolean, reason: string, nextSession: Date|null, missedSession: {day: string, time: string, date: Date}|null}}
 */
export function canStartSession(scheduleDays, scheduleTime, now = new Date()) {
  if (!scheduleDays || scheduleDays.length === 0) {
    return {
      canStart: false,
      reason: 'Programul grupei nu este setat. Contactează administratorul pentru a seta zilele și ora lecțiilor.',
      nextSession: null,
      nextSessionFormatted: null,
      missedSession: null
    }
  }

  // Convertim la timezone România
  const roTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' }))
  const currentDayIndex = roTime.getDay() // 0 = Duminică
  const currentHour = roTime.getHours()
  const currentMinute = roTime.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Convertim scheduleDays în indexuri
  const scheduledDayIndexes = scheduleDays.map(d => DAY_MAP[d]).filter(i => i !== undefined)

  if (scheduledDayIndexes.length === 0) {
    return {
      canStart: false,
      reason: 'Zilele de program sunt invalide. Contactează administratorul.',
      nextSession: null,
      missedSession: null
    }
  }

  // Verifică dacă astăzi e o zi programată
  const todayDay = scheduleDays.find(d => DAY_MAP[d] === currentDayIndex)
  const todayTimeStr = todayDay ? getTimeForDay(scheduleTime, todayDay) : null

  // Dacă e zi programată dar nu are oră setată - permite pornirea toată ziua
  if (todayDay && !todayTimeStr) {
    return {
      canStart: true,
      reason: `Azi (${DAY_NAMES_RO[currentDayIndex]}) e zi de lecție. Ora nu e specificată, poți porni oricând.`,
      nextSession: null,
      missedSession: null
    }
  }

  // Calculează fereastra de timp permisă
  let todayScheduledMinutes = null
  if (todayTimeStr) {
    const [hours, minutes] = todayTimeStr.split(':').map(Number)
    todayScheduledMinutes = hours * 60 + (minutes || 0)
  }

  // Verifică dacă profesorul poate porni lecția
  if (todayDay && todayScheduledMinutes !== null) {
    // Fereastra: 30 min înainte până la sfârșitul zilei (23:59)
    const windowStart = todayScheduledMinutes - 30
    const windowEnd = 23 * 60 + 59 // 23:59 - sfârșitul zilei

    if (currentTimeInMinutes >= windowStart && currentTimeInMinutes <= windowEnd) {
      // Găsește următoarea sesiune programată (pentru săptămâna viitoare)
      const nextSessionInfo = getNextScheduledSession(scheduleDays, scheduleTime, now)
      return {
        canStart: true,
        reason: `Poți porni lecția - e în interval (${todayTimeStr})`,
        nextSession: nextSessionInfo?.date || null,
        nextSessionFormatted: nextSessionInfo ? `${nextSessionInfo.dayName} la ${nextSessionInfo.time}` : null,
        missedSession: null
      }
    } else if (currentTimeInMinutes < windowStart) {
      // Prea devreme - următoarea sesiune e TOT AZI la ora programată
      return {
        canStart: false,
        reason: `Prea devreme. Lecția e programată la ${todayTimeStr}. Poți porni începând cu ${formatMinutesToTime(windowStart)}`,
        nextSession: null,
        nextSessionFormatted: `${DAY_NAMES_RO[currentDayIndex]} la ${todayTimeStr}`,
        missedSession: null
      }
    }
  }

  // Găsește următoarea sesiune programată
  const nextSessionInfo = getNextScheduledSession(scheduleDays, scheduleTime, now)

  // Verifică dacă s-a ratat o sesiune (de la ultima zi programată care a trecut)
  const missedSessionInfo = getMissedSession(scheduleDays, scheduleTime, now)
  
  // Azi nu e zi programată sau a trecut ziua
  return {
    canStart: false,
    reason: todayDay 
      ? `A trecut ziua pentru lecția de azi. Următoarea sesiune: ${nextSessionInfo ? `${nextSessionInfo.dayName} la ${nextSessionInfo.time}` : 'N/A'}`
      : `Azi (${DAY_NAMES_RO[currentDayIndex]}) nu e zi de lecție. Următoarea sesiune: ${nextSessionInfo ? `${nextSessionInfo.dayName} la ${nextSessionInfo.time}` : 'N/A'}`,
    nextSession: nextSessionInfo?.date || null,
    nextSessionFormatted: nextSessionInfo ? `${nextSessionInfo.dayName} la ${nextSessionInfo.time}` : null,
    missedSession: missedSessionInfo
  }
}

/**
 * Găsește următoarea sesiune programată
 */
function getNextScheduledSession(scheduleDays, scheduleTime, now = new Date()) {
  const currentDayIndex = now.getDay()
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes()

  // Iterăm prin zilele următoare (începem de mâine, azi e gestionată separat)
  for (let daysAhead = 1; daysAhead < 8; daysAhead++) {
    const checkDayIndex = (currentDayIndex + daysAhead) % 7
    const matchingDay = scheduleDays.find(d => DAY_MAP[d] === checkDayIndex)

    if (matchingDay) {
      const timeStr = getTimeForDay(scheduleTime, matchingDay)
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number)

        const nextDate = new Date(now)
        nextDate.setDate(nextDate.getDate() + daysAhead)
        nextDate.setHours(hours, minutes || 0, 0, 0)

        return {
          day: matchingDay,
          time: timeStr,
          date: nextDate,
          dayName: DAY_NAMES_RO[checkDayIndex]
        }
      }
    }
  }

  return null
}

/**
 * Verifică dacă s-a ratat o sesiune (ultima sesiune programată care a trecut - din zilele anterioare)
 * O sesiune e ratată doar dacă a trecut ZIUA complet (nu doar ora)
 */
function getMissedSession(scheduleDays, scheduleTime, now = new Date()) {
  const currentDayIndex = now.getDay()

  // Verifică zilele anterioare din săptămâna curentă (azi NU poate fi ratată, mai e timp)
  for (let daysBack = 1; daysBack < 7; daysBack++) {
    const checkDayIndex = (currentDayIndex - daysBack + 7) % 7
    const matchingDay = scheduleDays.find(d => DAY_MAP[d] === checkDayIndex)

    if (matchingDay) {
      const timeStr = getTimeForDay(scheduleTime, matchingDay)
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number)
        const missedDate = new Date(now)
        missedDate.setDate(missedDate.getDate() - daysBack)
        missedDate.setHours(hours, minutes || 0, 0, 0)

        return {
          day: matchingDay,
          time: timeStr,
          date: missedDate,
          dayName: DAY_NAMES_RO[checkDayIndex]
        }
      }
    }
  }

  return null
}

/**
 * Formatează minutele într-un string de timp (HH:MM)
 */
function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Creează o dată cu ora specifică
 */
function createDateWithTime(baseDate, timeInMinutes) {
  const date = new Date(baseDate)
  date.setHours(Math.floor(timeInMinutes / 60), timeInMinutes % 60, 0, 0)
  return date
}

/**
 * Formatează informațiile despre sesiune pentru afișare
 */
function formatSessionInfo(sessionInfo) {
  if (!sessionInfo) return 'N/A'
  return `${sessionInfo.dayName} la ${sessionInfo.time}`
}

/**
 * Verifică dacă există deja o sesiune înregistrată pentru data dată
 */
export function shouldCheckMissedSession(lastSessionDate, scheduledDate) {
  if (!lastSessionDate) return true
  
  // Comparăm doar datele (fără ore)
  const lastDate = new Date(lastSessionDate)
  lastDate.setHours(0, 0, 0, 0)
  
  const scheduled = new Date(scheduledDate)
  scheduled.setHours(0, 0, 0, 0)
  
  return scheduled > lastDate
}

export { DAY_NAMES_RO, DAY_MAP }
