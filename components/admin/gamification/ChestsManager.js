'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, GiftIcon } from '@heroicons/react/24/outline'
import { CHEST_TIERS, RARITY_STYLES, RarityBadge, CurrencyBadge } from './shared'

export default function ChestsManager() {
  const [chests, setChests] = useState([])
  const [cosmetics, setCosmetics] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [rewardsFor, setRewardsFor] = useState(null) // chest

  async function load() {
    setLoading(true)
    const [c, cos] = await Promise.all([
      fetch('/api/admin/chests', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/admin/cosmetics', { cache: 'no-store' }).then(r => r.json()),
    ])
    setChests(c)
    setCosmetics(cos)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save(data) {
    const isNew = !data.id
    const url = isNew ? '/api/admin/chests' : `/api/admin/chests/${data.id}`
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { toast.success('OK'); setEditing(null); load() }
    else toast.error((await res.json()).error || 'Eroare')
  }
  async function remove(id) {
    if (!confirm('Ștergi acest cufăr?')) return
    const res = await fetch(`/api/admin/chests/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Șters'); load() }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Chests Manager</h2>
          <p className="text-sm text-slate-500">Cufere cu recompense aleatorii (cosmetics, coins, gems).</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30"
        >
          <PlusIcon className="w-4 h-4" /> Cufăr nou
        </button>
      </div>

      {loading && <div className="text-center py-12 text-slate-400">Se încarcă...</div>}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chests.map(c => {
            const tier = CHEST_TIERS.find(t => t.value === c.tier) || CHEST_TIERS[0]
            return (
              <div key={c.id} className={`group bg-slate-900 rounded-2xl overflow-hidden ring-2 ring-slate-700 hover:ring-amber-400 transition`}>
                <div className={`h-32 bg-gradient-to-br ${tier.grad} relative flex items-center justify-center`}>
                  <GiftIcon className="w-16 h-16 text-white/80 drop-shadow-lg" />
                  {!c.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">INACTIV</span>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="font-bold text-white text-sm truncate">{c.name}</h3>
                    <p className="text-xs text-slate-400">{tier.label} · {c.rewards?.length || 0} recompense</p>
                  </div>
                  <CurrencyBadge currency={c.currency} amount={c.price} />
                  <div className="flex gap-1 pt-1">
                    <button onClick={() => setRewardsFor(c)} className="flex-1 px-2 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold">
                      Recompense
                    </button>
                    <button onClick={() => setEditing(c)} className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
                      <PencilIcon className="w-3 h-3" />
                    </button>
                    <button onClick={() => remove(c.id)} className="px-2 py-1.5 bg-red-900/40 hover:bg-red-900 text-red-300 rounded-lg">
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing !== null && <ChestModal item={editing} onClose={() => setEditing(null)} onSave={save} />}
      {rewardsFor && <RewardsModal chest={rewardsFor} cosmetics={cosmetics} onClose={() => { setRewardsFor(null); load() }} />}
    </div>
  )
}

function ChestModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    tier: item.tier || 'COMMON',
    currency: item.currency || 'COINS',
    price: item.price ?? 200,
    active: item.active ?? true,
    guaranteedRarity: item.guaranteedRarity || '',
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">{form.id ? 'Editează cufăr' : 'Cufăr nou'}</h3>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Nume"><input className={inp} value={form.name} onChange={e=>set('name', e.target.value)} /></Field>
          <Field label="Descriere"><input className={inp} value={form.description} onChange={e=>set('description', e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tier">
              <select className={inp} value={form.tier} onChange={e=>set('tier', e.target.value)}>
                {CHEST_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Currency">
              <select className={inp} value={form.currency} onChange={e=>set('currency', e.target.value)}>
                <option value="COINS">🪙 Coins</option>
                <option value="GEMS">💎 Gems</option>
              </select>
            </Field>
            <Field label="Preț">
              <input type="number" className={inp} value={form.price} onChange={e=>set('price', Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Garantat minim (rarity)">
            <select className={inp} value={form.guaranteedRarity} onChange={e=>set('guaranteedRarity', e.target.value || null)}>
              <option value="">— fără garanție —</option>
              {Object.keys(RARITY_STYLES).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={e=>set('active', e.target.checked)} /> Activ
          </label>
        </div>
        <div className="px-5 py-3 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Anulează</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-sm font-semibold shadow">Salvează</button>
        </div>
      </div>
    </div>
  )
}

function RewardsModal({ chest, cosmetics, onClose }) {
  const [rewards, setRewards] = useState([])
  const [form, setForm] = useState({ cosmeticId: '', weight: 10, coinsAmount: '', gemsAmount: '' })
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const r = await fetch(`/api/admin/chest-rewards?chestId=${chest.id}`).then(r => r.json())
    setRewards(r)
    setLoading(false)
  }
  useEffect(() => { load() }, [chest.id])

  async function add() {
    const body = {
      chestId: chest.id,
      cosmeticId: form.cosmeticId || null,
      weight: Number(form.weight) || 10,
      coinsAmount: form.coinsAmount ? Number(form.coinsAmount) : null,
      gemsAmount: form.gemsAmount ? Number(form.gemsAmount) : null,
    }
    if (!body.cosmeticId && !body.coinsAmount && !body.gemsAmount) {
      toast.error('Alege un cosmetic SAU coins SAU gems')
      return
    }
    const res = await fetch('/api/admin/chest-rewards', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) {
      toast.success('Recompensă adăugată'); setForm({ cosmeticId: '', weight: 10, coinsAmount: '', gemsAmount: '' }); load()
    } else toast.error('Eroare')
  }

  async function remove(id) {
    const res = await fetch(`/api/admin/chest-rewards?id=${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  const totalWeight = rewards.reduce((s, r) => s + Math.max(1, r.weight), 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">Recompense — {chest.name}</h3>
          <p className="text-xs text-slate-500">Total weight: {totalWeight}. Probabilitate = weight / total.</p>
        </div>
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {loading && <div className="text-slate-400">Se încarcă...</div>}
          {!loading && rewards.length === 0 && <div className="text-center py-6 text-slate-400 text-sm">Nicio recompensă.</div>}
          {!loading && rewards.map(r => {
            const pct = ((r.weight / totalWeight) * 100).toFixed(1)
            return (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  {r.cosmetic && (
                    <div className="flex items-center gap-2">
                      <RarityBadge rarity={r.cosmetic.rarity} />
                      <span className="font-semibold text-sm">{r.cosmetic.name}</span>
                    </div>
                  )}
                  {r.coinsAmount && <span className="font-semibold text-sm">🪙 {r.coinsAmount} Coins</span>}
                  {r.gemsAmount && <span className="font-semibold text-sm">💎 {r.gemsAmount} Gems</span>}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">{pct}%</div>
                  <div className="text-[10px] text-slate-400">weight {r.weight}</div>
                </div>
                <button onClick={() => remove(r.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )
          })}

          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-bold text-slate-700">Adaugă recompensă</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cosmetic (opțional)">
                <select className={inp} value={form.cosmeticId} onChange={e=>setForm({...form, cosmeticId: e.target.value})}>
                  <option value="">— niciunul —</option>
                  {cosmetics.map(c => <option key={c.id} value={c.id}>{c.rarity} · {c.name}</option>)}
                </select>
              </Field>
              <Field label="Weight"><input type="number" className={inp} value={form.weight} onChange={e=>setForm({...form, weight: e.target.value})} /></Field>
              <Field label="Coins (alternativ)"><input type="number" className={inp} value={form.coinsAmount} onChange={e=>setForm({...form, coinsAmount: e.target.value})} /></Field>
              <Field label="Gems (alternativ)"><input type="number" className={inp} value={form.gemsAmount} onChange={e=>setForm({...form, gemsAmount: e.target.value})} /></Field>
            </div>
            <button onClick={add} className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold">
              + Adaugă
            </button>
          </div>
        </div>
        <div className="px-5 py-3 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Închide</button>
        </div>
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
