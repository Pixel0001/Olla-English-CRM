import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import { getSystemSettings, invalidateSettingsCache, DEFAULT_LIMITS } from '@/lib/student-limits'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const can = await checkPermission('system.settings')
    if (!can.allowed) return NextResponse.json({ error: 'Fără permisiune' }, { status: 403 })

    const settings = await getSystemSettings({ fresh: true })
    return NextResponse.json(settings)
  } catch (e) {
    if (e.message === 'Unauthorized' || e.message === 'Forbidden') {
      return NextResponse.json({ error: e.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await requireAdmin()
    const can = await checkPermission('system.settings')
    if (!can.allowed) return NextResponse.json({ error: 'Fără permisiune' }, { status: 403 })

    const me = await getCurrentUser()
    const body = await request.json()

    const data = {}
    const fields = [
      'problemCooldownMin', 'cooldownEnabled',
      'dailyXpCap', 'xpCapEnabled',
      'levelCurve', 'levelNames',
    ]
    for (const k of fields) if (k in body) data[k] = body[k]

    // Validări
    if (data.problemCooldownMin != null) {
      const v = parseInt(data.problemCooldownMin)
      if (Number.isNaN(v) || v < 0 || v > 60 * 24 * 7) {
        return NextResponse.json({ error: 'Cooldown invalid (0..10080 min)' }, { status: 400 })
      }
      data.problemCooldownMin = v
    }
    if (data.dailyXpCap != null) {
      const v = parseInt(data.dailyXpCap)
      if (Number.isNaN(v) || v < 0 || v > 100000) {
        return NextResponse.json({ error: 'Cap XP invalid (0..100000)' }, { status: 400 })
      }
      data.dailyXpCap = v
    }
    if (data.levelCurve) {
      if (!Array.isArray(data.levelCurve) || data.levelCurve.some(n => !Number.isInteger(n) || n < 0)) {
        return NextResponse.json({ error: 'levelCurve invalid' }, { status: 400 })
      }
      // Sortăm crescător & dedup
      data.levelCurve = [...new Set(data.levelCurve.map(Number))].sort((a, b) => a - b)
      if (data.levelCurve[0] !== 0) data.levelCurve = [0, ...data.levelCurve]
    }
    if (data.levelNames && !Array.isArray(data.levelNames)) {
      return NextResponse.json({ error: 'levelNames invalid' }, { status: 400 })
    }

    // Asigurăm singleton-ul
    let existing = await prisma.systemSettings.findFirst()
    if (!existing) {
      existing = await prisma.systemSettings.create({ data: { ...DEFAULT_LIMITS, ...data, updatedById: me?.id } })
    } else {
      existing = await prisma.systemSettings.update({
        where: { id: existing.id },
        data: { ...data, updatedById: me?.id },
      })
    }
    invalidateSettingsCache()

    return NextResponse.json(existing)
  } catch (e) {
    if (e.message === 'Unauthorized' || e.message === 'Forbidden') {
      return NextResponse.json({ error: e.message }, { status: 401 })
    }
    console.error('[system-settings PATCH]', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
