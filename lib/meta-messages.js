/**
 * Mesajele paginii Olla English — Messenger și Instagram, într-un singur loc.
 *
 * Se citește DOAR pagina Olla (META_MESSAGES_PAGE_ID, implicit id-ul ei), ca să
 * nu se amestece conversațiile altor pagini la care ar avea acces token-ul.
 *
 * Se citesc conversații și mesaje și se poate răspunde în numele paginii,
 * în limitele impuse de Meta (fereastra de 24 de ore).
 */

const GRAPH = 'https://graph.facebook.com/v21.0'

const USER_TOKEN = process.env.META_ACCESS_TOKEN || ''

// Pagina de care ne pasă. Un token poate administra mai multe pagini —
// aici ne uităm doar la aceasta.
export const PAGE_ID = process.env.META_MESSAGES_PAGE_ID || '812688938587669'

export const isConfigured = () => !!USER_TOKEN

async function graph(path, params = {}, token) {
  const url = new URL(`${GRAPH}/${path}`)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }
  url.searchParams.set('access_token', token)

  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json().catch(() => ({}))
  if (json.error) {
    const err = new Error(json.error.message || 'Eroare Meta API')
    err.code = json.error.code
    throw err
  }
  return json
}

// Token-ul de pagină se schimbă rar; îl ținem cât trăiește instanța.
let pageTokenCache = null

async function pageToken() {
  if (!USER_TOKEN) throw new Error('META_ACCESS_TOKEN lipsește')
  if (pageTokenCache) return pageTokenCache

  const res = await graph(PAGE_ID, { fields: 'access_token,name' }, USER_TOKEN)
  if (!res.access_token) {
    throw new Error('Contul Meta conectat nu are drepturi de administrare pe această pagină')
  }
  pageTokenCache = res.access_token
  return pageTokenCache
}

/** Numele paginii — ca să se vadă limpede a cui e căsuța de mesaje. */
export async function pageInfo() {
  const res = await graph(PAGE_ID, { fields: 'name,category,link' }, USER_TOKEN)
  return { id: PAGE_ID, name: res.name, category: res.category || null, link: res.link || null }
}

const clean = (s) => (typeof s === 'string' ? s.trim() : '')

/** Cine e persoana din conversație (nu pagina noastră). */
function otherParticipant(participants, platform) {
  const list = participants?.data || []
  const other = list.find((p) => String(p.id) !== String(PAGE_ID)) || list[0] || {}
  return {
    id: other.id || null,
    name: clean(other.name) || clean(other.username) || 'Necunoscut',
    username: clean(other.username) || null,
    platform,
  }
}

/**
 * Conversațiile paginii, pentru o platformă.
 * @param {'messenger'|'instagram'} platform
 * @param {string} after cursor de paginare
 */
export async function fetchConversations(platform = 'messenger', after = null, limit = 25) {
  const token = await pageToken()

  const res = await graph(`${PAGE_ID}/conversations`, {
    platform,
    fields: 'id,updated_time,message_count,unread_count,snippet,participants',
    limit,
    after,
  }, token)

  const conversations = (res.data || []).map((c) => ({
    id: c.id,
    platform,
    updatedTime: c.updated_time || null,
    messageCount: c.message_count ?? null,
    unreadCount: c.unread_count ?? 0,
    snippet: clean(c.snippet),
    person: otherParticipant(c.participants, platform),
  }))

  return { conversations, next: res.paging?.cursors?.after && res.paging?.next ? res.paging.cursors.after : null }
}

/** Mesajele dintr-o conversație, cele mai vechi primele. */
export async function fetchMessages(conversationId, limit = 50) {
  const token = await pageToken()

  const res = await graph(`${conversationId}/messages`, {
    fields: 'id,created_time,from,to,message',
    limit,
  }, token)

  const messages = (res.data || []).map((m) => ({
    id: m.id,
    createdTime: m.created_time || null,
    text: clean(m.message),
    fromPage: String(m.from?.id) === String(PAGE_ID),
    fromName: clean(m.from?.name) || clean(m.from?.username) || '—',
  }))

  // Meta le dă de la cel mai nou; în chat le vrem cronologic
  return messages.reverse()
}

/**
 * Cifrele care contează pentru administrație: câte conversații, câte
 * necitite și cât de proaspete sunt.
 */
export function summarize(conversations) {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  let unread = 0
  let last24h = 0
  let last7d = 0

  for (const c of conversations) {
    if (c.unreadCount > 0) unread++
    const t = c.updatedTime ? new Date(c.updatedTime).getTime() : 0
    if (now - t <= day) last24h++
    if (now - t <= 7 * day) last7d++
  }

  return { total: conversations.length, unread, last24h, last7d }
}

// Fereastra standard de răspuns e de 24 de ore. Eticheta HUMAN_AGENT o duce
// la 7 zile — se folosește exact în cazul nostru: un om din administrație
// răspunde manual, nu un bot.
const WINDOW_ERROR = (error) => {
  const code = error?.code
  const sub = error?.error_subcode
  return code === 10 || sub === 2018278 || /outside.*window|24 hour|24-hour/i.test(error?.message || '')
}

