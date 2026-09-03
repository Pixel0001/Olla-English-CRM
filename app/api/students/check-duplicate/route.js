import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Există deja un elev cu numele ăsta?
 *
 * Nu blochează nimic — doar spune ce seamănă, ca să nu se creeze din greșeală
 * al treilea „Popescu Maria". Compararea se face pe nume normalizat (fără
 * diacritice, fără majuscule, fără ordinea cuvintelor), pentru că oamenii scriu
 * „Ion Popescu" azi și „Popescu Ion" mâine.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const normalize = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // scoate diacriticele
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const words = (s) => normalize(s).split(' ').filter((w) => w.length >= 3)

const digits = (s) => String(s || '').replace(/\D/g, '')

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['SUPERADMIN', 'ADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''

  const nameWords = words(name)
  const phoneDigits = digits(phone)

  // Fără măcar un cuvânt sau un telefon, n-avem ce compara
  if (nameWords.length === 0 && phoneDigits.length < 6) {
    return NextResponse.json({ matches: [] })
  }

  const students = await prisma.student.findMany({
    select: {
      id: true,
      fullName: true,
      parentName: true,
      parentPhone: true,
      age: true,
      isAdult: true,
      createdAt: true,
      groupStudents: {
        where: { status: { notIn: ['LEFT', 'TRANSFERRED'] } },
        select: { group: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const matches = []

  for (const s of students) {
    const existing = words(s.fullName)
    const common = nameWords.filter((w) => existing.includes(w))

    const samePhone =
      phoneDigits.length >= 6 &&
      (digits(s.parentPhone).endsWith(phoneDigits.slice(-8)) ||
        phoneDigits.endsWith(digits(s.parentPhone).slice(-8)))

    // Nume identic, un cuvânt comun (prenume sau nume de familie), sau telefon
    const exact = normalize(s.fullName) === normalize(name) && nameWords.length > 0
    if (!exact && common.length === 0 && !samePhone) continue

    matches.push({
      id: s.id,
      fullName: s.fullName,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      age: s.age,
      isAdult: s.isAdult,
      groups: s.groupStudents.map((gs) => gs.group?.name).filter(Boolean),
      addedAt: s.createdAt.toISOString(),
      // exact > telefon identic > un cuvânt comun
      score: exact ? 3 : samePhone ? 2 : common.length >= 2 ? 2 : 1,
      reason: exact
        ? 'același nume'
        : samePhone
          ? 'același telefon'
          : common.length >= 2
            ? 'nume foarte asemănător'
            : 'nume asemănător',
    })
  }

  matches.sort((a, b) => b.score - a.score || a.fullName.localeCompare(b.fullName, 'ro'))

  return NextResponse.json({
    matches: matches.slice(0, 6),
    total: matches.length,
    // Doar potrivirile puternice merită o avertizare apăsată
    strong: matches.some((m) => m.score >= 2),
  })
}
