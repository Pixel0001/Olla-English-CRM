/**
 * Telegram Bot Utility
 * Pentru trimiterea notificărilor pe Telegram
 */

// Bot pentru notificări lecții (ratate, puține, zero)
const TELEGRAM_LESSONS_BOT_TOKEN = process.env.TELEGRAM_LESSONS_BOT_TOKEN
const TELEGRAM_LESSONS_CHAT_ID = process.env.TELEGRAM_LESSONS_CHAT_ID

// Bot pentru înscrieri și contact
const TELEGRAM_CONTACT_BOT_TOKEN = process.env.TELEGRAM_CONTACT_BOT_TOKEN
const TELEGRAM_CONTACT_CHAT_ID = process.env.TELEGRAM_CONTACT_CHAT_ID

// Admin chat with threads
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
const TELEGRAM_MISSED_LESSONS_THREAD_ID = process.env.TELEGRAM_MISSED_LESSONS_THREAD_ID
const TELEGRAM_LOW_LESSONS_THREAD_ID = process.env.TELEGRAM_LOW_LESSONS_THREAD_ID
const TELEGRAM_ENROLLMENTS_THREAD_ID = process.env.TELEGRAM_ENROLLMENTS_THREAD_ID
const TELEGRAM_TEACHER_ACTIVITIES_THREAD_ID = process.env.TELEGRAM_TEACHER_ACTIVITIES_THREAD_ID
// Topic separat pentru cereri de contact / lecție gratuită.
// Dacă nu e setat, cade pe topicul de înscrieri (comportamentul vechi).
const TELEGRAM_CONTACT_THREAD_ID = process.env.TELEGRAM_CONTACT_THREAD_ID || TELEGRAM_ENROLLMENTS_THREAD_ID

/**
 * Rutarea centralizată: ce tip de mesaj merge în ce topic.
 * Toate notificările de admin folosesc TELEGRAM_ADMIN_CHAT_ID (grup cu topic-uri).
 */
export const TELEGRAM_ROUTES = {
  // Lecții/recuperări neefectuate, nepornite sau anulate
  missedLessons: TELEGRAM_MISSED_LESSONS_THREAD_ID,
  // Ore rămase: puține / zero / negative
  lowLessons: TELEGRAM_LOW_LESSONS_THREAD_ID,
  // Înscrieri de pe site
  enrollments: TELEGRAM_ENROLLMENTS_THREAD_ID,
  // Cereri de contact / lecție gratuită
  contact: TELEGRAM_CONTACT_THREAD_ID,
  // Activități profesori (grupă nouă, elev nou, plată, modificări grupă)
  teacherActivities: TELEGRAM_TEACHER_ACTIVITIES_THREAD_ID,
}

/**
 * Trimite mesaj pe Telegram
 */
async function sendTelegramMessage(botToken, chatId, message, parseMode = 'HTML', threadId = null) {
  if (!botToken || !chatId) {
    console.log('Telegram not configured, skipping notification:', message.substring(0, 50))
    return false
  }

  try {
    const body = {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode
    }
    
    // Add thread_id if specified (for topic groups)
    if (threadId) {
      body.message_thread_id = parseInt(threadId)
    }
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (!data.ok) {
      console.error('Telegram error:', data.description)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return false
  }
}

/**
 * Trimite mesaj cu butoane inline pe Telegram
 */
async function sendTelegramMessageWithKeyboard(botToken, chatId, message, keyboard, threadId = null) {
  if (!botToken || !chatId) {
    console.log('Telegram not configured, skipping notification with keyboard')
    return null
  }

  try {
    const body = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard }
    }

    if (threadId) {
      body.message_thread_id = parseInt(threadId)
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!data.ok) {
      console.error('Telegram keyboard error:', data.description)
      return null
    }

    return data.result.message_id
  } catch (error) {
    console.error('Error sending Telegram message with keyboard:', error)
    return null
  }
}

/**
 * Notificare lecții puține/zero/negative (Thread 2 - Ore Rămase)
 * Trimite doar pentru <=1 lecții
 *
 * @param {Object} options.studentDetails - { parentName, parentPhone, parentEmail, lastPaymentAmount, lastPaymentDate }
 */
