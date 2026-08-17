import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyLowLessons } from '@/lib/telegram'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { sessionId } = await request.json()

    // Get the session with all attendances
    const lessonSession = await prisma.lessonSession.findUnique({
      where: { id: sessionId },
      include: {
        group: {
          include: {
            groupStudents: {
              where: {
                status: { notIn: ['LEFT', 'TRANSFERRED'] }  // Only active students
              }
            }
          }
        },
        attendances: true
      }
    })

    if (!lessonSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (lessonSession.group.teacherId !== session.user.id && !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (lessonSession.lessonsDeducted) {
      return NextResponse.json({ error: 'Lessons already deducted' }, { status: 400 })
    }

    // Check all students have attendance marked
    if (lessonSession.attendances.length !== lessonSession.group.groupStudents.length) {
      return NextResponse.json({ 
        error: 'All students must have attendance marked before deducting' 
      }, { status: 400 })
    }

    // Process each attendance
    const transactions = []
    
    for (const attendance of lessonSession.attendances) {
      const groupStudent = lessonSession.group.groupStudents.find(
        gs => gs.studentId === attendance.studentId
      )

      if (!groupStudent) continue

      if (attendance.status === 'PRESENT') {
        // Deduct one lesson for present students
        await prisma.groupStudent.update({
          where: { id: groupStudent.id },
          data: {
            lessonsRemaining: { decrement: 1 }
          }
        })

        // Create transaction record
        transactions.push({
          studentId: attendance.studentId,
          groupId: lessonSession.groupId,
          sessionId: lessonSession.id,
          delta: -1,
          reason: `Lecție prezent - ${new Date(lessonSession.date).toLocaleDateString('ro-RO')}`
        })
      } else if (attendance.status === 'ABSENT') {
        // Increment absences for absent students
        await prisma.groupStudent.update({
          where: { id: groupStudent.id },
          data: {
            absences: { increment: 1 }
          }
        })
      }
    }

    // Create all transaction records
    if (transactions.length > 0) {
      await prisma.lessonTransaction.createMany({
        data: transactions
      })
    }

    // Mark session as processed
    await prisma.lessonSession.update({
      where: { id: sessionId },
      data: { lessonsDeducted: true }
    })

    // ============================================
    // CREATE REAL-TIME NOTIFICATIONS FOR LOW/ZERO/NEGATIVE LESSONS
    // ============================================
    const groupStudentsAfterDeduction = await prisma.groupStudent.findMany({
      where: {
        groupId: lessonSession.groupId,
        status: 'ACTIVE',
        lessonsRemaining: { lte: 3 }
      },
      include: {
        student: true,
        payments: { orderBy: { paymentDate: 'desc' }, take: 1 },
        group: {
          include: {
          }
        }
      }
    })

    for (const gs of groupStudentsAfterDeduction) {
      const lessons = gs.lessonsRemaining
      let type, title, message

      if (lessons < 0) {
        type = 'NEGATIVE_LESSONS'
        title = `🔴 ${gs.student.fullName} are ${lessons} lecții!`
        message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" are lecții negative (${lessons}). Necesită atenție imediată!`
      } else if (lessons === 0) {
        type = 'ZERO_LESSONS'
        title = `⚠️ ${gs.student.fullName} a rămas fără lecții`
        message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" are 0 lecții rămase. Contactați părinții pentru reînnoire.`
      } else {
        type = 'LOW_LESSONS'
        title = `📉 ${gs.student.fullName} are doar ${lessons} lecții`
        message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" (${gs.group.level}) mai are doar ${lessons} lecții.`
      }

      // Check if similar notification exists in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const existingNotification = await prisma.notification.findFirst({
        where: {
          type,
          studentId: gs.studentId,
          groupId: gs.groupId,
          createdAt: { gte: oneDayAgo }
        }
      })

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            type,
            title,
            message,
            link: `/admin/students/${gs.studentId}`,
            recipientId: null, // For all admins
            studentId: gs.studentId,
            groupId: gs.groupId,
            data: { 
              lessonsRemaining: lessons,
              groupName: gs.group.name,
              levelName: gs.group.level
            }
          }
        })

        // Trimite și pe Telegram
        const lastPayment = gs.payments?.[0]
        await notifyLowLessons(
          gs.student.fullName,
          gs.group.name,
          gs.group.level,
          lessons,
          {
            parentName: gs.student.parentName,
            parentPhone: gs.student.parentPhone,
            parentEmail: gs.student.parentEmail,
            lastPaymentAmount: lastPayment?.amount ?? null,
            lastPaymentDate: lastPayment?.paymentDate ?? null,
          }
        )
      }
    }

    return NextResponse.json({ success: true, deducted: transactions.length })
  } catch (error) {
    console.error('Error deducting lessons:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
