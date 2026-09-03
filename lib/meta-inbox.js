import { fetchInbox, pageInfo, summarize, PAGE_ID } from '@/lib/meta-messages'
import { readCache, writeCache } from '@/lib/external-cache'

/**
 * Inboxul, cu tot ce ține de păstrarea lui.
 *
 * Regula: pe ecran ajunge întotdeauna ultima citire reușită, oricât de veche.
 * Meta e lentă și uneori nu răspunde deloc — dacă am fi așteptat-o la fiecare
 * deschidere, pagina ar fi părut goală sau blocată. Împrospătarea se face în
 * fundal, iar rezultatul gol nu se salvează niciodată peste unul bun.
 */

export const INBOX_KEY = 'meta:inbox'
const FRESH_MS = 20 * 1000

let refreshing = false

/** Citește de la Meta. Aruncă dacă n-a venit nimic — vezi comentariul de sus. */
export async function loadInbox() {
  const { conversations, errors } = await fetchInbox()

  if (conversations.length === 0 && errors.length > 0) {
    throw new Error(errors.join(' · '))
  }

  const page = await pageInfo().catch(() => ({ id: PAGE_ID, name: 'Pagina' }))

  return {
    page,
    conversations,
    errors,
    stats: summarize(conversations),
    fetchedAt: new Date().toISOString(),
  }
}

/** Împrospătare în fundal: cine a cerut acum a primit deja datele vechi. */
export function refreshInBackground() {
  if (refreshing) return
  refreshing = true

  loadInbox()
    .then((data) => writeCache(INBOX_KEY, data))
    .catch((e) => console.error('[inbox] împrospătare eșuată:', e?.message))
    .finally(() => { refreshing = false })
}

/**
 * Inboxul pentru afișare.
 * Întoarce imediat ce avem; cere date noi doar dacă n-avem chiar nimic.
 */
export async function getInbox({ force = false } = {}) {
  if (!force) {
    const cached = await readCache(INBOX_KEY)

    // Un inbox gol nu merită servit: mai bine o citire adevărată decât
    // „nicio conversație" pe nedrept.
    if (cached?.payload?.conversations?.length > 0) {
      if (cached.ageMs > FRESH_MS) refreshInBackground()
      return { ...cached.payload, cached: true, ageMs: cached.ageMs, cacheFrom: cached.from }
    }
  }

  const data = await loadInbox()
  await writeCache(INBOX_KEY, data)
  return { ...data, cached: false, ageMs: 0 }
}

/** Folosit de cron, ca datele să fie proaspete înainte să intre cineva. */
export async function warmInbox() {
  const data = await loadInbox()
  await writeCache(INBOX_KEY, data)
  return { conversations: data.conversations.length, warmedAt: data.fetchedAt }
}
