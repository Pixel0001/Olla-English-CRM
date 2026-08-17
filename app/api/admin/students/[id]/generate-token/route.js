import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

/**
 * POST /api/admin/students/[id]/generate-token
 * Generează (sau regenerează) accessToken pentru un elev.
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin()
    const canEdit = await checkPermission('students.edit')
    if (!canEdit.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea de a edita elevii' }, { status: 403 })
    }

    const { id } = await params
    const student = await prisma.student.findUnique({ where: { id }, select: { id: true } })
    if (!student) return NextResponse.json({ error: 'Elevul nu există' }, { status: 404 })

    const token = nanoid(32)
    const updated = await prisma.student.update({
      where: { id },
      data: { accessToken: token },
      select: { accessToken: true },
    })

    return NextResponse.json({ token: updated.accessToken })
  } catch (e) {
    console.error('[generate-token]', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
