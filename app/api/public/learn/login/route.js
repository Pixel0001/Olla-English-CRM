import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/security/argon2'

// POST { email?, phone?, name?, password }
// Caută elevul după email parinte SAU telefon parinte SAU numeFull, verifică parola, returnează accessToken
export async function POST(req) {
  try {
    const { identifier, password } = await req.json()
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Completează toate câmpurile' }, { status: 400 })
    }

    const q = identifier.trim()

    // Caută după email, telefon sau nume complet (case-insensitive)
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { parentEmail: { equals: q, mode: 'insensitive' } },
          { parentPhone: q },
          { fullName: { equals: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true, fullName: true, accessToken: true,
        password: true, active: true,
      },
    })

    if (!student || !student.password) {
      return NextResponse.json({ error: 'Cont inexistent sau parola nesetată. Contactează profesorul.' }, { status: 401 })
    }

    if (student.active === false) {
      return NextResponse.json({ error: 'Contul este dezactivat. Contactează profesorul.' }, { status: 403 })
    }

    const ok = await verifyPassword(student.password, password)
    if (!ok) {
      return NextResponse.json({ error: 'Parolă greșită' }, { status: 401 })
    }

    return NextResponse.json({ token: student.accessToken, name: student.fullName })
  } catch (e) {
    console.error('[learn/login]', e)
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
