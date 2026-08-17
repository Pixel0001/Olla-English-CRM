import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

// GET — detaliile unui set (pentru profesor/admin)
export async function GET(_req, { params }) {
  const { allowed } = await checkPermission('problems.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const set = await prisma.generatedSet.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, fullName: true } },
      createdBy: { select: { id: true, name: true } },
      setProblems: { include: { problem: true }, orderBy: { order: 'asc' } },
      attempts: {
        orderBy: { createdAt: 'desc' },
        include: { problem: { select: { id: true, title: true, topic: true, points: true } } },
      },
    },
  })
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(set)
}

// PATCH — update setări (titlu, policy, time limit, student)
export async function PATCH(request, { params }) {
  const { allowed } = await checkPermission('problems.assign')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  try {
    const body = await request.json()
    const allowedFields = ['title', 'explanationPolicy', 'timeLimit', 'studentId']
    const data = {}
    for (const k of allowedFields) {
      if (k in body) data[k] = body[k]
    }
    if ('timeLimit' in data) data.timeLimit = data.timeLimit ? Number(data.timeLimit) : null
    if ('studentId' in data && !data.studentId) data.studentId = null

    const set = await prisma.generatedSet.update({ where: { id }, data })
    return NextResponse.json(set)
  } catch (e) {
    console.error('Set update error:', e)
    return NextResponse.json({ error: 'Eroare' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(_req, { params }) {
  const { allowed } = await checkPermission('problems.assign')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  try {
    await prisma.generatedSet.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Set delete error:', e)
    return NextResponse.json({ error: 'Eroare' }, { status: 500 })
  }
}
