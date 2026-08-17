// ── Sistem central de limite per-elev ────────────────────────────────────
// Cooldown între probleme + cap zilnic XP + niveluri configurabile.
//
// Ierarhie de rezolvare a limitelor (per elev):
//   1) Override pe ELEV (cel mai specific)
//   2) Override pe oricare GRUPĂ în care e elevul
//   3) SystemSettings global
//
// Dacă oriunde este setat "disabled" → limita e dezactivată.
// superStudent ignoră toate limitele.

import prisma from '@/lib/prisma'

export const DEFAULT_LIMITS = {
  problemCooldownMin: 240,
  cooldownEnabled: true,
  dailyXpCap: 500,
  xpCapEnabled: true,
  levelCurve: [0, 100, 300, 700, 1500, 3000, 6000, 12000, 25000, 50000],
  levelNames: ['Novice', 'Explorator', 'Practicant', 'Expert', 'Master', 'Legend', 'Mythic', 'Titan', 'Sage', 'Immortal'],
}

// ── Singleton settings ─────────────────────────────────────────────────────
let _cache = null
let _cacheAt = 0
const CACHE_TTL = 30 * 1000 // 30s

export async function getSystemSettings({ fresh = false } = {}) {
  if (!fresh && _cache && Date.now() - _cacheAt < CACHE_TTL) return _cache
  let s = await prisma.systemSettings.findFirst()
  if (!s) {
    s = await prisma.systemSettings.create({ data: {} })
  }
  _cache = { ...DEFAULT_LIMITS, ...s }
  _cacheAt = Date.now()
  return _cache
}

export function invalidateSettingsCache() {
  _cache = null
  _cacheAt = 0
}

// ── Rezoluție efectivă pentru un elev ──────────────────────────────────────
export async function getEffectiveLimits(studentId) {
  const [student, settings] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        superStudent: true,
        cooldownOverrideMin: true,
        dailyXpCapOverride: true,
        cooldownDisabled: true,
        xpCapDisabled: true,
        lastProblemSolvedAt: true,
        lastSolvedLessonId: true,
        groupStudents: {
          select: {
            group: {
              select: {
                id: true,
                cooldownOverrideMin: true,
                dailyXpCapOverride: true,
                cooldownDisabled: true,
                xpCapDisabled: true,
                active: true,
              },
            },
          },
        },
      },
    }),
    getSystemSettings(),
  ])

  if (!student) return null

  const groups = (student.groupStudents || []).map(gs => gs.group).filter(g => g && g.active !== false)

  const cooldownMin =
    student.cooldownOverrideMin ??
    groups.find(g => g.cooldownOverrideMin != null)?.cooldownOverrideMin ??
    settings.problemCooldownMin

  const dailyXpCap =
    student.dailyXpCapOverride ??
    groups.find(g => g.dailyXpCapOverride != null)?.dailyXpCapOverride ??
    settings.dailyXpCap

  const cooldownDisabled =
    student.superStudent ||
    student.cooldownDisabled ||
    groups.some(g => g.cooldownDisabled) ||
    !settings.cooldownEnabled

  const xpCapDisabled =
    student.superStudent ||
    student.xpCapDisabled ||
    groups.some(g => g.xpCapDisabled) ||
    !settings.xpCapEnabled

  return {
    cooldownMin,
    dailyXpCap,
    cooldownDisabled,
    xpCapDisabled,
    lastProblemSolvedAt: student.lastProblemSolvedAt,
    lastSolvedLessonId: student.lastSolvedLessonId,
    superStudent: student.superStudent,
    settings,
  }
}

// ── Cooldown ───────────────────────────────────────────────────────────────
/**
 * Verifică cooldown-ul pentru un elev.
 * @param {string} studentId
 * @param {string|null} lessonId — dacă e furnizat și e aceeași lecție cu ultima rezolvare, cooldown-ul NU se aplică
 */
