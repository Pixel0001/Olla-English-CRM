import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyLeadFollowUps, sendTeacherDirectMessage } from '@/lib/telegram'

/**
 * Cron dedicat recontactărilor de leads, rulat des (la 10 minute).
 *
 * E separat de cron-ul zilnic tocmai ca să rămână ieftin: o singură
 * interogare pe un câmp indexat (nextFollowUpAt), care de cele mai multe ori
 * întoarce zero rânduri. Follow-up-ul are acum și oră, nu doar zi.
 *
 * followUpNotifiedAt oprește retrimiterea: un lead e anunțat o singură dată
 * pentru o dată de recontactare, până când data e schimbată.
 */

export const dynamic = 'force-dynamic'

// Statusuri închise — nu mai au rost recontactările
const CLOSED_LEAD_STATUSES = ['PLATIT', 'STUDIAZA', 'PLECAT', 'LOST_LEAD']

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const now = new Date()

    const due = await prisma.lead.findMany({
      where: {
        nextFollowUpAt: { not: null, lte: now },
        status: { notIn: CLOSED_LEAD_STATUSES },
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true, telegramChatId: true } },
      },
      orderBy: { nextFollowUpAt: 'asc' },
      take: 100,
    })

    // Anunțăm o singură dată per dată de recontactare; dacă data e mutată mai
    // târziu, followUpNotifiedAt rămâne în urmă și lead-ul reintră în listă.
    const pending = due.filter(
      (l) => !l.followUpNotifiedAt || l.followUpNotifiedAt < l.nextFollowUpAt
    )

    if (pending.length === 0) {
      return NextResponse.json({ success: true, notified: 0, timestamp: now.toISOString() })
    }

    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const items = pending.map((lead) => {
      const dueDate = new Date(lead.nextFollowUpAt)
      dueDate.setHours(0, 0, 0, 0)
      return { lead, daysOverdue: Math.round((startOfDay - dueDate) / 86400000) }
    })

    // 1. Digest în topicul comun de lead-uri
    await notifyLeadFollowUps(items)

    // 2. Mesaj direct fiecărui responsabil conectat la Telegram
    const byOwner = new Map()
    for (const lead of pending) {
      if (!lead.assignedTo?.telegramChatId) continue
      const key = lead.assignedTo.telegramChatId
      if (!byOwner.has(key)) byOwner.set(key, { owner: lead.assignedTo, leads: [] })
      byOwner.get(key).leads.push(lead)
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')
    let directMessages = 0

    for (const { owner, leads } of byOwner.values()) {
      const lines = [
        `🔔 <b>Ai ${leads.length} ${leads.length === 1 ? 'lead de recontactat' : 'lead-uri de recontactat'}</b>`,
        '',
        ...leads.map((l) => {
          const time = new Date(l.nextFollowUpAt).toLocaleString('ro-RO', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            timeZone: 'Europe/Chisinau',
          })
          const name = baseUrl
            ? `<a href="${baseUrl}/admin/leads/${l.id}">${l.name}</a>`
            : `<b>${l.name}</b>`
          return `• ${name}${l.phone ? ` — ${l.phone}` : ''} — ${time}`
        }),
      ]

      const sent = await sendTeacherDirectMessage(owner.telegramChatId, lines.join('\n'))
      if (sent) directMessages++
    }

    // 3. Marcăm ca anunțate, ca să nu se repete la următoarea rulare
    await prisma.lead.updateMany({
      where: { id: { in: pending.map((l) => l.id) } },
      data: { followUpNotifiedAt: now },
    })

    return NextResponse.json({
      success: true,
      notified: pending.length,
      directMessages,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Lead follow-up cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
