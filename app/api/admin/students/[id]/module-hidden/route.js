import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

// POST { moduleId } — ascunde modulul pentru student
export async function POST(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const { moduleId } = await request.json()
    if (!moduleId) return NextResponse.json({ error: 'moduleId obligatoriu' }, { status: 400 })

    const record = await prisma.moduleHidden.upsert({
      where: { studentId_moduleId: { studentId, moduleId } },
      update: {},
      create: { studentId, moduleId },
    })
    return NextResponse.json(record)
  } catch (e) {
    console.error('hide module', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE ?moduleId=xxx — face modulul vizibil din nou
export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    if (!moduleId) return NextResponse.json({ error: 'moduleId obligatoriu' }, { status: 400 })

    await prisma.moduleHidden.deleteMany({ where: { studentId, moduleId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('unhide module', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
