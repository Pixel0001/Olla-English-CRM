export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import ContactClient from './ContactClient'

export default async function ContactMessagesPage() {
  return (
    <PermissionGuard permission="contact.view">
      <ContactMessagesPageContent />
    </PermissionGuard>
  )
}

async function ContactMessagesPageContent() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: messages.length,
    lead: messages.filter(m => m.status === 'LEAD' || m.status === 'NOU').length,
    contactat: messages.filter(m => m.status === 'CONTACTAT' || m.status === 'CITIT').length,
    programat: messages.filter(m => m.status === 'PROGRAMAT' || m.status === 'PRIMA_LECTIE').length
  }

  // Format messages for client component
  const formattedMessages = messages.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    message: m.message,
    status: m.status,
    createdAt: m.createdAt
  }))

  return <ContactClient messages={formattedMessages} stats={stats} />
}
