import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST - Acknowledge a security alert
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const alert = await prisma.securityAlert.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedBy: session.user.id,
        acknowledgedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, alert })
  } catch (error) {
    console.error('Error acknowledging alert:', error)
    return NextResponse.json(
      { error: 'Eroare la confirmarea alertei' },
      { status: 500 }
    )
  }
}
