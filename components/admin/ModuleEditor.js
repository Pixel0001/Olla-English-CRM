'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ModuleEditor({ module: m, canEdit }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: m.title, description: m.description || '', language: m.language || '',
    order: m.order, active: m.active, coverImage: m.coverImage || '',
    grades: m.grades || [],
  })

  const save = async () => {
    try {
      const r = await fetch(`/api/admin/modules/${m.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error()
      toast.success('Salvat')
      setEditing(false)
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 [&_input]:text-gray-900 [&_input]:bg-white [&_textarea]:text-gray-900 [&_textarea]:bg-white [&_input]:placeholder-gray-400">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {editing ? (
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-lg font-semibold text-gray-900 bg-white" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <input value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} placeholder="Limbaj" className="px-3 py-2 border rounded-lg text-sm" />
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="px-3 py-2 border rounded-lg text-sm" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                  Activ
                </label>
              </div>
              <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="Cover URL" className="w-full px-3 py-2 border rounded-lg text-sm" />
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5">Clase vizibile (gol = toate clasele):</p>
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4,5,6,7,8,9].map(g => {
                    const checked = form.grades.includes(g)
                    return (
                      <label key={g} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400'
                      }`}>
                        <input type="checkbox" className="hidden" checked={checked} onChange={() => {
                          const next = checked ? form.grades.filter(x => x !== g) : [...form.grades, g].sort((a,b)=>a-b)
                          setForm({ ...form, grades: next })
                        }} />
                        Cl.{g}
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">#{m.order}</span>
                {m.language && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{m.language}</span>}
                {!m.active && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">inactiv</span>}
                {m.grades?.length > 0
                  ? m.grades.map(g => <span key={g} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-semibold">Cl.{g}</span>)
                  : <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Toate clasele</span>}
              </div>
              <h2 className="text-2xl font-bold mt-1 text-gray-900">{m.title}</h2>
              {m.description && <p className="text-gray-600 mt-1 text-sm">{m.description}</p>}
              <p className="text-xs text-gray-400 mt-1">/{m.slug}</p>
            </>
          )}
        </div>
        {canEdit && (
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 border rounded-lg text-sm">Anulează</button>
                <button onClick={save} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">Salvează</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-3 py-1.5 border rounded-lg text-sm">Editează</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
