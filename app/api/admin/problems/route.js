import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

// GET /api/admin/problems  — listă probleme cu filtre
export async function GET(request) {
  const { allowed } = await checkPermission('problems.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic') || undefined
  const difficulty = searchParams.get('difficulty') || undefined
  const type = searchParams.get('type') || undefined
  const q = searchParams.get('q') || undefined

  const where = { active: true }
  if (topic) where.topic = topic
  if (difficulty) where.difficulty = difficulty
  if (type) where.type = type
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { tags: { has: q } },
    ]
  }

  const problems = await prisma.problem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { attempts: true, setProblems: true } },
    },
  })
  return NextResponse.json(problems)
}

// POST /api/admin/problems — creează problemă nouă
export async function POST(request) {
  const { allowed, user } = await checkPermission('problems.create')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const {
      title, description, difficulty = 'EASY', topic, subtopic,
      type = 'MULTIPLE_CHOICE', options = [], correctAnswer,
      starterCode, testCases, explanation, hint,
      tags = [], estimatedTime = 5, points = 10, language, lessonId,
    } = body

    if (!title || !description || !topic || !explanation) {
      return NextResponse.json(
        { error: 'Titlul, descrierea, topic și explicația sunt obligatorii.' },
        { status: 400 }
      )
    }
    if (type === 'MULTIPLE_CHOICE' && (!Array.isArray(options) || options.length < 2)) {
      return NextResponse.json(
        { error: 'Pentru grilă, oferă cel puțin 2 opțiuni.' },
        { status: 400 }
      )
    }

    const problem = await prisma.problem.create({
      data: {
        title, description, difficulty, topic, subtopic,
        type, options, correctAnswer,
        starterCode, testCases: testCases ?? undefined,
        explanation, hint,
        tags, estimatedTime: Number(estimatedTime) || 5, points: Number(points) || 10,
        language,
        lessonId: lessonId || undefined,
        createdById: user?.id,
      },
    })
    return NextResponse.json(problem, { status: 201 })
  } catch (e) {
    console.error('Problem create error:', e)
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 })
  }
}
