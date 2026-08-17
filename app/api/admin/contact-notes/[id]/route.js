import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkPermission } from '@/lib/permissions'

// DELETE - Delete a note
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    // Check permission
    const permCheck = await checkPermission('contact.delete')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu aveți permisiunea de a șterge notițe' }, { status: 403 })
    }

    const { id } = await params

    // Check if note exists
    const note = await prisma.contactNote.findUnique({
      where: { id }
    })

    if (!note) {
      return NextResponse.json({ error: 'Notița nu a fost găsită' }, { status: 404 })
    }

    await prisma.contactNote.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Eroare la ștergerea notiței' }, { status: 500 })
  }
}
