/**
 * Mesajele paginii Olla English — Messenger și Instagram, într-un singur loc.
 *
 * Se citește DOAR pagina Olla (META_MESSAGES_PAGE_ID, implicit id-ul ei), ca să
 * nu se amestece conversațiile altor pagini la care ar avea acces token-ul.
 *
 * Totul e read-only: se citesc conversații și mesaje, nu se trimite nimic.
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
