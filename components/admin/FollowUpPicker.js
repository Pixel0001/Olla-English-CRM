'use client'

/**
 * Alegerea datei și orei de recontactare.
 *
 * Minutele merg din 10 în 10, fiindcă atât de des verifică cron-ul — o oră ca
 * 16:08 ar suna tot la 16:10. Valoarea iese ca ISO complet (cu fus orar), ca
 * serverul să nu o interpreteze drept oră UTC și să o mute cu câteva ore.
 */

const MINUTES = ['00', '10', '20', '30', '40', '50']
const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'))

const pad = (n) => String(n).padStart(2, '0')

const parts = (iso) => {
  if (!iso) return { date: '', hour: '10', minute: '00' }
  const d = new Date(iso)
  if (isNaN(d.getTime())) return { date: '', hour: '10', minute: '00' }
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    hour: pad(d.getHours()),
    // rotunjim la cel mai apropiat pas, pentru valorile vechi (ex. 16:08)
    minute: pad(Math.round(d.getMinutes() / 10) * 10 % 60),
  }
}

export default function FollowUpPicker({ value, onChange, disabled = false, className = '' }) {
  const { date, hour, minute } = parts(value)

  const emit = (nextDate, nextHour, nextMinute) => {
    if (!nextDate) return onChange(null)
    // Construim data în ora locală și o trimitem ca ISO cu fus orar
    const d = new Date(`${nextDate}T${nextHour}:${nextMinute}:00`)
    if (isNaN(d.getTime())) return
    onChange(d.toISOString())
  }

  const select =
    'px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 font-mono'

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <input
        type="date"
        value={date}
        disabled={disabled}
        onChange={(e) => emit(e.target.value, hour, minute)}
        className="px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
      />

      <select
        value={hour}
        disabled={disabled || !date}
        onChange={(e) => emit(date, e.target.value, minute)}
        className={select}
        aria-label="Ora"
      >
        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>

      <span className="text-gray-400 font-bold">:</span>

      <select
        value={minute}
        disabled={disabled || !date}
        onChange={(e) => emit(date, hour, e.target.value)}
        className={select}
        aria-label="Minutul"
      >
        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      {date && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(null)}
          className="text-[11px] text-gray-500 hover:text-red-600 disabled:opacity-50"
        >
          elimină
        </button>
      )}
    </div>
  )
}
