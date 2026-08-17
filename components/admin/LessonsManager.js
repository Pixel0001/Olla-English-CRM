'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LessonsManager({ moduleId, lessons, canEdit }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', theory: '', isFree: false, order: lessons.length, videoUrl: '' })
  const [saving, setSaving] = useState(false)

  const addLesson = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      toast.success('Lecție creată')
      setAdding(false)
      setForm({ title: '', theory: '', isFree: false, order: lessons.length + 1, videoUrl: '' })
      router.refresh()
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  const toggleFree = async (lessonId, current) => {
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFree: !current }),
      })
      if (!r.ok) throw new Error()
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  const deleteLesson = async (lessonId, title) => {
    if (!confirm(`Șterge lecția "${title}"?`)) return
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons/${lessonId}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      toast.success('Șters')
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">📖 Lecții ({lessons.length})</h3>
        {canEdit && (
          <button onClick={() => setAdding(!adding)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">
            {adding ? 'Anulează' : '+ Lecție nouă'}
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={addLesson} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3 [&_input:not([type=checkbox])]:text-gray-900 [&_input:not([type=checkbox])]:bg-white [&_textarea]:text-gray-900 [&_textarea]:bg-white [&_label]:text-gray-700">
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Titlu lecție (ex: Variabile și tipuri)" className="w-full px-3 py-2 border rounded-lg text-gray-900 bg-white placeholder-gray-400" />
          <textarea required value={form.theory} onChange={e => setForm({ ...form, theory: e.target.value })} rows={6} placeholder="Teorie (markdown). Ex: ## Variabile&#10;O variabilă este..." className="w-full px-3 py-2 border rounded-lg font-mono text-sm text-gray-900 bg-white placeholder-gray-400" />
          <input value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="Video URL (opțional - YouTube embed)" className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFree} onChange={e => setForm({ ...form, isFree: e.target.checked })} />
              <span className="text-emerald-700 font-medium">🎁 Lecție gratuită (trial)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              Ordine: <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-20 px-2 py-1 border rounded text-gray-900 bg-white" />
            </label>
            <button type="submit" disabled={saving} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50">
              {saving ? '...' : 'Creează'}
            </button>
          </div>
        </form>
      )}

      {lessons.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Nicio lecție încă.</p>
      ) : (
        <div className="space-y-2">
          {lessons.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full font-mono">#{l.order}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 truncate">{l.title}</span>
                  {l.isFree && <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">🎁 GRATIS</span>}
                  {!l.active && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">inactiv</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  📝 {l._count.problems} probleme • 📨 {l._count.submissions} submisii
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2 items-center">
                  <button onClick={() => toggleFree(l.id, l.isFree)} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">
                    {l.isFree ? 'Fă plătită' : 'Fă gratuită'}
                  </button>
                  <Link href={`/admin/modules/${moduleId}/lessons/${l.id}`} className="text-sm text-indigo-600 font-medium">
                    Editează →
                  </Link>
                  <button onClick={() => deleteLesson(l.id, l.title)} className="text-sm text-red-600">×</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
