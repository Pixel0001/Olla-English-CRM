import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

// GET /api/admin/problems/[id]
export async function GET(_req, { params }) {
  const { allowed } = await checkPermission('problems.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: {
      _count: { select: { attempts: true, setProblems: true } },
    },
  })
  if (!problem) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(problem)
}

// PATCH /api/admin/problems/[id] — update
export async function PATCH(request, { params }) {
  const { allowed } = await checkPermission('problems.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  try {
    const body = await request.json()
    const allowedFields = [
      'title','description','difficulty','topic','subtopic','type','options',
      'correctAnswer','starterCode','testCases','explanation','hint','tags',
      'estimatedTime','points','language','active'
    ]
    const data = {}
    for (const k of allowedFields) {
      if (k in body) data[k] = body[k]
    }
    if ('estimatedTime' in data) data.estimatedTime = Number(data.estimatedTime) || 5
    if ('points' in data) data.points = Number(data.points) || 10

    const problem = await prisma.problem.update({ where: { id }, data })
    revalidateTag('problems')
    revalidateTag('lessons')
    return NextResponse.json(problem)
  } catch (e) {
    console.error('Problem update error:', e)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}

// DELETE /api/admin/problems/[id]
export async function DELETE(_req, { params }) {
  const { allowed } = await checkPermission('problems.delete')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  try {
    // Ștergem mai întâi înregistrările copil (MongoDB nu face cascade automat)
    await Promise.all([
      prisma.problemAttempt.deleteMany({ where: { problemId: id } }),
      prisma.problemSubmission.deleteMany({ where: { problemId: id } }),
      prisma.setProblem.deleteMany({ where: { problemId: id } }),
    ])
    await prisma.problem.delete({ where: { id } })
    revalidateTag('problems')
    revalidateTag('lessons')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Problem delete error:', e)
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 })
  }
}
