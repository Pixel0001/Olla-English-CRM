/**
 * Orele din CRM sunt mereu ora școlii (Chișinău), nu ora calculatorului.
 *
 * Fără asta, un laptop setat pe alt fus trimite altă oră decât cea aleasă pe
 * ecran, iar notificările ajung decalate. Toate conversiile de mai jos merg
 * prin Intl, deci trecerea la ora de vară e tratată automat.
 */

export const SCHOOL_TZ = 'Europe/Chisinau'

/** Cu câte minute e fusul înaintea UTC la momentul dat (ex. 180 vara). */
export function tzOffsetMinutes(date, timeZone = SCHOOL_TZ) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]))
  const asUtc = Date.UTC(
    Number(p.year), Number(p.month) - 1, Number(p.day),
    Number(p.hour === '24' ? '00' : p.hour), Number(p.minute), Number(p.second)
  )
  return (asUtc - date.getTime()) / 60000
}

/**
 * „2026-08-18" + „17" + „30", citite ca oră de Chișinău → ISO în UTC.
 * Rezultatul e ce trebuie trimis către API.
 */
export function zonedToUtcISO(dateStr, hour, minute, timeZone = SCHOOL_TZ) {
  if (!dateStr) return null
  const hh = String(hour).padStart(2, '0')
  const mm = String(minute).padStart(2, '0')

  // Pornim de la varianta „ca și cum ar fi UTC", apoi scădem offsetul real
  const naive = new Date(`${dateStr}T${hh}:${mm}:00Z`)
  if (isNaN(naive.getTime())) return null

  const offset = tzOffsetMinutes(naive, timeZone)
  const utc = new Date(naive.getTime() - offset * 60000)

  // Aproape de schimbarea orei, offsetul poate diferi înainte/după conversie
  const corrected = tzOffsetMinutes(utc, timeZone)
  return corrected === offset
    ? utc.toISOString()
    : new Date(naive.getTime() - corrected * 60000).toISOString()
}

/** ISO din bază → { date: 'YYYY-MM-DD', hour: 'HH', minute: 'MM' }, ora Chișinăului. */
export function utcToZonedParts(iso, timeZone = SCHOOL_TZ) {
  if (!iso) return { date: '', hour: '10', minute: '00' }
  const d = new Date(iso)
  if (isNaN(d.getTime())) return { date: '', hour: '10', minute: '00' }

  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
  const p = Object.fromEntries(dtf.formatToParts(d).map((x) => [x.type, x.value]))
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    hour: p.hour === '24' ? '00' : p.hour,
    minute: p.minute,
  }
}

/** Aceeași zi, ora dată, în fusul școlii — pentru scurtături de tip „+3 zile". */
export function zonedDateInDays(days, hour = 10, minute = 0, timeZone = SCHOOL_TZ) {
  const target = new Date(Date.now() + days * 86400000)
  const { date } = utcToZonedParts(target.toISOString(), timeZone)
  return zonedToUtcISO(date, hour, minute, timeZone)
}
