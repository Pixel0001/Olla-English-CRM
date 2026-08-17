import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'
import { gradeCode, checkAiQuota, logAiUsage, getStudentAiUsage } from '@/lib/ai-grader'
import { assertAiAccess } from '@/lib/learning-access'
import { checkCooldown, computeXpAward, markProblemSolved } from '@/lib/student-limits'
import { awardEconomy } from '@/lib/economy'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // Vercel — extindem timeout pentru OpenAI

// Penalty pentru cod detectat ca AI: scade din nota finală
const AI_PENALTY = 0 // detectare AI dezactivată — nu mai scădem puncte (prea multe false positives la elevi)

// Limită hard pe input — protecție cost (un cod de 50KB ar costa ~$0.03 doar input)
const MAX_CODE_LENGTH = 5000
const MAX_OUTPUT_LENGTH = 2000

function getIp(req) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * GET — câte cereri AI mai are studentul azi (pentru UI)
 */
export async function GET(req, { params }) {
  const { token } = await params
  if (!token || typeof token !== 'string' || token.length < 10) {
    return NextResponse.json({ error: 'Token invalid' }, { status: 400 })
  }
  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }
  const usage = await getStudentAiUsage(student.id)
  return NextResponse.json(usage)
}

/**
 * POST — trimite cod la AI pentru notare
 * Body: { problemId, lessonId?, code, output?, source? }
 * Răspuns: { submission, aiGrade, aiDetect, usage }
 */