export async function notifyLowLessons(studentName, groupName, levelName, lessonsRemaining, studentDetails = null) {
  let emoji, status

  if (lessonsRemaining < 0) {
    emoji = '🔴'
    status = `LECȚII NEGATIVE (${lessonsRemaining})`
  } else if (lessonsRemaining === 0) {
    emoji = '⚠️'
    status = 'ZERO LECȚII'
  } else {
    emoji = '📉'
    status = `DOAR ${lessonsRemaining} LECȚII`
  }

  // Detalii contact + ultima plată (opționale)
  let contactBlock = ''
  if (studentDetails) {
    const { parentName, parentPhone, parentEmail, lastPaymentAmount, lastPaymentDate } = studentDetails
    const lines = []
    if (parentName) lines.push(`👨‍👩‍👦 Părinte: ${parentName}`)
    if (parentPhone) lines.push(`📞 Telefon: <a href="tel:${parentPhone}">${parentPhone}</a>`)
    if (parentEmail) lines.push(`✉️ Email: ${parentEmail}`)
    if (lastPaymentAmount != null) {
      let paymentLine = `💰 Ultima plată: <b>${Number(lastPaymentAmount).toLocaleString('ro-RO')} lei</b>`
      if (lastPaymentDate) {
        try {
          const d = new Date(lastPaymentDate).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
          paymentLine += ` (${d})`
        } catch {}
      }
      lines.push(paymentLine)
    } else {
      lines.push('💰 Ultima plată: <i>fără plăți</i>')
    }
    if (lines.length > 0) {
      contactBlock = '\n\n' + lines.join('\n')
    }
  }

  const message = `${emoji} <b>${status}</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}
📘 Nivel: ${levelName}
📊 Lecții rămase: <b>${lessonsRemaining}</b>${contactBlock}

${lessonsRemaining <= 0 ? '⚡ Contactați părinții pentru reînnoire!' : ''}`

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN, 
    TELEGRAM_ADMIN_CHAT_ID, 
    message,
    'HTML',
    TELEGRAM_LOW_LESSONS_THREAD_ID
  )
}

/**
 * Notificare lecție ratată (grup) - Thread 4 - Lecții Neefectuate
 * Cu butoane interactive: ✅ S-a efectuat / ❌ NU s-a efectuat
 */
export async function notifyMissedGroupSession(groupName, teacherName, levelName, scheduledDay, scheduledTime, studentsCount, missedSessionId = null) {
  const message = `❌ <b>LECȚIE NEEFECTUATĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
📘 Nivel: ${levelName}
📅 Programat: ${scheduledDay} la ${scheduledTime || 'ora neprecizată'}
👥 Elevi afectați: ${studentsCount}

⚡ Verificați situația!`

  // Dacă avem missedSessionId, trimitem cu butoane
  if (missedSessionId) {
    const keyboard = [
      [
        { text: '✅ S-a efectuat', callback_data: `m:y:${missedSessionId}` },
        { text: '❌ NU s-a efectuat', callback_data: `m:n:${missedSessionId}` },
      ],
    ]
    return sendTelegramMessageWithKeyboard(
      TELEGRAM_LESSONS_BOT_TOKEN,
      TELEGRAM_ADMIN_CHAT_ID,
      message,
      keyboard,
      TELEGRAM_MISSED_LESSONS_THREAD_ID
    )
  }

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN, 
    TELEGRAM_ADMIN_CHAT_ID, 
    message,
    'HTML',
    TELEGRAM_MISSED_LESSONS_THREAD_ID
  )
}

/**
 * Notificare recuperare ratată - Thread 4 - Lecții Neefectuate
 */
export async function notifyMissedMakeup(groupName, teacherName, scheduledTime, studentNames) {
  const message = `❌ <b>RECUPERARE NEEFECTUATĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
👥 Elevi: ${studentNames || 'Nespecificați'}

⚡ Verificați situația!`

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN, 
    TELEGRAM_ADMIN_CHAT_ID, 
    message,
    'HTML',
    TELEGRAM_MISSED_LESSONS_THREAD_ID
  )
}

/**
 * Notificare activitate profesor - Thread 9 - Activități Profesori
 * Pentru: grupă nouă, elev nou, plată nouă
 */
export async function notifyTeacherActivity(type, teacherName, details) {
  let emoji, title
  
  switch (type) {
    case 'group':
      emoji = '📚'
      title = 'GRUPĂ NOUĂ CREATĂ'
      break
    case 'student':
      emoji = '👤'
      title = 'ELEV NOU CREAT'
      break
    case 'student_group':
      emoji = '➕'
      title = 'ELEV ADĂUGAT ÎN GRUPĂ'
      break
    case 'payment':
      emoji = '💰'
      title = 'PLATĂ NOUĂ ADĂUGATĂ'
      break
    default:
      emoji = '📝'
      title = 'ACTIVITATE PROFESOR'
  }

  const message = `${emoji} <b>${title}</b>

👨‍🏫 Profesor: <b>${teacherName}</b>
${details}

🕐 ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau' })}`

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN, 
    TELEGRAM_ADMIN_CHAT_ID, 
    message,
    'HTML',
    TELEGRAM_TEACHER_ACTIVITIES_THREAD_ID
  )
}

