'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { BookOpenIcon, PuzzlePieceIcon, Cog6ToothIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import TheoryEditor from './TheoryEditor'

const DIFF = { EASY: '🟢', MEDIUM: '🟡', HARD: '🔴' }

export default function LessonEditor({ moduleId, lesson, allProblems, canEdit }) {
  const router = useRouter()
  const backUrl = typeof window !== 'undefined' ? window.location.pathname : `/admin/modules/${moduleId}/lessons/${lesson.id}`
  const [tab, setTab] = useState('teorie') // 'teorie' | 'practica' | 'setari'
  const [form, setForm] = useState({
    title: lesson.title,
    theory: lesson.theory || '',
    isFree: lesson.isFree,
    order: lesson.order,
    videoUrl: lesson.videoUrl || '',
    active: lesson.active,
  })
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState(false)
  const [picked, setPicked] = useState(new Set())
  const [search, setSearch] = useState('')

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons/${lesson.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error()
      toast.success('Salvat')
      router.refresh()
    } catch { toast.error('Eroare') } finally { setSaving(false) }
  }

  const attachPicked = async () => {
    if (picked.size === 0) return
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons/${lesson.id}/problems`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemIds: [...picked] }),
      })
      if (!r.ok) throw new Error()
      toast.success(`${picked.size} probleme atașate`)
      setPicked(new Set())
      setPicker(false)
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  const detach = async (pid) => {
    if (!confirm('Detașează problema din lecție?')) return
    try {
      const r = await fetch(`/api/admin/modules/${moduleId}/lessons/${lesson.id}/problems?problemId=${pid}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  const available = allProblems.filter(p => p.lessonId !== lesson.id && (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.topic?.toLowerCase().includes(search.toLowerCase())))

  const TABS = [
    { k: 'teorie', label: 'Teorie', icon: BookOpenIcon, count: null },
    { k: 'practica', label: 'Practică', icon: PuzzlePieceIcon, count: lesson.problems.length },
    { k: 'setari', label: 'Setări', icon: Cog6ToothIcon, count: null },
  ]

  return (
    <div className="space-y-4">
      {/* Title bar — static, nu sticky */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 flex-wrap shadow-sm">
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          disabled={!canEdit}
          placeholder="Titlul lecției..."
          className="flex-1 min-w-[200px] px-3 py-2 border-2 border-transparent hover:border-slate-200 focus:border-indigo-400 rounded-lg text-lg font-bold outline-none transition"
        />
      </div>

      {/* FAB save — colț dreapta-jos */}
      {canEdit && (
        <button
          onClick={save}
          disabled={saving}
          title="Salvează lecția"
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-xl disabled:opacity-50 transition"
        >
          <CloudArrowUpIcon className="w-4 h-4" /> {saving ? 'Se salvează...' : 'Salvează'}
        </button>
      )}

      {/* Big tab buttons */}
      <div className="flex gap-2 bg-white rounded-2xl border border-gray-200 p-2">
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.k
          return (
            <button
              key={t.k}
              type="button"
              onClick={() => setTab(t.k)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition ${
                active
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== null && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TEORIE TAB */}
      {tab === 'teorie' && (
        <div className="space-y-3">
          <TheoryEditor
            value={form.theory}
            onChange={(text) => setForm(f => ({ ...f, theory: text }))}
            disabled={!canEdit}
          />
          {canEdit && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <span>💡</span>
              <div>
                <strong>Sfat:</strong> nu uita să apeși <strong>Salvează lecția</strong> (sus) după ce termini de editat. Modificările nu se salvează automat.
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRACTICA TAB */}
      {tab === 'practica' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <PuzzlePieceIcon className="w-5 h-5 text-indigo-600" />
              Probleme ({lesson.problems.length})
            </h3>
            {canEdit && (
              <div className="flex gap-2 flex-wrap">
                <Link href={`/admin/problems/new?back=${encodeURIComponent(backUrl)}&lessonId=${lesson.id}`} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 font-medium">+ Creează problemă nouă</Link>
                <button onClick={() => setPicker(!picker)} className="text-sm px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition">
                  {picker ? 'Închide' : '+ Atașează din bancă'}
                </button>
              </div>
            )}
          </div>

          {picker && (
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută..." className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
              <div className="max-h-64 overflow-y-auto space-y-1">
                {available.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">Nicio problemă disponibilă.</p>
                ) : available.map(p => (
                  <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-white rounded text-sm cursor-pointer">
                    <input type="checkbox" checked={picked.has(p.id)} onChange={(e) => {
                      const n = new Set(picked)
                      if (e.target.checked) n.add(p.id); else n.delete(p.id)
                      setPicked(n)
                    }} />
                    <span>{DIFF[p.difficulty]}</span>
                    <span className="font-medium">{p.title}</span>
                    <span className="text-xs text-gray-500">#{p.topic}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <span className="text-xs text-gray-600">{picked.size} selectate</span>
                <button onClick={attachPicked} disabled={picked.size === 0} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50">Atașează</button>
              </div>
            </div>
          )}

          {lesson.problems.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <PuzzlePieceIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Nicio problemă atașată.</p>
              <p className="text-slate-400 text-xs mt-1">Adaugă pentru ca elevii să rezolve după teorie.</p>
            </div>
          ) : (
            <ol className="space-y-1">
              {lesson.problems.map((p, i) => (
                <li key={p.id} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:bg-slate-50 transition">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded font-mono">{i + 1}</span>
                  <span>{DIFF[p.difficulty]}</span>
                  <span className="font-medium flex-1 truncate">{p.title}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">{p.topic}</span>
                  <Link href={`/admin/problems/${p.id}/edit?back=${encodeURIComponent(backUrl)}`} className="text-xs text-indigo-600 px-2 hover:underline">Editează</Link>
                  {canEdit && <button onClick={() => detach(p.id)} className="text-xs text-red-600 px-2 hover:underline">Detașează</button>}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* SETARI TAB */}
      {tab === 'setari' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-indigo-600" />
            Setări lecție
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">Video URL (opțional, intro)</label>
            <input
              value={form.videoUrl}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/embed/..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
              disabled={!canEdit}
            />
            <p className="text-xs text-slate-500 mt-1">
              Acest video apare deasupra teoriei. Pentru video în mijlocul teoriei, folosește blocul <strong>Video YouTube</strong> din editor.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-3 cursor-pointer hover:bg-emerald-100 transition">
              <input type="checkbox" checked={form.isFree} onChange={e => setForm({ ...form, isFree: e.target.checked })} disabled={!canEdit} />
              <span className="text-emerald-700 font-medium">🎁 Gratuită (trial / mod demo)</span>
            </label>

            <label className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="font-medium text-slate-700">Ordine:</span>
              <input
                type="number" value={form.order}
                onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded ml-auto"
                disabled={!canEdit}
              />
            </label>

            <label className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} disabled={!canEdit} />
              <span className="text-slate-700 font-medium">✅ Activă (vizibilă elevilor)</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
