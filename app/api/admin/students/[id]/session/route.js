import { NextResponse } from 'next/server'
import { checkPermission } from '@/lib/permissions'
import prisma from '@/lib/prisma'

// DELETE /api/admin/students/[id]/session  — resetează sesiunea activă
export async function DELETE(req, { params }) {
  const { allowed } = await checkPermission('students.edit')
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.student.update({
    where: { id },
    data: {
      activeSessionId: null,
      activeSessionAt: null,
      activeSessionIp: null,
      activeSessionUA: null,
    },
  })

  return NextResponse.json({ ok: true })
}
