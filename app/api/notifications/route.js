import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Fetch notifications for current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const isAdmin = session.user.role === 'ADMIN'

    // Build where clause based on role
    let whereClause = {}
    
    if (isAdmin) {
      // Admin sees notifications without recipientId (global admin notifications) 
      // OR specifically for them
      whereClause = {
        OR: [
          { recipientId: null }, // Global admin notifications
          { recipientId: session.user.id }
        ]
      }
    } else {
      // Teachers only see their own notifications
      whereClause = {
        recipientId: session.user.id
      }
    }

    if (unreadOnly) {
      whereClause.read = false
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        student: {
          select: { id: true, fullName: true }
        }
      }
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        ...whereClause,
        read: false
      }
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Eroare la încărcarea notificărilor' }, { status: 500 })
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAllRead } = body

    const isAdmin = session.user.role === 'ADMIN'

    if (markAllRead) {
      // Mark all notifications as read for this user
      let whereClause = {}
      
      if (isAdmin) {
        whereClause = {
          OR: [
            { recipientId: null },
            { recipientId: session.user.id }
          ],
          read: false
        }
      } else {
        whereClause = {
          recipientId: session.user.id,
          read: false
        }
      }

      await prisma.notification.updateMany({
        where: whereClause,
        data: { read: true }
      })
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          OR: [
            { recipientId: null },
            { recipientId: session.user.id }
          ]
        },
        data: { read: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}
