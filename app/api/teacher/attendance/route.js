import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sessionId, studentId, status, notes } = await request.json()

    // Verify the session exists and teacher has access
    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: {
        group: true
      }
    })

    if (!lessonSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (lessonSession.group.teacherId !== session.user.id && !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (lessonSession.lessonsDeducted && status !== undefined) {
      return NextResponse.json({ error: 'Lessons already deducted' }, { status: 400 })
    }

    // Check if 24 hours have passed (teachers can't modify notes after 24h, admins can)
    const hoursElapsed = (Date.now() - new Date(lessonSession.date).getTime()) / (1000 * 60 * 60)
    const isExpired = hoursElapsed >= 24
    
    if (isExpired && notes !== undefined && !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ 
        error: 'Nu poți modifica notițele după 24 de ore de la sesiune. Contactează un administrator.' 
      }, { status: 403 })
    }

    // Build update/create data
    const updateData = {}
    const createData = { sessionId, studentId }
    
    if (status !== undefined) {
      updateData.status = status
      createData.status = status
    }
    if (notes !== undefined) {
      updateData.notes = notes
      createData.notes = notes
    }

    // Upsert attendance record
    const attendance = await prisma.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId
        }
      },
      update: updateData,
      create: createData
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }

  try {
    const attendances = await prisma.attendance.findMany({
      where: { sessionId },
      include: { student: true }
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
