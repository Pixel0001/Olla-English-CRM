'use client'

/**
 * Panou reutilizabil pentru override-uri de cooldown + XP cap.
 * Folosit în StudentForm și în pagina de editare grupă.
 *
 * Props:
 *   value: { cooldownOverrideMin, dailyXpCapOverride, cooldownDisabled, xpCapDisabled }
 *   onChange: (patch) => void  — apelat cu obiect parțial pentru a fi merge-uit
 *   scope: 'student' | 'group'
 */

export default function LimitsOverridePanel({ value = {}, onChange, scope = 'student' }) {
  const v = {
    cooldownOverrideMin: value.cooldownOverrideMin ?? '',
    dailyXpCapOverride:  value.dailyXpCapOverride ?? '',
    cooldownDisabled:    !!value.cooldownDisabled,
    xpCapDisabled:       !!value.xpCapDisabled,
  }
  const set = (patch) => onChange?.(patch)
  const label = scope === 'group' ? 'grupei' : 'elevului'

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚙️</span>
        <h3 className="font-extrabold text-amber-900 text-sm">Limite individuale (override)</h3>
      </div>
      <p className="text-xs text-amber-800/80">
        Aceste setări <strong>suprascriu</strong> setările globale pentru {label} respectiv{scope === 'group' ? 'e' : ''}.
        Lasă gol pentru a moșteni de la global / grupă.
      </p>

      {/* Cooldown */}
      <div className="bg-white rounded-xl p-3 space-y-2 border border-amber-200">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-800">⏱️ Cooldown între probleme</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input type="checkbox" checked={v.cooldownDisabled}
              onChange={e => set({ cooldownDisabled: e.target.checked })}
              className="w-4 h-4 accent-rose-600" />
            <span className={v.cooldownDisabled ? 'text-rose-700 font-bold' : 'text-slate-500'}>
              Dezactivează complet
            </span>
          </label>
        </div>
        <div className={v.cooldownDisabled ? 'opacity-40 pointer-events-none' : ''}>
          <input type="number" min={0} max={10080} placeholder="Moștenește (gol)"
            value={v.cooldownOverrideMin}
            onChange={e => set({ cooldownOverrideMin: e.target.value })}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-amber-500" />
          <p className="text-[11px] text-slate-500 mt-1">
            Minute. Ex: <code>0</code> = fără cooldown, <code>240</code> = 4h.
            {v.cooldownOverrideMin !== '' && Number.isFinite(parseInt(v.cooldownOverrideMin)) && (
              <span className="ml-1 font-bold text-amber-700">
                = {Math.floor(parseInt(v.cooldownOverrideMin) / 60)}h {parseInt(v.cooldownOverrideMin) % 60}min
              </span>
            )}
          </p>
        </div>
      </div>

      {/* XP Cap */}
      <div className="bg-white rounded-xl p-3 space-y-2 border border-amber-200">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-800">⚡ Cap zilnic XP</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input type="checkbox" checked={v.xpCapDisabled}
              onChange={e => set({ xpCapDisabled: e.target.checked })}
              className="w-4 h-4 accent-rose-600" />
            <span className={v.xpCapDisabled ? 'text-rose-700 font-bold' : 'text-slate-500'}>
              Dezactivează complet
            </span>
          </label>
        </div>
        <div className={v.xpCapDisabled ? 'opacity-40 pointer-events-none' : ''}>
          <input type="number" min={0} max={100000} placeholder="Moștenește (gol)"
            value={v.dailyXpCapOverride}
            onChange={e => set({ dailyXpCapOverride: e.target.value })}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-amber-500" />
          <p className="text-[11px] text-slate-500 mt-1">
            XP. Ex: <code>0</code> = nu primește XP, <code>2000</code> = 2000 XP/zi.
          </p>
        </div>
      </div>
    </div>
  )
}
