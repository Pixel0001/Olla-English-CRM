/**
 * Pachetele de lecții ale unei grupe (billingType PACKAGE).
 *
 * Grupa are un pachet de N lecții. Fiecare lecție ținută scade din pachet,
 * indiferent câți elevi au fost prezenți — absența cuiva nu schimbă nimic.
 * Când s-au ținut toate cele N, începe pachetul următor; nu există reset la
 * început de lună.
 *
 * Nimic nu se ține separat: pachetele se deduc din lecțiile grupei, puse în
 * ordinea datei și tăiate din N în N. Deci o lecție ștearsă sau adăugată
 * retroactiv mută singură granițele, fără să rămână cifre în urmă.
 */

export const DEFAULT_PACKAGE_LESSONS = 8
export const MAX_PACKAGE_LESSONS = 200

/** Numărul din formular → întreg valid, sau null dacă nu e. */
export function parsePackageLessons(value) {
  const n = parseInt(value, 10)
  if (!Number.isFinite(n) || n < 1 || n > MAX_PACKAGE_LESSONS) return null
  return n
}

/** Numărul pachetului scris într-un formular → întreg ≥ 1, sau null (gol / invalid). */
export function parsePackageNumber(value) {
  const n = parseInt(value, 10)
  return Number.isFinite(n) && n >= 1 && n <= 10000 ? n : null
}

/**
 * Pachetul pe care îl acoperă o plată făcută acum, când nu s-a ales altul:
 * cel în curs, sau următorul dacă cel curent e deja plin (cine plătește în
 * momentul acela plătește, de fapt, ce urmează).
 */
export function payablePackageNumber(current) {
  return current.complete ? current.number + 1 : current.number
}

/**
 * Ce a achitat un elev pentru un pachet: suma plăților legate de el, ultima
 * datorie notată și data ultimei plăți. Null = nimic achitat.
 *
 * @param payments  plățile elevului: { forPackage, amount, debt, paymentDate }
 */
export function packagePayment(payments, number) {
  const rows = (payments || [])
    .filter((p) => p.forPackage === number)
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
  if (rows.length === 0) return null
  return {
    amount: rows.reduce((sum, p) => sum + (p.amount || 0), 0),
    count: rows.length,
    lastDate: rows[0].paymentDate,
    // Datoria rămasă e cea din ultima plată: la fiecare tranșă se scrie cât mai e de dat
    debt: rows[0].debt || 0,
  }
}

/** Tipul de plată trimis din formular → una din cele trei valori valide. */
export function parseBillingType(value) {
  return value === 'INDIVIDUAL' ? 'INDIVIDUAL' : value === 'PACKAGE' ? 'PACKAGE' : 'MONTHLY'
}

/** Câte lecții are un pachet al grupei. */
export function packageSize(group) {
  return parsePackageLessons(group?.packageLessons) ?? DEFAULT_PACKAGE_LESSONS
}

const sortKey = (s) => `${new Date(s.date).getTime().toString().padStart(16, '0')}|${s.id ?? ''}`

/**
 * Pachetele grupei, de la primul la ultimul.
 *
 * @param sessions   lecțiile grupei: { id, date, ... }
 * @param size       lecții într-un pachet
 * @param startedAt  numără doar lecțiile din această zi încolo (null = toate)
 *
 * Întoarce mereu cel puțin un pachet: fără nicio lecție ținută, pachetul 1
 * e gol (0 din N). Ultimul pachet e cel curent; dacă e plin, următoarea
 * lecție îl deschide pe următorul.
 */
export function packageCycles(sessions, size, startedAt = null) {
  const from = startedAt ? new Date(startedAt).getTime() : null
  const counted = (sessions || [])
    .filter((s) => from === null || new Date(s.date).getTime() >= from)
    .sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0))

  const cycles = []
  for (let i = 0; i < counted.length; i += size) {
    const chunk = counted.slice(i, i + size)
    cycles.push({
      number: cycles.length + 1,
      sessions: chunk,
      total: size,
      held: chunk.length,
      remaining: size - chunk.length,
      complete: chunk.length === size,
      firstDate: chunk[0].date,
      lastDate: chunk[chunk.length - 1].date,
    })
  }

  if (cycles.length === 0) {
    cycles.push({
      number: 1, sessions: [], total: size, held: 0, remaining: size,
      complete: false, firstDate: null, lastDate: null,
    })
  }

  return { cycles, current: cycles[cycles.length - 1], countedSessions: counted.length }
}
