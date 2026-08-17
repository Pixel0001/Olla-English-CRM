import { writeFileSync } from 'fs'

const content = `export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  TrophyIcon, ArrowLeftIcon, StarIcon, Bars3BottomLeftIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { TrophyIcon as TrophySolid } from '@heroicons/react/24/solid'

const LEVELS = [
  { min: 0,    max: 99,       num: 1, name: 'Novice',     color: 'text-slate-500',   bg: 'bg-slate-100',   bar: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  { min: 100,  max: 299,      num: 2, name: 'Explorator', color: 'text-blue-600',    bg: 'bg-blue-50',     bar: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  { min: 300,  max: 699,      num: 3, name: 'Practicant', color: 'text-emerald-600', bg: 'bg-emerald-50',  bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { min: 700,  max: 1499,     num: 4, name: 'Expert',     color: 'text-amber-600',   bg: 'bg-amber-50',    bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  { min: 1500, max: 2999,     num: 5, name: 'Master',     color: 'text-purple-600',  bg: 'bg-purple-50',   bar: 'bg-purple-400',  badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  { min: 3000, max: Infinity, num: 6, name: 'Legend',     color: 'text-rose-600',    bg: 'bg-rose-50',     bar: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-700 border-rose-200' },
]

function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0]
}

const RANK_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600']

export default async function LeaderboardPage({ params }) {
  const { token } = await params

  const me = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true, active: true },
  })
  if (!me || me.active === false) notFound()

  const [allStudents, allSubmissions, allBonusPoints] = await Promise.all([
    prisma.student.findMany({
      where: { active: true },
      select: { id: true, fullName: true },
    }),
    prisma.problemSubmission.findMany({
      where: { status: 'GRADED', grade: { gte: 60 } },
      select: { studentId: true, grade: true, problem: { select: { points: true } } },
    }),
    prisma.bonusPoint.findMany({
      select: { studentId: true, points: true },
    }),
  ])

  const xpMap = new Map()
  for (const s of allStudents) xpMap.set(s.id, 0)
  for (const sub of allSubmissions) {
    const xp = Math.round((sub.problem?.points ?? 10) * (sub.grade / 100))
    xpMap.set(sub.studentId, (xpMap.get(sub.studentId) ?? 0) + xp)
  }
  for (const bp of allBonusPoints) {
    xpMap.set(bp.studentId, (xpMap.get(bp.studentId) ?? 0) + bp.points)
  }

  const ranked = allStudents
    .map(s => ({ ...s, xp: xpMap.get(s.id) ?? 0 }))
    .sort((a, b) => b.xp - a.xp)

  const myRank = ranked.findIndex(s => s.id === me.id) + 1
  const myXP = xpMap.get(me.id) ?? 0
  const myLevel = getLevel(myXP)
  const myNextLevel = LEVELS[myLevel.num] ?? null
  const myXpInto = myXP - myLevel.min
  const myXpNeeded = myNextLevel ? myNextLevel.min - myLevel.min : 1
  const myPct = myNextLevel ? Math.min(100, Math.round((myXpInto / myXpNeeded) * 100)) : 100
  const xpToNext = myNextLevel ? myNextLevel.min - myXP : 0
  const playerAhead = ranked[myRank - 2]
  const xpToOvertake = playerAhead ? Math.max(0, playerAhead.xp - myXP + 1) : 0

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-4 flex items-center gap-3 shadow-lg">
        <Link href={\`/learn/\${token}\`} className="p-2 hover:bg-white/10 rounded-xl transition">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <TrophyIcon className="w-6 h-6 text-amber-300" />
        <div>
          <h1 className="font-extrabold text-lg leading-tight">Clasament</h1>
          <p className="text-white/60 text-xs">Toti elevii dupa XP acumulat</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* My position card */}
        <div className={\`rounded-2xl p-5 border-2 \${myLevel.bg} shadow-sm\`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-md">
              #{myRank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-gray-900 text-base">Tu · {me.fullName}</div>
              <Link href={\`/learn/\${token}/levels\`} className={\`text-sm font-bold \${myLevel.color} hover:underline\`}>
                Nivel {myLevel.num} — {myLevel.name}
              </Link>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-extrabold text-gray-900">{myXP}</div>
              <div className="text-xs text-gray-500">XP total</div>
            </div>
          </div>

          {myNextLevel ? (
            <>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className={myLevel.color}>Nv.{myLevel.num} {myLevel.name}</span>
                <span className="text-gray-500">
                  <strong className="text-gray-900">{xpToNext} XP</strong> pana la{' '}
                  <span className={myNextLevel.color}>{myNextLevel.name}</span>
                </span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                <div className={\`h-full \${myLevel.bar} rounded-full transition-all duration-700\`} style={{ width: \`\${myPct}%\` }} />
              </div>
              <div className="text-[10px] text-gray-500 mt-1 text-right">{myXpInto} / {myXpNeeded} XP ({myPct}%)</div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="text-2xl">👑</div>
              <div className="text-sm font-bold text-rose-600">Ai atins nivelul maxim — Legend!</div>
            </div>
          )}

          {playerAhead && xpToOvertake > 0 && (
            <div className="mt-3 px-3 py-2 bg-white/60 rounded-xl flex items-center gap-2 text-xs">
              <Bars3BottomLeftIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-gray-700">
                <strong className="text-blue-900">+{xpToOvertake} XP</strong> ca sa-l depasesti pe{' '}
                <strong>{playerAhead.fullName}</strong> (locul #{myRank - 1})
              </span>
            </div>
          )}
        </div>

        {/* Leaderboard list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">Top elevi</span>
            <span className="ml-auto text-xs text-gray-400">{ranked.length} elevi</span>
          </div>
          <div className="divide-y divide-gray-50">
            {ranked.map((student, idx) => {
              const rank = idx + 1
              const level = getLevel(student.xp)
              const isMe = student.id === me.id
              return (
                <div key={student.id} className={\`px-4 py-3 flex items-center gap-3 \${isMe ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}\`}>
                  <div className={\`w-8 text-center shrink-0 font-extrabold text-base \${RANK_COLORS[idx] ?? 'text-gray-400'}\`}>
                    {rank <= 3 ? <TrophySolid className={\`w-5 h-5 mx-auto \${RANK_COLORS[idx]}\`} /> : rank}
                  </div>
                  <div className={\`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 \${isMe ? 'bg-gradient-to-br from-blue-900 to-blue-700 text-white' : 'bg-slate-100 text-slate-600'}\`}>
                    {student.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={\`text-sm font-semibold truncate \${isMe ? 'text-blue-900' : 'text-gray-900'}\`}>
                      {isMe ? \`\${student.fullName} (tu)\` : student.fullName}
                    </div>
                    <Link href={\`/learn/\${token}/levels\`} className={\`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full border mt-0.5 hover:opacity-75 transition \${level.badge}\`}>
                      Nivel {level.num} · {level.name}
                    </Link>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={\`text-base font-extrabold \${isMe ? 'text-blue-900' : 'text-gray-900'}\`}>{student.xp}</div>
                    <div className="text-[10px] text-gray-400">XP</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Link to levels page */}
        <Link href={\`/learn/\${token}/levels\`} className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:bg-slate-50 transition group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shrink-0 text-xl">🏆</div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-sm">Vezi toate nivelurile</div>
            <div className="text-xs text-gray-500">Novice → Explorator → Practicant → Expert → Master → Legend</div>
          </div>
          <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </div>
  )
}
`

writeFileSync('app/learn/[token]/leaderboard/page.js', content, 'utf8')
console.log('Leaderboard written OK')
