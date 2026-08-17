import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/teacher/problems — profesor creează problemă nouă
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const {
      title, description, difficulty = 'EASY', topic, subtopic,
      type = 'MULTIPLE_CHOICE', options = [], correctAnswer,
      starterCode, testCases, explanation, hint,
      tags = [], estimatedTime = 5, points = 10, language,
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
        createdById: session.user.id,
      },
    })
    return NextResponse.json(problem, { status: 201 })
  } catch (e) {
    console.error('Teacher problem create error:', e)
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 })
  }
}
