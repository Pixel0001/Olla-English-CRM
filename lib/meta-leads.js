import prisma from '@/lib/prisma'
import { fetchConversations, fetchMessages, PAGE_ID, isConfigured } from '@/lib/meta-messages'
import { notifyNewLead, notifyLeadNewMessage } from '@/lib/telegram'

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
 * Mesajele scrise de persoană după ultima verificare: intră ca notiță pe lead
 * și pleacă pe Telegram, cu butoanele de status.
 * Întoarce textul ultimului mesaj nou, sau null dacă n-a scris nimic.
 */
async function handleNewMessages(lead, conversation, notify) {
  const seenUntil = lead.metaLastMessageAt ? new Date(lead.metaLastMessageAt).getTime() : 0
  const updated = conversation.updatedTime ? new Date(conversation.updatedTime).getTime() : 0
  if (updated <= seenUntil) return null

  let messages = []
  try {
    messages = await fetchMessages(conversation.id, 25)
  } catch {
    return null
  }

  const fresh = messages.filter(
    (m) => !m.fromPage && m.text && new Date(m.createdTime).getTime() > seenUntil
  )

  await prisma.lead.update({
    where: { id: lead.id },
    data: { metaLastMessageAt: new Date(Math.max(updated, seenUntil)) },
  })

  if (fresh.length === 0) return null

  // Notițele păstrează firul în CRM, chiar dacă nimeni nu deschide Messenger
  await prisma.leadNote.createMany({
    data: fresh.map((m) => ({
      leadId: lead.id,
      content: m.text,
      authorName: `${lead.name} (mesaj primit)`,
      createdAt: new Date(m.createdTime),
    })),
  }).catch(() => {})

  const last = fresh[fresh.length - 1].text

  if (notify) {
    await notifyLeadNewMessage(lead, last, conversation.platform).catch((e) =>
      console.error('[meta-leads] Telegram mesaj nou:', e?.message)
    )
  }

  return last
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
  const newMessages = []
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
      })

      // Conversație deja convertită: ne interesează doar dacă a scris ceva nou
      if (already) {
        skipped.existing++
        const fresh = await handleNewMessages(already, c, notify)
        if (fresh) newMessages.push({ id: already.id, name: already.name, text: fresh })
        continue
      }

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
          metaLastMessageAt: c.updatedTime ? new Date(c.updatedTime) : new Date(),
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
    newMessages: newMessages.length,
    newMessageLeads: newMessages,
    skipped,
    errors,
    pageId: PAGE_ID,
    syncedAt: new Date().toISOString(),
  }
}
