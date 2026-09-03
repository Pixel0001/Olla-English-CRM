import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import {
  fetchInbox, fetchConversations, fetchMessages, pageInfo, summarize, sendMessage,
  markSeen, diagnose, subscribePageMessaging, isConfigured, PAGE_ID,
} from '@/lib/meta-messages'

/**
 * Inboxul paginii Olla English — Messenger și Instagram la un loc.
 *
 * GET                        → conversațiile din ambele platforme
 * GET ?conversation=<id>     → mesajele unei conversații
 * GET ?diagnose=1            → de ce nu vin conversațiile
 * POST { recipientId, text } → răspunde în numele paginii
 * POST { action:'subscribe' }→ abonează aplicația la pagină
 *
 * Apelurile către Meta durează secunde bune, așa că răspunsul se ține în
 * memorie și se împrospătează în fundal: pagina se deschide instant cu ce
 * știm deja, iar datele proaspete ajung la următoarea verificare.
 */

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const FRESH_MS = 20 * 1000        // sub asta, datele se consideră proaspete
const THREAD_FRESH_MS = 10 * 1000

let inboxCache = null             // { data, at, refreshing }
const threadCache = new Map()     // conversationId → { messages, at }

async function loadInbox() {
  const { conversations, errors } = await fetchInbox()
  const page = await pageInfo().catch(() => ({ id: PAGE_ID, name: 'Pagina' }))
  return {
    page,
    conversations,
    errors,
    stats: summarize(conversations),
    fetchedAt: new Date().toISOString(),
  }
}

/** Împrospătare în fundal — cine a cerut deja a primit datele vechi. */
function refreshInBackground() {
  if (inboxCache?.refreshing) return
  if (inboxCache) inboxCache.refreshing = true

  loadInbox()
    .then((data) => { inboxCache = { data, at: Date.now(), refreshing: false } })
    .catch(() => { if (inboxCache) inboxCache.refreshing = false })
}

export async function POST(request) {
  try {
    await requireAdmin()

    const canSend = await checkPermission('messages.send')
    if (!canSend.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să trimiți mesaje' }, { status: 403 })
    }

    if (!isConfigured()) {
      return NextResponse.json({ error: 'Token-ul Meta nu este setat' }, { status: 503 })
    }

    const body = await request.json()

    // Abonarea paginii schimbă o setare a paginii, nu doar citește — o lăsăm
    // doar pe mâna superadminului.
    if (body.action === 'subscribe') {
      const session = await getServerSession(authOptions)
      if (session?.user?.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { error: 'Doar superadminul poate conecta mesageria paginii' },
          { status: 403 }
        )
      }
      const result = await subscribePageMessaging()
      return NextResponse.json({ ok: true, ...result })
    }

    const { recipientId, text, conversationId } = body
    const sent = await sendMessage(recipientId, text)

    // Firul și lista se schimbă imediat după trimitere
    if (conversationId) threadCache.delete(conversationId)
    if (inboxCache) inboxCache.at = 0

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
        error: 'Token-ul Meta nu este setat',
        hint: 'Adaugă META_PAGE_ACCESS_TOKEN în variabilele de mediu și redeployează.',
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)

    if (searchParams.get('diagnose') === '1') {
      return NextResponse.json(await diagnose())
    }

    // ── Un fir de discuție ──
    const conversationId = searchParams.get('conversation')
    if (conversationId) {
      const cached = threadCache.get(conversationId)
      const fresh = cached && Date.now() - cached.at < THREAD_FRESH_MS

      const messages = fresh ? cached.messages : await fetchMessages(conversationId)
      if (!fresh) threadCache.set(conversationId, { messages, at: Date.now() })

      const personId = searchParams.get('person')
      if (personId) markSeen(personId).catch(() => {})

      return NextResponse.json({ conversationId, messages, cached: !!fresh })
    }

    // ── O singură platformă, pentru compatibilitate ──
    const platform = searchParams.get('platform')
    if (platform === 'messenger' || platform === 'instagram') {
      const after = searchParams.get('after') || null
      const { conversations, next } = await fetchConversations(platform, after)
      return NextResponse.json({ platform, conversations, next, stats: summarize(conversations) })
    }

    // ── Inboxul, cu datele ținute în memorie ──
    const force = searchParams.get('refresh') === '1'

    if (inboxCache && !force) {
      const age = Date.now() - inboxCache.at
      if (age > FRESH_MS) refreshInBackground()
      return NextResponse.json({ ...inboxCache.data, cached: true, ageMs: age })
    }

    const data = await loadInbox()
    inboxCache = { data, at: Date.now(), refreshing: false }

    return NextResponse.json({ ...data, cached: false, ageMs: 0 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Eroare la citirea mesajelor Meta:', error)

    const hint = /capability/i.test(error.message)
      ? 'Aplicația Meta nu are capacitatea de Instagram Messaging. Se adaugă din App Dashboard → Add Product → Instagram, apoi Advanced Access pentru instagram_manage_messages.'
      : null

    return NextResponse.json({ error: error.message || 'Eroare Meta', hint }, { status: 502 })
  }
}
