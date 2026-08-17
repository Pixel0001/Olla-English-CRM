export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { AI_LIMITS } from '@/lib/ai-grader'
import { getStudentLearningAccess, AI_PAYMENT_LOCK_MESSAGE } from '@/lib/learning-access'
import { ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import MrOllaAvatar from '@/components/learn/MrOllaAvatar'

function timeUntil(date) {
  if (!date) return null
  const diff = new Date(date) - new Date()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m`
  return `${m} minute`
}

function fmtTime(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
}

export default async function AiStatsPage({ params }) {
  const { token } = await params

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, fullName: true, active: true },
  })
  if (!student || student.active === false) notFound()

  const access = await getStudentLearningAccess(student.id)
  const canUseAi = access.isSuper || access.subscriptionActive

  if (!canUseAi) {
    return (
      <div className="min-h-screen bg-[#0c1a1d] text-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex justify-center mb-3">
            <MrOllaAvatar size={48} animated />
          </div>
          <h1 className="text-xl font-extrabold mb-2">Olla AI e blocat</h1>
          <p className="text-sm text-[#a0b8bc] mb-5">{AI_PAYMENT_LOCK_MESSAGE}</p>
          <Link href={`/learn/${token}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#30919f] hover:bg-[#136976] rounded-xl font-bold text-sm transition active:scale-95">
            <ArrowLeftIcon className="w-4 h-4" /> Înapoi la lecții
          </Link>
        </div>
      </div>
    )
  }

  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  const [usedToday, monthRows, oldestToday] = await Promise.all([
    prisma.aiUsage.count({
      where: { studentId: student.id, createdAt: { gte: dayAgo } },
    }),
    prisma.aiUsage.findMany({
      where: { studentId: student.id, createdAt: { gte: startOfMonth } },
      select: { createdAt: true, endpoint: true, costUsd: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.aiUsage.findFirst({
      where: { studentId: student.id, createdAt: { gte: dayAgo } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
  ])

  const dailyLimit   = AI_LIMITS.perStudentDaily
  const monthlyLimit = dailyLimit * daysInMonth
  const usedMonth    = monthRows.length
  const costMonth    = monthRows.reduce((s, r) => s + (r.costUsd || 0), 0)

  const dailyRemaining  = Math.max(0, dailyLimit - usedToday)
  const monthlyRemaining = Math.max(0, monthlyLimit - usedMonth)
  const dailyPct  = Math.min(100, Math.round((usedToday / dailyLimit) * 100))
  const monthlyPct = Math.min(100, Math.round((usedMonth / monthlyLimit) * 100))

  // Cooldown
  const resetAt = oldestToday
    ? new Date(new Date(oldestToday.createdAt).getTime() + 24 * 60 * 60 * 1000)
    : null
  const cooldown = timeUntil(resetAt)
  const resetTime = fmtTime(resetAt)

  // Grafic activitate luna curentă — câte cereri pe zi
  const dailyMap = new Map()
  for (let d = 1; d <= daysInMonth; d++) dailyMap.set(d, 0)
  for (const r of monthRows) {
    const d = new Date(r.createdAt).getDate()
    dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1)
  }
  const days = Array.from(dailyMap.entries()) // [[1,n],[2,n]...]
  const maxDay = Math.max(1, ...days.map(([,n]) => n))

  // Enabled?
  const aiEnabled = process.env.AI_GRADING_ENABLED !== 'false'

  const barColor = (pct) =>
    pct >= 90 ? 'from-red-500 to-rose-600'
    : pct >= 60 ? 'from-amber-400 to-orange-500'
    : 'from-[#30919f] to-[#136976]'

  return (
    <div className="min-h-screen bg-[#0c1a1d] text-white">
      {/* Header */}
      <div
        className="sticky top-0 z-20 bg-[#0c1a1d]/90 backdrop-blur-sm border-b border-[#30919f]/20 flex items-center gap-3 px-4 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <Link href={`/learn/${token}`} className="p-2 hover:bg-white/10 rounded-xl transition">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-9 h-9 rounded-xl bg-white/10 p-0.5">
            <MrOllaAvatar size={32} animated />
          </div>
          <div>
            <div className="font-bold text-sm">Olla AI</div>
            <div className="text-[11px] text-[#a0b8bc]">Utilizarea ta</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        {/* Disabled banner */}
        {!aiEnabled && (
          <div className="bg-red-900/50 border border-red-500/40 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">⚠️</div>
            <div className="font-bold text-red-300">Mr. Olla este temporar offline</div>
            <div className="text-xs text-red-400 mt-1">Profesorul a dezactivat AI. Revino mai târziu!</div>
          </div>
        )}

        {/* Salut */}
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-white/10 p-1">
            <MrOllaAvatar size={40} animated />
          </div>
          <div>
            <div className="font-bold">Salut, {student.fullName?.split(' ')[0]}! 👋</div>
            <div className="text-xs text-[#a0b8bc] mt-0.5">Iată câte verificări AI ai disponibile azi şi în această lună.</div>
          </div>
        </div>

        {/* Card ZI */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[11px] text-[#a0b8bc] font-semibold uppercase tracking-wide">Azi</div>
                <div className="text-4xl font-black mt-1">
                  {dailyRemaining}
                  <span className="text-lg text-[#a0b8bc] font-normal"> / {dailyLimit}</span>
                </div>
                <div className="text-xs text-[#a0b8bc] mt-0.5">verificări rămase azi</div>
              </div>
              <div className={`text-4xl font-black ${dailyPct >= 100 ? 'text-red-400' : dailyPct >= 60 ? 'text-amber-400' : 'text-[#30919f]'}`}>
                {100 - dailyPct}<span className="text-lg text-indigo-300 font-normal">%</span>
              </div>
            </div>

            {/* Bară */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${barColor(dailyPct)} rounded-full transition-all`}
                style={{ width: `${dailyPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#a0b8bc] mt-1">
              <span>{usedToday} folosite</span>
              <span>{dailyRemaining} rămase</span>
            </div>
          </div>

          {/* Cooldown */}
          {dailyRemaining === 0 && cooldown ? (
            <div className="mx-4 mb-4 bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-center">
              <div className="text-red-300 font-bold text-sm">⏳ Limită atinsă!</div>
              <div className="text-xs text-red-400 mt-1">
                Reîncărcarea în <span className="font-bold text-white">{cooldown}</span>
              </div>
              {resetTime && <div className="text-[10px] text-red-400 mt-0.5">aproximativ la ora {resetTime}</div>}
            </div>
          ) : dailyRemaining <= 5 && dailyRemaining > 0 ? (
            <div className="mx-4 mb-4 bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 text-center">
              <div className="text-amber-300 font-bold text-sm">⚠️ Mai ai puțin!</div>
              <div className="text-xs text-amber-400 mt-1">
                Ai doar <span className="font-bold text-white">{dailyRemaining}</span> {dailyRemaining === 1 ? 'verificare' : 'verificări'} rămase azi.
                {cooldown && <> Reîncărcare în <span className="font-bold text-white">{cooldown}</span>.</>}
              </div>
            </div>
          ) : dailyRemaining > 0 ? (
            <div className="mx-4 mb-4 bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-emerald-300 font-bold text-sm">✅ Totul OK!</div>
              <div className="text-xs text-emerald-400 mt-1">
                Ai <span className="font-bold text-white">{dailyRemaining}</span> verificări disponibile azi.
                {resetTime && <> Limita se reîncarcă la ora <span className="font-bold text-white">{resetTime}</span>.</>}
              </div>
            </div>
          ) : null}
        </div>

        {/* Card LUNĂ */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="text-[11px] text-[#a0b8bc] font-semibold uppercase tracking-wide mb-3">Luna aceasta</div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-3xl font-black">
                {monthlyRemaining}
                <span className="text-base text-[#a0b8bc] font-normal"> / {monthlyLimit}</span>
              </div>
              <div className="text-xs text-[#a0b8bc] mt-0.5">verificări rămase în luna {new Date().toLocaleDateString('ro-RO', { month: 'long' })}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${monthlyPct >= 90 ? 'text-red-400' : monthlyPct >= 60 ? 'text-amber-400' : 'text-[#30919f]'}`}>
                {100 - monthlyPct}<span className="text-sm text-indigo-300 font-normal">%</span>
              </div>
              <div className="text-[10px] text-[#a0b8bc]">din buget</div>
            </div>
          </div>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full bg-gradient-to-r ${barColor(monthlyPct)} rounded-full transition-all`}
              style={{ width: `${monthlyPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#a0b8bc]">
            <span>{usedMonth} folosite</span>
            <span>din {monthlyLimit} total</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-lg font-bold">{now.getDate()}</div>
              <div className="text-[10px] text-[#a0b8bc]">ziua din {daysInMonth}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-lg font-bold">{dailyLimit}</div>
              <div className="text-[10px] text-[#a0b8bc]">verificări / zi</div>
            </div>
          </div>
        </div>

        {/* Grafic activitate lunară */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          <div className="text-[11px] text-[#a0b8bc] font-semibold uppercase tracking-wide mb-4">Activitate — {new Date().toLocaleDateString('ro-RO', { month: 'long' })}</div>
          <div className="flex items-end gap-px h-16">
            {days.map(([day, count]) => {
              const h = (count / maxDay) * 100
              const isToday = day === now.getDate()
              return (
                <div key={day} className="flex-1 flex flex-col items-center" title={`${day}: ${count} cereri`}>
                  <div
                    className={`w-full rounded-sm transition ${isToday ? 'bg-[#f8b316]' : count > 0 ? 'bg-[#30919f]' : 'bg-white/10'}`}
                    style={{ height: `${Math.max(count > 0 ? 8 : 2, h)}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[9px] text-[#a0b8bc] mt-1">
            <span>1</span>
            <span className="text-[#f8b316] font-bold">azi ({now.getDate()})</span>
            <span>{daysInMonth}</span>
          </div>
        </div>

        {/* Explicație cum funcționează */}
        <div className="bg-[#0f2127] rounded-2xl border border-[#30919f]/20 p-5 space-y-3">
          <div className="font-bold text-sm text-[#a0b8bc]">Cum funcționează AI-ul?</div>
          <div className="space-y-2 text-xs text-[#a0b8bc]">
            <div className="flex gap-2"><span>🎯</span><span>Ai <strong className="text-white">{dailyLimit} verificări pe zi</strong> la Olla AI pentru notarea codului.</span></div>
            <div className="flex gap-2"><span>💬</span><span>La fiecare problemă poți pune <strong className="text-white">maxim 5 întrebări</strong> pentru clarificări.</span></div>
            <div className="flex gap-2"><span>⏳</span><span>Limita zilnică se reîncarcă automat <strong className="text-white">la 24h</strong> după prima cerere.</span></div>
            <div className="flex gap-2"><span>🤖</span><span>Olla AI <strong className="text-white">detectează</strong> dacă ai copiat codul de pe internet — <strong className="text-red-300">scad puncte!</strong></span></div>
            <div className="flex gap-2"><span>👨‍🏫</span><span>Profesorul poate <strong className="text-white">suprascrie</strong> oricând nota dată de AI.</span></div>
          </div>
        </div>

        {/* Buton înapoi */}
        <Link href={`/learn/${token}`} className="flex items-center justify-center gap-2 w-full py-3 bg-[#30919f] hover:bg-[#136976] rounded-2xl font-bold transition active:scale-95">
          <ArrowLeftIcon className="w-4 h-4" />
          Înapoi la lecții
        </Link>
      </div>
    </div>
  )
}
