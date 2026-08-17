import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

// GET - Fetch all lesson sessions for admin
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check permission
  const permCheck = await checkPermission('sessions.view')
  if (!permCheck.allowed) {
    return NextResponse.json({ error: 'Nu ai permisiunea să vezi sesiunile' }, { status: 403 })
  }

  try {
    // Get all lesson sessions with full details
    const sessions = await prisma.lessonSession.findMany({
      include: {
        group: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        attendances: {
          include: {
            student: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Get all teachers for filter
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' }
    })

    // Get all groups for filter
    const groups = await prisma.group.findMany({
      include: {
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      sessions,
      teachers,
      groups
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
