export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PermissionGuard from '@/components/admin/PermissionGuard'
import CopySetLinkButton from '@/components/admin/CopySetLinkButton'
import DeleteSetButton from '@/components/admin/DeleteSetButton'

const POLICY_LABEL = {
  ALWAYS: '✅ Vezi oricând',
  AFTER_ANSWER: '⏸ După ce răspunde',
  AFTER_SET: '🏁 După finalizare',
}
const DIFF = { EASY: '🟢 Ușor', MEDIUM: '🟡 Mediu', HARD: '🔴 Greu' }

export default async function SetDetailPage({ params }) {
  return (
    <PermissionGuard permission="problems.view">
      <Content params={params} />
    </PermissionGuard>
  )
}

async function Content({ params }) {
  const { id } = await params
  const set = await prisma.generatedSet.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, fullName: true } },
      createdBy: { select: { id: true, name: true } },
      setProblems: { include: { problem: true }, orderBy: { order: 'asc' } },
      attempts: true,
    },
  })
  if (!set) notFound()

  const attemptByProblem = new Map()
  for (const a of set.attempts) {
    const cur = attemptByProblem.get(a.problemId)
    if (!cur || new Date(a.createdAt) > new Date(cur.createdAt)) attemptByProblem.set(a.problemId, a)
  }

  const totalPoints = set.setProblems.reduce((s, sp) => s + (sp.problem.points || 0), 0)
  const earnedPoints = [...attemptByProblem.values()].reduce((s, a) => s + (a.pointsAwarded || 0), 0)
  const correctCount = [...attemptByProblem.values()].filter(a => a.isCorrect).length

  return (
    <div className="space-y-4 xs:space-y-6 max-w-5xl">
      <Link href="/admin/problems/sets" className="text-indigo-600 hover:underline text-sm">← Înapoi la seturi</Link>

      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">{set.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            👤 {set.student?.fullName || 'fără elev'} • {POLICY_LABEL[set.explanationPolicy]}
            {set.timeLimit ? ` • ⏱ ${set.timeLimit} min` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <CopySetLinkButton token={set.accessToken} />
          <DeleteSetButton id={set.id} title={set.title} />
        </div>
      </div>

      {/* Status & link */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
        <p className="text-sm font-medium text-emerald-900 mb-2">🔗 Link pentru elev:</p>
        <code className="block bg-white px-3 py-2 rounded border border-emerald-200 text-xs break-all">
          /solve/{set.accessToken}
        </code>
        <p className="text-xs text-emerald-700 mt-2">
          Trimite acest link elevului. Nu necesită cont.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-gray-500">Status</div>
          <div className="text-lg font-bold mt-1">
            {set.completedAt ? '🏁 Finalizat' : set.startedAt ? '▶️ În curs' : '⏸ Neînceput'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-gray-500">Probleme rezolvate</div>
          <div className="text-lg font-bold mt-1">{attemptByProblem.size} / {set.setProblems.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-gray-500">Corecte</div>
          <div className="text-lg font-bold mt-1 text-emerald-600">{correctCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-xs text-gray-500">Scor</div>
          <div className="text-lg font-bold mt-1">{earnedPoints} / {totalPoints} pct</div>
        </div>
      </div>

      {/* Problems */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">📝 Problemele din set</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {set.setProblems.map((sp, i) => {
            const att = attemptByProblem.get(sp.problemId)
            return (
              <div key={sp.id} className="p-4 flex items-start gap-3">
                <div className="text-gray-400 font-mono text-sm pt-0.5">{i + 1}.</div>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/problems/${sp.problem.id}/edit`} className="font-medium text-gray-900 hover:text-indigo-600">
                    {sp.problem.title}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">
                    {DIFF[sp.problem.difficulty]} • {sp.problem.topic} • {sp.problem.points} pct
                  </div>
                </div>
                <div className="text-right text-xs">
                  {att ? (
                    att.isCorrect ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        ✅ Corect ({att.attempts}x)
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        ❌ Greșit ({att.attempts}x)
                      </span>
                    )
                  ) : (
                    <span className="text-gray-400">— neîncercat</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
