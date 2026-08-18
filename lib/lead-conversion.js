import prisma from '@/lib/prisma'

/**
 * Conversia unui lead în elev.
 *
 * Când lead-ul ajunge la un status câștigat (a plătit / studiază), elevul
 * apare automat în lista de elevi. Legătura se ține în Lead.convertedStudentId,
 * deci o a doua trecere prin același status nu mai creează un duplicat.
 */

// Statusurile care înseamnă „s-a transformat în client"
export const WON_LEAD_STATUSES = ['PLATIT', 'STUDIAZA']

export function isWonStatus(status) {
  return WON_LEAD_STATUSES.includes(status)
}

/**
 * Creează elevul din lead, dacă nu există deja.
 * @returns {{ created: boolean, studentId: string|null, error?: string }}
 */
export async function convertLeadToStudent(lead) {
  if (!lead) return { created: false, studentId: null }
  if (lead.convertedStudentId) {
    return { created: false, studentId: lead.convertedStudentId }
  }

  try {
    // Dacă „cine învață" e completat, persoana de contact e părintele.
    // Altfel, contactul însuși e elevul (cazul adulților).
    const isSelf = !lead.studentName?.trim()
    const fullName = isSelf ? lead.name : lead.studentName.trim()

    const traceParts = [`Creat automat din lead (${new Date().toLocaleDateString('ro-RO')})`]
    if (lead.interestedIn) traceParts.push(`Nivel: ${lead.interestedIn}`)
    if (lead.message) traceParts.push(lead.message)

    const student = await prisma.student.create({
      data: {
        fullName,
        age: lead.studentAge ?? null,
        parentName: isSelf ? null : lead.name,
        parentPhone: lead.phone || null,
        parentEmail: lead.email || null,
        notes: traceParts.join(' · '),
      },
    })

    await prisma.lead.update({
      where: { id: lead.id },
      data: { convertedStudentId: student.id },
    })

    return { created: true, studentId: student.id }
  } catch (e) {
    // Conversia nu trebuie să pice schimbarea de status a lead-ului
    console.error('Lead → student conversion error:', e)
    return { created: false, studentId: null, error: e.message }
  }
}
