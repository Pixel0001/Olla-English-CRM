import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

// POST { lessonId, notes? } — acordă acces la o lecție individuală
export async function POST(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const sessionUser = await getCurrentUser()
    const { id: studentId } = await params
    const { lessonId, notes } = await request.json()
    if (!lessonId) return NextResponse.json({ error: 'lessonId obligatoriu' }, { status: 400 })

    const access = await prisma.lessonAccess.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      update: { notes, grantedById: sessionUser.id },
      create: { studentId, lessonId, notes, grantedById: sessionUser.id },
    })
    return NextResponse.json(access)
  } catch (e) {
    console.error('grant lesson access', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE ?lessonId=xxx — revocă accesul la lecție
export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    if (!lessonId) return NextResponse.json({ error: 'lessonId obligatoriu' }, { status: 400 })

    await prisma.lessonAccess.deleteMany({ where: { studentId, lessonId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('revoke lesson access', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
