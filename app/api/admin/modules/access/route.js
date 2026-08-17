import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import crypto from 'crypto'

// Acordă/revocă acces la modul pentru un elev + generează/regenerează accessToken pentru elev

export async function POST(req) {
  const { allowed, user } = await checkPermission('modules.access')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { studentId, moduleId, source = 'granted', notes } = body
  if (!studentId || !moduleId) {
    return NextResponse.json({ error: 'studentId și moduleId sunt obligatorii' }, { status: 400 })
  }

  // Generează accessToken pentru elev dacă nu are
  const student = await prisma.student.findUnique({ where: { id: studentId } })
  if (!student) return NextResponse.json({ error: 'Elev inexistent' }, { status: 404 })

  let accessToken = student.accessToken
  if (!accessToken) {
    accessToken = crypto.randomBytes(16).toString('base64url')
    // ensure unique
    while (await prisma.student.findFirst({ where: { accessToken, NOT: { id: studentId } } })) {
      accessToken = crypto.randomBytes(16).toString('base64url')
    }
    await prisma.student.update({ where: { id: studentId }, data: { accessToken } })
  }

  // Upsert acces
  const access = await prisma.moduleAccess.upsert({
    where: { studentId_moduleId: { studentId, moduleId } },
    update: { source, notes: notes || null, grantedById: user?.id || null },
    create: {
      studentId, moduleId,
      source, notes: notes || null,
      grantedById: user?.id || null,
    },
  })

  return NextResponse.json({ access, accessToken })
}

export async function DELETE(req) {
  const { allowed } = await checkPermission('modules.access')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get('studentId')
  const moduleId = searchParams.get('moduleId')
  if (!studentId || !moduleId) {
    return NextResponse.json({ error: 'studentId și moduleId sunt obligatorii' }, { status: 400 })
  }
  await prisma.moduleAccess.delete({
    where: { studentId_moduleId: { studentId, moduleId } },
  }).catch(() => null)
  return NextResponse.json({ ok: true })
}
