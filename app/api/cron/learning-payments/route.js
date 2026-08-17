import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const TELEGRAM_LESSONS_BOT_TOKEN = process.env.TELEGRAM_LESSONS_BOT_TOKEN
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
// Raportul de abonamente /learn merge în topicul de plăți.
// Dacă nu există topic separat, cade pe „Ore rămase" (comportamentul vechi).
const TELEGRAM_PAYMENTS_THREAD_ID = process.env.TELEGRAM_PAYMENTS_THREAD_ID || process.env.TELEGRAM_LOW_LESSONS_THREAD_ID

async function sendTelegram(message) {
  if (!TELEGRAM_LESSONS_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    console.log('[learning-payments cron] Telegram not configured')
    return false
  }
  try {
    const body = {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
    if (TELEGRAM_PAYMENTS_THREAD_ID) body.message_thread_id = parseInt(TELEGRAM_PAYMENTS_THREAD_ID)
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_LESSONS_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!data.ok) console.error('[learning-payments cron] telegram error:', data.description)
    return !!data.ok
  } catch (e) {
    console.error('[learning-payments cron] telegram error', e)
    return false
  }
}

const fmtDate = d => new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
const escape = s => String(s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

function renderStudentBlock(student, payment, days, kind) {
  let block = `${kind === 'expired' ? '🔴' : '🟡'} <b>${escape(student.fullName)}</b>\n`
  if (student.parentName) block += `   👤 Părinte: ${escape(student.parentName)}\n`
  if (student.parentPhone) block += `   📞 ${escape(student.parentPhone)}\n`
  if (student.parentEmail) block += `   ✉️ ${escape(student.parentEmail)}\n`
  if (student.groupStudents?.length) {
    const groupNames = student.groupStudents.map(gs => gs.group?.name).filter(Boolean)
    if (groupNames.length) block += `   👥 Grupă: ${escape(groupNames.join(', '))}\n`
  }
  block += `   💰 Ultima plată: <b>${payment.amount} ${payment.currency}</b> (${payment.validDays} zile) — ${fmtDate(payment.paymentDate)}\n`
  if (kind === 'expired') {
    block += `   ⏰ <b>Expirat de ${Math.abs(days)} ${Math.abs(days) === 1 ? 'zi' : 'zile'}</b> (${fmtDate(payment.expiresAt)})\n`
  } else {
    block += `   ⏰ Expiră ${days === 0 ? '<b>astăzi</b>' : `în <b>${days} ${days === 1 ? 'zi' : 'zile'}</b>`} (${fmtDate(payment.expiresAt)})\n`
  }
  return block
}

export async function GET(request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const in3Days = new Date(now.getTime() + 3 * 86400000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

    // Toți elevii activi care au cel puțin o plată
    const studentsWithPayments = await prisma.student.findMany({
      where: { active: true, learningPayments: { some: {} } },
      select: {
        id: true, fullName: true, parentName: true, parentPhone: true, parentEmail: true,
        learningPayments: { orderBy: { paymentDate: 'desc' }, take: 1 },
        groupStudents: {
          select: { group: { select: { name: true } } },
        },
      },
    })

    const expiringSoon = []
    const expired = []

    for (const s of studentsWithPayments) {
      const latest = s.learningPayments[0]
      if (!latest) continue
      const expiresAt = new Date(latest.expiresAt)
      const days = Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000)

      if (expiresAt < sevenDaysAgo) continue // expirat de mai mult de 7 zile, nu mai notificăm
      if (expiresAt > in3Days) continue // expiră în mai mult de 3 zile

      if (days < 0) expired.push({ student: s, payment: latest, days })
      else expiringSoon.push({ student: s, payment: latest, days })
    }

    let notificationsSent = 0

    if (expired.length > 0 || expiringSoon.length > 0) {
      let msg = `📅 <b>Abonamente /learn — raport zilnic</b>\n`
      msg += `<i>${fmtDate(now)} la 8:00</i>\n\n`

      if (expired.length > 0) {
        msg += `━━━━━━━━━━━━━━━━━━━━\n`
        msg += `🔴 <b>EXPIRATE — ${expired.length} ${expired.length === 1 ? 'elev' : 'elevi'}</b>\n`
        msg += `<i>(acces auto-revocat la modulele plătite — pot face doar lecții gratis)</i>\n`
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
        for (const { student, payment, days } of expired) {
          msg += renderStudentBlock(student, payment, days, 'expired') + '\n'
        }
      }

      if (expiringSoon.length > 0) {
        msg += `━━━━━━━━━━━━━━━━━━━━\n`
        msg += `🟡 <b>EXPIRĂ ÎN CURÂND — ${expiringSoon.length} ${expiringSoon.length === 1 ? 'elev' : 'elevi'}</b>\n`
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`
        for (const { student, payment, days } of expiringSoon) {
          msg += renderStudentBlock(student, payment, days, 'soon') + '\n'
        }
      }

      const sent = await sendTelegram(msg)
      if (sent) notificationsSent = 1
    }

    return NextResponse.json({
      ok: true,
      checkedAt: now.toISOString(),
      expiringSoon: expiringSoon.length,
      expired: expired.length,
      notificationsSent,
    })
  } catch (e) {
    console.error('[learning-payments cron] error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
