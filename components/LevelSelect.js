'use client'

import { LEVEL_GROUPS, ENGLISH_LEVELS, groupLabel } from '@/lib/english-levels'

/**
 * Select de nivel, grupat pe audiență (copii / adulți) și bandă CEFR.
 *
 * Dacă valoarea curentă nu mai există în listă (nivel vechi, ex. „C2"),
 * o păstrează ca opțiune separată — altfel s-ar pierde tăcut la prima salvare.
 */
export default function LevelSelect({
  value = '',
  onChange,
  name = 'level',
  className = '',
  emptyLabel = 'Fără nivel',
  id,
}) {
  const isLegacy = value && !ENGLISH_LEVELS.includes(value)

  return (
    <select id={id} name={name} value={value} onChange={onChange} className={className}>
      <option value="">{emptyLabel}</option>

      {isLegacy && (
        <optgroup label="Nivel curent">
          <option value={value}>{value}</option>
        </optgroup>
      )}

      {LEVEL_GROUPS.map((g) => (
        <optgroup key={`${g.audience}-${g.band}`} label={groupLabel(g)}>
          {g.levels.map((level) => (
            <option key={`${g.audience}-${level}`} value={level}>
              {level}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
