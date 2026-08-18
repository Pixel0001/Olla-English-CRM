import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'
import { LEAD_STATUS_VALUES, LEAD_SOURCE_VALUES } from '@/lib/leads-config'
import { convertLeadToStudent, isWonStatus } from '@/lib/lead-conversion'

async function requireStaff(permission) {
  const session = await getServerSession(authOptions)
  if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const perm = await checkPermission(permission)
  if (!perm.allowed) {
    return { error: NextResponse.json({ error: 'Nu ai permisiunea necesară' }, { status: 403 }) }
  }
  return { session }
}

export async function GET(request, { params }) {
  const { error } = await requireStaff('leads.view')
  if (error) return error

  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { leadNotes: { orderBy: { createdAt: 'desc' } } },
  })
  if (!lead) return NextResponse.json({ error: 'Lead negăsit' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PATCH(request, { params }) {
  const { error } = await requireStaff('leads.edit')
  if (error) return error

  try {
    const { id } = await params
    const data = await request.json()
    const update = {}

    if (data.status !== undefined) {
      if (!LEAD_STATUS_VALUES.includes(data.status)) {
        return NextResponse.json({ error: 'Status invalid' }, { status: 400 })
      }
      update.status = data.status
    }
    if (data.source !== undefined) {
      if (!LEAD_SOURCE_VALUES.includes(data.source)) {
        return NextResponse.json({ error: 'Sursă invalidă' }, { status: 400 })
      }
      update.source = data.source
    }

    // Câmpuri text: șirul gol înseamnă „golește câmpul"
    for (const f of ['name', 'phone', 'email', 'sourceDetail', 'message', 'studentName', 'interestedIn']) {
      if (data[f] !== undefined) update[f] = data[f]?.trim() || null
    }
    if (data.name !== undefined && !update.name) {
      return NextResponse.json({ error: 'Numele nu poate fi gol' }, { status: 400 })
    }
    if (data.studentAge !== undefined) {
      update.studentAge = data.studentAge ? parseInt(data.studentAge) : null
    }
    if (data.nextFollowUpAt !== undefined) {
      update.nextFollowUpAt = data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null
      // Data schimbată → lead-ul reintră în coada de notificări
      update.followUpNotifiedAt = null
    }
    if (data.assignedToId !== undefined) {
      update.assignedToId = data.assignedToId || null
    }
    if (data.convertedStudentId !== undefined) {
      update.convertedStudentId = data.convertedStudentId || null
    }

    const lead = await prisma.lead.update({ where: { id }, data: update })

    // Lead câștigat → elevul apare automat în lista de elevi (o singură dată)
    let conversion = null
    if (isWonStatus(lead.status) && !lead.convertedStudentId) {
      conversion = await convertLeadToStudent(lead)
    }

    return NextResponse.json({ ...lead, conversion })
  } catch (e) {
    console.error('Lead PATCH error:', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireStaff('leads.delete')
  if (error) return error

  try {
    const { id } = await params
    await prisma.leadNote.deleteMany({ where: { leadId: id } })
    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Lead DELETE error:', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
