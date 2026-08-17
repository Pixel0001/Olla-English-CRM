import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { AI_LIMITS } from '@/lib/ai-grader'

export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  const { token } = await params

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true },
  })
  if (!student || student.active === false) {
    return NextResponse.json({ error: 'Acces interzis' }, { status: 403 })
  }

  const now = new Date()
  const dayAgo   = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const daysInMonth  = endOfMonth.getDate()

  // Cereri azi (24h), luna asta, și cost luna
  const [usedToday, monthRows] = await Promise.all([
    prisma.aiUsage.count({
      where: { studentId: student.id, createdAt: { gte: dayAgo } },
    }),
    prisma.aiUsage.findMany({
      where: { studentId: student.id, createdAt: { gte: startOfMonth } },
      select: { createdAt: true, endpoint: true, costUsd: true, success: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const usedMonth   = monthRows.length
  const costMonth   = monthRows.reduce((s, r) => s + (r.costUsd || 0), 0)

  // Câte cereri per zi în luna curentă
  const dailyMap = new Map()
  for (let d = 1; d <= daysInMonth; d++) {
    const key = String(d).padStart(2, '0')
    dailyMap.set(key, { count: 0, cost: 0 })
  }
  for (const r of monthRows) {
    const day = String(new Date(r.createdAt).getDate()).padStart(2, '0')
    const e = dailyMap.get(day)
    if (e) { e.count++; e.cost += r.costUsd || 0 }
  }
  const dailyActivity = Array.from(dailyMap.entries()).map(([day, v]) => ({
    day: Number(day), ...v,
  }))

  // Cooldown: când expiră limita zilnică (cea mai veche cerere din ziua curentă + 24h)
  const oldestToday = await prisma.aiUsage.findFirst({
    where: { studentId: student.id, createdAt: { gte: dayAgo } },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  })
  const resetAt = oldestToday
    ? new Date(new Date(oldestToday.createdAt).getTime() + 24 * 60 * 60 * 1000)
    : null

  // Endpoints breakdown azi
  const endpointBreakdown = {}
  const todayRows = monthRows.filter(r => new Date(r.createdAt) >= dayAgo)
  for (const r of todayRows) {
    if (!endpointBreakdown[r.endpoint]) endpointBreakdown[r.endpoint] = 0
    endpointBreakdown[r.endpoint]++
  }

  const dailyLimit  = AI_LIMITS.perStudentDaily
  const monthlyLimit = dailyLimit * daysInMonth

  return NextResponse.json({
    daily: {
      used: usedToday,
      limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - usedToday),
      pct: Math.min(100, Math.round((usedToday / dailyLimit) * 100)),
      resetAt,
    },
    monthly: {
      used: usedMonth,
      limit: monthlyLimit,
      remaining: Math.max(0, monthlyLimit - usedMonth),
      pct: Math.min(100, Math.round((usedMonth / monthlyLimit) * 100)),
      costUsd: costMonth,
      daysInMonth,
      dayOfMonth: now.getDate(),
    },
    dailyActivity,
    endpointBreakdown,
    enabled: process.env.AI_GRADING_ENABLED !== 'false',
  })
}
