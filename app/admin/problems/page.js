export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { checkPermission } from '@/lib/permissions'
import DeleteProblemButton from '@/components/admin/DeleteProblemButton'
import ProblemFilters from '@/components/admin/ProblemFilters'
import {
  ChartBarIcon, BookOpenIcon, SparklesIcon, PlusIcon,
  PencilSquareIcon, CircleStackIcon, ClipboardDocumentListIcon,
  ChevronLeftIcon, ChevronRightIcon, BrainCircuitIcon,
} from '@heroicons/react/24/outline'
import { BoltIcon } from '@heroicons/react/24/solid'

const DIFF_CONFIG = {
  EASY:   { label: 'Ușor',  cls: 'bg-emerald-100 text-emerald-700' },
  MEDIUM: { label: 'Mediu', cls: 'bg-amber-100 text-amber-700' },
  HARD:   { label: 'Greu',  cls: 'bg-rose-100 text-rose-700' },
}
const TYPE_LABEL = {
  MULTIPLE_CHOICE: 'Grilă',
  SHORT_ANSWER: 'Răspuns scurt',
  CODING: 'Cod',
  INPUT_OUTPUT: 'Input/Output',
}

const PAGE_SIZE = 15

export default async function AdminProblemsPage({ searchParams }) {
  return (
    <PermissionGuard permission="problems.view">
      <Content searchParams={searchParams} />
    </PermissionGuard>
  )
}

async function Content({ searchParams }) {
  const sp = (await searchParams) || {}
  const topic = sp.topic || undefined
  const difficulty = sp.difficulty || undefined
  const type = sp.type || undefined
  const q = sp.q || undefined
  const page = Math.max(1, parseInt(sp.page || '1'))

  const [canCreate, canEdit, canDelete, canAssign] = await Promise.all([
    checkPermission('problems.create'),
    checkPermission('problems.edit'),
    checkPermission('problems.delete'),
    checkPermission('problems.assign'),
  ])

  const where = { active: true }
  if (topic) where.topic = topic
  if (difficulty) where.difficulty = difficulty
  if (type) where.type = type
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [problems, total, allTopics] = await Promise.all([
    prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, title: true, topic: true, type: true,
        difficulty: true, points: true, tags: true,
        _count: { select: { attempts: true, setProblems: true } },
      },
    }),
    prisma.problem.count({ where }),
    prisma.problem.findMany({
      where: { active: true },
      select: { topic: true },
      distinct: ['topic'],
    }),
  ])

  const topics = [...new Set(allTopics.map(t => t.topic))].filter(Boolean).sort()
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Build pagination URL helper
  const pageUrl = (p) => {
    const params = new URLSearchParams()
    if (topic) params.set('topic', topic)
    if (difficulty) params.set('difficulty', difficulty)
    if (type) params.set('type', type)
    if (q) params.set('q', q)
    params.set('page', String(p))
    return `/admin/problems?${params}`
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CircleStackIcon className="w-6 h-6 text-indigo-600" />
            Banca de Probleme
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            {total} {total === 1 ? 'problemă activă' : 'probleme active'}
            {(topic || difficulty || type || q) && ` • filtrat`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/problems/stats"
            className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            <ChartBarIcon className="w-4 h-4" /> Statistici
          </Link>
          {canAssign.allowed && (
            <Link href="/admin/problems/sets"
              className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
              <BookOpenIcon className="w-4 h-4" /> Seturi
            </Link>
          )}
          {canAssign.allowed && (
            <Link href="/admin/problems/sets/new"
              className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              <SparklesIcon className="w-4 h-4" /> Set nou
            </Link>
          )}
          {canCreate.allowed && (
            <Link href="/admin/problems/new"
              className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <PlusIcon className="w-4 h-4" /> Adaugă
            </Link>
          )}
        </div>
      </div>

      <ProblemFilters topics={topics} initial={{ topic, difficulty, type, q }} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titlu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pct</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folosiri</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Nicio problemă găsită.
                </td></tr>
              ) : problems.map(p => {
                const diff = DIFF_CONFIG[p.difficulty]
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{p.title}</div>
                      {p.tags?.length > 0 && (
                        <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                          {p.tags.slice(0, 4).map(t => `#${t}`).join(' ')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">{p.topic}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{TYPE_LABEL[p.type] || p.type}</td>
                    <td className="px-4 py-3">
                      {diff
                        ? <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${diff.cls}`}>{diff.label}</span>
                        : <span className="text-xs text-gray-500">{p.difficulty}</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{p.points}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <BookOpenIcon className="w-3.5 h-3.5 text-amber-500" /> {p._count.setProblems} seturi
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClipboardDocumentListIcon className="w-3.5 h-3.5 text-indigo-400" /> {p._count.attempts} încercări
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {canEdit.allowed && (
                          <Link href={`/admin/problems/${p.id}/edit`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            <PencilSquareIcon className="w-4 h-4" /> Editează
                          </Link>
                        )}
                        {canDelete.allowed && <DeleteProblemButton id={p.id} title={p.title} />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {problems.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500 text-sm">Nicio problemă găsită.</div>
          ) : problems.map(p => {
            const diff = DIFF_CONFIG[p.difficulty]
            return (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{p.topic}</span>
                      {diff && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${diff.cls}`}>{diff.label}</span>}
                      <span className="text-xs text-gray-500">{TYPE_LABEL[p.type]}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-700 font-semibold whitespace-nowrap shrink-0">{p.points} pct</span>
                </div>
                <div className="flex gap-3 mt-3 text-sm">
                  {canEdit.allowed && (
                    <Link href={`/admin/problems/${p.id}/edit`} className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                      <PencilSquareIcon className="w-4 h-4" /> Editează
                    </Link>
                  )}
                  {canDelete.allowed && <DeleteProblemButton id={p.id} title={p.title} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
            <p className="text-sm text-gray-600 hidden xs:block">
              Pagina <strong>{page}</strong> din <strong>{totalPages}</strong>
              <span className="text-gray-400"> · {total} total</span>
            </p>
            <div className="flex items-center gap-1.5 mx-auto xs:mx-0">
              {/* Prev */}
              {page > 1 ? (
                <Link href={pageUrl(page - 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <ChevronLeftIcon className="w-4 h-4" /> Înapoi
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
                  <ChevronLeftIcon className="w-4 h-4" /> Înapoi
                </span>
              )}

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p2 => p2 === 1 || p2 === totalPages || Math.abs(p2 - page) <= 1)
                  .reduce((acc, p2, idx, arr) => {
                    if (idx > 0 && p2 - arr[idx - 1] > 1) acc.push('…')
                    acc.push(p2)
                    return acc
                  }, [])
                  .map((item, i) =>
                    item === '…' ? (
                      <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <Link key={item} href={pageUrl(item)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                          item === page
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                        }`}>
                        {item}
                      </Link>
                    )
                  )
                }
              </div>

              {/* Next */}
              {page < totalPages ? (
                <Link href={pageUrl(page + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Înainte <ChevronRightIcon className="w-4 h-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
                  Înainte <ChevronRightIcon className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
