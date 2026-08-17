'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RARITY_STYLES, RarityBadge, CurrencyBadge } from './shared'

export default function ThemesManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/themes', { cache: 'no-store' })
    setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save(data) {
    const isNew = !data.id
    const url = isNew ? '/api/admin/themes' : `/api/admin/themes/${data.id}`
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { toast.success('OK'); setEditing(null); load() }
    else toast.error((await res.json()).error || 'Eroare')
  }

  async function remove(id) {
    if (!confirm('Ștergi această theme?')) return
    const res = await fetch(`/api/admin/themes/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Șters'); load() }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Themes Manager</h2>
          <p className="text-sm text-slate-500">Schimbă culorile, gradient-urile, glow-urile UI pentru elevi.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/30 transition hover:from-cyan-700 hover:to-blue-700"
        >
          <PlusIcon className="w-4 h-4" /> Theme nouă
        </button>
      </div>

      {loading && <div className="text-center py-12 text-slate-400">Se încarcă...</div>}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(t => (
            <div key={t.id} className="group bg-slate-900 rounded-2xl overflow-hidden ring-2 ring-slate-700 hover:ring-cyan-400 transition">
              {/* Live preview */}
              <div
                className="h-32 relative flex items-center justify-center"
                style={{
                  background: t.bgGradient || `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl shadow-lg" style={{ background: t.primary }} />
                  <div className="w-10 h-10 rounded-xl shadow-lg" style={{ background: t.secondary }} />
                  <div className="w-10 h-10 rounded-xl shadow-lg" style={{ background: t.accent }} />
                </div>
                <div className="absolute top-2 left-2"><RarityBadge rarity={t.rarity} /></div>
                {!t.active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">INACTIV</span>
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <h3 className="font-bold text-white text-sm truncate">{t.name}</h3>
                  {t.description && <p className="text-xs text-slate-400 truncate">{t.description}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <CurrencyBadge currency={t.currency} amount={t.price} />
                </div>
                <div className="flex gap-1 pt-1">
                  <button onClick={() => setEditing(t)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold">
                    <PencilIcon className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => remove(t.id)} className="px-2 py-1.5 bg-red-900/40 hover:bg-red-900 text-red-300 rounded-lg">
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ThemeModal item={editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </div>
  )
}

function ThemeModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    rarity: item.rarity || 'COMMON',
    currency: item.currency || 'COINS',
    price: item.price ?? 500,
    primary: item.primary || '#6366f1',
    secondary: item.secondary || '#8b5cf6',
    accent: item.accent || '#ec4899',
    bgGradient: item.bgGradient || '',
    glowColor: item.glowColor || '',
    active: item.active ?? true,
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-900">{form.id ? 'Editează theme' : 'Theme nouă'}</h3>
        </div>

        {/* Live preview */}
        <div
          className="h-28 m-5 rounded-xl flex items-center justify-center gap-3"
          style={{ background: form.bgGradient || `linear-gradient(135deg, ${form.primary}, ${form.secondary})` }}
        >
          <div className="px-4 py-2 rounded-lg font-bold text-white shadow" style={{ background: form.accent }}>
            Preview
          </div>
        </div>

        <div className="p-5 space-y-3 pt-0">
          <Field label="Nume"><input className={inp} value={form.name} onChange={e=>set('name', e.target.value)} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="Primary"   value={form.primary}   onChange={v=>set('primary', v)} />
            <ColorField label="Secondary" value={form.secondary} onChange={v=>set('secondary', v)} />
            <ColorField label="Accent"    value={form.accent}    onChange={v=>set('accent', v)} />
          </div>
          <Field label="Background gradient (CSS)">
            <input className={inp} value={form.bgGradient} onChange={e=>set('bgGradient', e.target.value)} placeholder="linear-gradient(135deg, #1e3a8a, #6366f1)" />
          </Field>
          <Field label="Glow color">
            <input className={inp} value={form.glowColor} onChange={e=>set('glowColor', e.target.value)} placeholder="rgba(99,102,241,0.5)" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Rarity">
              <select className={inp} value={form.rarity} onChange={e=>set('rarity', e.target.value)}>
                {Object.keys(RARITY_STYLES).map(r => <option key={r} value={r}>{r}</option>)}
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
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={e=>set('active', e.target.checked)} /> Activ
          </label>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Anulează</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-semibold shadow">Salvează</button>
        </div>
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={e=>onChange(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} className={inp} />
      </div>
    </Field>
  )
}
