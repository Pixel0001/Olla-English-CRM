export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requirePermission } from '@/lib/permissions'
import { AI_LIMITS } from '@/lib/ai-grader'
import {
  CurrencyDollarIcon,
  CpuChipIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default async function AiUsagePage() {
  await requirePermission('submissions.view')

  const now = new Date()
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Aggregates în paralel
  const [todayAgg, monthAgg, totalAgg, last24Count, errorCount, recentSubs] = await Promise.all([
    prisma.aiUsage.aggregate({
      where: { createdAt: { gte: startOfDay } },
      _sum: { costUsd: true, tokensIn: true, tokensOut: true }, _count: true,
    }),
    prisma.aiUsage.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { costUsd: true }, _count: true,
    }),
    prisma.aiUsage.aggregate({
      _sum: { costUsd: true, tokensIn: true, tokensOut: true }, _count: true,
    }),
    prisma.aiUsage.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.aiUsage.count({ where: { success: false, createdAt: { gte: days30Ago } } }),
    prisma.problemSubmission.findMany({
      where: { aiGraded: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        student: { select: { id: true, fullName: true } },
        problem: { select: { id: true, title: true, language: true } },
      },
    }),
  ])

  // Grafic: cereri pe zi (ultimele 30 zile) — agreg manual
  const last30 = await prisma.aiUsage.findMany({
    where: { createdAt: { gte: days30Ago } },
    select: { createdAt: true, costUsd: true },
  })
  const dailyMap = new Map()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i)
    dailyMap.set(d.toISOString().slice(0, 10), { count: 0, cost: 0 })
  }
  for (const u of last30) {
    const k = new Date(u.createdAt).toISOString().slice(0, 10)
    const e = dailyMap.get(k); if (e) { e.count++; e.cost += u.costUsd || 0 }
  }
  const dailyData = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }))
  const maxCount = Math.max(1, ...dailyData.map(d => d.count))

  // Top elevi după cost (ultimele 30 zile)
  const topByStudent = await prisma.aiUsage.groupBy({
    by: ['studentId'],
    where: { studentId: { not: null }, createdAt: { gte: days30Ago } },
    _sum: { costUsd: true }, _count: true,
    orderBy: { _sum: { costUsd: 'desc' } },
    take: 10,
  })
  const studentIds = topByStudent.map(t => t.studentId).filter(Boolean)
  const studentNames = studentIds.length
    ? await prisma.student.findMany({ where: { id: { in: studentIds } }, select: { id: true, fullName: true } })
    : []
  const nameById = new Map(studentNames.map(s => [s.id, s.fullName]))

  // Estimări proiecție lunară
  const todayCost = todayAgg._sum.costUsd || 0
  const monthCost = monthAgg._sum.costUsd || 0
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const projectedMonth = dayOfMonth > 0 ? (monthCost / dayOfMonth) * daysInMonth : monthCost
  const budgetUsedPct = AI_LIMITS.globalDailyUsd > 0 ? Math.min(100, (todayCost / AI_LIMITS.globalDailyUsd) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl">🐍</div>
        <div>
          <h1 className="text-2xl font-bold">Mr. Olla — AI Usage</h1>
          <p className="text-sm text-gray-500">Statistici utilizare și cost OpenAI</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={CurrencyDollarIcon} label="Cost azi" value={`$${todayCost.toFixed(4)}`} sub={`${todayAgg._count} cereri`} color="green" />
        <Stat icon={ChartBarIcon} label="Cost luna asta" value={`$${monthCost.toFixed(3)}`} sub={`proiecție: $${projectedMonth.toFixed(2)}`} color="blue" />
        <Stat icon={CpuChipIcon} label="Cereri 24h" value={last24Count} sub={`total: ${totalAgg._count}`} color="purple" />
        <Stat icon={ExclamationTriangleIcon} label="Erori 30 zile" value={errorCount} sub={`tokens: ${(totalAgg._sum.tokensIn || 0) + (totalAgg._sum.tokensOut || 0)}`} color={errorCount > 0 ? 'red' : 'gray'} />
      </div>

      {/* Buget zilnic */}
      <div className="bg-white rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-800">Buget zilnic global</h2>
          <span className="text-sm text-gray-600">${todayCost.toFixed(4)} / ${AI_LIMITS.globalDailyUsd.toFixed(2)}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${budgetUsedPct >= 90 ? 'bg-red-500' : budgetUsedPct >= 60 ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${budgetUsedPct}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Limite: <strong>{AI_LIMITS.perStudentDaily}/elev/zi</strong> · <strong>{AI_LIMITS.perIpHourly}/IP/oră</strong>
          {budgetUsedPct >= 90 && <span className="ml-2 text-red-600 font-bold">⚠️ Aproape de kill-switch!</span>}
        </div>
      </div>

      {/* Grafic 30 zile */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Cereri AI — ultimele 30 zile</h2>
        <div className="flex items-end gap-1 h-40">
          {dailyData.map(d => {
            const h = (d.count / maxCount) * 100
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition hover:opacity-80"
                  style={{ height: `${Math.max(2, h)}%` }}
                />
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  {d.date}: {d.count} req · ${d.cost.toFixed(4)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{dailyData[0]?.date}</span>
          <span>{dailyData[dailyData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Top elevi */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <UserIcon className="w-5 h-5" /> Top elevi (cost — ultimele 30 zile)
        </h2>
        {topByStudent.length === 0 ? (
          <p className="text-sm text-gray-500">Niciun elev nu a folosit AI încă.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="py-2">Elev</th>
                  <th className="py-2">Cereri</th>
                  <th className="py-2">Cost</th>
                  <th className="py-2">Avg/cerere</th>
                </tr>
              </thead>
              <tbody>
                {topByStudent.map(t => {
                  const cost = t._sum.costUsd || 0
                  const avg = t._count > 0 ? cost / t._count : 0
                  return (
                    <tr key={t.studentId} className="border-b last:border-0">
                      <td className="py-2 font-medium">{nameById.get(t.studentId) || '—'}</td>
                      <td className="py-2">{t._count}</td>
                      <td className="py-2 font-mono">${cost.toFixed(4)}</td>
                      <td className="py-2 font-mono text-xs text-gray-500">${avg.toFixed(5)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submisii AI recente */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="w-5 h-5" /> Submisii notate de AI (recente)
        </h2>
        {recentSubs.length === 0 ? (
          <p className="text-sm text-gray-500">Încă nicio submisie notată de Mr. Olla.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="py-2">Elev</th>
                  <th className="py-2">Problemă</th>
                  <th className="py-2">Limbaj</th>
                  <th className="py-2">Notă</th>
                  <th className="py-2">AI?</th>
                  <th className="py-2">Override</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {recentSubs.map(s => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2">{s.student?.fullName}</td>
                    <td className="py-2 max-w-[200px] truncate">{s.problem?.title}</td>
                    <td className="py-2 text-xs text-gray-500">{s.problem?.language || '—'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        (s.grade ?? 0) >= 60 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{s.grade ?? '—'}</span>
                    </td>
                    <td className="py-2">
                      {s.aiSuspectedAi ? (
                        <span className="text-red-600 font-bold text-xs">⚠️ {s.aiSuspicionScore}/100</span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="py-2">
                      {s.teacherOverride
                        ? <span className="text-amber-700 text-xs font-bold">✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2">
                      <Link href={`/admin/submissions/${s.id}`} className="text-indigo-600 hover:underline text-xs">deschide →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    red: 'from-red-500 to-rose-600',
    gray: 'from-gray-400 to-gray-600',
  }
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorMap[color] || colorMap.gray} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}
