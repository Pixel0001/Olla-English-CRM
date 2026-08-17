export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PermissionGuard from '@/components/admin/PermissionGuard'
import LeadDetailClient from './LeadDetailClient'

export default async function LeadDetailPage({ params }) {
  const { id } = await params
  return (
    <PermissionGuard permission="leads.view">
      <Content id={id} />
    </PermissionGuard>
  )
}

async function Content({ id }) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      leadNotes: { orderBy: { createdAt: 'desc' } },
      createdBy: { select: { name: true, email: true } },
    },
  })

  if (!lead) notFound()

  return <LeadDetailClient lead={JSON.parse(JSON.stringify(lead))} />
}
