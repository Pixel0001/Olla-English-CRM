import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { generateAccessToken, smartRandomSelect } from '@/lib/problem-utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/sets — listă seturi
export async function GET(request) {
  const { allowed } = await checkPermission('problems.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId') || undefined

  const sets = await prisma.generatedSet.findMany({
    where: studentId ? { studentId } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      student: { select: { id: true, fullName: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { setProblems: true, attempts: true } },
    },
  })
  return NextResponse.json(sets)
}

/**
 * POST /api/admin/sets — creează un set
 * Body:
 *  - title (string, required)
 *  - studentId (string, optional)
 *  - explanationPolicy: 'ALWAYS' | 'AFTER_ANSWER' | 'AFTER_SET' (default AFTER_ANSWER)
 *  - timeLimit (int, minute, optional)
 *  - mode: 'manual' | 'random'
 *  - manual: problemIds: string[]
 *  - random: { difficulty?, topic?, count, mix?, avoidRecent? }
 */
export async function POST(request) {
  const { allowed, user } = await checkPermission('problems.assign')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const {
      title,
      studentId,
      explanationPolicy = 'AFTER_ANSWER',
      timeLimit,
      mode = 'manual',
      problemIds = [],
      random = {},
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Titlul este obligatoriu' }, { status: 400 })
    }

    let chosenIds = []

    if (mode === 'manual') {
      if (!Array.isArray(problemIds) || problemIds.length === 0) {
        return NextResponse.json({ error: 'Selectează cel puțin o problemă' }, { status: 400 })
      }
      chosenIds = problemIds
    } else {
      // RANDOM SMART SELECTION
      const {
        difficulty,
        topic,
        count = 5,
        mix, // { EASY:n, MEDIUM:n, HARD:n }
        avoidRecent = true,
      } = random

      const where = { active: true }
      if (topic) where.topic = topic
      if (difficulty && !mix) where.difficulty = difficulty

      const candidates = await prisma.problem.findMany({
        where,
        select: { id: true, difficulty: true, topic: true },
      })

      // Evită problemele rezolvate recent de elev (ultimele 30 zile)
      let recentProblemIds = new Set()
      if (avoidRecent && studentId) {
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recent = await prisma.problemAttempt.findMany({
          where: { studentId, createdAt: { gte: since } },
          select: { problemId: true },
          distinct: ['problemId'],
        })
        recentProblemIds = new Set(recent.map(r => r.problemId))
      }

      const chosen = smartRandomSelect(candidates, {
        count: Number(count) || 5,
        recentProblemIds,
        mix,
      })

      if (chosen.length === 0) {
        return NextResponse.json(
          { error: 'Nu s-au găsit probleme care să se potrivească filtrului.' },
          { status: 400 }
        )
      }
      chosenIds = chosen.map(p => p.id)
    }

    // Creează setul + relațiile setProblem
    const set = await prisma.generatedSet.create({
      data: {
        title,
        studentId: studentId || undefined,
        explanationPolicy,
        timeLimit: timeLimit ? Number(timeLimit) : null,
        accessToken: generateAccessToken(),
        config: { mode, random: mode === 'random' ? random : null },
        createdById: user?.id,
        setProblems: {
          create: chosenIds.map((pid, i) => ({ problemId: pid, order: i })),
        },
      },
      include: {
        setProblems: { include: { problem: true } },
        student: { select: { id: true, fullName: true } },
      },
    })

    return NextResponse.json(set, { status: 201 })
  } catch (e) {
    console.error('Set create error:', e)
    return NextResponse.json({ error: 'Eroare la crearea setului' }, { status: 500 })
  }
}
