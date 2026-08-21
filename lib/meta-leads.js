import prisma from '@/lib/prisma'
import { fetchConversations, fetchMessages, PAGE_ID, isConfigured } from '@/lib/meta-messages'
import { notifyNewLead } from '@/lib/telegram'

/**
 * Transformă conversațiile de pe Messenger și Instagram în lead-uri.
 *
 * Regula de bază: o conversație = un lead, o singură dată. Legătura se ține pe
 * Lead.metaConversationId, deci a doua rulare nu mai creează nimic pentru
 * aceleași discuții. Nimic nu se șterge și nimic nu se suprascrie: dacă cineva
 * a lucrat deja lead-ul, rămâne cum e.
 *
 * Funcția rulează doar când SUPERADMIN-ul a pornit comutatorul din Securitate.
 */

const PLATFORMS = [
  { platform: 'messenger', source: 'MESSENGER', label: 'Messenger' },
  { platform: 'instagram', source: 'INSTAGRAM', label: 'Instagram' },
]

/** Setările: singleton, ca peste tot în CRM. */
export async function getMetaLeadSettings() {
  const existing = await prisma.systemSettings.findFirst()
  if (existing) return existing
  return prisma.systemSettings.create({ data: {} })
}

export async function setMetaLeadsEnabled(enabled, userId = null) {
  const settings = await getMetaLeadSettings()
  return prisma.systemSettings.update({
    where: { id: settings.id },
    data: { metaLeadsEnabled: !!enabled, updatedById: userId },
  })
}

/** Textul care ajunge în lead: ce a scris omul, nu ce am răspuns noi. */
async function firstMessageFrom(conversationId, snippet) {
  try {
    const messages = await fetchMessages(conversationId, 25)
    const fromPerson = messages.filter((m) => !m.fromPage && m.text)
    if (fromPerson.length === 0) return snippet || null

    // Primul mesaj spune de ce a scris; ultimul spune unde s-a ajuns
    const first = fromPerson[0].text
    const last = fromPerson[fromPerson.length - 1].text
    return first === last ? first : `${first}\n\n(ultimul mesaj: ${last})`
  } catch {
    return snippet || null
  }
}

/**
 * Sincronizează conversațiile în lead-uri.
 * @param {Object} options
 * @param {number} options.limit câte conversații per platformă
 * @param {boolean} options.notify trimite pe Telegram pentru fiecare lead nou
 */
export async function syncConversationsToLeads({ limit = 25, notify = true } = {}) {
  if (!isConfigured()) throw new Error('META_ACCESS_TOKEN nu este setat')

  const created = []
  const skipped = { existing: 0, noPerson: 0 }
  const errors = []

  for (const { platform, source, label } of PLATFORMS) {
    let conversations = []
    try {
      const res = await fetchConversations(platform, null, limit)
      conversations = res.conversations
    } catch (e) {
      errors.push(`${label}: ${e.message}`)
      continue
    }

    for (const c of conversations) {
      if (!c.person?.id) { skipped.noPerson++; continue }

      const already = await prisma.lead.findFirst({
        where: { metaConversationId: c.id },
        select: { id: true },
      })
      if (already) { skipped.existing++; continue }

      const message = await firstMessageFrom(c.id, c.snippet)

      const lead = await prisma.lead.create({
        data: {
          name: c.person.name || 'Contact fără nume',
          source,
          sourceDetail: c.person.username ? `@${c.person.username}` : label,
          message,
          status: 'LEAD',
          metaConversationId: c.id,
          metaPlatform: platform,
          metaPersonId: c.person.id,
        },
      })

      created.push({ id: lead.id, name: lead.name, platform: label })

      if (notify) {
        // Notificarea nu trebuie să oprească sincronizarea
        await notifyNewLead(lead).catch((e) =>
          console.error('[meta-leads] Telegram:', e?.message)
        )
      }
    }
  }

  const settings = await getMetaLeadSettings()
  await prisma.systemSettings.update({
    where: { id: settings.id },
    data: {
      metaLeadsLastSyncAt: new Date(),
      metaLeadsCreated: (settings.metaLeadsCreated || 0) + created.length,
    },
  })

  return {
    created: created.length,
    createdLeads: created,
    skipped,
    errors,
    pageId: PAGE_ID,
    syncedAt: new Date().toISOString(),
  }
}
