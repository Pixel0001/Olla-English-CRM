'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon,
  CheckIcon, XMarkIcon, LockClosedIcon,
} from '@heroicons/react/24/outline'

const MONTH_NAMES = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
]

const DEFAULT_LESSONS = 8

/**
 * Pachetul lunar de lecții al unei grupe (de regulă 8 lecții/lună) plus
 * tabelul de prezențe pe lecțiile lunii.
 * Folosit atât în panoul de admin, cât și în cel al profesorului.
 */
export default function LessonPackagePanel({ groupId }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [lessonsInput, setLessonsInput] = useState(String(DEFAULT_LESSONS))

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/lesson-packages?groupId=${groupId}&year=${year}&month=${month}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Eroare la încărcare')
      setData(json)
      setLessonsInput(String(json.package?.totalLessons ?? DEFAULT_LESSONS))
      setEditing(false)
    } catch (err) {
      toast.error(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [groupId, year, month])

  useEffect(() => { load() }, [load])

  const shiftMonth = (delta) => {
    const d = new Date(year, month - 1 + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }

  const savePackage = async () => {
    const lessons = parseInt(lessonsInput, 10)
    if (!Number.isFinite(lessons) || lessons < 1 || lessons > 60) {
      return toast.error('Numărul de lecții trebuie să fie între 1 și 60')
    }
    setSaving(true)
    try {
      const res = await fetch('/api/lesson-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, year, month, totalLessons: lessons }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Eroare la salvare')
      toast.success('Pachet salvat')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const deletePackage = async () => {
    if (!confirm(`Ștergi pachetul pentru ${MONTH_NAMES[month - 1]} ${year}?`)) return
    setSaving(true)
    try {
      const res = await fetch(
        `/api/lesson-packages?groupId=${groupId}&year=${year}&month=${month}`,
        { method: 'DELETE' }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Eroare la ștergere')
      toast.success('Pachet șters')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Marchează prezența unui elev la o lecție (optimist, cu revenire la eroare)
  const toggleAttendance = async (session, studentId, current) => {
    if (session.locked || !data?.canEdit) return
    const next = current === 'PRESENT' ? 'ABSENT' : 'PRESENT'

    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === session.id ? { ...s, attendance: { ...s.attendance, [studentId]: next } } : s
      ),
    }))

    try {
      const res = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, studentId, status: next }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Eroare la salvarea prezenței')
      }
    } catch (err) {
      toast.error(err.message)
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === session.id ? { ...s, attendance: { ...s.attendance, [studentId]: current } } : s
        ),
      }))
    }
  }

  const pkg = data?.package
  const stats = data?.stats
  const sessions = data?.sessions || []
  const students = data?.students || []
  const canEdit = data?.canEdit

  return (
    <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 md:p-6 space-y-4">
      {/* Antet cu navigare pe luni */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base xs:text-lg md:text-xl font-bold text-gray-900">Pachet lunar de lecții</h2>
          <p className="text-xs xs:text-sm text-gray-600">
            Câte lecții s-au achitat luna aceasta și câte s-au făcut din ele
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Luna anterioară"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
          <span className="px-3 py-2 text-sm font-semibold text-gray-900 min-w-[9.5rem] text-center capitalize">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Luna următoare"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-32 bg-gray-100 rounded-xl" />
        </div>
      ) : !data ? (
        <p className="text-sm text-gray-500">Nu s-au putut încărca datele.</p>
      ) : (
        <>
          {/* Pachetul lunii */}
          {!pkg && !editing ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Nu există pachet pentru {MONTH_NAMES[month - 1]} {year}.
                {sessions.length > 0 && ` S-au ținut deja ${sessions.length} ${sessions.length === 1 ? 'lecție' : 'lecții'}.`}
              </p>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => { setLessonsInput(String(DEFAULT_LESSONS)); setEditing(true) }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Adaugă pachet
                </button>
              )}
            </div>
          ) : editing ? (
            <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lecții achitate pentru {MONTH_NAMES[month - 1]} {year}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={lessonsInput}
                  onChange={(e) => setLessonsInput(e.target.value)}
                  className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={savePackage}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Se salvează…' : 'Salvează'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setLessonsInput(String(pkg?.totalLessons ?? DEFAULT_LESSONS)) }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Anulează
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-4">
                <Stat label="Achitate" value={stats.total} />
                <Stat label="Efectuate" value={stats.held} color="text-indigo-600" />
                <Stat
                  label="Rămase"
                  value={stats.remaining}
                  color={stats.remaining === 0 ? 'text-red-600' : 'text-emerald-600'}
                />
                {stats.extra > 0 && <Stat label="Peste pachet" value={stats.extra} color="text-amber-600" />}

                {canEdit && (
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                      Modifică
                    </button>
                    <button
                      type="button"
                      onClick={deletePackage}
                      disabled={saving}
                      className="p-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      aria-label="Șterge pachetul"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stats.held >= stats.total ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min((stats.held / stats.total) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Prezențele lunii */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Prezențe — {MONTH_NAMES[month - 1]} {year}
            </h3>

            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500 border border-gray-100 rounded-xl p-4 text-center">
                Nicio lecție ținută în această lună.
              </p>
            ) : students.length === 0 ? (
              <p className="text-sm text-gray-500 border border-gray-100 rounded-xl p-4 text-center">
                Grupa nu are elevi activi.
              </p>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                        Elev
                      </th>
                      {sessions.map((s, i) => (
                        <th key={s.id} className="px-2 py-2 text-center text-xs font-medium text-gray-500 whitespace-nowrap">
                          <span className="block text-[10px] text-gray-400">{i + 1}</span>
                          {new Date(s.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
                          {s.locked && <LockClosedIcon className="h-3 w-3 inline ml-0.5 text-gray-400" />}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        P / A
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((st) => {
                      const present = sessions.filter((s) => s.attendance[st.studentId] === 'PRESENT').length
                      const absent = sessions.filter((s) => s.attendance[st.studentId] === 'ABSENT').length
                      return (
                        <tr key={st.studentId} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white">
                            {st.name}
                            {st.status === 'PAUSED' && (
                              <span className="ml-1 text-[10px] text-amber-600">(pauză)</span>
                            )}
                          </td>
                          {sessions.map((s) => (
                            <td key={s.id} className="px-2 py-1.5 text-center">
                              <AttendanceCell
                                value={s.attendance[st.studentId]}
                                locked={s.locked || !canEdit}
                                onClick={() => toggleAttendance(s, st.studentId, s.attendance[st.studentId])}
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center whitespace-nowrap">
                            <span className="text-emerald-600 font-semibold">{present}</span>
                            <span className="text-gray-300"> / </span>
                            <span className="text-red-600 font-semibold">{absent}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-3 py-2 text-xs font-medium text-gray-500 sticky left-0 bg-gray-50">
                        Prezenți
                      </td>
                      {sessions.map((s) => (
                        <td key={s.id} className="px-2 py-2 text-center text-xs font-semibold text-gray-700">
                          {students.filter((st) => s.attendance[st.studentId] === 'PRESENT').length}
                        </td>
                      ))}
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {sessions.some((s) => s.locked) && (
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <LockClosedIcon className="h-3 w-3" />
                Lecțiile cu lacăt au lecțiile deja scăzute din pachetele elevilor — prezența nu mai poate fi modificată.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Stat({ label, value, color = 'text-gray-900' }) {
  return (
    <div>
      <p className="text-[10px] xs:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-xl xs:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function AttendanceCell({ value, locked, onClick }) {
  const base = 'w-7 h-7 rounded-md inline-flex items-center justify-center transition-colors'

  if (value === 'PRESENT') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={locked}
        title={locked ? 'Prezent (blocat)' : 'Prezent — click pentru absent'}
        className={`${base} bg-emerald-100 text-emerald-700 ${locked ? 'cursor-default' : 'hover:bg-emerald-200'}`}
      >
        <CheckIcon className="h-4 w-4" />
      </button>
    )
  }

  if (value === 'ABSENT') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={locked}
        title={locked ? 'Absent (blocat)' : 'Absent — click pentru prezent'}
        className={`${base} bg-red-100 text-red-700 ${locked ? 'cursor-default' : 'hover:bg-red-200'}`}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      title={locked ? 'Nemarcat' : 'Nemarcat — click pentru prezent'}
      className={`${base} bg-gray-100 text-gray-400 ${locked ? 'cursor-default' : 'hover:bg-gray-200'}`}
    >
      –
    </button>
  )
}
