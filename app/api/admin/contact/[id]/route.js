import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check permission
    const permCheck = await checkPermission('contact.view')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să vezi mesajele de contact' }, { status: 403 })
    }

    const { id } = await params

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    })

    if (!message) {
      return NextResponse.json({ error: 'Mesaj negăsit' }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Eroare:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check permission - view permission allows status/notes updates
    const permCheck = await checkPermission('contact.view')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să gestionezi mesajele de contact' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()

    const updateData = {}
    if (data.status) updateData.status = data.status
    if (data.notes !== undefined) updateData.notes = data.notes

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Eroare:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['SUPERADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check permission
    const permCheck = await checkPermission('contact.delete')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să ștergi mesajele de contact' }, { status: 403 })
    }

    const { id } = await params

    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Eroare:', error)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
