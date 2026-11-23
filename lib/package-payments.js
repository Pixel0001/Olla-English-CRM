import prisma from '@/lib/prisma'
import { packageCycles, packageSize, parsePackageNumber, payablePackageNumber } from '@/lib/package-cycles'

/**
 * Pachetul pe care îl acoperă o plată nouă.
 *
 * Doar grupele cu pachet fix au așa ceva: la celelalte întoarce null, oricâte
 * valori ar trimite un formular. Dacă formularul n-a ales un pachet, plata
 * merge la cel în curs — sau la următorul, dacă pachetul curent e deja plin.
 *
 * @param groupStudentId  elevul din grupă care plătește
 * @param chosen          numărul scris în formular (gol / invalid = automat)
 */
export async function resolveForPackage(groupStudentId, chosen) {
  if (!groupStudentId) return null

  const gs = await prisma.groupStudent.findUnique({
    where: { id: groupStudentId },
    select: {
      group: { select: { id: true, billingType: true, packageLessons: true, packageStartedAt: true } },
    },
  })
  const group = gs?.group
  if (!group || group.billingType !== 'PACKAGE') return null

  const explicit = parsePackageNumber(chosen)
  if (explicit) return explicit

  const sessions = await prisma.lessonSession.findMany({
    where: { groupId: group.id },
    select: { id: true, date: true },
  })
  const { current } = packageCycles(sessions, packageSize(group), group.packageStartedAt)
  return payablePackageNumber(current)
}
