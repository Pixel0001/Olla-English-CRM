import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Acordă elevului permisiunea de a avansa la modulul următor
// POST { studentId, moduleId, notes? }
// DELETE ?studentId&moduleId

async function teacherCanAct(session, studentId) {
  if (['ADMIN', 'SUPERADMIN'].includes(session.user.role)) return true
  const link = await prisma.groupStudent.findFirst({
    where: { studentId, group: { teacherId: session.user.id, active: true } },
  })
  return !!link
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { studentId, moduleId, notes } = body
  if (!studentId || !moduleId) {
    return NextResponse.json({ error: 'studentId și moduleId obligatorii' }, { status: 400 })
  }
  if (!(await teacherCanAct(session, studentId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const advance = await prisma.moduleAdvance.upsert({
    where: { studentId_moduleId: { studentId, moduleId } },
    update: { notes: notes || null, grantedById: session.user.id },
    create: { studentId, moduleId, notes: notes || null, grantedById: session.user.id },
  })
  return NextResponse.json({ advance })
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  const moduleId = searchParams.get('moduleId')
  if (!studentId || !moduleId) return NextResponse.json({ error: 'Lipsă parametri' }, { status: 400 })
  if (!(await teacherCanAct(session, studentId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.moduleAdvance.delete({
    where: { studentId_moduleId: { studentId, moduleId } },
  }).catch(() => null)
  return NextResponse.json({ ok: true })
}
