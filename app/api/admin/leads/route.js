import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'
import { LEAD_STATUS_VALUES, LEAD_SOURCE_VALUES } from '@/lib/leads-config'
import { notifyNewLead, notifyLeadAssigned } from '@/lib/telegram'
import { parseSchoolDate } from '@/lib/timezone'

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

// GET /api/admin/leads — listare cu filtre
export async function GET(request) {
  const { error } = await requireStaff('leads.view')
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const where = {}

    // Status: acceptă valori multiple, separate prin virgulă
    const status = searchParams.get('status')
    if (status) {
      const list = status.split(',').filter((s) => LEAD_STATUS_VALUES.includes(s))
      if (list.length) where.status = { in: list }
    }

    // Sursă: idem
    const source = searchParams.get('source')
    if (source) {
      const list = source.split(',').filter((s) => LEAD_SOURCE_VALUES.includes(s))
      if (list.length) where.source = { in: list }
    }

    // Interval de creare
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) {
        const end = new Date(to)
        end.setHours(23, 59, 59, 999)
        where.createdAt.lte = end
      }
    }

    // Follow-up: „due" = programat până azi inclusiv; „none" = fără follow-up
    const followUp = searchParams.get('followUp')
    if (followUp === 'due') {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      where.nextFollowUpAt = { not: null, lte: end }
    } else if (followUp === 'upcoming') {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      where.nextFollowUpAt = { gt: end }
    } else if (followUp === 'none') {
      where.nextFollowUpAt = null
    }

    // Căutare liberă
    const q = searchParams.get('q')?.trim()
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
        { studentName: { contains: q, mode: 'insensitive' } },
        { sourceDetail: { contains: q, mode: 'insensitive' } },
      ]
    }

    const sort = searchParams.get('sort') || 'newest'
    const orderBy =
      sort === 'oldest' ? { createdAt: 'asc' }
      : sort === 'followup' ? { nextFollowUpAt: 'asc' }
      : sort === 'name' ? { name: 'asc' }
      : { createdAt: 'desc' }

    const leads = await prisma.lead.findMany({
      where,
      orderBy,
      take: Math.min(parseInt(searchParams.get('limit')) || 500, 1000),
      include: {
        createdBy: { select: { name: true, email: true } },
        _count: { select: { leadNotes: true } },
      },
    })

    return NextResponse.json({ leads })
  } catch (e) {
    console.error('Leads GET error:', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

// POST /api/admin/leads — lead nou, adăugat manual de staff
export async function POST(request) {
  const { session, error } = await requireStaff('leads.create')
  if (error) return error

  try {
    const data = await request.json()

    if (!data.name?.trim()) {
      return NextResponse.json({ error: 'Numele este obligatoriu' }, { status: 400 })
    }
    if (!data.phone?.trim() && !data.email?.trim()) {
      return NextResponse.json(
        { error: 'Ai nevoie de cel puțin un mod de contact: telefon sau email' },
        { status: 400 }
      )
    }
    if (data.source && !LEAD_SOURCE_VALUES.includes(data.source)) {
      return NextResponse.json({ error: 'Sursă invalidă' }, { status: 400 })
    }
    if (data.status && !LEAD_STATUS_VALUES.includes(data.status)) {
      return NextResponse.json({ error: 'Status invalid' }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        source: data.source || 'ALTA',
        sourceDetail: data.sourceDetail?.trim() || null,
        message: data.message?.trim() || null,
        studentName: data.studentName?.trim() || null,
        studentAge: data.studentAge ? parseInt(data.studentAge) : null,
        interestedIn: data.interestedIn?.trim() || null,
        status: data.status || 'LEAD',
        nextFollowUpAt: parseSchoolDate(data.nextFollowUpAt),
        assignedToId: data.assignedToId || null,
        createdById: session.user.id,
      },
    })

    // Notificarea nu trebuie să blocheze răspunsul; numele se rezolvă separat,
    // ca mesajul să conțină responsabilul și autorul, nu doar id-uri.
    ;(async () => {
      const [assignedTo, createdBy] = await Promise.all([
        lead.assignedToId
          ? prisma.user.findUnique({
              where: { id: lead.assignedToId },
              select: { name: true, email: true, telegramChatId: true },
            })
          : null,
        prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
      ])

      const enriched = {
        ...lead,
        assignedToName: assignedTo?.name || assignedTo?.email || null,
        createdByName: createdBy?.name || createdBy?.email || null,
      }

      // În topicul comun și, dacă are cont conectat, direct responsabilului
      await notifyNewLead(enriched)
      if (assignedTo?.telegramChatId) {
        await notifyLeadAssigned(enriched, { chatId: assignedTo.telegramChatId })
      }
    })().catch((err) => console.error('Telegram lead notify:', err))

    return NextResponse.json(lead, { status: 201 })
  } catch (e) {
    console.error('Leads POST error:', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
