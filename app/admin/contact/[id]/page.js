export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ContactMessageDetailClient from './ContactMessageDetailClient'

export default async function ContactMessageDetailPage({ params }) {
  const { id } = await params

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    include: {
      contactNotes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!message) {
    notFound()
  }

  // Marchează automat ca citit când se deschide
  if (message.status === 'NOU') {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'CITIT' }
    })
    message.status = 'CITIT'
  }

  return <ContactMessageDetailClient message={JSON.parse(JSON.stringify(message))} />
}
