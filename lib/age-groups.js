/**
 * Repartizarea pe vârste, pentru grupele de copii.
 *
 * Nu e un câmp de completat: se calculează din vârsta pe care o aveți deja la
 * elev (`age`) sau la lead (`studentAge`). Altfel ar trebui ținute la zi două
 * lucruri care spun același lucru, iar la o zi de naștere ar rămâne greșit.
 *
 * Marginile sunt inclusive: „7–9 ani" înseamnă 7, 8 și 9.
 */

export const AGE_GROUPS = [
  { value: '3-6', label: '3–6 ani', short: '3–6', min: 3, max: 6, color: 'bg-pink-100 text-pink-800' },
  { value: '7-9', label: '7–9 ani', short: '7–9', min: 7, max: 9, color: 'bg-amber-100 text-amber-800' },
  { value: '10-12', label: '10–12 ani', short: '10–12', min: 10, max: 12, color: 'bg-lime-100 text-lime-800' },
  { value: '13-15', label: '13–15 ani', short: '13–15', min: 13, max: 15, color: 'bg-cyan-100 text-cyan-800' },
  { value: '16-18', label: '16–18 ani', short: '16–18', min: 16, max: 18, color: 'bg-violet-100 text-violet-800' },
  { value: 'adulti', label: 'Adulți', short: 'adulți', min: 19, max: 120, color: 'bg-gray-200 text-gray-800' },
]

export const AGE_GROUP_VALUES = AGE_GROUPS.map((g) => g.value)

/**
 * Categoria de vârstă a cuiva.
 * @param {number|null} age vârsta în ani
 * @param {boolean} isAdult bifa „adult", când vârsta exactă nu se știe
 */
export function getAgeGroup(age, isAdult = false) {
  if (isAdult) return AGE_GROUPS.find((g) => g.value === 'adulti')

  const n = Number(age)
  if (!Number.isFinite(n) || n <= 0) return null

  return AGE_GROUPS.find((g) => n >= g.min && n <= g.max) || null
}

/** Intervalul pentru o interogare Prisma: { gte, lte }. */
export function ageRange(value) {
  const group = AGE_GROUPS.find((g) => g.value === value)
  return group ? { gte: group.min, lte: group.max } : null
}
