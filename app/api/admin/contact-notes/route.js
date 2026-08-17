import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'

// POST - Create a new note
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    // Check permission - view permission allows adding notes
    const permCheck = await checkPermission('contact.view')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu aveți permisiunea de a adăuga notițe' }, { status: 403 })
    }

    const data = await request.json()
    const { contactMessageId, content } = data

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Conținutul notiței este obligatoriu' }, { status: 400 })
    }

    if (!contactMessageId) {
      return NextResponse.json({ error: 'ID-ul mesajului este obligatoriu' }, { status: 400 })
    }

    const note = await prisma.contactNote.create({
      data: {
        contactMessageId,
        content: content.trim()
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Eroare la crearea notiței' }, { status: 500 })
  }
}

// GET - Get notes for a contact message
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contactMessageId = searchParams.get('contactMessageId')

    if (!contactMessageId) {
      return NextResponse.json({ error: 'ID-ul mesajului este obligatoriu' }, { status: 400 })
    }

    const notes = await prisma.contactNote.findMany({
      where: { contactMessageId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Eroare la încărcarea notițelor' }, { status: 500 })
  }
}
