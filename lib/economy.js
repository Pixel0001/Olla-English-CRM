// lib/economy.js
// Sistemul economic + streak — folosit din submit / ai-grade.
//
// Reguli:
//   • Coins = mirror al XP-ului acordat (1:1).
//   • Gems = se acordă DOAR la probleme de tip CODING.
//   • Streak: minim 3 probleme/zi pentru a păstra streak-ul.
//   • Streak multiplier crește XP & Coins câștigate.

import prisma from '@/lib/prisma'

// Câte gems se acordă pentru o problemă de coding rezolvată cu succes.
// Scalează cu nota și cu rarity-ul implicit al problemei (folosim points ca proxy).
function gemsForCoding(points, grade) {
  const base = Math.max(1, Math.round((points || 10) / 5))   // 10p → 2 gems
  const scaled = Math.round(base * (grade / 100))
  return Math.max(1, scaled)
}

// Multiplicator în funcție de streak
function multiplierForStreak(days) {
  if (days >= 100) return 2.0
  if (days >= 30)  return 1.5
  if (days >= 7)   return 1.25
  if (days >= 3)   return 1.1
  return 1.0
}

// Returnează cheia "YYYY-MM-DD" în UTC pentru o dată
function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

/**
 * Acordă XP/Coins/Gems pentru o submisie reușită + actualizează streak-ul.
 *
 * @param {Object}  args
 * @param {string}  args.studentId
 * @param {number}  args.baseXp           — XP acordat deja (după cap-ul zilnic)
 * @param {Object}  args.problem          — { type, points }
 * @param {number}  args.grade            — 0-100
 * @param {boolean} args.passed           — grade >= 60
 *
 * @returns { coins, gems, streak, multiplier, milestoneHit }
 */
export async function awardEconomy({ studentId, baseXp, problem, grade, passed }) {
  if (!studentId) return { coins: 0, gems: 0, streak: 0, multiplier: 1, milestoneHit: null }

  // ── 1. Streak update (înainte de calcule, ca multiplicatorul să fie corect)
  const today = dayKey()
  const streak = await prisma.studentStreak.upsert({
    where: { studentId },
    update: {},
    create: { studentId, todayDay: today },
  })

  let { current, best, lastActiveDay, problemsToday, todayDay, freezesAvailable, freezesUsed, milestones } = streak
  milestones = milestones || []

  // Reset contor dacă s-a schimbat ziua
  if (todayDay !== today) {
    // Verifică dacă ziua precedentă a fost "validă" (≥3 probleme).
    // Dacă a fost ieri și valid → streak continuă, altfel se sparge (cu freeze opțional).
    if (lastActiveDay) {
      const yesterday = dayKey(new Date(Date.now() - 86400000))
      if (lastActiveDay !== yesterday) {
        // Streak rupt — încearcă freeze
        if (freezesAvailable > 0) {
          freezesAvailable -= 1
          freezesUsed += 1
        } else {
          current = 0
        }
      }
    }
    problemsToday = 0
    todayDay = today
  }

  // Doar problemele rezolvate (passed) contează pentru streak
  if (passed) {
    problemsToday += 1
    // La a 3-a problemă din zi, marcăm ziua ca "valid" și incrementăm streak-ul
    if (problemsToday === 3) {
      if (lastActiveDay !== today) {
        const yesterday = dayKey(new Date(Date.now() - 86400000))
        current = (lastActiveDay === yesterday) ? current + 1 : 1
        if (current > best) best = current
        lastActiveDay = today
      }
    }
  }

  const multiplier = multiplierForStreak(current)

  // Detectează milestone nou atins
  let milestoneHit = null
  for (const m of [7, 30, 100]) {
    if (current >= m && !milestones.includes(String(m))) {
      milestones.push(String(m))
      milestoneHit = m
      // Bonus în gems la milestone
      // (acordat ca parte din awardEconomy, vezi mai jos)
    }
  }

  // ── 2. Calcul recompense
  // XP-ul a fost deja acordat în submit (capped). Coins = XP * multiplicator.
  const multipliedXp = passed ? Math.round(baseXp * multiplier) : 0
  const coins = multipliedXp
  let gems = 0
  if (passed && problem?.type === 'CODING') {
    gems = Math.round(gemsForCoding(problem.points, grade) * multiplier)
  }

  // Bonus milestone
  let bonusGems = 0
  if (milestoneHit === 7)   bonusGems = 25
  if (milestoneHit === 30)  bonusGems = 100
  if (milestoneHit === 100) bonusGems = 500
  gems += bonusGems

  // ── 3. Persistență
  await prisma.$transaction([
    prisma.studentStreak.update({
      where: { studentId },
      data: {
        current, best, lastActiveDay, problemsToday, todayDay,
        freezesAvailable, freezesUsed, multiplier, milestones,
      },
    }),
    prisma.studentEconomy.upsert({
      where: { studentId },
      update: {
        coins:            { increment: coins },
        gems:             { increment: gems },
        totalCoinsEarned: { increment: coins },
        totalGemsEarned:  { increment: gems },
      },
      create: {
        studentId,
        coins, gems,
        totalCoinsEarned: coins,
        totalGemsEarned:  gems,
      },
    }),
  ])

  // ── 4. Update leaderboard events active
  if (passed) {
    await updateLeaderboards({ studentId, baseXp: multipliedXp, gems, coins, isCoding: problem?.type === 'CODING' })
  }

  return { coins, gems, streak: current, multiplier, milestoneHit, bonusGems }
}

