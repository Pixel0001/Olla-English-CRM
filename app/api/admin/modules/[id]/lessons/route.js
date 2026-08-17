import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { slugify } from '@/lib/problem-utils'
import { revalidateTag } from 'next/cache'

export async function POST(req, { params }) {
  const { allowed } = await checkPermission('modules.create')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: moduleId } = await params
  const body = await req.json()
  const { title, theory, isFree, order, videoUrl } = body
  if (!title || !theory) {
    return NextResponse.json({ error: 'Titlu și teoria sunt obligatorii' }, { status: 400 })
  }

  // unique slug per module
  let base = slugify(body.slug || title)
  let candidate = base
  let i = 1
  while (await prisma.lesson.findUnique({ where: { moduleId_slug: { moduleId, slug: candidate } } })) {
    candidate = `${base}-${i++}`
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title,
      slug: candidate,
      theory,
      isFree: !!isFree,
      videoUrl: videoUrl || null,
      order: typeof order === 'number' ? order : 0,
    },
  })
  revalidateTag('lessons')
  revalidateTag('modules')
  return NextResponse.json({ lesson }, { status: 201 })
}
