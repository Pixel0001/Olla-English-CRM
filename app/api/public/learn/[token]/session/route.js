import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Single-session enforcement pentru portalul elevului.
//
// POST /api/public/learn/[token]/session  { sessionId }
//   → marchează acest sessionId ca cel activ pentru elev (overwrite).
//   → folosit la mount-ul paginii / la prima vizită din browser.
//
// GET /api/public/learn/[token]/session?sessionId=...
//   → { active: boolean, kicked: boolean }
//   → folosit de polling pentru a detecta dacă alt browser a luat sesiunea.

function getClientInfo(req) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  const ua = req.headers.get('user-agent')?.slice(0, 200) || 'unknown'
  return { ip, ua }
}

export async function POST(req, { params }) {
  const { token } = await params
  let body = {}
  try { body = await req.json() } catch {}
  const sessionId = String(body.sessionId || '').trim()
  if (!sessionId || sessionId.length < 8 || sessionId.length > 80) {
    return NextResponse.json({ error: 'invalid sessionId' }, { status: 400 })
  }

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true, activeSessionId: true },
  })
  if (!student) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (!student.active) return NextResponse.json({ error: 'inactive' }, { status: 403 })

  const { ip, ua } = getClientInfo(req)
  const previousSessionId = student.activeSessionId

  await prisma.student.update({
    where: { id: student.id },
    data: {
      activeSessionId: sessionId,
      activeSessionAt: new Date(),
      activeSessionIp: ip,
      activeSessionUA: ua,
    },
  })

  return NextResponse.json({
    ok: true,
    sessionId,
    kickedPrevious: !!previousSessionId && previousSessionId !== sessionId,
  })
}

export async function GET(req, { params }) {
  const { token } = await params
  const url = new URL(req.url)
  const sessionId = String(url.searchParams.get('sessionId') || '').trim()
  if (!sessionId) return NextResponse.json({ error: 'missing sessionId' }, { status: 400 })

  const student = await prisma.student.findFirst({
    where: { accessToken: token },
    select: { id: true, active: true, activeSessionId: true },
  })
  if (!student) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (!student.active) {
    return NextResponse.json({ active: false, kicked: false, reason: 'inactive' }, { status: 200 })
  }

  // Dacă DB nu are nicio sesiune înregistrată încă, considerăm activă
  // (până la primul claim, oricine accesează tokenul e legitim).
  if (!student.activeSessionId) {
    return NextResponse.json({ active: true, kicked: false })
  }

  const active = student.activeSessionId === sessionId
  return NextResponse.json({ active, kicked: !active })
}
