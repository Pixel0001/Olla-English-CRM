export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  ArrowLeftIcon, LockClosedIcon, CheckCircleIcon, TrophyIcon,
} from '@heroicons/react/24/outline'
import { getSystemSettings } from '@/lib/student-limits'
import { buildLevels, getLevel } from '@/lib/levels'

export default async function LevelsPage({ params }) {
  const { token } = await params

  const me = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true, active: true },
  })
  if (!me || me.active === false) notFound()

  const settings = await getSystemSettings()
  const LEVELS = buildLevels(settings.levelCurve, settings.levelNames)

  const [submissions, bonusPoints] = await Promise.all([
    prisma.problemSubmission.findMany({
      where: { studentId: me.id, status: 'GRADED', grade: { gte: 60 } },
      select: { grade: true, xpAwarded: true, problem: { select: { points: true } } },
    }),
    prisma.bonusPoint.findMany({
      where: { studentId: me.id },
      select: { points: true },
    }),
  ])

  let myXP = 0
  for (const sub of submissions) {
    if (sub.xpAwarded != null) myXP += sub.xpAwarded
    else myXP += Math.round((sub.problem?.points ?? 10) * (sub.grade / 100))
  }
  for (const bp of bonusPoints) myXP += bp.points

  const myLevel = getLevel(LEVELS, myXP)
  const lastName = LEVELS[LEVELS.length - 1]?.name || 'Maestru'

  return (
    <div className="min-h-screen bg-[#0c1a1d]">
      <div className="text-white px-4 py-4 flex items-center gap-3 shadow-lg" style={{ background: 'linear-gradient(to right, #0c1a1d, #0f2127, #136976)' }}>
        <Link href={`/learn/${token}`} className="p-2 hover:bg-white/10 rounded-xl transition">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <TrophyIcon className="w-6 h-6 text-amber-300" />
        <div>
          <h1 className="font-extrabold text-lg leading-tight">Niveluri</h1>
          <p className="text-white/60 text-xs">Progresia ta de la {LEVELS[0]?.name || 'începător'} la {lastName}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <div className="bg-[#0f2127] rounded-2xl p-4 shadow-sm border border-[#30919f]/30 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${myLevel.bar}`}>
            <myLevel.IconSolid className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-white">{me.fullName}</div>
            <div className={`text-sm font-bold ${myLevel.color}`}>Nivel {myLevel.num} · {myLevel.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white">{myXP}</div>
            <div className="text-xs text-[#a0b8bc]">XP total</div>
          </div>
        </div>

        {LEVELS.map((l, i) => {
          const next = LEVELS[i + 1]
          const isCurrent = l.num === myLevel.num
          const isPassed = myXP >= (next?.min ?? Infinity) && !isCurrent
          const isLocked = myXP < l.min
          const xpRange = next ? next.min - l.min : null
          const xpInLevel = Math.max(0, myXP - l.min)
          const pct = xpRange ? Math.min(100, Math.round((xpInLevel / xpRange) * 100)) : 100

          let statusIcon = null
          let cardBorder = 'border-2 ' + l.border
          let cardBg = 'bg-[#0f2127]'

          if (isPassed) {
            cardBorder = 'border-2 border-emerald-500/50'
            cardBg = 'bg-[#0f2127]'
            statusIcon = <span className="text-emerald-400 font-black text-lg">✓</span>
          } else if (isLocked) {
            cardBorder = 'border border-[#30919f]/10'
            cardBg = 'bg-[#0a1518]'
            statusIcon = <LockClosedIcon className="w-4 h-4 text-[#a0b8bc]/50" />
          } else if (isCurrent) {
            cardBorder = 'border-2 border-[#30919f]/60'
            statusIcon = <span className={'text-[10px] font-black px-2 py-0.5 rounded-full border ' + l.badge}>ACUM</span>
          }

          return (
            <div key={l.num} className={`rounded-2xl p-4 shadow-sm ${cardBorder} ${cardBg} ${isLocked ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ' + (isPassed ? 'bg-emerald-500' : isCurrent ? l.bar : 'bg-[#1a3540]')}>
                  {isPassed
                    ? <CheckCircleIcon className="w-6 h-6 text-white" />
                    : isLocked
                      ? <l.Icon className="w-6 h-6 text-[#a0b8bc]/50" />
                      : <l.IconSolid className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={'font-extrabold text-base ' + (isLocked ? 'text-[#a0b8bc]/40' : isPassed ? 'text-emerald-400' : l.color)}>
                      {l.name}
                    </span>
                    {statusIcon}
                  </div>
                  <div className="text-[11px] text-[#a0b8bc] mt-0.5">
                    {l.min === 0 ? 'Începi de la 0 XP' : ('De la ' + l.min.toLocaleString() + ' XP')}
                    {next && (' până la ' + (next.min - 1).toLocaleString() + ' XP')}
                    {!next && ' · Nivel maxim 👑'}
                  </div>

                  {xpRange && (isCurrent || isPassed) && (
                    <div className="mt-2">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={'h-full rounded-full ' + (isPassed ? 'bg-emerald-400' : l.bar)}
                          style={{ width: (isPassed ? 100 : pct) + '%' }} />
                      </div>
                      {isCurrent && (
                        <div className="text-[10px] text-[#a0b8bc] mt-1">
                          {xpInLevel} / {xpRange} XP ({pct}%) · mai ai <strong className="text-white">{next.min - myXP} XP</strong> până la {next.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div className="text-center text-xs text-[#a0b8bc] py-2">
          Câștigă XP rezolvând probleme sau primind puncte bonus de la profesor
        </div>
      </div>
    </div>
  )
}