/**
 * Notificare lecție întârziată (2+ ore) - Thread 4 - Lecții Neefectuate
 */
export async function notifyLateSession(groupName, teacherName, scheduledTime, hoursLate, isRecuperare = false) {
  const type = isRecuperare ? 'RECUPERARE' : 'LECȚIE'
  
  const message = `⏰ <b>${type} NEPORNITĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
⏱ Întârziere: ${hoursLate}

⚡ Profesorul a uitat să pornească lecția!`

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN,
    TELEGRAM_ADMIN_CHAT_ID || TELEGRAM_LESSONS_CHAT_ID,
    message,
    'HTML',
    TELEGRAM_ROUTES.missedLessons
  )
}

/**
 * Notificare mesaj contact nou - Thread Contact (fallback: Înscrieri) - cu butoane status inline
 * @param {string} contactId - ID-ul din DB (pentru callback_data)
 */
export async function notifyNewContact(name, email, phone, contactId, contactMessage) {
  const isFromSiteForm = email === 'noreply@ollaenglish.md'
  const emailLine = isFromSiteForm ? '🌐 Sursă: <b>Formular site</b>' : `📧 Email: ${email}`

  const msg = `📬 <b>CERERE LECȚIE GRATUITĂ</b>

👤 Nume: <b>${name}</b>
${emailLine}
📱 Telefon: <b>${phone || 'N/A'}</b>

📊 Status: 🔵 Pending`

  // Dacă nu avem contactId nu putem face butoane
  if (!contactId) {
    return sendTelegramMessage(
      TELEGRAM_LESSONS_BOT_TOKEN,
      TELEGRAM_ADMIN_CHAT_ID,
      msg,
      'HTML',
      TELEGRAM_ROUTES.contact
    )
  }

  const keyboard = [
    [
      { text: '✅ Contactat', callback_data: `c:CONTACTAT:${contactId}` },
      { text: '📅 Programat', callback_data: `c:PROGRAMAT:${contactId}` }
    ],
    [
      { text: '🎓 Finalizat', callback_data: `c:FINALIZAT_LECTIA:${contactId}` },
      { text: '⏳ Așteptăm', callback_data: `c:ASTEPTAM_PLATA:${contactId}` }
    ],
    [
      { text: '💰 Achitat', callback_data: `c:PLATIT:${contactId}` },
      { text: '❌ Anulat', callback_data: `c:LOST_LEAD:${contactId}` }
    ]
  ]

  return sendTelegramMessageWithKeyboard(
    TELEGRAM_LESSONS_BOT_TOKEN,
    TELEGRAM_ADMIN_CHAT_ID,
    msg,
    keyboard,
    TELEGRAM_ROUTES.contact
  )
}

/**
 * Notificare lecție anulată de profesor - Thread 4 - Lecții Neefectuate
 */
export async function notifyCancelledLesson(groupName, teacherName, levelName, scheduledTime, isRecuperare = false, studentNames = null) {
  const type = isRecuperare ? 'RECUPERARE ANULATĂ' : 'LECȚIE ANULATĂ'
  
  const message = `🚫 <b>${type}</b>

📚 Grupa: <b>${groupName}</b>
📘 Nivel: ${levelName}
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
${studentNames ? `👥 Elevi: ${studentNames}` : ''}

⚠️ Profesorul a anulat lecția!`

  return sendTelegramMessage(
    TELEGRAM_LESSONS_BOT_TOKEN,
    TELEGRAM_ADMIN_CHAT_ID || TELEGRAM_LESSONS_CHAT_ID,
    message,
    'HTML',
    TELEGRAM_ROUTES.missedLessons
  )
}

/**
 * Trimite mesaj direct către profesor (în privat)
 * Folosește telegramChatId din profilul profesorului
 */
export async function sendTeacherDirectMessage(teacherChatId, message) {
  if (!teacherChatId) {
    console.log('Teacher has no telegramChatId configured')
    return false
  }
  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, teacherChatId, message)
}

