'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  AcademicCapIcon, LockClosedIcon, CheckCircleIcon, RocketLaunchIcon,
  EyeIcon, EyeSlashIcon, ChevronDownIcon, ChevronRightIcon, BookOpenIcon,
} from '@heroicons/react/24/outline'

export default function StudentModuleAccessTable({ studentId, modules, accessIds, advanceIds, hiddenIds = [], lessonAccessIds = [] }) {
  const router = useRouter()
  const [accessSet, setAccessSet] = useState(new Set(accessIds))
  const [pendingId, setPendingId] = useState(null)
  const [hiddenSet, setHiddenSet] = useState(new Set(hiddenIds))
  const [pendingHideId, setPendingHideId] = useState(null)
  const [lessonAccessSet, setLessonAccessSet] = useState(new Set(lessonAccessIds))
  const [pendingLessonId, setPendingLessonId] = useState(null)
  const [expanded, setExpanded] = useState(new Set())

  const toggle = async (moduleId) => {
    const has = accessSet.has(moduleId)
    setPendingId(moduleId)
    const next = new Set(accessSet)
    has ? next.delete(moduleId) : next.add(moduleId)
    setAccessSet(next)
    try {
      let res
      if (has) {
        res = await fetch(`/api/admin/students/${studentId}/module-access?moduleId=${moduleId}`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/admin/students/${studentId}/module-access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId, source: 'granted' }),
        })
      }
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      toast.success(has ? 'Acces revocat' : 'Acces acordat')
      router.refresh()
    } catch (e) {
      const revert = new Set(accessSet)
      has ? revert.add(moduleId) : revert.delete(moduleId)
      setAccessSet(revert)
      toast.error(e.message)
    } finally {
      setPendingId(null)
    }
  }

  const advanceSet = new Set(advanceIds)

  const toggleHide = async (moduleId) => {
    const isHidden = hiddenSet.has(moduleId)
    setPendingHideId(moduleId)
    const next = new Set(hiddenSet)
    isHidden ? next.delete(moduleId) : next.add(moduleId)
    setHiddenSet(next)
    try {
      let res
      if (isHidden) {
        res = await fetch(`/api/admin/students/${studentId}/module-hidden?moduleId=${moduleId}`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/admin/students/${studentId}/module-hidden`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId }),
        })
      }
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      toast.success(isHidden ? 'Modul afișat' : 'Modul ascuns')
      router.refresh()
    } catch (e) {
      const revert = new Set(hiddenSet)
      isHidden ? revert.add(moduleId) : revert.delete(moduleId)
      setHiddenSet(revert)
      toast.error(e.message)
    } finally {
      setPendingHideId(null)
    }
  }

  const toggleLesson = async (lessonId) => {
    const has = lessonAccessSet.has(lessonId)
    setPendingLessonId(lessonId)
    const next = new Set(lessonAccessSet)
    has ? next.delete(lessonId) : next.add(lessonId)
    setLessonAccessSet(next)
    try {
      let res
      if (has) {
        res = await fetch(`/api/admin/students/${studentId}/lesson-access?lessonId=${lessonId}`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/admin/students/${studentId}/lesson-access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        })
      }
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      toast.success(has ? 'Acces lecție revocat' : 'Acces lecție acordat')
      router.refresh()
    } catch (e) {
      const revert = new Set(lessonAccessSet)
      has ? revert.add(lessonId) : revert.delete(lessonId)
      setLessonAccessSet(revert)
      toast.error(e.message)
    } finally {
      setPendingLessonId(null)
    }
  }

  const toggleExpand = (moduleId) => {
    const next = new Set(expanded)
    next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId)
    setExpanded(next)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center gap-2">
        <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Acces module și lecții</h3>
        <span className="text-xs text-gray-500 ml-auto">
          {accessSet.size}/{modules.length} module
          {lessonAccessSet.size > 0 ? ` · ${lessonAccessSet.size} lecții` : ''}
          {hiddenSet.size > 0 ? ` · ${hiddenSet.size} ascunse` : ''}
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {modules.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">Niciun modul definit.</div>
        )}
        {modules.map((m, idx) => {
          const has = accessSet.has(m.id)
          const advanced = advanceSet.has(m.id)
          const pending = pendingId === m.id
          const hidden = hiddenSet.has(m.id)
          const pendingHide = pendingHideId === m.id
          const isExpanded = expanded.has(m.id)
          const lessons = m.lessons || []
          const grantedLessonsInModule = lessons.filter(l => lessonAccessSet.has(l.id)).length
          return (
            <div key={m.id}>
              <div className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${hidden ? 'opacity-50' : ''}`}>
                {/* Expand chevron */}
                {lessons.length > 0 ? (
                  <button
                    onClick={() => toggleExpand(m.id)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 shrink-0"
                    aria-label="Toggle lecții"
                  >
                    {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                  </button>
                ) : <div className="w-6 shrink-0" />}

                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                  has ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm truncate">{m.title}</span>
                    {m.language && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-900 text-white rounded">{m.language}</span>}
                    {advanced && <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                      <RocketLaunchIcon className="w-3 h-3" /> Advance
                    </span>}
                    {hidden && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded">Ascuns</span>}
                    {grantedLessonsInModule > 0 && !has && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                        {grantedLessonsInModule} lecți{grantedLessonsInModule === 1 ? 'e' : 'i'} acordate
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{m._count?.lessons ?? lessons.length} lecții</div>
                </div>
                {/* Eye toggle */}
                <button
                  onClick={() => toggleHide(m.id)}
                  disabled={pendingHide}
                  title={hidden ? 'Afișează modulul' : 'Ascunde modulul de la student'}
                  className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                    hidden ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {hidden ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
                {/* Access toggle switch */}
                <button
                  onClick={() => toggle(m.id)}
                  disabled={pending}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
                    has ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle acces modul"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    has ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Lecții — colapsabil */}
              {isExpanded && lessons.length > 0 && (
                <div className="bg-slate-50 border-t border-gray-100">
                  {lessons.map((l, li) => {
                    const lhas = lessonAccessSet.has(l.id)
                    const lpending = pendingLessonId === l.id
                    const effectivelyAccessible = has || l.isFree || lhas
                    return (
                      <div key={l.id} className="pl-14 pr-4 py-2 flex items-center gap-3 border-b border-gray-100 last:border-b-0 hover:bg-white">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          lhas ? 'bg-amber-500 text-white' : effectivelyAccessible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                        }`}>{li + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <BookOpenIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-sm text-gray-800 truncate">{l.title}</span>
                            {l.isFree && <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded">Gratis</span>}
                            {lhas && <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 bg-amber-100 text-amber-700 rounded">Acordat</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleLesson(l.id)}
                          disabled={lpending}
                          title={lhas ? 'Revocă acces lecție' : 'Acordă acces doar la această lecție'}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
                            lhas ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                          aria-label="Toggle acces lecție"
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            lhas ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
