export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import LeadsClient from './LeadsClient'

export default async function LeadsPage() {
  return (
    <PermissionGuard permission="leads.view">
      <LeadsPageContent />
    </PermissionGuard>
  )
}

async function LeadsPageContent() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      _count: { select: { leadNotes: true } },
    },
  })

  const formatted = leads.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email,
    source: l.source,
    sourceDetail: l.sourceDetail,
    message: l.message,
    studentName: l.studentName,
    studentAge: l.studentAge,
    isAdult: l.isAdult,
    interestedIn: l.interestedIn,
    status: l.status,
    nextFollowUpAt: l.nextFollowUpAt ? l.nextFollowUpAt.toISOString() : null,
    createdAt: l.createdAt.toISOString(),
    createdByName: l.createdBy?.name || l.createdBy?.email || null,
    assignedToId: l.assignedToId || null,
    assignedToName: l.assignedTo?.name || l.assignedTo?.email || null,
    notesCount: l._count.leadNotes,
    metaConversationId: l.metaConversationId || null,
    metaPlatform: l.metaPlatform || null,
    metaPersonId: l.metaPersonId || null,
  }))

  const staff = await prisma.user.findMany({
    where: { active: true, role: { in: ["SUPERADMIN", "ADMIN", "TEACHER"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })

  return <LeadsClient leads={formatted} staff={JSON.parse(JSON.stringify(staff))} />
}