export async function checkCooldown(studentId, lessonId = null) {
  const limits = await getEffectiveLimits(studentId)
  if (!limits) return { allowed: true }
  if (limits.cooldownDisabled) return { allowed: true, disabled: true }
  if (!limits.lastProblemSolvedAt) return { allowed: true }

  // Cooldown per lecție: dacă elevul e în aceeași lecție în care a rezolvat ultima problemă → liber
  if (lessonId && limits.lastSolvedLessonId && lessonId === limits.lastSolvedLessonId) {
    return { allowed: true, samelesson: true }
  }

  const elapsedMs = Date.now() - new Date(limits.lastProblemSolvedAt).getTime()
  const cooldownMs = limits.cooldownMin * 60_000
  const remainingMs = cooldownMs - elapsedMs
  if (remainingMs <= 0) return { allowed: true }

  return {
    allowed: false,
    reason: 'COOLDOWN',
    cooldownMin: limits.cooldownMin,
    remainingMs,
    remainingMin: Math.ceil(remainingMs / 60_000),
    nextAllowedAt: new Date(Date.now() + remainingMs),
  }
}

// ── XP zilnic ──────────────────────────────────────────────────────────────
export async function getTodayXpEarned(studentId) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const subs = await prisma.problemSubmission.findMany({
    where: {
      studentId,
      status: 'GRADED',
      gradedAt: { gte: start },
    },
    select: {
      grade: true,
      xpAwarded: true,
      problem: { select: { points: true } },
    },
  })

  const bonus = await prisma.bonusPoint.findMany({
    where: { studentId, createdAt: { gte: start } },
    select: { points: true },
  })

  let total = 0
  for (const s of subs) {
    if (s.xpAwarded != null) total += s.xpAwarded
    else if ((s.grade ?? 0) >= 60) total += Math.round((s.problem?.points ?? 10) * (s.grade / 100))
  }
  for (const b of bonus) total += b.points
  return total
}

/** Cât XP poate primi elevul ACUM (max). 0 = a atins capul. */
export async function getRemainingXpToday(studentId) {
  const limits = await getEffectiveLimits(studentId)
  if (!limits || limits.xpCapDisabled) return Infinity
  const today = await getTodayXpEarned(studentId)
  return Math.max(0, limits.dailyXpCap - today)
}

/** Calculează XP-ul efectiv care se va acorda pentru o submisie nouă. */
export async function computeXpAward(studentId, baseXp) {
  const limits = await getEffectiveLimits(studentId)
  if (!limits) return { awarded: baseXp, capped: false }
  if (limits.xpCapDisabled) return { awarded: baseXp, capped: false, disabled: true }

  const today = await getTodayXpEarned(studentId)
  const room = Math.max(0, limits.dailyXpCap - today)
  const awarded = Math.min(baseXp, room)
  return {
    awarded,
    capped: awarded < baseXp,
    todayXp: today,
    cap: limits.dailyXpCap,
    remaining: room - awarded,
  }
}

// ── Niveluri (configurabile) ───────────────────────────────────────────────
export function computeLevel(xp, settings) {
  const curve = settings?.levelCurve?.length ? settings.levelCurve : DEFAULT_LIMITS.levelCurve
  const names = settings?.levelNames?.length ? settings.levelNames : DEFAULT_LIMITS.levelNames
  let lvl = 1
  for (let i = 0; i < curve.length; i++) {
    if (xp >= curve[i]) lvl = i + 1
    else break
  }
  const currentMin = curve[lvl - 1] ?? 0
  const nextMin = curve[lvl] ?? null
  return {
    level: lvl,
    name: names[lvl - 1] || `Nivel ${lvl}`,
    currentMin,
    nextMin,
    xpInLevel: xp - currentMin,
    xpToNext: nextMin != null ? Math.max(0, nextMin - xp) : 0,
    progress: nextMin != null ? Math.min(100, Math.round(((xp - currentMin) / (nextMin - currentMin)) * 100)) : 100,
  }
}

/** Marchează că elevul tocmai a rezolvat o problemă (resetează cooldown) */
export async function markProblemSolved(studentId, lessonId = null) {
  await prisma.student.update({
    where: { id: studentId },
    data: {
      lastProblemSolvedAt: new Date(),
      ...(lessonId ? { lastSolvedLessonId: lessonId } : {}),
    },
  })
}
