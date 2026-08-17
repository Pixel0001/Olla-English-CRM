'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function StudentEconomyAdmin({ studentId }) {
  const [econ, setEcon] = useState(null)
  const [currency, setCurrency] = useState('COINS')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const r = await fetch(`/api/admin/students/${studentId}/economy`, { cache: 'no-store' })
    const j = await r.json()
    setEcon(j.economy)
  }
  useEffect(() => { load() }, [studentId])

  async function submit(sign) {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return toast.error('Introdu o sumă validă')
    setBusy(true)
    try {
      const r = await fetch(`/api/admin/students/${studentId}/economy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, amount: sign * Math.round(n), reason }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Eroare')
      setEcon(j.economy)
      setAmount(''); setReason('')
      toast.success(`${sign > 0 ? '+' : '-'}${Math.round(n)} ${currency} aplicat`)
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-lg">💰</span>
        <h2 className="text-base font-semibold text-gray-900">Economie (Coins & Gems)</h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 shadow">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider opacity-90">
              <span className="text-base">🪙</span> Coins
            </div>
            <div className="text-3xl font-extrabold leading-tight mt-1">{econ?.coins ?? '—'}</div>
            <div className="text-[10px] font-bold opacity-70">total câștigați: {econ?.totalCoinsEarned ?? 0}</div>
          </div>
          <div className="rounded-xl p-4 bg-gradient-to-br from-cyan-400 to-blue-500 text-cyan-950 shadow">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider opacity-90">
              <span className="text-base">💎</span> Gems
            </div>
            <div className="text-3xl font-extrabold leading-tight mt-1">{econ?.gems ?? '—'}</div>
            <div className="text-[10px] font-bold opacity-70">total câștigate: {econ?.totalGemsEarned ?? 0}</div>
          </div>
        </div>

        {/* Streak info */}
        {econ?.streak > 0 && (
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-xs text-orange-900">
            🔥 Streak: <b>{econ.streak} zile</b> · Multiplier: <b>×{econ.multiplier?.toFixed(2)}</b> · Azi: <b>{econ.problemsToday}/3</b>
          </div>
        )}

        {/* Grant form */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="text-sm font-semibold text-gray-700">Acordă / debitează</div>

          <div className="flex gap-2">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="COINS">🪙 Coins</option>
              <option value="GEMS">💎 Gems</option>
            </select>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Sumă"
              className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Motiv (opțional)"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => submit(+1)}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition"
            >
              <PlusIcon className="w-4 h-4" /> Acordă
            </button>
            <button
              onClick={() => submit(-1)}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition"
            >
              <MinusIcon className="w-4 h-4" /> Retrage
            </button>
          </div>
          <p className="text-xs text-gray-400">Acțiunea apare în istoricul bonus-urilor cu prefixul [COINS] / [GEMS].</p>
        </div>
      </div>
    </div>
  )
}
