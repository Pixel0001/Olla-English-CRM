import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { slugify } from '@/lib/problem-utils'
import { revalidateTag } from 'next/cache'

export async function GET() {
  const { allowed } = await checkPermission('modules.view')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const modules = await prisma.learningModule.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    include: {
      _count: { select: { lessons: true, accesses: true } },
    },
  })
  return NextResponse.json({ modules })
}

export async function POST(req) {
  const { allowed, user } = await checkPermission('modules.create')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { title, description, language, coverImage, order, grades } = body
  if (!title) return NextResponse.json({ error: 'Titlul e obligatoriu' }, { status: 400 })

  let slug = slugify(body.slug || title)
  // ensure unique
  let i = 1
  let candidate = slug
  while (await prisma.learningModule.findUnique({ where: { slug: candidate } })) {
    candidate = `${slug}-${i++}`
  }

  const created = await prisma.learningModule.create({
    data: {
      title,
      slug: candidate,
      description: description || null,
      language: language || null,
      coverImage: coverImage || null,
      order: typeof order === 'number' ? order : 0,
      grades: Array.isArray(grades) ? grades : [],
      createdById: user?.id || null,
    },
  })
  revalidateTag('modules')
  revalidateTag('lessons')
  return NextResponse.json({ module: created }, { status: 201 })
}
