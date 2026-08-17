import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyNewLead } from '@/lib/telegram'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

export async function POST(request) {
  try {
    // Rate limiting: 1 request per minute
    const clientIP = getClientIP(request)
    const rateLimitKey = `contact:${clientIP}`
    const { success, remaining, resetIn } = checkRateLimit(rateLimitKey, 1, 60000)

    if (!success) {
      return NextResponse.json(
        { error: `Prea multe cereri. Încercați din nou în ${Math.ceil(resetIn / 1000)} secunde.` },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000))
          }
        }
      )
    }

    const data = await request.json()
    const { name, email, phone, message } = data

    // Validare
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Numele, email-ul și mesajul sunt obligatorii' },
        { status: 400 }
      )
    }

    // Salvare în baza de date
    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        message: message || null,
        source: 'SITE',
        status: 'LEAD'
      }
    })

    // Trimite notificare pe Telegram cu butoane
    await notifyNewLead(lead)

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Eroare la salvarea mesajului:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la procesarea cererii' },
      { status: 500 }
    )
  }
}

// Fără GET public: lista de lead-uri conține date personale și se citește
// exclusiv autentificat, prin /api/admin/leads.
