import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { askMrOlla, checkAiQuota, logAiUsage, getStudentAiUsage } from '@/lib/ai-grader'
import { assertAiAccess } from '@/lib/learning-access'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_CHAT_PER_PROBLEM = 5 // max 5 perechi întrebare/răspuns per problemă
const MAX_QUESTION_LENGTH = 500
const MAX_CODE_CONTEXT = 5000

function getIp(req) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/**
 * GET ?problemId=xxx → istoricul + counter rămas
 */
export async function GET(req, { params }) {
  const { token } = await params
  if (!token || typeof token !== 'string' || token.length < 10) {
    return NextResponse.json({ error: 'Token invalid' }, { status: 400 })
  }
  const url = new URL(req.url)
  const problemId = url.searchParams.get('problemId')
  if (!problemId || typeof problemId !== 'string') {
    return NextResponse.json({ error: 'problemId obligatoriu' }, { status: 400 })
  }

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })

  const messages = await prisma.aiChatMessage.findMany({
    where: { studentId: student.id, problemId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true, createdAt: true },
  })
  const userMsgCount = messages.filter(m => m.role === 'user').length
  return NextResponse.json({
    messages,
    used: userMsgCount,
    limit: MAX_CHAT_PER_PROBLEM,
    remaining: Math.max(0, MAX_CHAT_PER_PROBLEM - userMsgCount),
  })
}

/**
 * POST { problemId, lessonId?, question, code? }
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
  const { problemId, lessonId, question, code = '' } = body
  if (!problemId || typeof problemId !== 'string' || !question || typeof question !== 'string' || !question.trim()) {
    return NextResponse.json({ error: 'problemId și question sunt obligatorii' }, { status: 400 })
  }
  if (lessonId && typeof lessonId !== 'string') {
    return NextResponse.json({ error: 'lessonId invalid' }, { status: 400 })
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: `Întrebarea e prea lungă (max ${MAX_QUESTION_LENGTH} caractere)` }, { status: 400 })
  }
  const safeCode = typeof code === 'string' ? code.slice(0, MAX_CODE_CONTEXT) : ''

  // 0. PAYWALL
  const aiAccess = await assertAiAccess(student.id, { lessonId })
  if (!aiAccess.allowed) {
    return NextResponse.json({
      error: aiAccess.message || 'Acces AI blocat',
      locked: true,
      reason: aiAccess.reason,
    }, { status: 403 })
  }

  // Limit per problem
  const userMsgCount = await prisma.aiChatMessage.count({
    where: { studentId: student.id, problemId, role: 'user' },
  })
  if (userMsgCount >= MAX_CHAT_PER_PROBLEM) {
    return NextResponse.json({
      error: `Ai folosit toate cele ${MAX_CHAT_PER_PROBLEM} întrebări pentru această problemă. Încearcă să o rezolvi singur acum! 💪`,
    }, { status: 429 })
  }

  // Quota globală AI (acelaşi tipar ca grade-code)
  const quota = await checkAiQuota({ studentId: student.id, ip })
  if (!quota.allowed) {
    const messages = {
      AI_DISABLED: 'Mr. Olla e temporar offline.',
      STUDENT_LIMIT: `Ai folosit toate cele ${quota.limit} cereri AI pentru azi. Încearcă mâine!`,
      IP_LIMIT: 'Prea multe cereri într-un timp scurt. Așteaptă puțin.',
      GLOBAL_BUDGET: 'Bugetul AI zilnic atins. Încearcă mâine.',
    }
    return NextResponse.json({ error: messages[quota.reason] || 'Limită atinsă', quota }, { status: 429 })
  }

  // Încarcă problema
  const problem = await prisma.problem.findUnique({ where: { id: problemId } })
  if (!problem) return NextResponse.json({ error: 'Problemă inexistentă' }, { status: 404 })

  // Istoricul (pentru context)
  const history = await prisma.aiChatMessage.findMany({
    where: { studentId: student.id, problemId },
    orderBy: { createdAt: 'asc' },
    take: 20,
    select: { role: true, content: true },
  })

  // Salvează întrebarea elevului
  const userMsg = await prisma.aiChatMessage.create({
    data: {
      studentId: student.id, problemId, lessonId: lessonId || null,
      role: 'user', content: question.trim(),
    },
  })

  // Cere răspuns
  let answer
  try {
    answer = await askMrOlla({
      problemTitle: problem.title,
      problemDescription: problem.description,
      language: problem.language || 'python',
      studentCode: safeCode,
      history,
      question: question.trim(),
    })
  } catch (e) {
    await logAiUsage({
      studentId: student.id, ip, endpoint: 'chat',
      tokensIn: 0, tokensOut: 0, success: false, errorMsg: e?.message,
    })
    console.error('[ai-chat] error:', e)
    return NextResponse.json({ error: 'Mr. Olla nu poate răspunde acum. Încearcă din nou.' }, { status: 503 })
  }

  await logAiUsage({
    studentId: student.id, ip, endpoint: 'chat',
    tokensIn: answer.tokensIn, tokensOut: answer.tokensOut, success: true,
  })

  // Salvează răspunsul
  const assistantMsg = await prisma.aiChatMessage.create({
    data: {
      studentId: student.id, problemId, lessonId: lessonId || null,
      role: 'assistant', content: answer.answer,
      tokensIn: answer.tokensIn, tokensOut: answer.tokensOut,
    },
  })

  const usage = await getStudentAiUsage(student.id)
  return NextResponse.json({
    userMessage: userMsg,
    assistantMessage: assistantMsg,
    used: userMsgCount + 1,
    limit: MAX_CHAT_PER_PROBLEM,
    remaining: MAX_CHAT_PER_PROBLEM - userMsgCount - 1,
    usage,
  })
}
