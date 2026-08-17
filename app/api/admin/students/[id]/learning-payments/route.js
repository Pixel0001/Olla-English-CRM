import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

// GET — listează plățile pentru abonament la /learn
export async function GET(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.view')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const payments = await prisma.learningPayment.findMany({
      where: { studentId },
      orderBy: { paymentDate: 'desc' },
    })
    return NextResponse.json(payments)
  } catch (e) {
    console.error('list learning payments', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST { amount, validDays?, currency?, paymentDate?, notes? }
export async function POST(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const sessionUser = await getCurrentUser()
    const { id: studentId } = await params
    const body = await request.json()
    const { amount, validDays = 30, currency = 'MDL', paymentDate, notes } = body

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Suma invalidă' }, { status: 400 })
    }

    const payDate = paymentDate ? new Date(paymentDate) : new Date()
    const expiresAt = new Date(payDate.getTime() + Number(validDays) * 24 * 60 * 60 * 1000)

    const payment = await prisma.learningPayment.create({
      data: {
        studentId,
        amount: Number(amount),
        currency,
        paymentDate: payDate,
        validDays: Number(validDays),
        expiresAt,
        notes: notes || null,
        createdById: sessionUser.id,
      },
    })
    return NextResponse.json(payment, { status: 201 })
  } catch (e) {
    console.error('create learning payment', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE ?paymentId=xxx
export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    const can = await checkPermission('students.edit')
    if (!can.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id: studentId } = await params
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    if (!paymentId) return NextResponse.json({ error: 'paymentId obligatoriu' }, { status: 400 })

    await prisma.learningPayment.deleteMany({ where: { id: paymentId, studentId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('delete learning payment', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
