'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useMemo, useOptimistic } from 'react'

const DIFF = { EASY: '🟢', MEDIUM: '🟡', HARD: '🔴' }
const STATUS_BADGE = {
  PENDING: 'bg-amber-100 text-amber-700',
  GRADED: 'bg-emerald-100 text-emerald-700',
  NEEDS_REVISION: 'bg-red-100 text-red-700',
}

export default function SubmissionsList({
  submissions,
  students = [],
  groups = [],
  currentStudent = '',
  currentGroup = '',
  onlyCoding = false,
  status = 'PENDING',
  page = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 20,
  basePath = '/teacher/submissions',
  canDelete = true,
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [selected, setSelected] = useState(() => new Set())
  const [busy, startTransition] = useTransition()
  const [deleting, setDeleting] = useState(false)
  const [optimisticCoding, setOptimisticCoding] = useOptimistic(onlyCoding)

  const buildHref = useMemo(() => {
    return (overrides = {}) => {
      const params = new URLSearchParams()
      const merged = {
        status, studentId: currentStudent, groupId: currentGroup,
        type: onlyCoding ? 'CODING' : '', page: String(page),
        ...overrides,
      }
      for (const [k, v] of Object.entries(merged)) {
        if (v && v !== '' && !(k === 'page' && v === '1')) params.set(k, v)
      }
      const qs = params.toString()
      return `${basePath}${qs ? `?${qs}` : ''}`
    }
  }, [status, currentStudent, currentGroup, onlyCoding, page, basePath])

  const navigate = (overrides) => startTransition(() => router.push(buildHref(overrides)))

  const toggleOne = (id) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }
  const toggleAll = () => {
    if (selected.size === submissions.length) setSelected(new Set())
    else setSelected(new Set(submissions.map(s => s.id)))
  }

  const handleDelete = async (ids, msg) => {
    if (!confirm(msg)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/teacher/submissions/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) {
        const t = await res.text()
        alert('Eroare la ștergere: ' + t)
        return
      }
      const data = await res.json()
      setSelected(new Set())
      router.refresh()
      // mic feedback
      console.log(`✓ Șterse: ${data.deleted}`)
    } catch (e) {
      alert('Eroare: ' + e.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-center [&_select]:text-gray-900 [&_select]:bg-white [&_label]:text-gray-700 [&_span]:text-gray-900">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">Elev:</label>
          <select
            value={currentStudent}
            onChange={e => navigate({ studentId: e.target.value, page: '1' })}
            className="flex-1 px-2 py-1.5 border rounded-lg text-sm text-gray-900 bg-white"
          >
            <option value="">— Toți —</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">Grupă:</label>
          <select
            value={currentGroup}
            onChange={e => navigate({ groupId: e.target.value, studentId: '', page: '1' })}
            className="flex-1 px-2 py-1.5 border rounded-lg text-sm text-gray-900 bg-white"
          >
            <option value="">— Toate grupele —</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}{g.level ? ` — ${g.level}` : ''}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={optimisticCoding}
            onChange={e => {
              const next = e.target.checked
              startTransition(() => {
                setOptimisticCoding(next)
                router.push(buildHref({ type: next ? 'CODING' : '', page: '1' }))
              })
            }}
            className="w-4 h-4"
          />
          <span>💻 Doar probleme de coding</span>
        </label>

        <div className="text-xs text-gray-500 text-right">
          {totalCount} rezultate • pag. {page}/{totalPages}
        </div>
      </div>

      {/* Bulk actions */}
      {canDelete && selected.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm text-red-800 font-medium">
            {selected.size} selectate
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg"
            >
              Anulează
            </button>
            <button
              disabled={deleting}
              onClick={() => handleDelete([...selected], `Sigur ștergi ${selected.size} submisii? Acțiunea este permanentă, dar NU afectează scorul/XP-ul elevilor.`)}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg disabled:opacity-50"
            >
              {deleting ? 'Șterg...' : `🗑️ Șterge ${selected.size}`}
            </button>
          </div>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
          Nicio submisie pentru filtrele selectate. 🎉
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-xs text-gray-500 uppercase">
                  {canDelete && (
                    <th className="px-3 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selected.size === submissions.length && submissions.length > 0}
                        onChange={toggleAll}
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left">Elev</th>
                  <th className="px-4 py-3 text-left">Problemă</th>
                  <th className="px-4 py-3 text-left">Sursa</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Notă</th>
                  <th className="px-4 py-3 text-left">Trimis</th>
                  <th className="px-4 py-3 text-right">Acțiune</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    {canDelete && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(s.id)}
                          onChange={() => toggleOne(s.id)}
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm font-medium">{s.student?.fullName || '?'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{DIFF[s.problem?.difficulty]}</span>
                        <span className="font-medium">{s.problem?.title}</span>
                        {s.problem?.type === 'CODING' && (
                          <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-700">CODING</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{s.problem?.topic} • {s.problem?.type}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {s.source === 'lesson' && s.lesson ? (
                        <div>
                          <div className="font-medium">📖 {s.lesson.title}</div>
                          <div className="text-gray-500">{s.lesson.module?.title}</div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">🎲 random</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${STATUS_BADGE[s.status]}`}>{s.status}</span>
                      {s.autoCorrect === true && <div className="text-emerald-600 text-xs mt-0.5">✓ auto</div>}
                      {s.autoCorrect === false && <div className="text-red-600 text-xs mt-0.5">✗ auto</div>}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {s.attemptNumber > 1 && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">Înc. {s.attemptNumber}</span>
                        )}
                        {s.hintUsed && (
                          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[10px] font-bold" title="Hint folosit (-10p)">💡 hint</span>
                        )}
                        {s.solutionViewed && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold" title="Elevul a văzut rezolvarea">👁 rezolvare</span>
                        )}
                        {s.locked && (
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold" title="Problemă blocată">🔒</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">{s.grade ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.createdAt).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link href={`${basePath}/${s.id}`} className="text-indigo-600 text-sm font-medium mr-2">
                        {s.status === 'PENDING' ? 'Verifică →' : 'Vezi'}
                      </Link>
                      {canDelete && (
                        <button
                          disabled={deleting}
                          onClick={() => handleDelete([s.id], 'Sigur ștergi această submisie? NU afectează scorul/XP-ul elevului.')}
                          className="text-red-600 text-sm hover:underline disabled:opacity-50"
                          title="Șterge submisia"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {submissions.map(s => (
              <div key={s.id} className="p-3">
                <div className="flex items-start gap-2">
                  {canDelete && (
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggleOne(s.id)}
                      className="mt-1"
                    />
                  )}
                  <Link href={`${basePath}/${s.id}`} className="flex-1 block">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{s.student?.fullName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[s.status]}`}>{s.status}</span>
                    </div>
                    <div className="text-sm mt-1">
                      {DIFF[s.problem?.difficulty]} {s.problem?.title}
                      {s.problem?.type === 'CODING' && (
                        <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-700">CODING</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-between">
                      <span>{s.source === 'lesson' ? s.lesson?.title : '🎲 random'}</span>
                      <span>{new Date(s.createdAt).toLocaleDateString('ro-RO')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {typeof s.grade === 'number' && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">{s.grade}p</span>
                      )}
                      {s.attemptNumber > 1 && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">Înc. {s.attemptNumber}</span>
                      )}
                      {s.hintUsed && (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[10px] font-bold">💡 hint</span>
                      )}
                      {s.solutionViewed && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">👁 rezolvare</span>
                      )}
                      {s.locked && (
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">🔒 blocat</span>
                      )}
                    </div>
                  </Link>
                  {canDelete && (
                    <button
                      disabled={deleting}
                      onClick={() => handleDelete([s.id], 'Sigur ștergi această submisie?')}
                      className="text-red-600 text-sm p-1 disabled:opacity-50"
                      title="Șterge"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 flex flex-col xs:flex-row items-start xs:items-center gap-2">
          <div className="text-xs text-gray-500 shrink-0">
            {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} din {totalCount}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Link
              href={buildHref({ page: '1' })}
              className={`px-2 py-1 text-sm rounded border ${page <= 1 ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}
            >« Prima</Link>
            <Link
              href={buildHref({ page: String(Math.max(1, page - 1)) })}
              className={`px-2 py-1 text-sm rounded border ${page <= 1 ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}
            >‹ Anterior</Link>
            <span className="px-3 py-1 text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Link
              href={buildHref({ page: String(Math.min(totalPages, page + 1)) })}
              className={`px-2 py-1 text-sm rounded border ${page >= totalPages ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}
            >Următor ›</Link>
            <Link
              href={buildHref({ page: String(totalPages) })}
              className={`px-2 py-1 text-sm rounded border ${page >= totalPages ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}
            >Ultima »</Link>
          </div>
        </div>
      )}
    </div>
  )
}
