// Nivelurile de engleză folosite la grupe și la leads.
// Structura e pe două audiențe (copii / adulți), fiecare cu benzi CEFR și
// subnivele. Modifică lista aici — apare automat în toate formularele.

export const LEVEL_GROUPS = [
  // ── Copii ──────────────────────────────────────────────────────────────
  { audience: 'Copii', band: 'Preșcolari', levels: ['Mini grădiniță'] },
  { audience: 'Copii', band: 'Pre-A1', levels: ['Pre A1.1'] },
  { audience: 'Copii', band: 'A1', levels: ['A1.1', 'A1.2', 'A1.3', 'A1.4', 'A1.5'] },
  { audience: 'Copii', band: 'A2', levels: ['A2.1', 'A2.2', 'A2.3', 'A2.4', 'A2.5'] },
  { audience: 'Copii', band: 'B1', levels: ['B1.1', 'B1.2', 'B1.3', 'B1.4', 'B1.5'] },
  { audience: 'Copii', band: 'B1+', levels: ['B1.1+', 'B1.2+', 'B1.3+', 'B1.4+', 'B1.5+'] },
  { audience: 'Copii', band: 'B2', levels: ['B2.1', 'B2.2', 'B2.3', 'B2.4', 'B2.5'] },

  // ── Adulți (CEFR) ──────────────────────────────────────────────────────
  { audience: 'Adulți', band: 'A1 – Începător', levels: ['A1.1', 'A1.2'] },
  { audience: 'Adulți', band: 'A2 – Elementar', levels: ['A2.1', 'A2.2', 'A2.3'] },
  { audience: 'Adulți', band: 'B1 – Intermediar', levels: ['B1.1', 'B1.2', 'B1.3'] },
  { audience: 'Adulți', band: 'B1+ – Intermediar consolidat', levels: ['B1.1+', 'B1.2+', 'B1.3+'] },
  { audience: 'Adulți', band: 'B2 – Intermediar superior', levels: ['B2.1', 'B2.2', 'B2.3'] },
  { audience: 'Adulți', band: 'C1 – Avansat', levels: ['C1.1', 'C1.2', 'C1.3'] },

  // ── Programe separate ──────────────────────────────────────────────────
  { audience: 'Programe', band: 'Programe', levels: ['Cambridge', 'IELTS', 'Business', 'Conversație'] },
]

// Listă plată, fără duplicate — pentru validări și pentru consumatorii vechi.
export const ENGLISH_LEVELS = [...new Set(LEVEL_GROUPS.flatMap((g) => g.levels))]

// Eticheta unui optgroup: „Copii · A1", „Adulți · B2 – Intermediar superior".
export const groupLabel = (g) =>
  g.audience === 'Programe' ? 'Programe' : `${g.audience} · ${g.band}`

export default ENGLISH_LEVELS