export async function POST(req, { params }) {
  const { token } = await params
  if (!token || typeof token !== 'string' || token.length < 10) {
    return NextResponse.json({ error: 'Token invalid' }, { status: 400 })
  }
  const ip = getIp(req)

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student) return NextResponse.json({ error: 'Token invalid' }, { status: 404 })
  if (student.active === false) return NextResponse.json({ error: 'Cont dezactivat' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { problemId, lessonId, code, output, source = 'lesson' } = body
  if (!problemId || typeof problemId !== 'string') {
    return NextResponse.json({ error: 'problemId invalid' }, { status: 400 })
  }
  if (lessonId && typeof lessonId !== 'string') {
    return NextResponse.json({ error: 'lessonId invalid' }, { status: 400 })
  }
  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'code obligatoriu' }, { status: 400 })
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: `Codul e prea lung (max ${MAX_CODE_LENGTH} caractere)` }, { status: 413 })
  }
  // Trim output la o limită sigură — nu eroare, doar tunde
  const safeOutput = typeof output === 'string' ? output.slice(0, MAX_OUTPUT_LENGTH) : ''

  // 0. PAYWALL — doar abonații pot folosi AI (sau lecții free)
  const aiAccess = await assertAiAccess(student.id, { lessonId })
  if (!aiAccess.allowed) {
    return NextResponse.json({
      error: aiAccess.message || 'Acces AI blocat',
      locked: true,
      reason: aiAccess.reason,
    }, { status: 403 })
  }

  // 1. Quota check
  const quota = await checkAiQuota({ studentId: student.id, ip })
  if (!quota.allowed) {
    const messages = {
      AI_DISABLED: 'Profesorul AI este temporar dezactivat. Cere ajutor profesorului tău.',
      STUDENT_LIMIT: `Ai folosit deja toate cele ${quota.limit} verificări AI pentru azi. Încearcă mâine!`,
      IP_LIMIT: 'Prea multe cereri într-un timp scurt. Așteaptă 1 oră.',
      GLOBAL_BUDGET: 'Bugetul zilnic AI a fost atins. Încearcă mâine.',
    }
    return NextResponse.json({
      error: messages[quota.reason] || 'Limită atinsă',
      quota,
    }, { status: 429 })
  }

  // 2. Încarcă problema
  const problem = await prisma.problem.findUnique({ where: { id: problemId } })
  if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })
  if (problem.type !== 'CODING') {
    return NextResponse.json({ error: 'AI grading e doar pentru probleme CODING' }, { status: 400 })
  }
  // Securitate: dacă problema aparține unei lecții, lessonId trebuie să corespundă
  if (problem.lessonId && lessonId && problem.lessonId !== lessonId) {
    return NextResponse.json({ error: 'Lecția nu corespunde problemei' }, { status: 400 })
  }

  // 3. Verifică submisii existente — nu permitem dacă e blocată sau notată > 60 (deja corect)
  const prevSubs = await prisma.problemSubmission.findMany({
    where: { studentId: student.id, problemId, lessonId: lessonId || null },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  const alreadyLocked = prevSubs.some(s => s.locked)
  const alreadyCorrect = prevSubs.some(s => s.status === 'GRADED' && (s.grade ?? 0) >= 100)
  if (alreadyLocked || alreadyCorrect) {
    return NextResponse.json({ error: 'Problemă deja rezolvată sau blocată' }, { status: 400 })
  }

  // ── COOLDOWN: doar la PRIMA tentativă a unei probleme noi (nu pe retry-uri)
  // Cooldown per lecție: problemele din aceeași lecție nu sunt blocate între ele
  // La antrenament (random) sau lecții gratuite cooldown-ul nu se aplică deloc
  const lessonFree = lessonId ? (await prisma.lesson.findUnique({ where: { id: lessonId }, select: { isFree: true } }))?.isFree : false
  const lessonGranted = lessonId ? !!(await prisma.lessonAccess.findFirst({ where: { studentId: student.id, lessonId } })) : false
  if (prevSubs.length === 0 && source !== 'random' && !lessonFree && !lessonGranted) {
    const cd = await checkCooldown(student.id, lessonId || null)
    if (!cd.allowed) {
      return NextResponse.json({
        error: `Așteaptă ${cd.remainingMin} min până la următoarea problemă.`,
        cooldown: true,
        remainingMin: cd.remainingMin,
        remainingMs: cd.remainingMs,
        cooldownMin: cd.cooldownMin,
        nextAllowedAt: cd.nextAllowedAt,
      }, { status: 429 })
    }
  }

  // 4. Cere AI: doar grading (detectare AI/plagiat dezactivată — prea multe false positives)
  let aiGrade
  const aiDetect = { isAi: false, score: 0, reason: '', tokensIn: 0, tokensOut: 0, costUsd: 0 }
  try {
    aiGrade = await gradeCode({
      problemTitle: problem.title,
      problemDescription: problem.description,
      expectedSolution: problem.correctAnswer || '',
      studentCode: code,
      language: problem.language || 'python',
      studentOutput: safeOutput,
    })
  } catch (e) {
    await logAiUsage({
      studentId: student.id, ip, endpoint: 'grade-code',
      tokensIn: 0, tokensOut: 0, success: false, errorMsg: e?.message,
    })
    console.error('[ai-grade] OpenAI error:', e)
    return NextResponse.json({
      error: 'Profesorul AI nu poate răspunde acum. Încearcă din nou peste câteva secunde.',
    }, { status: 503 })
  }

  // 5. Nicio penalizare AI — folosim doar nota dată de gradeCode
  const finalGrade = aiGrade.grade

  // 6. Loghează usage
  await logAiUsage({
    studentId: student.id, ip, endpoint: 'grade-code',
    tokensIn: (aiGrade.tokensIn || 0) + (aiDetect.tokensIn || 0),
    tokensOut: (aiGrade.tokensOut || 0) + (aiDetect.tokensOut || 0),
    success: true,
  })

  // 7. Salvează ca ProblemSubmission
  // 2 încercări: la prima (sub 60) NU blocăm, la a doua sau dacă a trecut → blocăm
  const attemptNumber = prevSubs.length + 1
  const MAX_AI_ATTEMPTS = 3
  const passed = finalGrade >= 60
  const perfect = finalGrade >= 100
  const isLastAttempt = attemptNumber >= MAX_AI_ATTEMPTS
  const shouldLock = perfect || isLastAttempt || aiDetect.isAi

  // ── XP cap zilnic (acordat o singură dată — la prima trecere)
  const alreadyPassed = prevSubs.some(s => s.autoCorrect === true)
  let xpAwarded = null
  let xpInfo = null
  if (passed && !alreadyPassed) {
    const baseXp = Math.round((problem.points ?? 10) * (finalGrade / 100))
    const award = await computeXpAward(student.id, baseXp)
    xpAwarded = award.awarded
    xpInfo = award
  }

  const sub = await prisma.problemSubmission.create({
    data: {
      studentId: student.id,
      problemId,
      lessonId: lessonId || null,
      answer: null,
      code,
      source,
      difficulty: problem.difficulty,
      autoCorrect: passed,
      status: 'GRADED',
      grade: finalGrade,
      gradedAt: new Date(),
      attemptNumber,
      locked: shouldLock, // prima încercare ratată = nu blocăm, mai poate încerca
      aiGraded: true,
      aiReasoning: aiGrade.reasoning,
      aiRubric: aiGrade.rubric,
      aiSuspectedAi: aiDetect.isAi,
      aiSuspicionScore: aiDetect.score,
      aiTokensIn: (aiGrade.tokensIn || 0) + (aiDetect.tokensIn || 0),
      aiTokensOut: (aiGrade.tokensOut || 0) + (aiDetect.tokensOut || 0),
      feedback: aiGrade.reasoning,
      xpAwarded,
    },
  })

  // Invalidate cached xpSubs — dashboard picks up new grade on next load
  revalidateTag('submissions')

  // ── Marchează cooldown după o rezolvare reușită
  if (passed) {
    await markProblemSolved(student.id, lessonId || null)
  }

  // ── Gamification: Coins/Gems + Streak (problemele de coding au gems garantate)
  // acordat o singură dată — doar la prima trecere (alreadyPassed = false)
  const economy = (passed && !alreadyPassed) ? await awardEconomy({
    studentId: student.id,
    baseXp: xpAwarded || 0,
    problem: { type: 'CODING', points: problem.points },
    grade: finalGrade,
    passed,
  }) : null

  const usage = await getStudentAiUsage(student.id)

  return NextResponse.json({
    submission: sub,
    aiGrade: { ...aiGrade, finalGrade },
    aiDetect,
    aiPenaltyApplied: aiDetect.isAi ? AI_PENALTY : 0,
    usage,
    xpAwarded,
    xpInfo,
    economy,
  })
}
