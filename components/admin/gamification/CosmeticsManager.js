'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { COSMETIC_TYPES, RARITY_STYLES, RarityBadge, CurrencyBadge } from './shared'
import { TITLE_EFFECTS } from '@/components/student/TitleBadge'
import dynamic from 'next/dynamic'
const TitleBadgePreview = dynamic(() => import('@/components/student/TitleBadge'), { ssr: false })

export default function CosmeticsManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | {} (new) | item

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/cosmetics', { cache: 'no-store' })
    setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save(data) {
    const isNew = !data.id
    const url = isNew ? '/api/admin/cosmetics' : `/api/admin/cosmetics/${data.id}`
    const method = isNew ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      toast.success(isNew ? 'Cosmetic adăugat' : 'Cosmetic actualizat')
      setEditing(null)
      load()
    } else {
      toast.error((await res.json()).error || 'Eroare')
    }
  }

  async function remove(id) {
    if (!confirm('Ștergi acest cosmetic?')) return
    const res = await fetch(`/api/admin/cosmetics/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Șters'); load() }
    else toast.error('Eroare')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cosmetics Shop</h2>
          <p className="text-sm text-slate-500">Iteme cosmetice disponibile în shop sau ca recompense din cufere.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-fuchsia-500/30 transition"
        >
          <PlusIcon className="w-4 h-4" /> Adaugă Cosmetic
        </button>
      </div>

      {loading && <div className="text-center py-12 text-slate-400">Se încarcă...</div>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Niciun cosmetic încă. Adaugă primul!</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(it => {
            const r = RARITY_STYLES[it.rarity] || RARITY_STYLES.COMMON
            return (
              <div
                key={it.id}
                className={`group relative bg-slate-900 rounded-2xl overflow-hidden ring-2 ${r.ring} ${r.glow} transition-all hover:scale-[1.02]`}
              >
                {/* Rarity gradient background */}
                <div className={`h-32 bg-gradient-to-br ${r.grad} relative flex items-center justify-center`}>
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl opacity-50">✨</span>
                  )}
                  <div className="absolute top-2 left-2"><RarityBadge rarity={it.rarity} /></div>
                  {!it.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">INACTIV</span>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="font-bold text-white text-sm truncate">{it.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{COSMETIC_TYPES.find(t=>t.value===it.type)?.label}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <CurrencyBadge currency={it.currency} amount={it.price} />
                    <span className="text-[10px] text-slate-500">{it._count?.inventory || 0} owned</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button
                      onClick={() => setEditing(it)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                    >
                      <PencilIcon className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => remove(it.id)}
                      className="px-2 py-1.5 bg-red-900/40 hover:bg-red-900 text-red-300 rounded-lg transition"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing !== null && (
        <CosmeticModal item={editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </div>
  )
}

function CosmeticModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    id: item.id || undefined,
    name: item.name || '',
    description: item.description || '',
    type: item.type || 'PROFILE_BANNER',
    rarity: item.rarity || 'COMMON',
    currency: item.currency || 'COINS',
    price: item.price ?? 100,
    imageUrl: item.imageUrl || '',
    active: item.active ?? true,
    shopVisible: item.shopVisible ?? true,
    sortOrder: item.sortOrder ?? 0,
    titleEffect: item.cssPayload?.titleEffect || 'none',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-900">{form.id ? 'Editează cosmetic' : 'Cosmetic nou'}</h3>
        </div>
        <div className="p-5 space-y-3">
          <Field label="Nume"><input className={inp} value={form.name} onChange={e=>set('name', e.target.value)} /></Field>
          <Field label="Descriere">
            <textarea className={inp} rows={2} value={form.description} onChange={e=>set('description', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tip">
              <select className={inp} value={form.type} onChange={e=>set('type', e.target.value)}>
                {COSMETIC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
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
            <Field label="Preț"><input type="number" className={inp} value={form.price} onChange={e=>set('price', Number(e.target.value))} /></Field>
          </div>
          <Field label="URL imagine">
            <input className={inp} value={form.imageUrl} onChange={e=>set('imageUrl', e.target.value)} placeholder="/cosmetics/banner-1.png" />
          </Field>
          {form.type === 'TITLE' && (
            <Field label="Efect vizual titlu">
              <select className={inp} value={form.titleEffect} onChange={e=>set('titleEffect', e.target.value)}>
                {TITLE_EFFECTS.map(ef => <option key={ef.value} value={ef.value}>{ef.label}</option>)}
              </select>
              {form.titleEffect !== 'none' && (
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Preview:</span>
                  <TitleBadgePreview name={form.name || 'Titlu Test'} effect={form.titleEffect} rarity={form.rarity} />
                </div>
              )}
            </Field>
          )}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={e=>set('active', e.target.checked)} /> Activ
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.shopVisible} onChange={e=>set('shopVisible', e.target.checked)} /> Vizibil în shop
            </label>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Anulează</button>
          <button
            onClick={() => onSave({
            ...form,
            cssPayload: form.type === 'TITLE'
              ? { ...(item.cssPayload || {}), titleEffect: form.titleEffect }
              : (item.cssPayload || null),
          })}
            className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg text-sm font-semibold shadow"
          >Salvează</button>
        </div>
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
