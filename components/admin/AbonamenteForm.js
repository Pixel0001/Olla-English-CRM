'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ClockIcon, BoltIcon, TrophyIcon, PlusIcon, TrashIcon,
  CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline'

const COOLDOWN_PRESETS = [
  { v: 0, l: 'Fără' },
  { v: 30, l: '30 min' },
  { v: 60, l: '1 h' },
  { v: 120, l: '2 h' },
  { v: 240, l: '4 h' },
  { v: 480, l: '8 h' },
  { v: 1440, l: '24 h' },
]

const XP_PRESETS = [100, 250, 500, 1000, 2000, 5000]

export default function AbonamenteForm({ initial }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [s, setS] = useState({
    problemCooldownMin: initial.problemCooldownMin ?? 240,
    cooldownEnabled:    initial.cooldownEnabled ?? true,
    dailyXpCap:         initial.dailyXpCap ?? 500,
    xpCapEnabled:       initial.xpCapEnabled ?? true,
    levelCurve:         initial.levelCurve?.length ? [...initial.levelCurve] : [0, 100, 300, 700, 1500, 3000, 6000, 12000, 25000, 50000],
    levelNames:         initial.levelNames?.length ? [...initial.levelNames] : ['Novice', 'Explorator', 'Practicant', 'Expert', 'Master', 'Legend', 'Mythic', 'Titan', 'Sage', 'Immortal'],
  })

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch('/api/admin/system-settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Eroare')
      toast.success('Setări salvate')
      router.refresh()
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const set = (k, v) => setS(p => ({ ...p, [k]: v }))

  // ── Niveluri editor ────────────────────────────────────────────────────
  const addLevel = () => {
    const last = s.levelCurve[s.levelCurve.length - 1] || 0
    setS(p => ({
      ...p,
      levelCurve: [...p.levelCurve, last + 1000],
      levelNames: [...p.levelNames, `Nivel ${p.levelCurve.length + 1}`],
    }))
  }
  const removeLevel = (i) => {
    if (s.levelCurve.length <= 2) { toast.error('Minim 2 niveluri'); return }
    setS(p => ({
      ...p,
      levelCurve: p.levelCurve.filter((_, k) => k !== i),
      levelNames: p.levelNames.filter((_, k) => k !== i),
    }))
  }
  const setLevelXp = (i, v) => {
    const arr = [...s.levelCurve]; arr[i] = parseInt(v) || 0
    setS(p => ({ ...p, levelCurve: arr }))
  }
  const setLevelName = (i, v) => {
    const arr = [...s.levelNames]; arr[i] = v
    setS(p => ({ ...p, levelNames: arr }))
  }

  return (
    <div className="space-y-4 pb-24">
      {/* ── COOLDOWN ────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="font-bold text-lg text-slate-900">Cooldown între probleme</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={s.cooldownEnabled} onChange={e => set('cooldownEnabled', e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            <span className={`text-sm font-bold ${s.cooldownEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
              {s.cooldownEnabled ? '✓ Activ' : '✗ Dezactivat global'}
            </span>
          </label>
        </header>
        <p className="text-sm text-slate-600">
          După rezolvarea unei probleme, elevul trebuie să aștepte acest interval până la următoarea.
          Previne ca elevii să termine toate temele într-o singură ședință.
        </p>
        <div className={s.cooldownEnabled ? '' : 'opacity-40 pointer-events-none'}>
          <div className="flex gap-2 flex-wrap mb-3">
            {COOLDOWN_PRESETS.map(p => (
              <button key={p.v} type="button" onClick={() => set('problemCooldownMin', p.v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${s.problemCooldownMin === p.v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {p.l}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom (minute)</span>
            <input type="number" min={0} max={10080} value={s.problemCooldownMin}
              onChange={e => set('problemCooldownMin', parseInt(e.target.value) || 0)}
              className="mt-1 w-32 px-3 py-2 border-2 border-slate-200 rounded-lg outline-none focus:border-indigo-400" />
            <span className="ml-2 text-sm text-slate-500">
              = {Math.floor(s.problemCooldownMin / 60)}h {s.problemCooldownMin % 60}min
            </span>
          </label>
        </div>
      </section>

      {/* ── XP CAP ─────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BoltIcon className="w-6 h-6 text-amber-600" />
            <h2 className="font-bold text-lg text-slate-900">Cap zilnic XP</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={s.xpCapEnabled} onChange={e => set('xpCapEnabled', e.target.checked)} className="w-4 h-4 accent-amber-600" />
            <span className={`text-sm font-bold ${s.xpCapEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
              {s.xpCapEnabled ? '✓ Activ' : '✗ Dezactivat global'}
            </span>
          </label>
        </header>
        <p className="text-sm text-slate-600">
          Maxim XP pe care îl poate acumula un elev într-o zi. După atingere, problemele rezolvate nu mai dau XP până a doua zi.
        </p>
        <div className={s.xpCapEnabled ? '' : 'opacity-40 pointer-events-none'}>
          <div className="flex gap-2 flex-wrap mb-3">
            {XP_PRESETS.map(v => (
              <button key={v} type="button" onClick={() => set('dailyXpCap', v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${s.dailyXpCap === v ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {v} XP
              </button>
            ))}
          </div>
          <label className="block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom (XP)</span>
            <input type="number" min={0} max={100000} value={s.dailyXpCap}
              onChange={e => set('dailyXpCap', parseInt(e.target.value) || 0)}
              className="mt-1 w-32 px-3 py-2 border-2 border-slate-200 rounded-lg outline-none focus:border-amber-400" />
          </label>
        </div>
      </section>

      {/* ── NIVELURI ────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <header className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-purple-600" />
          <h2 className="font-bold text-lg text-slate-900">Curba de niveluri</h2>
        </header>
        <p className="text-sm text-slate-600">
          Praguri XP pentru fiecare nivel. Primul nivel începe de la 0. Adaugă oricâte niveluri vrei.
        </p>
        <div className="space-y-2">
          {s.levelCurve.map((xp, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <input value={s.levelNames[i] || ''} onChange={e => setLevelName(i, e.target.value)}
                placeholder={`Nivel ${i + 1}`}
                className="flex-1 min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-400" />
              <div className="flex items-center gap-1">
                <input type="number" min={0} value={xp} disabled={i === 0}
                  onChange={e => setLevelXp(i, e.target.value)}
                  className={`w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-400 ${i === 0 ? 'bg-slate-100' : ''}`} />
                <span className="text-xs text-slate-500 font-bold">XP</span>
              </div>
              <button type="button" onClick={() => removeLevel(i)} disabled={s.levelCurve.length <= 2}
                className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLevel}
          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-purple-200 rounded-xl text-sm font-bold text-purple-700 hover:bg-purple-50 transition">
          <PlusIcon className="w-4 h-4" /> Adaugă nivel
        </button>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          💡 <strong>Sfat:</strong> ultimul nivel e cel mai înalt — pune-l mare (ex 50000 XP) ca să fie greu de atins.
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Modificările se aplică imediat tuturor elevilor (cache 30s).
          </p>
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition shadow">
            {saving ? 'Se salvează…' : '💾 Salvează setările'}
          </button>
        </div>
      </div>
    </div>
  )
}
