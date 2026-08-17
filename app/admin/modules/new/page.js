'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewModulePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', description: '', language: 'python', coverImage: '', order: 0,
  })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch('/api/admin/modules', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      toast.success('Modul creat!')
      router.push(`/admin/modules/${d.module.id}`)
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📚 Modul nou</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 [&_input]:text-gray-900 [&_input]:bg-white [&_textarea]:text-gray-900 [&_textarea]:bg-white [&_select]:text-gray-900 [&_select]:bg-white [&_label]:text-gray-700 [&_input]:placeholder-gray-400">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titlu *</label>
          <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Python Fundamentals" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (opțional)</label>
          <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generat din titlu" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limbaj</label>
            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="matematica">Matematică</option>
              <option value="romana">Limbă Română</option>
              <option value="stiinte">Științe</option>
              <option value="informatica">Informatică</option>
              <option value="engleza">Engleză</option>
              <option value="fizica">Fizică</option>
              <option value="chimie">Chimie</option>
              <option value="biologie">Biologie</option>
              <option value="geografie">Geografie</option>
              <option value="istorie">Istorie</option>
              <option value="other">Altul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordine</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL</label>
          <input type="text" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Anulează</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{saving ? 'Se salvează...' : 'Creează'}</button>
        </div>
      </form>
    </div>
  )
}
