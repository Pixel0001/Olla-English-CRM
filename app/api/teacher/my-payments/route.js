import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyTeacherActivity } from '@/lib/telegram'

// GET - Fetch payments created by this teacher
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { createdById: session.user.id },
      include: {
        groupStudent: {
          include: {
            student: true,
            group: {
              include: {
              }
            }
          }
        }
      },
      orderBy: { paymentDate: 'desc' }
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create a new payment
export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { groupStudentId, amount, paymentMethod, notes, lessonsToAdd } = body

    if (!groupStudentId) {
      return NextResponse.json({ error: 'Selectează o grupă' }, { status: 400 })
    }
    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Introdu o sumă validă' }, { status: 400 })
    }
    if (!lessonsToAdd || parseInt(lessonsToAdd) <= 0) {
      return NextResponse.json({ error: 'Introdu numărul de lecții (minim 1)' }, { status: 400 })
    }

    // Verify groupStudent exists and teacher has access
    const groupStudent = await prisma.groupStudent.findUnique({
      where: { id: groupStudentId },
      include: {
        group: true,
        student: true
      }
    })

    if (!groupStudent) {
      return NextResponse.json({ error: 'Elevul din grupă nu a fost găsit' }, { status: 404 })
    }

    // Check if teacher has access (is the teacher of the group or created the student)
    const hasAccess = groupStudent.group.teacherId === session.user.id ||
      groupStudent.student.createdById === session.user.id ||
      ['SUPERADMIN', 'ADMIN'].includes(session.user.role)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Nu ai acces la acest elev' }, { status: 403 })
    }

    // Create payment and update lessons in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create payment
      const payment = await tx.payment.create({
        data: {
          groupStudentId,
          amount: parseFloat(amount),
          paymentMethod: paymentMethod || null,
          notes: notes || null,
          lessonsAdded: lessonsToAdd ? parseInt(lessonsToAdd) : null,
          createdById: session.user.id
        },
        include: {
          groupStudent: {
            include: {
              student: true,
              group: {
                include: {
                }
              }
            }
          }
        }
      })

      // Update groupStudent with added lessons (always, since lessonsToAdd is required)
      await tx.groupStudent.update({
        where: { id: groupStudentId },
        data: {
          lessonsRemaining: {
            increment: parseInt(lessonsToAdd)
          }
        }
      })

      // Create transaction record
      await tx.lessonTransaction.create({
        data: {
          studentId: groupStudent.studentId,
          groupId: groupStudent.groupId,
          delta: parseInt(lessonsToAdd),
          reason: `Plată ${amount} MDL - ${lessonsToAdd} lecții adăugate`
        }
      })

      return payment
    })

    // Send Telegram notification - Thread 9
    const details = `👤 Elev: <b>${result.groupStudent.student.fullName}</b>
📚 Grupa: ${result.groupStudent.group.name}
📘 Nivel: ${result.groupStudent.group.level || 'N/A'}
💵 Sumă: <b>${amount} MDL</b>
📖 Lecții adăugate: <b>${lessonsToAdd}</b>
💳 Metodă: ${paymentMethod || 'Nespecificată'}`

    notifyTeacherActivity('payment', session.user.name || session.user.email, details)
      .catch(err => console.error('Telegram notification error:', err))

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
