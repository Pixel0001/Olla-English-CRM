import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { revalidateTag } from 'next/cache'

export async function GET(req, { params }) {
  const { allowed } = await checkPermission('modules.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const m = await prisma.learningModule.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { problems: true, submissions: true } } },
      },
      _count: { select: { accesses: true, advances: true } },
    },
  })
  if (!m) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ module: m })
}

export async function PATCH(req, { params }) {
  const { allowed } = await checkPermission('modules.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const allowedFields = ['title', 'description', 'language', 'coverImage', 'order', 'active', 'grades']
  const data = {}
  for (const f of allowedFields) if (body[f] !== undefined) data[f] = body[f]

  const updated = await prisma.learningModule.update({ where: { id }, data })
  revalidateTag('modules')
  revalidateTag('lessons')
  return NextResponse.json({ module: updated })
}

export async function DELETE(req, { params }) {
  const { allowed } = await checkPermission('modules.delete')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.learningModule.delete({ where: { id } })
  revalidateTag('modules')
  revalidateTag('lessons')
  return NextResponse.json({ ok: true })
}
