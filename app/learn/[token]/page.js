export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  PuzzlePieceIcon, ClockIcon, LockClosedIcon, BookOpenIcon,
  RocketLaunchIcon, ChevronRightIcon, SparklesIcon,
  CodeBracketIcon, FireIcon, TrophyIcon,
  UserCircleIcon, PencilSquareIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid'
import { PAYMENT_LOCK_MESSAGE } from '@/lib/learning-access'
import { getSystemSettings } from '@/lib/student-limits'
import { buildLevels, getLevel } from '@/lib/levels'
import { getStudentEconomy } from '@/lib/economy'
import { getStudentByToken, getCachedAllProblemPoints, getCachedStudentXpSubs } from '@/lib/student-cache'
import { getBannerStyle } from '@/lib/banner-presets'
import LockedLessonCard from '@/components/student/LockedLessonCard'
import BonusPointsHistory from '@/components/student/BonusPointsHistory'
import LogoutButton from '@/components/student/LogoutButton'
import CooldownTimer from '@/components/student/CooldownTimer'
import LearnLoading from './loading'
import ModuleAccordion from '@/components/learn/ModuleAccordion'

const getModules = unstable_cache(
  () => prisma.learningModule.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true, title: true, description: true, language: true, order: true, grades: true,
      lessons: {
        where: { active: true },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, slug: true, order: true, isFree: true, _count: { select: { problems: true } } },
      },
    },
  }),
  ['learn-modules'],
  { revalidate: 300, tags: ['modules'] }
)

const MODULE_THEMES = [
  { from: 'from-amber-400', to: 'to-orange-500', soft: 'from-amber-50 to-orange-50', ring: 'ring-amber-200' },
  { from: 'from-yellow-400', to: 'to-amber-500', soft: 'from-yellow-50 to-amber-50', ring: 'ring-yellow-200' },
  { from: 'from-rose-400', to: 'to-pink-500', soft: 'from-rose-50 to-pink-50', ring: 'ring-rose-200' },
  { from: 'from-sky-400', to: 'to-blue-500', soft: 'from-sky-50 to-blue-50', ring: 'ring-sky-200' },
  { from: 'from-emerald-400', to: 'to-teal-500', soft: 'from-emerald-50 to-teal-50', ring: 'ring-emerald-200' },
  { from: 'from-violet-400', to: 'to-purple-500', soft: 'from-violet-50 to-purple-50', ring: 'ring-violet-200' },
]