async function updateLeaderboards({ studentId, baseXp, gems, coins, isCoding }) {
  const now = new Date()
  const events = await prisma.leaderboardEvent.findMany({
    where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } },
    select: { id: true, type: true },
  })
  if (!events.length) return

  for (const ev of events) {
    let inc = 0
    if (ev.type === 'XP')     inc = baseXp
    if (ev.type === 'COINS')  inc = coins
    if (ev.type === 'GEMS')   inc = gems
    if (ev.type === 'CODING') inc = isCoding ? baseXp : 0
    if (inc <= 0) continue

    await prisma.leaderboardEntry.upsert({
      where: { eventId_studentId: { eventId: ev.id, studentId } },
      update: { score: { increment: inc } },
      create: { eventId: ev.id, studentId, score: inc },
    })
  }
}

// Spend currency (cu validare). Returnează { ok, balance } sau aruncă.
export async function spendCurrency({ studentId, currency, amount }) {
  if (amount <= 0) throw new Error('Sumă invalidă')
  const econ = await prisma.studentEconomy.upsert({
    where: { studentId },
    update: {},
    create: { studentId },
  })
  const field = currency === 'GEMS' ? 'gems' : 'coins'
  if ((econ[field] || 0) < amount) {
    return { ok: false, balance: econ[field] }
  }
  const updated = await prisma.studentEconomy.update({
    where: { studentId },
    data: {
      [field]: { decrement: amount },
      [currency === 'GEMS' ? 'totalGemsSpent' : 'totalCoinsSpent']: { increment: amount },
    },
  })
  return { ok: true, balance: updated[field] }
}

export async function getStudentEconomy(studentId) {
  const [econ, streak] = await Promise.all([
    prisma.studentEconomy.findUnique({ where: { studentId } }),
    prisma.studentStreak.findUnique({ where: { studentId } }),
  ])
  return {
    coins: econ?.coins || 0,
    gems: econ?.gems || 0,
    totalCoinsEarned: econ?.totalCoinsEarned || 0,
    totalGemsEarned:  econ?.totalGemsEarned || 0,
    streak: streak?.current || 0,
    bestStreak: streak?.best || 0,
    multiplier: streak?.multiplier || 1.0,
    freezesAvailable: streak?.freezesAvailable || 0,
    problemsToday: streak?.problemsToday || 0,
    todayDay: streak?.todayDay || null,
  }
}
