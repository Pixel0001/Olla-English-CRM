export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotificationsPageClient from './NotificationsPageClient'
import PermissionGuard from '@/components/admin/PermissionGuard'

export default async function AdminNotificationsPage() {
  return (
    <PermissionGuard permission="notifications.view">
      <NotificationsPageContent />
    </PermissionGuard>
  )
}

async function NotificationsPageContent() {
  const session = await getServerSession(authOptions)

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { recipientId: null },
        { recipientId: session.user.id }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      student: {
        select: { id: true, fullName: true }
      }
    }
  })

  return <NotificationsPageClient 
    notifications={JSON.parse(JSON.stringify(notifications))} 
    isAdmin={true}
  />
}