async function postMessage(token, recipientId, text, humanAgent) {
  const payload = humanAgent
    ? { messaging_type: 'MESSAGE_TAG', tag: 'HUMAN_AGENT' }
    : { messaging_type: 'RESPONSE' }

  const res = await fetch(`${GRAPH}/${PAGE_ID}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
      ...payload,
      access_token: token,
    }),
  })

  return res.json().catch(() => ({}))
}

/**
 * Marchează conversația ca citită la Meta, ca badge-ul de necitite să nu
 * rămână agățat după ce am deschis discuția în CRM.
 */
export async function markSeen(recipientId) {
  if (!recipientId) return false
  try {
    const token = await pageToken()
    const res = await fetch(`${GRAPH}/${PAGE_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        sender_action: 'mark_seen',
        access_token: token,
      }),
    })
    const json = await res.json().catch(() => ({}))
    return !json.error
  } catch {
    return false
  }
}

/**
 * Trimite un mesaj în numele paginii, pe Messenger sau Instagram.
 *
 * Încearcă întâi un răspuns obișnuit; dacă Meta spune că fereastra de 24 de ore
 * s-a închis, reia cu eticheta HUMAN_AGENT, care e valabilă 7 zile. Dacă și
 * asta e refuzată, spunem exact de ce — de obicei pentru că token-ului îi
 * lipsește permisiunea „human_agent".
 */
export async function sendMessage(recipientId, text) {
  if (!recipientId) throw new Error('Lipsește destinatarul')
  const body = clean(text)
  if (!body) throw new Error('Mesajul e gol')

  const token = await pageToken()

  let json = await postMessage(token, recipientId, body, false)
  let usedHumanAgent = false

  if (json.error && WINDOW_ERROR(json.error)) {
    json = await postMessage(token, recipientId, body, true)
    usedHumanAgent = true
  }

  if (json.error) {
    if (usedHumanAgent && /permission|human_agent|tag/i.test(json.error.message || '')) {
      throw new Error(
        'Meta a refuzat răspunsul ca agent uman. Token-ul curent nu are permisiunea ' +
        '„human_agent" — regenerează-l bifând-o, apoi se poate răspunde până la 7 zile ' +
        'de la ultimul mesaj al persoanei.'
      )
    }
    if (WINDOW_ERROR(json.error)) {
      throw new Error(
        'Au trecut peste 7 zile de la ultimul mesaj al persoanei — nici eticheta de agent ' +
        'uman nu mai e valabilă. Trebuie să scrie ea din nou.'
      )
    }
    throw new Error(json.error.message || 'Meta a refuzat trimiterea')
  }

  return {
    messageId: json.message_id || null,
    recipientId: json.recipient_id || recipientId,
    humanAgent: usedHumanAgent,
  }
}

/**
 * De ce nu vin conversațiile? Întreabă Meta, punct cu punct.
 *
 * Instagram are câteva condiții care, neîndeplinite, nu dau eroare — pur și
 * simplu întorc zero conversații. Aici le verificăm pe rând, ca să se vadă
 * exact unde se rupe lanțul.
 */
export async function diagnose() {
  const out = { page: null, instagram: null, subscribedApps: null, platforms: {} }

  // Pagina și contul de Instagram legat de ea
  try {
    const page = await graph(PAGE_ID, {
      fields: 'name,instagram_business_account{id,username,name}',
    }, USER_TOKEN)
    out.page = { id: PAGE_ID, name: page.name }
    out.instagram = page.instagram_business_account
      ? {
          id: page.instagram_business_account.id,
          username: page.instagram_business_account.username,
          name: page.instagram_business_account.name || null,
        }
      : null
  } catch (e) {
    out.page = { id: PAGE_ID, error: e.message }
  }

  // Aplicația trebuie abonată la pagină ca să poată citi mesajele de Instagram
  try {
    const token = await pageToken()
    const subs = await graph(`${PAGE_ID}/subscribed_apps`, { fields: 'subscribed_fields' }, token)
    const apps = subs.data || []
    out.subscribedApps = {
      count: apps.length,
      fields: apps.flatMap((a) => a.subscribed_fields || []),
    }
    out.subscribedApps.hasMessages = out.subscribedApps.fields.includes('messages')
  } catch (e) {
    out.subscribedApps = { error: e.message }
  }

  // Câte conversații întoarce, de fapt, fiecare platformă
  for (const platform of ['messenger', 'instagram']) {
    try {
      const { conversations } = await fetchConversations(platform, null, 5)
      out.platforms[platform] = { ok: true, count: conversations.length }
    } catch (e) {
      out.platforms[platform] = { ok: false, error: e.message, code: e.code || null }
    }
  }

  return out
}

/**
 * Abonează aplicația la mesajele paginii — pasul care lipsește de obicei
 * pentru Instagram. E o singură setare pe pagină, reversibilă din Meta.
 */
export async function subscribePageMessaging() {
  const token = await pageToken()

  const res = await fetch(`${GRAPH}/${PAGE_ID}/subscribed_apps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscribed_fields: 'messages,messaging_postbacks,message_reactions',
      access_token: token,
    }),
  })

  const json = await res.json().catch(() => ({}))
  if (json.error) throw new Error(json.error.message || 'Abonarea a eșuat')
  return { success: !!json.success }
}
