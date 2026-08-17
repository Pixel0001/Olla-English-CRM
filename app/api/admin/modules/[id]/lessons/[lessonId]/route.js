import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'

export async function GET(req, { params }) {
  const { allowed } = await checkPermission('modules.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { lessonId } = await params
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: true,
      problems: { orderBy: { lessonOrder: 'asc' } },
    },
  })
  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ lesson })
}

export async function PATCH(req, { params }) {
  const { allowed } = await checkPermission('modules.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { lessonId } = await params
  const body = await req.json()
  const allowedFields = ['title', 'theory', 'isFree', 'order', 'videoUrl', 'active']
  const data = {}
  for (const f of allowedFields) if (body[f] !== undefined) data[f] = body[f]

  const updated = await prisma.lesson.update({ where: { id: lessonId }, data })
  revalidateTag('lessons')
  revalidateTag('modules')
  return NextResponse.json({ lesson: updated })
}

export async function DELETE(req, { params }) {
  const { allowed } = await checkPermission('modules.delete')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { lessonId } = await params
  // Detach problems (set lessonId=null) but don't delete them
  await prisma.problem.updateMany({ where: { lessonId }, data: { lessonId: null, lessonOrder: null } })
  await prisma.lesson.delete({ where: { id: lessonId } })
  revalidateTag('lessons')
  revalidateTag('modules')
  return NextResponse.json({ ok: true })
}