/**
 * Notificare profesor - program zilnic (direct în privat)
 */
export async function notifyTeacherDailySchedule(teacherChatId, teacherName, lessons, dayName) {
  if (!teacherChatId || !lessons?.length) return false
  
  const lessonsText = lessons
    .map(l => `• <b>${l.time}</b> - ${l.groupName} (${l.studentsCount} elevi)`)
    .join('\n')
  
  const message = `📚 <b>Programul tău pentru ${dayName}</b>

Bună dimineața, ${teacherName}! 👋

Ai ${lessons.length} ${lessons.length === 1 ? 'lecție' : 'lecții'} azi:

${lessonsText}

🎯 Succes la ore!`

  return sendTeacherDirectMessage(teacherChatId, message)
}

/**
 * Notificare profesor - elev nou în grupă (direct în privat)
 * @param {object} options - Opțiuni pentru notificare
 * @param {string} options.teacherChatId - Chat ID-ul profesorului
 * @param {string} options.studentName - Numele elevului
 * @param {string} options.groupName - Numele grupei
 * @param {string} options.levelName - Nivelul grupei
 * @param {string} options.scheduleDays - Zilele de curs (ex: "Luni, Miercuri")
 * @param {string} options.scheduleTime - Ora cursului
 * @param {string} options.branchName - Numele filialei
 * @param {string} options.parentPhone - Telefonul părintelui
 * @param {string} options.parentEmail - Emailul părintelui
 * @param {string} options.action - 'adăugat' sau 'transferat'
 * @param {string} options.previousTeacher - Profesorul anterior (pentru transfer)
 * @param {string} options.previousGroup - Grupa anterioară (pentru transfer)
 */
export async function notifyTeacherNewStudent(options) {
  const {
    teacherChatId,
    studentName,
    groupName,
    levelName,
    scheduleDays,
    scheduleTime,
    branchName,
    parentPhone,
    parentEmail,
    action = 'adăugat',
    previousTeacher,
    previousGroup
  } = options
  
  if (!teacherChatId) return false
  
  const emoji = action === 'transferat' ? '🔄' : '🆕'
  
  let scheduleInfo = ''
  if (scheduleDays) scheduleInfo += `\n📅 Zile: ${scheduleDays}`
  if (scheduleTime) scheduleInfo += `\n🕐 Ora: ${scheduleTime}`
  if (branchName) scheduleInfo += `\n📍 Filiala: ${branchName}`
  
  let contactInfo = ''
  if (parentPhone) contactInfo += `\n📱 Tel. părinte: ${parentPhone}`
  if (parentEmail) contactInfo += `\n📧 Email: ${parentEmail}`
  
  let transferInfo = ''
  if (action === 'transferat' && (previousTeacher || previousGroup)) {
    transferInfo = '\n\n📋 <b>Transferat din:</b>'
    if (previousGroup) transferInfo += `\n   📚 Grupa: ${previousGroup}`
    if (previousTeacher) transferInfo += `\n   👨‍🏫 Profesor: ${previousTeacher}`
  }
  
  const message = `${emoji} <b>Elev ${action} în grupă</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}
📘 Nivel: ${levelName}${scheduleInfo}${contactInfo}${transferInfo}

📝 Verifică lista de prezență la următoarea lecție!`

  return sendTeacherDirectMessage(teacherChatId, message)
}

/**
 * Notificare profesor - elev eliminat/transferat din grupă (direct în privat)
 * @param {object} options - Opțiuni pentru notificare
 */
export async function notifyTeacherStudentRemoved(options) {
  const {
    teacherChatId,
    studentName,
    groupName,
    targetGroup,
    targetTeacher,
    isTransfer = false
  } = options
  
  if (!teacherChatId) return false
  
  let transferInfo = ''
  if (isTransfer && (targetGroup || targetTeacher)) {
    transferInfo = '\n\n📋 <b>Transferat în:</b>'
    if (targetGroup) transferInfo += `\n   📚 Grupa: ${targetGroup}`
    if (targetTeacher) transferInfo += `\n   👨‍🏫 Profesor: ${targetTeacher}`
  }
  
  const emoji = isTransfer ? '🔄' : '👋'
  const title = isTransfer ? 'Elev transferat din grupă' : 'Elev eliminat din grupă'
  
  const message = `${emoji} <b>${title}</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}${transferInfo}

📝 Elevul nu va mai apărea în lista de prezență.`

  return sendTeacherDirectMessage(teacherChatId, message)
}

export { sendTelegramMessage }
