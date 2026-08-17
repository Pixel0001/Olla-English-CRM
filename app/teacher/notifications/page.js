export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotificationsPageClient from '@/app/admin/notifications/NotificationsPageClient'

export default async function TeacherNotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: session.user.id
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
    isAdmin={false}
  />
}
