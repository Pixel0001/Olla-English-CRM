import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'

// Atașează / detașează probleme de o lecție
// POST { problemIds: [], orderStart?: number } - atașează (cu ordinea automată)
// DELETE { problemId }                          - detașează

export async function POST(req, { params }) {
  const { allowed } = await checkPermission('modules.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { lessonId } = await params
  const body = await req.json()
  const ids = Array.isArray(body.problemIds) ? body.problemIds : []
  if (ids.length === 0) return NextResponse.json({ error: 'Niciun ID' }, { status: 400 })

  // Determinăm următorul order disponibil
  const maxOrder = await prisma.problem.aggregate({
    where: { lessonId },
    _max: { lessonOrder: true },
  })
  let nextOrder = (maxOrder._max.lessonOrder ?? -1) + 1

  for (const pid of ids) {
    await prisma.problem.update({
      where: { id: pid },
      data: { lessonId, lessonOrder: nextOrder++ },
    })
  }
  revalidateTag('lessons')
  revalidateTag('problems')
  return NextResponse.json({ ok: true, attached: ids.length })
}

export async function DELETE(req, { params }) {
  const { allowed } = await checkPermission('modules.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const problemId = searchParams.get('problemId')
  if (!problemId) return NextResponse.json({ error: 'problemId required' }, { status: 400 })

  await prisma.problem.update({
    where: { id: problemId },
    data: { lessonId: null, lessonOrder: null },
  })
  revalidateTag('lessons')
  revalidateTag('problems')
  return NextResponse.json({ ok: true })
}