async function DashboardContent({ token }) {
  // ── BATCH 1: student (React cache — deduplicat cu layout) ──
  const student = await getStudentByToken(token)
  if (!student) notFound()
  if (student.active === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md bg-white rounded-2xl shadow-lg border border-rose-200 p-8 text-center">
          <LockClosedIcon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">Cont dezactivat</h1>
          <p className="text-sm text-gray-600 mt-2">Contul tău este momentan dezactivat. Te rugăm să contactezi profesorul pentru reactivare.</p>
        </div>
      </div>
    )
  }

  // ── BATCH 2: TOTUL în paralel ──
  const [latestPayment, modules, accesses, advances, progresses, pendingSubs, xpSubs, recentBonusPoints, revisionNotifs, hiddenModulesRaw, lessonAccessesRaw, groupOverrides, settings, economy, allProblemPoints] = await Promise.all([
    prisma.learningPayment.findFirst({
      where: { studentId: student.id },
      orderBy: { paymentDate: 'desc' },
    }),
    getModules(),
    prisma.moduleAccess.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.moduleAdvance.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.lessonProgress.findMany({
      where: { studentId: student.id },
      select: { lessonId: true, completedAt: true, theoryCompleted: true },
    }),
    prisma.problemSubmission.count({ where: { studentId: student.id, status: 'PENDING' } }),
    getCachedStudentXpSubs(student.id),
    prisma.bonusPoint.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
      include: { addedBy: { select: { name: true } } },
    }),
    prisma.notification.findMany({
      where: { studentId: student.id, type: 'REVISION_REQUEST', read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.moduleHidden.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.lessonAccess.findMany({ where: { studentId: student.id }, select: { lessonId: true } }),
    // Lightweight group-level overrides only (student scalar overrides come from getStudentByToken)
    prisma.groupStudent.findMany({
      where: { studentId: student.id },
      select: {
        group: {
          select: {
            cooldownOverrideMin: true, dailyXpCapOverride: true,
            cooldownDisabled: true, xpCapDisabled: true, active: true,
          },
        },
      },
    }),
    getSystemSettings(),
    getStudentEconomy(student.id),
    // Problem points cached 60s — runs in PARALLEL (no sequential round-trip after batch)
    getCachedAllProblemPoints(),
  ])

  const problemPointsMap = new Map(allProblemPoints.map(p => [p.id, p.points]))

  // Compute effective limits inline (no extra DB call — student already fetched above)
  const activeGroups = groupOverrides.map(gs => gs.group).filter(g => g?.active !== false)
  const effectiveCooldownMin =
    student.cooldownOverrideMin ??
    activeGroups.find(g => g.cooldownOverrideMin != null)?.cooldownOverrideMin ??
    settings.problemCooldownMin
  const effectiveDailyXpCap =
    student.dailyXpCapOverride ??
    activeGroups.find(g => g.dailyXpCapOverride != null)?.dailyXpCapOverride ??
    settings.dailyXpCap
  const cooldownDisabled =
    student.superStudent || student.cooldownDisabled ||
    activeGroups.some(g => g.cooldownDisabled) || !settings.cooldownEnabled
  const xpCapDisabled =
    student.superStudent || student.xpCapDisabled ||
    activeGroups.some(g => g.xpCapDisabled) || !settings.xpCapEnabled
  const studentLimits = {
    cooldownMin: effectiveCooldownMin, dailyXpCap: effectiveDailyXpCap,
    cooldownDisabled, xpCapDisabled,
    lastProblemSolvedAt: student.lastProblemSolvedAt,
    lastSolvedLessonId: student.lastSolvedLessonId,
    superStudent: student.superStudent, settings,
  }

  // Cooldown state
  const cooldownActive = (() => {
    if (!studentLimits || studentLimits.cooldownDisabled || !studentLimits.lastProblemSolvedAt) return false
    const elapsedMs = Date.now() - new Date(studentLimits.lastProblemSolvedAt).getTime()
    return elapsedMs < studentLimits.cooldownMin * 60_000
  })()
  const cooldownLastLessonId = studentLimits?.lastSolvedLessonId || null
  const cooldownRemainingMs = cooldownActive
    ? studentLimits.cooldownMin * 60_000 - (Date.now() - new Date(studentLimits.lastProblemSolvedAt).getTime())
    : 0
  const cooldownEndsAt = cooldownActive ? Date.now() + cooldownRemainingMs : 0

  const accessSet = new Set(accesses.map(a => a.moduleId))
  const advanceSet = new Set(advances.map(a => a.moduleId))
  const progressMap = new Map(progresses.map(p => [p.lessonId, p]))
  const hiddenModuleIds = new Set(hiddenModulesRaw.map(h => h.moduleId))
  const visibleModules = modules.filter(m => {
    if (hiddenModuleIds.has(m.id)) return false
    // Filtrare dupa clasa elevului
    if (!m.grades || m.grades.length === 0) return true // fara restrictie
    if (!student.grade) return true // elevul fara clasa vede tot
    return m.grades.includes(student.grade)
  })
  const lessonAccessSet = new Set(lessonAccessesRaw.map(a => a.lessonId))

  const paymentDaysLeft = latestPayment
    ? Math.ceil((new Date(latestPayment.expiresAt).getTime() - Date.now()) / 86400000)
    : null
  const paymentExpired = paymentDaysLeft !== null && paymentDaysLeft < 0
  const paymentExpiringSoon = paymentDaysLeft !== null && paymentDaysLeft >= 0 && paymentDaysLeft <= 3
  const subscriptionActive = paymentDaysLeft !== null && paymentDaysLeft >= 0
  const noPayment = !latestPayment
  const showPaymentLock = !student.superStudent && (paymentExpired || noPayment)

  const hasAnyManualAccess = accessSet.size > 0 || lessonAccessSet.size > 0
  const canAccessRandom = student.superStudent || subscriptionActive || hasAnyManualAccess

  const totalLessons = visibleModules.reduce((s, m) => s + m.lessons.length, 0)
  const completedLessons = progresses.filter(p => p.completedAt).length
  const globalPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // XP & Level — păstrează doar cel mai bun grade per (studentId, problemId)
  const bestPerProblem = new Map()
  for (const sub of xpSubs) {
    const cur = bestPerProblem.get(sub.problemId)
    if (!cur || (sub.grade ?? 0) > cur.grade) {
      bestPerProblem.set(sub.problemId, { grade: sub.grade ?? 0, points: problemPointsMap.get(sub.problemId) ?? 10 })
    }
  }
  const submissionXP = [...bestPerProblem.values()].reduce(
    (s, b) => s + Math.round(b.points * (b.grade / 100)), 0
  )

  // Filtrează cererile de refacere care deja au fost rezolvate (≥60p) — și marchează-le citite
  const visibleRevisionNotifs = []
  const resolvedNotifIds = []
  for (const n of revisionNotifs) {
    const pid = n.data?.problemId
    const best = pid ? bestPerProblem.get(pid) : null
    if (best && best.grade >= 60) {
      resolvedNotifIds.push(n.id)
    } else {
      visibleRevisionNotifs.push(n)
    }
  }
  if (resolvedNotifIds.length > 0) {
    // fire-and-forget; nu blocăm randarea
    prisma.notification.updateMany({
      where: { id: { in: resolvedNotifIds } },
      data: { read: true },
    }).catch(() => {})
  }
  const bonusXP = recentBonusPoints.reduce((s, bp) => s + bp.points, 0)
  const totalXP = submissionXP + bonusXP
  const LEVELS = buildLevels(settings.levelCurve, settings.levelNames)
  const currentLevel = getLevel(LEVELS, totalXP)
  const nextLevel = LEVELS[currentLevel.num] ?? null
  const xpIntoLevel = totalXP - currentLevel.min
  const xpNeeded = nextLevel ? nextLevel.min - currentLevel.min : 1
  const levelPct = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100

  return (
    <div className="flex bg-[#f0fafb] overflow-hidden" style={{ height: 'calc(100vh - env(safe-area-inset-top))' }}>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 text-white overflow-y-auto" style={{background:'linear-gradient(to bottom, #0c1a1d, #0f2127, #0c1a1d)'}}>
        <div className="p-5 space-y-4 flex-1">

          {/* Profile */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
              <SparklesIcon className="w-3 h-3 text-yellow-300" /> Spatiul tau
            </div>
            <h1 className="text-xl font-extrabold leading-tight">
              Salut, <span className="olla-me-name text-[#f8b316]">{student.fullName.split(' ')[0]}</span>!
            </h1>
            <p className="text-white/50 text-xs mt-0.5">{student.fullName}</p>
            {(() => {
              const equippedBanner = student.equipped?.find(e => e.cosmetic?.type === 'PROFILE_BANNER')
              const bannerStyle = getBannerStyle(equippedBanner?.cosmetic?.name)
              if (!bannerStyle) return null
              return (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-4 w-20 rounded-full shadow-inner opacity-90" style={bannerStyle} />
                  <span className="text-[10px] text-white/50 truncate">{equippedBanner.cosmetic.name}</span>
                </div>
              )
            })()}
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 100 100" className="w-16 h-16 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#fde047" strokeWidth="10"
                  strokeDasharray={`${globalPct * 2.513} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold">{globalPct}%</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Progres global</div>
              <div className="text-2xl font-extrabold">{completedLessons}<span className="text-white/40 text-base font-normal">/{totalLessons}</span></div>
              <div className="text-[10px] text-white/40">lectii completate</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-xl p-3">
              <BookOpenIcon className="w-4 h-4 text-indigo-300 mb-1" />
              <div className="text-lg font-bold">{modules.length}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Module</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <ClockIcon className="w-4 h-4 text-amber-300 mb-1" />
              <div className="text-lg font-bold">{pendingSubs}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">In asteptare</div>
            </div>
          </div>

          {/* XP & Level */}
          <Link href={`/learn/${token}/levels`} className="block bg-white/10 hover:bg-white/15 rounded-2xl p-4 space-y-2.5 transition active:scale-[0.99]">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${currentLevel.bar}`}>
                <currentLevel.IconSolid className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Nivel {currentLevel.num}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${currentLevel.badge}`}>{currentLevel.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-2xl font-extrabold text-white">{totalXP}</span>
                <span className="text-white/40 text-xs ml-1">XP</span>
              </div>
              {nextLevel && (
                <span className="text-[10px] text-white/40">{nextLevel.min - totalXP} XP → {nextLevel.name}</span>
              )}
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${currentLevel.bar} rounded-full transition-all duration-700`} style={{ width: `${levelPct}%` }} />
            </div>
            <div className="text-[10px] text-white/50 font-semibold pt-0.5">Vezi toate nivelurile →</div>
          </Link>

          {/* Coins / Gems / Streak — Economy */}
          <Link href={`/learn/${token}/shop`} className="block bg-white/10 hover:bg-white/15 rounded-2xl p-3 transition active:scale-[0.99]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Economie</span>
              <span className="text-[10px] font-bold text-amber-300">Shop →</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg p-2 text-amber-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80 flex items-center gap-1"><span>🪙</span></div>
                <div className="text-base font-extrabold leading-none mt-0.5">{economy.coins}</div>
                <div className="text-[8px] font-bold opacity-70 mt-0.5">Coins</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg p-2 text-cyan-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80 flex items-center gap-1"><span>💎</span></div>
                <div className="text-base font-extrabold leading-none mt-0.5">{economy.gems}</div>
                <div className="text-[8px] font-bold opacity-70 mt-0.5">Gems</div>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg p-2 text-rose-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80 flex items-center gap-1"><span>🔥</span></div>
                <div className="text-base font-extrabold leading-none mt-0.5">{economy.streak}</div>
                <div className="text-[8px] font-bold opacity-70 mt-0.5">Streak</div>
              </div>
            </div>
            {economy.streak > 0 && (
              <div className="text-[10px] text-white/60 mt-2 font-semibold">
                ×{(economy.multiplier || 1).toFixed(2)} multiplier · azi {economy.problemsToday}/3
              </div>
            )}
          </Link>

          {/* Subscription status */}
          {latestPayment && (
            <div className={`rounded-2xl p-3 border ${
              paymentExpired ? 'bg-rose-500/20 border-rose-400/40' :
              paymentExpiringSoon ? 'bg-amber-400/20 border-amber-300/40' :
              'bg-emerald-500/15 border-emerald-400/30'
            }`}>
              <div className="flex items-center gap-2">
                <ClockIcon className={`w-4 h-4 ${paymentExpired ? 'text-rose-200' : paymentExpiringSoon ? 'text-amber-200' : 'text-emerald-200'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Abonament</span>
              </div>
              <div className="mt-1 text-sm font-extrabold text-white">
                {paymentExpired
                  ? `Expirat de ${Math.abs(paymentDaysLeft)} zile`
                  : paymentDaysLeft === 0 ? 'Expiră astăzi'
                  : `${paymentDaysLeft} ${paymentDaysLeft === 1 ? 'zi' : 'zile'} rămase`
                }
              </div>
              <div className="text-[10px] text-white/60 mt-0.5">
                {latestPayment.amount} {latestPayment.currency} • până la {new Date(latestPayment.expiresAt).toLocaleDateString('ro-RO')}
              </div>
              {(paymentExpired || paymentExpiringSoon) && (
                <div className="text-[10px] text-white/80 mt-1.5 font-semibold">
                  Contactează profesorul pentru a reînnoi.
                </div>
              )}
            </div>
          )}
          {!latestPayment && (
            <div className="rounded-2xl p-3 bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Abonament</div>
              <div className="text-xs text-white/60 mt-1">Începe perioada de probă. Contactează profesorul pentru abonament.</div>
            </div>
          )}

          {/* Random CTA */}
          <Link href={`/learn/${token}/random`}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition ${
              canAccessRandom
                ? 'bg-[#f8b316] hover:bg-[#e5a310] text-[#0c1a1d]'
                : 'bg-white/5 hover:bg-white/10 border border-[#f8b316]/30 text-white'
            }`}>
            <FireIcon className={`w-4 h-4 shrink-0 ${canAccessRandom ? '' : 'text-[#f8b316]'}`} />
            <div className="flex-1 min-w-0 leading-tight">
              <div>Antrenament</div>
              {!canAccessRandom && (
                <div className="text-[10px] font-semibold text-[#f8b316]/80 animate-pulse">
                  Achită abonament
                </div>
              )}
            </div>
            {!canAccessRandom
              ? <LockClosedIcon className="w-3.5 h-3.5 text-[#f8b316]/70 shrink-0 animate-pulse" />
              : <ChevronRightIcon className="w-4 h-4 shrink-0" />
            }
          </Link>

          {/* Leaderboard link */}
          <Link href={`/learn/${token}/leaderboard`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition">
            <TrophyIcon className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="flex-1">Clasament</span>
            <ChevronRightIcon className="w-4 h-4 shrink-0 text-white/40" />
          </Link>

          {/* Shop link */}
          <Link href={`/learn/${token}/shop`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-fuchsia-600/30 to-pink-600/30 hover:from-fuchsia-600/50 hover:to-pink-600/50 ring-1 ring-fuchsia-400/40 text-white transition shadow-lg shadow-fuchsia-500/20">
            <span className="text-base shrink-0">✨</span>
            <span className="flex-1">Shop & Cufere</span>
            <ChevronRightIcon className="w-4 h-4 shrink-0 text-white/40" />
          </Link>

          {/* AI Stats link */}
          <Link href={`/learn/${token}/ai-stats`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition">
            <SparklesIcon className="w-4 h-4 shrink-0 text-[#30919f]" />
            <span className="flex-1">Olla AI</span>
            <ChevronRightIcon className="w-4 h-4 shrink-0 text-white/40" />
          </Link>

          {/* Profil / Cabinet link */}
          <Link href={`/learn/${token}/profil`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition">
            <UserCircleIcon className="w-4 h-4 shrink-0 text-emerald-300" />
            <span className="flex-1">Cabinetul meu</span>
            <ChevronRightIcon className="w-4 h-4 shrink-0 text-white/40" />
          </Link>

          {/* Deconectare */}
          <LogoutButton className="w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 transition">
            <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Deconectează-te</span>
          </LogoutButton>

          {/* Module nav links */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold px-1 mb-2">Module</p>
            <div className="space-y-0.5">
              {visibleModules.map((m, idx) => {
                const prev = visibleModules[idx - 1]
                const hasAccess = accessSet.has(m.id)
                const unlocked = true // modulele sunt independente
                const doneL = m.lessons.filter(l => progressMap.get(l.id)?.completedAt).length
                const pct2 = m.lessons.length > 0 ? Math.round((doneL / m.lessons.length) * 100) : 0
                return (
                  <a key={m.id} href={`#module-${m.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition group">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      unlocked ? 'bg-white/20 text-white' : 'bg-white/10 text-white/30'
                    }`}>{idx + 1}</div>
                    <span className={`text-sm truncate flex-1 ${unlocked ? 'text-white' : 'text-white/30'}`}>{m.title}</span>
                    {unlocked
                      ? <span className="text-[10px] font-bold text-white/40 shrink-0">{pct2}%</span>
                      : <LockClosedIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    }
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-5 lg:p-6 space-y-4">

          {/* Mobile top bar */}
          <div className="lg:hidden rounded-2xl p-4 text-white" style={{background:'linear-gradient(135deg, #0c1a1d, #0f2127, #136976)'}}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold">
                  Salut, <span className="olla-me-name text-[#f8b316]">{student.fullName.split(' ')[0]}</span>!
                </h1>
                <p className="text-white/60 text-xs">{completedLessons}/{totalLessons} lectii &middot; {globalPct}%</p>
                {(() => {
                  const equippedBanner = student.equipped?.find(e => e.cosmetic?.type === 'PROFILE_BANNER')
                  const bannerStyle = getBannerStyle(equippedBanner?.cosmetic?.name)
                  if (!bannerStyle) return null
                  return <div className="h-3 w-16 rounded-full mt-1 opacity-80" style={bannerStyle} />
                })()}
              </div>
              <Link href={`/learn/${token}/random`}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#f8b316] text-[#0c1a1d] rounded-xl font-bold text-xs shrink-0">
                <FireIcon className="w-4 h-4" /> Antrenament
              </Link>
            </div>

            {/* XP + Leaderboard row (mobile only) */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link href={`/learn/${token}/levels`} className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 transition active:scale-95">
                <div className="flex items-center gap-1 mb-1">
                  <currentLevel.IconSolid className="w-3 h-3 text-white" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Nivel {currentLevel.num}</span>
                </div>
                <div className="text-lg font-extrabold leading-tight">{totalXP} <span className="text-[10px] text-white/40 font-normal">XP</span></div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${currentLevel.bar} rounded-full`} style={{ width: `${levelPct}%` }} />
                </div>
              </Link>
              <Link href={`/learn/${token}/leaderboard`}
                className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 flex items-center gap-2 transition active:scale-95">
                <TrophyIcon className="w-5 h-5 text-amber-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">Clasament</div>
                  <div className="text-sm font-extrabold leading-tight">Vezi top</div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/40 shrink-0" />
              </Link>
            </div>

            {/* Coins/Gems/Streak — mobile */}
            <Link href={`/learn/${token}/shop`} className="mt-2 grid grid-cols-3 gap-2 active:scale-[0.99] transition">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl p-2 text-amber-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">🪙 Coins</div>
                <div className="text-base font-extrabold leading-tight">{economy.coins}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-2 text-cyan-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">💎 Gems</div>
                <div className="text-base font-extrabold leading-tight">{economy.gems}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl p-2 text-rose-950">
                <div className="text-[9px] font-extrabold uppercase tracking-wider opacity-80">🔥 Streak</div>
                <div className="text-base font-extrabold leading-tight">{economy.streak} <span className="text-[9px] font-bold opacity-70">zile</span></div>
              </div>
            </Link>

            {/* Cabinet + Mr. Olla row (mobile) */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link href={`/learn/${token}/profil`}
                className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 flex items-center gap-2 transition active:scale-95">
                <UserCircleIcon className="w-5 h-5 text-emerald-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">Cabinetul meu</div>
                  <div className="text-sm font-extrabold leading-tight">Cursuri, plăți, istoric</div>
                </div>
              </Link>
              <Link href={`/learn/${token}/ai-stats`}
                className="bg-[#30919f]/20 hover:bg-[#30919f]/30 rounded-xl p-2.5 flex items-center gap-2 transition active:scale-95 border border-[#30919f]/30">
                <SparklesIcon className="w-5 h-5 text-[#30919f] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#30919f]/80">Olla AI</div>
                  <div className="text-sm font-extrabold leading-tight text-white">Încercări rămase</div>
                </div>
              </Link>
            </div>

            {/* Deconectare (mobile) */}
            <LogoutButton className="w-full mt-1 rounded-xl p-2.5 flex items-center gap-2 transition active:scale-95 text-white/40 hover:text-rose-300 hover:bg-rose-500/10">
              <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[9px] font-bold uppercase tracking-wider text-white/40">Cont</div>
                <div className="text-sm font-extrabold leading-tight">Deconectează-te</div>
              </div>
            </LogoutButton>
          </div>

          {pendingSubs > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm text-slate-700">
                Ai <strong>{pendingSubs}</strong> {pendingSubs === 1 ? 'problema in asteptare' : 'probleme in asteptare'} la profesor.
              </p>
            </div>
          )}

          {/* Revision request notifications */}
          {visibleRevisionNotifs.length > 0 && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <PencilSquareIcon className="w-5 h-5 text-rose-600 shrink-0" />
                <h3 className="font-bold text-rose-600 text-sm">
                  {visibleRevisionNotifs.length === 1 ? 'Cerere de refacere' : `${visibleRevisionNotifs.length} cereri de refacere`}
                </h3>
              </div>
              <div className="space-y-1.5">
                {visibleRevisionNotifs.map(n => {
                  const lessonId = n.data?.lessonId
                  const problemId = n.data?.problemId
                  const lessonTitle = n.data?.lessonTitle
                  const href = lessonId
                    ? `/learn/${token}/lesson/${lessonId}${problemId ? `?problemId=${problemId}` : ''}`
                    : `/learn/${token}`
                  // curăț emoji-ul din title (e salvat pe server cu 📝)
                  const cleanTitle = (n.title || '').replace(/^[\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D\s]+/u, '').trim() || n.title
                  return (
                    <Link
                      key={n.id}
                      href={href}
                      className="flex items-start gap-2 bg-white hover:bg-rose-100 transition rounded-xl p-2.5 ring-1 ring-rose-200"
                    >
                      <PencilSquareIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{cleanTitle}</div>
                        {lessonTitle && (
                          <div className="text-xs text-rose-400 mt-0.5 inline-flex items-center gap-1">
                            <BookOpenIcon className="w-3 h-3" /> {lessonTitle}
                          </div>
                        )}
                        <div className="text-xs text-rose-300/80 line-clamp-2 mt-0.5">{n.message}</div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                    </Link>
                  )
                })}
              </div>
              <p className="text-[10px] text-rose-400/70">Notificarea dispare automat când reiei problema.</p>
            </div>
          )}

          {/* Bonus points history */}
          {recentBonusPoints.length > 0 && (
            <BonusPointsHistory bonusPoints={recentBonusPoints} />
          )}

          {/* Payment lock banner */}
          {showPaymentLock && (
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <LockClosedIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-lg leading-tight">
                    {paymentExpired
                      ? `Abonamentul a expirat de ${Math.abs(paymentDaysLeft)} ${Math.abs(paymentDaysLeft) === 1 ? 'zi' : 'zile'}`
                      : 'Niciun abonament activ'
                    }
                  </h3>
                  <p className="text-white/90 text-sm mt-1">
                    {PAYMENT_LOCK_MESSAGE}
                  </p>
                  <p className="text-white/70 text-xs mt-2">
                    Poți continua doar lecțiile <strong>gratuite</strong> (badge „Gratis”). Antrenamentul aleator este dezactivat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Module cards */}
          {visibleModules.map((m, idx) => {
            const prev = visibleModules[idx - 1]
            const hasFullAccess = accessSet.has(m.id)
            const unlocked = true // modulele sunt independente
            const advanceGranted = advanceSet.has(m.id)
            const totalL = m.lessons.length
            const doneL = m.lessons.filter(l => progressMap.get(l.id)?.completedAt).length
            const pct = totalL > 0 ? Math.round((doneL / totalL) * 100) : 0
            const theme = MODULE_THEMES[idx % MODULE_THEMES.length]

            // Auto-open dacă studentul are progres sau e primul modul
            const defaultOpen = idx === 0 || doneL > 0

            const headerJSX = (
              <div className="bg-white rounded-t-2xl overflow-hidden">
                {/* Thick accent bar */}
                <div className={`h-2 bg-gradient-to-r ${theme.from} ${theme.to}`} />
                {/* Header body */}
                <div className="px-5 py-5 flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center shadow-lg shrink-0`}>
                    {unlocked
                      ? <CodeBracketIcon className="w-7 h-7 text-white drop-shadow" />
                      : <LockClosedIcon className="w-7 h-7 text-white drop-shadow" />
                    }
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-sm`}>Modul {idx + 1}</span>
                      {m.language && <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-slate-900 text-white rounded-full">{m.language}</span>}
                      {!unlocked && <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-slate-500 text-white rounded-full"><LockClosedIcon className="w-3 h-3" /> Blocat</span>}
                      {hasFullAccess && unlocked && <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500 text-white rounded-full"><CheckSolid className="w-3 h-3" /> Acces complet</span>}
                      {advanceGranted && <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-purple-600 text-white rounded-full"><RocketLaunchIcon className="w-3 h-3" /> Advance</span>}
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{m.title}</h2>
                    {m.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{m.description}</p>}
                    {/* Inline progress bar */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${theme.from} ${theme.to} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-[#a0b8bc]">{doneL}/{totalL} lecții</span>
                    </div>
                  </div>
                  {/* % badge */}
                  <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center">
                      <div className={`text-2xl font-black bg-gradient-to-br ${theme.from} ${theme.to} bg-clip-text text-transparent leading-none`}>{pct}%</div>
                      <div className="text-[9px] font-bold text-[#a0b8bc] uppercase tracking-wider mt-0.5">gata</div>
                    </div>
                  </div>
                </div>
              </div>
            )

            const progressBarJSX = null

            return (
              <div key={m.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden ring-1 ${unlocked ? 'ring-teal-200' : 'ring-teal-100 opacity-70'}`}>
                <ModuleAccordion
                  moduleId={m.id}
                  defaultOpen={defaultOpen}
                  header={headerJSX}
                  progressBar={progressBarJSX}
                >
                  {/* Lessons grid */}
                  <div className="p-4 pt-3 bg-slate-50">
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {m.lessons.map((l, li) => {
                        // În interiorul modulului, lecțiile sunt secvențiale
                        const prevDone = li === 0 || !!progressMap.get(m.lessons[li - 1].id)?.completedAt
                        const grantedLesson = lessonAccessSet.has(l.id)
                        const accessible = student.superStudent
                          ? true
                          : grantedLesson
                            ? true
                            : (subscriptionActive || hasFullAccess || l.isFree) && prevDone
                        const prog = progressMap.get(l.id)
                        const done = !!prog?.completedAt
                        const started = !!prog?.theoryCompleted && !done
                        const onCooldown = cooldownActive && accessible && !done && l.id !== cooldownLastLessonId && !grantedLesson && !l.isFree

                        const numCls = done
                          ? `bg-gradient-to-br ${theme.from} ${theme.to} text-white shadow-sm`
                          : onCooldown ? 'bg-slate-100 text-slate-400'
                          : started ? 'bg-[#30919f] text-white shadow-sm'
                          : accessible ? 'bg-teal-50 text-[#136976] font-bold'
                          : 'bg-slate-100 text-slate-300'

                        const cardCls = !accessible
                          ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-55'
                          : onCooldown
                            ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-70'
                            : done
                              ? `border-teal-200 bg-white hover:shadow-md hover:border-teal-300`
                              : started
                                ? 'border-[#30919f]/40 bg-teal-50 hover:shadow-md hover:border-[#30919f]/60'
                                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'

                        const inner = (
                          <>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${numCls}`}>
                              {done ? <CheckSolid className="w-5 h-5" /> : onCooldown ? (
                                <CooldownTimer endsAt={cooldownEndsAt} compact />
                              ) : <span>{li + 1}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm text-slate-800 leading-snug block truncate">{l.title}</span>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {l.isFree && <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">Gratis</span>}
                                {started && !done && !onCooldown && <span className="text-[10px] font-extrabold px-2 py-0.5 bg-teal-100 text-[#136976] rounded-full uppercase tracking-wider">În curs</span>}
                                {!accessible && <LockClosedIcon className="w-3 h-3 text-slate-300" />}
                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                  <PuzzlePieceIcon className="w-3 h-3" />
                                  {l._count.problems} {l._count.problems === 1 ? 'prob.' : 'prob.'}
                                </span>
                              </div>
                            </div>
                            {accessible && !onCooldown && (
                              done
                                ? <CheckSolid className="w-4 h-4 shrink-0 text-[#30919f]" />
                                : <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-[#30919f] transition" />
                            )}
                          </>
                        )

                        const lockReason = !prevDone ? 'module' : 'payment'

                        return accessible && !onCooldown ? (
                          <Link key={l.id} href={`/learn/${token}/lesson/${l.id}`}
                            className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${cardCls}`}>
                            {inner}
                          </Link>
                        ) : onCooldown ? (
                          <div key={l.id} className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all ${cardCls}`}>
                            {inner}
                          </div>
                        ) : (
                          <LockedLessonCard key={l.id} reason={lockReason}>
                            {inner}
                          </LockedLessonCard>
                        )
                      })}
                      {m.lessons.length === 0 && (
                        <p className="sm:col-span-2 xl:col-span-3 text-sm text-slate-400 text-center py-6">
                          Nicio lecție încă.
                        </p>
                      )}
                    </div>
                  </div>
                </ModuleAccordion>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default async function StudentLearnDashboard({ params }) {
  const { token } = await params
  return (
    <Suspense fallback={<LearnLoading />}>
      <DashboardContent token={token} />
    </Suspense>
  )
}
