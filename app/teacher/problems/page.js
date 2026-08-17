export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

const DIFF_LABEL = { EASY: '🟢 Ușor', MEDIUM: '🟡 Mediu', HARD: '🔴 Greu' }
const TYPE_LABEL = { MULTIPLE_CHOICE: 'Grilă', SHORT_ANSWER: 'Răspuns scurt', CODING: 'Cod', INPUT_OUTPUT: 'I/O' }

const PAGE_SIZE = 20

export default async function TeacherProblemsPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const sp = (await searchParams) || {}
  return (
    <Suspense fallback={
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-14 bg-white rounded-2xl border border-gray-100" />
        <div className="h-64 bg-white rounded-2xl border border-gray-100" />
      </div>
    }>
      <ProblemsContent searchParams={sp} />
    </Suspense>
  )
}

async function ProblemsContent({ searchParams: sp }) {
  const topic = sp.topic || undefined
  const difficulty = sp.difficulty || undefined
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)

  const where = { active: true }
  if (topic) where.topic = topic
  if (difficulty) where.difficulty = difficulty

  const [problems, total, topicsRaw] = await Promise.all([
    prisma.problem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { attempts: true, submissions: true } } },
    }),
    prisma.problem.count({ where }),
    prisma.problem.findMany({ where: { active: true }, distinct: ['topic'], select: { topic: true } }),
  ])

  const topics = topicsRaw
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const pageUrl = (p) => {
    const params = new URLSearchParams()
    if (topic) params.set('topic', topic)
    if (difficulty) params.set('difficulty', difficulty)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/teacher/problems${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold">🧠 Banca de Probleme</h1>
          <p className="text-sm text-gray-600">{total} probleme active{(topic || difficulty) ? ' • filtrat' : ''}</p>
        </div>
        <Link href="/teacher/problems/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          + Adaugă problemă
        </Link>
      </div>

      <form className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-wrap gap-2" method="GET">
        <select name="topic" defaultValue={topic || ''} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">Toate topic-urile</option>
          {[...new Set(topics.map(t => t.topic).filter(Boolean))].sort().map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="difficulty" defaultValue={difficulty || ''} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">Toate dificultățile</option>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>
        <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">Filtrează</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 text-left">Titlu</th>
                <th className="px-4 py-3 text-left">Topic</th>
                <th className="px-4 py-3 text-left">Tip</th>
                <th className="px-4 py-3 text-left">Diff</th>
                <th className="px-4 py-3 text-left">Folosiri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {problems.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nicio problemă.</td></tr>
              ) : problems.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-sm"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">{p.topic}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{TYPE_LABEL[p.type]}</td>
                  <td className="px-4 py-3 text-sm">{DIFF_LABEL[p.difficulty]}</td>
                  <td className="px-4 py-3 text-xs">📚 {p._count.attempts + p._count.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {problems.map(p => (
            <div key={p.id} className="p-3">
              <div className="font-medium text-sm">{p.title}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">{p.topic}</span>
                <span className="text-xs text-gray-500">{TYPE_LABEL[p.type]}</span>
                <span className="text-xs">{DIFF_LABEL[p.difficulty]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex flex-col xs:flex-row items-start xs:items-center gap-2">
            <div className="text-xs text-gray-500 shrink-0">
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} din {total}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Link href={pageUrl(1)}
                className={`px-2 py-1 text-sm rounded border ${page <= 1 ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}>
                « Prima
              </Link>
              <Link href={pageUrl(Math.max(1, page - 1))}
                className={`px-2 py-1 text-sm rounded border ${page <= 1 ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}>
                ‹ Anterior
              </Link>
              <span className="px-3 py-1 text-sm font-medium">{page} / {totalPages}</span>
              <Link href={pageUrl(Math.min(totalPages, page + 1))}
                className={`px-2 py-1 text-sm rounded border ${page >= totalPages ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}>
                Următor ›
              </Link>
              <Link href={pageUrl(totalPages)}
                className={`px-2 py-1 text-sm rounded border ${page >= totalPages ? 'pointer-events-none opacity-40 border-gray-200' : 'border-gray-200 hover:border-indigo-300'}`}>
                Ultima »
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
