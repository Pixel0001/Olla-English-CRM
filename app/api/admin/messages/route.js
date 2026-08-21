import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import {
  fetchConversations, fetchMessages, pageInfo, summarize, sendMessage, markSeen,
  isConfigured, PAGE_ID,
} from '@/lib/meta-messages'

/**
 * Conversațiile paginii Olla English (Messenger + Instagram).
 *
 * GET  ?platform=messenger|instagram[&after=cursor] → lista de conversații
 * GET  ?conversation=<id>                           → mesajele unei conversații
 * POST { recipientId, text }                        → răspunde în numele paginii
 */

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    await requireAdmin()

    const canSend = await checkPermission('messages.send')
    if (!canSend.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să trimiți mesaje' }, { status: 403 })
    }

    if (!isConfigured()) {
      return NextResponse.json({ error: 'META_ACCESS_TOKEN nu este setat' }, { status: 503 })
    }

    const { recipientId, text } = await request.json()
    const sent = await sendMessage(recipientId, text)

    return NextResponse.json({ ok: true, ...sent, sentAt: new Date().toISOString() })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Eroare la trimiterea mesajului Meta:', error)
    return NextResponse.json({ error: error.message || 'Mesajul nu a putut fi trimis' }, { status: 502 })
  }
}

export async function GET(request) {
  try {
    await requireAdmin()

    const canView = await checkPermission('messages.view')
    if (!canView.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să vezi mesajele' }, { status: 403 })
    }

    if (!isConfigured()) {
      return NextResponse.json({
        error: 'META_ACCESS_TOKEN nu este setat',
        hint: 'Adaugă token-ul Meta în variabilele de mediu și redeployează.',
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation')

    // ── Un fir de discuție ──
    if (conversationId) {
      const messages = await fetchMessages(conversationId)

      // Am citit-o efectiv — o marcăm și la Meta, ca să dispară „necitite"
      const personId = searchParams.get('person')
      if (personId) markSeen(personId).catch(() => {})

      return NextResponse.json({ conversationId, messages })
    }

    // ── Lista de conversații ──
    const platform = searchParams.get('platform') === 'instagram' ? 'instagram' : 'messenger'
    const after = searchParams.get('after') || null

    const [{ conversations, next }, page] = await Promise.all([
      fetchConversations(platform, after),
      after ? Promise.resolve(null) : pageInfo().catch(() => ({ id: PAGE_ID, name: 'Pagina' })),
    ])

    return NextResponse.json({
      platform,
      page,
      conversations,
      next,
      stats: summarize(conversations),
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Eroare la citirea mesajelor Meta:', error)

    // Instagram cere ca un cont profesional să fie legat de pagină; spunem asta
    // pe șleau, altfel pare că e o eroare a CRM-ului.
    const hint = /instagram/i.test(error.message)
      ? 'Verifică dacă un cont Instagram profesional e conectat la pagină și dacă token-ul are instagram_manage_messages.'
      : null

    return NextResponse.json({ error: error.message || 'Eroare Meta', hint }, { status: 502 })
  }
}
