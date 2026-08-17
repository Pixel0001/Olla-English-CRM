'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'

export default function SubmissionGrader({ submission, lessonStats, existingAdvance }) {
  const router = useRouter()
  const [grade, setGrade] = useState(submission.grade ?? '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [saving, setSaving] = useState(false)
  const [advanceGranted, setAdvanceGranted] = useState(!!existingAdvance)

  const submit = async (newStatus) => {
    setSaving(true)
    try {
      const r = await fetch(`/api/teacher/submissions/${submission.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: grade === '' ? null : Number(grade),
          feedback,
          status: newStatus,
        }),
      })
      if (!r.ok) throw new Error()
      toast.success('Salvat')
      router.push('/admin/submissions')
    } catch { toast.error('Eroare la salvare') } finally { setSaving(false) }
  }

  const grantAdvance = async () => {
    if (!submission.lesson) return
    try {
      const r = await fetch('/api/teacher/advance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: submission.studentId,
          moduleId: submission.lesson.module.id,
          notes: `Acordat după ${submission.problem.title}`,
        }),
      })
      if (!r.ok) throw new Error()
      toast.success('Advance acordat — elevul poate trece la modulul următor')
      setAdvanceGranted(true)
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  const revokeAdvance = async () => {
    if (!confirm('Revocă advance?')) return
    try {
      const r = await fetch(`/api/teacher/advance?studentId=${submission.studentId}&moduleId=${submission.lesson.module.id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      setAdvanceGranted(false)
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  return (
    <div className="space-y-4">
      {submission.aiGraded && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-blue-300 flex items-center justify-center shrink-0 p-0.5">
              <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
                <defs>
                  <linearGradient id="grdr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
                </defs>
                <rect width="40" height="40" rx="11" fill="url(#grdr-bg)"/>
                <line x1="20" y1="5.5" x2="20" y2="11" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="20" cy="4.5" r="1.8" fill="#fbbf24"/>
                <rect x="8" y="11" width="24" height="20" rx="6" fill="#fff"/>
                <circle cx="15" cy="19.5" r="2.2" fill="#4f46e5"/>
                <circle cx="25" cy="19.5" r="2.2" fill="#4f46e5"/>
                <path d="M14 25 Q20 28.5 26 25" stroke="#4f46e5" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-blue-900">Notat de Mr. Olla (AI)</div>
              <div className="text-xs text-blue-700">
                Notă AI: <span className="font-bold">{submission.grade}/100</span>
                {submission.teacherOverride && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">OVERRIDE</span>}
              </div>
            </div>
          </div>
          {submission.aiSuspectedAi && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-sm">
              <div className="font-bold text-red-800">⚠️ Cod suspect generat de AI</div>
              <div className="text-red-700 text-xs mt-1">Scor încredere: {submission.aiSuspicionScore ?? '?'}/100 — penalizare deja aplicată</div>
            </div>
          )}
          {submission.aiReasoning && (
            <div className="bg-white rounded-lg border border-blue-100 p-3 text-sm text-gray-800 whitespace-pre-wrap mb-2">
              {submission.aiReasoning}
            </div>
          )}
          {submission.aiRubric && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white rounded p-2 border border-blue-100">
                <div className="font-bold text-lg">{submission.aiRubric.correctness ?? '—'}</div>
                <div className="text-gray-500">Corectitudine</div>
              </div>
              <div className="bg-white rounded p-2 border border-blue-100">
                <div className="font-bold text-lg">{submission.aiRubric.style ?? '—'}</div>
                <div className="text-gray-500">Stil</div>
              </div>
              <div className="bg-white rounded p-2 border border-blue-100">
                <div className="font-bold text-lg">{submission.aiRubric.efficiency ?? '—'}</div>
                <div className="text-gray-500">Eficiență</div>
              </div>
            </div>
          )}
          <div className="text-[11px] text-blue-600 mt-3">
            💡 Poți suprascrie nota AI mai jos — modificarea va fi marcată ca „override profesor".
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AcademicCapIcon className="w-5 h-5 text-gray-500" /> Notează & feedback</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notă (0-100)</label>
            <input type="number" min={0} max={100} value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-lg font-bold" />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <div className="flex gap-2 w-full">
              <button onClick={() => setGrade(100)} className="flex-1 px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg font-bold">100</button>
              <button onClick={() => setGrade(80)} className="flex-1 px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg">80</button>
              <button onClick={() => setGrade(60)} className="flex-1 px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg">60</button>
              <button onClick={() => setGrade(40)} className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg">40</button>
              <button onClick={() => setGrade(0)} className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg">0</button>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Feedback pentru elev</label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} placeholder="Ex: Bună rezolvare! Atenție la cazul când lista e goală..." className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => submit('GRADED')} disabled={saving} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-1.5">
            <CheckCircleIcon className="w-4 h-4" /> Notează (corect)
          </button>
          <button onClick={() => submit('NEEDS_REVISION')} disabled={saving} className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-1.5">
            <ExclamationTriangleIcon className="w-4 h-4" /> Cere refacere
          </button>
        </div>
      </div>

      {/* Advance section */}
      {submission.lesson && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-5">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><RocketLaunchIcon className="w-5 h-5 text-purple-500" /> Advance la modulul următor</h3>
          <p className="text-sm text-gray-700 mb-3">
            Modul curent: <strong>{submission.lesson.module.title}</strong>
            {lessonStats && (
              <span className="ml-2 text-xs">
                ({lessonStats.done}/{lessonStats.total} probleme — {lessonStats.allGraded ? 'toate notate corect' : 'încă în lucru'})
              </span>
            )}
          </p>
          {advanceGranted ? (
            <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
              <span className="text-sm text-purple-800 flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4" /> Advance acordat — elevul poate trece la modulul următor</span>
              <button onClick={revokeAdvance} className="text-xs text-red-600 px-2 py-1 hover:bg-white rounded">Revocă</button>
            </div>
          ) : (
            <button onClick={grantAdvance} className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-1.5">
              <RocketLaunchIcon className="w-4 h-4" /> Acordă advance la modulul următor
            </button>
          )}
        </div>
      )}
    </div>
  )
}
