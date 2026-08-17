import { writeFileSync } from 'fs'

const c = `export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  TrophyIcon, ArrowLeftIcon, Bars3BottomLeftIcon, ChevronRightIcon,
  SparklesIcon, MagnifyingGlassIcon, WrenchScrewdriverIcon,
  BoltIcon, RocketLaunchIcon, FireIcon, StarIcon,
} from '@heroicons/react/24/outline'
import { TrophyIcon as TrophySolid, FireIcon as FireSolid } from '@heroicons/react/24/solid'

const LEVELS = [
  { min: 0,    max: 99,       num: 1, name: 'Novice',     Icon: SparklesIcon,          color: 'text-slate-500',   bg: 'bg-slate-100',  bar: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600 border-slate-200',       iconColor: 'text-slate-400'   },
  { min: 100,  max: 299,      num: 2, name: 'Explorator', Icon: MagnifyingGlassIcon,   color: 'text-blue-600',    bg: 'bg-blue-50',    bar: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-700 border-blue-200',          iconColor: 'text-blue-400'    },
  { min: 300,  max: 699,      num: 3, name: 'Practicant', Icon: WrenchScrewdriverIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', iconColor: 'text-emerald-400' },
  { min: 700,  max: 1499,     num: 4, name: 'Expert',     Icon: BoltIcon,              color: 'text-amber-600',   bg: 'bg-amber-50',   bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200',       iconColor: 'text-amber-400'   },
  { min: 1500, max: 2999,     num: 5, name: 'Master',     Icon: RocketLaunchIcon,      color: 'text-purple-600',  bg: 'bg-purple-50',  bar: 'bg-purple-400',  badge: 'bg-purple-100 text-purple-700 border-purple-200',    iconColor: 'text-purple-400'  },
  { min: 3000, max: Infinity, num: 6, name: 'Legend',     Icon: FireIcon,              color: 'text-rose-600',    bg: 'bg-rose-50',    bar: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-700 border-rose-200',          iconColor: 'text-rose-400'    },
]

function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.min) ?? LEVELS[0]
}

const RANK_BG    = ['bg-yellow-400', 'bg-slate-300',   'bg-amber-600'  ]
const RANK_RING  = ['ring-yellow-300','ring-slate-200', 'ring-amber-400']
const RANK_TEXT  = ['text-amber-900', 'text-slate-700', 'text-amber-100']
const RANK_COLOR = ['text-yellow-500','text-slate-400', 'text-amber-700']

export default async function LeaderboardPage({ params }) {
  const { token } = await params

  const me = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true, active: true },
  })
  if (!me || me.active === false) notFound()

  const [allStudents, allSubmissions, allBonusPoints] = await Promise.all([
    prisma.student.findMany({ where: { active: true }, select: { id: true, fullName: true } }),
    prisma.problemSubmission.findMany({
      where: { status: 'GRADED', grade: { gte: 60 } },
      select: { studentId: true, grade: true, problem: { select: { points: true } } },
    }),
    prisma.bonusPoint.findMany({ select: { studentId: true, points: true } }),
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

  const ranked = allStudents.map(s => ({ ...s, xp: xpMap.get(s.id) ?? 0 })).sort((a, b) => b.xp - a.xp)

  const myRank     = ranked.findIndex(s => s.id === me.id) + 1
  const myXP       = xpMap.get(me.id) ?? 0
  const myLevel    = getLevel(myXP)
  const myNextLvl  = LEVELS[myLevel.num] ?? null
  const myXpInto   = myXP - myLevel.min
  const myXpNeeded = myNextLvl ? myNextLvl.min - myLevel.min : 1
  const myPct      = myNextLvl ? Math.min(100, Math.round((myXpInto / myXpNeeded) * 100)) : 100
  const xpToNext   = myNextLvl ? myNextLvl.min - myXP : 0
  const playerAhead  = ranked[myRank - 2]
  const xpToOvertake = playerAhead ? Math.max(0, playerAhead.xp - myXP + 1) : 0

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOP BAR + PODIUM */}
      <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-800 text-white px-4 pt-4 pb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href={'/learn/' + token} className="p-2 hover:bg-white/10 rounded-xl transition">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-extrabold text-xl leading-tight">Clasament</h1>
            <p className="text-white/50 text-xs">Toti elevii dupa XP acumulat</p>
          </div>
          <TrophyIcon className="w-7 h-7 text-amber-300" />
        </div>

        {ranked.length >= 3 && (
          <div className="flex items-end justify-center gap-3 max-w-xs mx-auto">
            {[1, 0, 2].map((pos) => {
              const s = ranked[pos]
              const isFirst = pos === 0
              const barPy = pos === 0 ? 'py-5' : pos === 1 ? 'py-3' : 'py-2'
              return (
                <div key={s.id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                  {isFirst && <TrophySolid className="w-5 h-5 text-yellow-400" />}
                  <div className="relative">
                    <div className={'rounded-full flex items-center justify-center font-extrabold shadow-lg ring-2 ' + (isFirst ? 'w-16 h-16 text-xl ' : 'w-12 h-12 text-base ') + RANK_BG[pos] + ' ' + RANK_RING[pos] + ' ' + RANK_TEXT[pos]}>
                      {s.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className={'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center font-black ring-2 ring-white ' + (isFirst ? 'w-6 h-6 text-[10px] ' : 'w-5 h-5 text-[9px] ') + RANK_BG[pos] + ' ' + RANK_TEXT[pos]}>
                      {pos + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-white/80 text-center leading-tight truncate w-full px-1">
                    {s.fullName.split(' ')[0]}
                  </span>
                  <div className={'w-full rounded-t-xl text-center ' + barPy + ' ' + (isFirst ? 'bg-yellow-500/20 border border-yellow-400/20' : 'bg-white/10')}>
                    <div className={'font-extrabold text-sm ' + (isFirst ? 'text-yellow-300' : 'text-white')}>{s.xp}</div>
                    <div className={'text-[9px] ' + (isFirst ? 'text-yellow-300/60' : 'text-white/40')}>XP</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">

        {/* MY POSITION CARD */}
        <div className={'rounded-2xl p-4 border shadow-sm ' + myLevel.bg}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md ring-2 ring-blue-300/30">
              {'#' + myRank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-gray-900 text-sm">{'Tu · ' + me.fullName}</div>
              <Link href={'/learn/' + token + '/levels'} className={'inline-flex items-center gap-1 text-xs font-bold hover:underline mt-0.5 ' + myLevel.color}>
                <myLevel.Icon className={'w-3 h-3 ' + myLevel.iconColor} />
                {'Nivel ' + myLevel.num + ' — ' + myLevel.name}
              </Link>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-extrabold text-gray-900">{myXP}</div>
              <div className="text-[10px] text-gray-500">XP total</div>
            </div>
          </div>

          {myNextLvl ? (
            <Link href={'/learn/' + token + '/levels'} className="block group">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className={myLevel.color}>{'Nv.' + myLevel.num + ' ' + myLevel.name}</span>
                <span className="text-gray-500">
                  <strong className="text-gray-900">{xpToNext + ' XP'}</strong>
                  {' pana la '}
                  <span className={myNextLvl.color}>{myNextLvl.name}</span>
                </span>
              </div>
              <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
                <div className={'h-full rounded-full transition-all duration-700 ' + myLevel.bar} style={{ width: myPct + '%' }} />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-gray-400 group-hover:text-blue-600 transition flex items-center gap-1">
                  <ChevronRightIcon className="w-3 h-3" />
                  {' Vezi toate nivelurile'}
                </span>
                <span className="text-[10px] text-gray-500">{myXpInto + ' / ' + myXpNeeded + ' XP'}</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1">
              <FireSolid className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-bold text-rose-600">Nivel maxim atins — Legend!</span>
              <FireSolid className="w-4 h-4 text-rose-500" />
            </div>
          )}

          {playerAhead && xpToOvertake > 0 && (
            <div className="mt-3 px-3 py-2 bg-white/60 rounded-xl flex items-center gap-2 text-xs">
              <Bars3BottomLeftIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-gray-700">
                <strong className="text-blue-900">{'+' + xpToOvertake + ' XP'}</strong>
                {' ca sa-l depasesti pe '}
                <strong>{playerAhead.fullName}</strong>
                {' (locul #' + (myRank - 1) + ')'}
              </span>
            </div>
          )}
        </div>

        {/* LEADERBOARD LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/80">
            <StarIcon className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">Toti elevii</span>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{ranked.length + ' elevi'}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {ranked.map((student, idx) => {
              const rank  = idx + 1
              const level = getLevel(student.xp)
              const isMe  = student.id === me.id
              const isTop = rank <= 3
              return (
                <div key={student.id} className={'px-4 py-3 flex items-center gap-3 transition-colors ' + (isMe ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50/80')}>
                  <div className="w-7 shrink-0 flex items-center justify-center">
                    {isTop
                      ? <TrophySolid className={'w-5 h-5 ' + RANK_COLOR[idx]} />
                      : <span className="text-sm font-bold text-gray-400 tabular-nums">{rank}</span>}
                  </div>
                  <div className={'w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 shadow-sm ring-2 ' +
                    (isTop
                      ? RANK_BG[idx] + ' ' + RANK_RING[idx] + ' ' + RANK_TEXT[idx]
                      : isMe
                        ? 'bg-gradient-to-br from-blue-900 to-blue-700 text-white ring-blue-200'
                        : 'bg-slate-100 text-slate-600 ring-slate-100')}>
                    {student.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={'text-sm font-semibold truncate ' + (isMe ? 'text-blue-900' : 'text-gray-900')}>
                      {isMe ? student.fullName + ' (tu)' : student.fullName}
                    </div>
                    <Link href={'/learn/' + token + '/levels'} className={'inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border mt-0.5 hover:opacity-75 transition ' + level.badge}>
                      <level.Icon className="w-2.5 h-2.5" />
                      {'Nv.' + level.num + ' ' + level.name}
                    </Link>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={'text-base font-extrabold tabular-nums ' + (isMe ? 'text-blue-900' : isTop ? RANK_COLOR[idx] : 'text-gray-800')}>{student.xp}</div>
                    <div className="text-[10px] text-gray-400">XP</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* LINK TO LEVELS */}
        <Link href={'/learn/' + token + '/levels'} className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:bg-slate-50 transition group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <TrophySolid className="w-5 h-5 text-amber-300" />
          </div>
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

writeFileSync('app/learn/[token]/leaderboard/page.js', c, 'utf8')
console.log('OK')
