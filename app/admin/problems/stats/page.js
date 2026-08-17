export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { computeStudentStats } from '@/lib/problem-utils'

export default async function ProblemsStatsPage({ searchParams }) {
  return (
    <PermissionGuard permission="problems.view">
      <Content searchParams={searchParams} />
    </PermissionGuard>
  )
}

async function Content({ searchParams }) {
  const sp = (await searchParams) || {}
  const studentId = sp.studentId || ''

  const students = await prisma.student.findMany({ select: { id: true, fullName: true }, orderBy: { fullName: 'asc' } })

  let stats = null
  let recentSubs = []
  let topAttempts = []
  if (studentId) {
    const [attempts, subs] = await Promise.all([
      prisma.problemAttempt.findMany({
        where: { studentId },
        include: { problem: { select: { topic: true, difficulty: true, title: true } } },
      }),
      prisma.problemSubmission.findMany({
        where: { studentId },
        include: { problem: { select: { topic: true, difficulty: true, title: true } } },
      }),
    ])

    // combinăm attempts (din seturi) cu submissions (din lecții/random) pentru o vedere unitară
    const all = [
      ...attempts.map(a => ({ isCorrect: a.isCorrect, problem: a.problem, source: 'set', when: a.createdAt })),
      ...subs.map(s => ({ isCorrect: s.status === 'GRADED' && (s.grade ?? 0) >= 60, problem: s.problem, source: s.source || 'lesson', when: s.createdAt })),
    ]
    stats = computeStudentStats(all)
    recentSubs = [...all].sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 15)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/problems" className="hover:text-indigo-600">🧠 Banca</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">Statistici</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h1 className="text-xl font-bold mb-3">📊 Statistici elev</h1>
        <form method="GET" className="flex gap-2">
          <select name="studentId" defaultValue={studentId} className="flex-1 sm:flex-none sm:w-96 px-3 py-2 border rounded-lg">
            <option value="">— Alege elev —</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Vezi</button>
        </form>
      </div>

      {!studentId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
          Alege un elev pentru a vedea progresul lui detaliat.
        </div>
      ) : !stats || stats.total === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
          Acest elev încă nu a rezolvat probleme.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Total" value={stats.total} />
            <Stat label="Corecte" value={stats.correct} accent="emerald" />
            <Stat label="Accuracy" value={`${stats.accuracy}%`} accent={stats.accuracy >= 70 ? 'emerald' : stats.accuracy >= 50 ? 'amber' : 'red'} />
            <Stat label="Slăbiciuni" value={stats.weakTopics.length} accent={stats.weakTopics.length > 0 ? 'red' : 'gray'} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold mb-3">📚 Performanță pe topic-uri</h3>
            <div className="space-y-2">
              {stats.byTopic.sort((a, b) => b.total - a.total).map(t => (
                <div key={t.topic} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium truncate">{t.topic}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full ${t.accuracy >= 70 ? 'bg-emerald-500' : t.accuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${t.accuracy}%` }} />
                  </div>
                  <div className="w-24 text-xs text-gray-600 text-right">{t.correct}/{t.total} • {t.accuracy}%</div>
                </div>
              ))}
            </div>
          </div>

          {stats.weakTopics.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ Topic-uri de îmbunătățit</h3>
              <div className="flex flex-wrap gap-2">
                {stats.weakTopics.map(t => <span key={t} className="px-2 py-1 bg-white border border-red-200 rounded text-sm">{t}</span>)}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold mb-3">🕒 Activitate recentă</h3>
            <div className="space-y-1.5">
              {recentSubs.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 text-sm">
                  <span>{r.isCorrect ? '✅' : '❌'}</span>
                  <span className="font-medium flex-1 truncate">{r.problem?.title}</span>
                  <span className="text-xs text-gray-500">{r.problem?.topic}</span>
                  <span className="text-xs text-gray-400">{new Date(r.when).toLocaleDateString('ro-RO')}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Stat({ label, value, accent = 'indigo' }) {
  const colors = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-2xl font-bold ${colors[accent]}`}>{value}</div>
    </div>
  )
}
