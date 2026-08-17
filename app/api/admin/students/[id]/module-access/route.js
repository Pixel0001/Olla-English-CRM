import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

// POST { moduleId, source?, notes? } — acordă acces la modul
export async function POST(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const sessionUser = await getCurrentUser()
    const { id: studentId } = await params
    const { moduleId, source = 'granted', notes } = await request.json()
    if (!moduleId) return NextResponse.json({ error: 'moduleId obligatoriu' }, { status: 400 })

    const access = await prisma.moduleAccess.upsert({
      where: { studentId_moduleId: { studentId, moduleId } },
      update: { source, notes, grantedById: sessionUser.id },
      create: { studentId, moduleId, source, notes, grantedById: sessionUser.id },
    })
    return NextResponse.json(access)
  } catch (e) {
    console.error('grant module access', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE ?moduleId=xxx — revocă accesul
export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    if (!moduleId) return NextResponse.json({ error: 'moduleId obligatoriu' }, { status: 400 })

    await prisma.moduleAccess.deleteMany({ where: { studentId, moduleId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('revoke module access', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
