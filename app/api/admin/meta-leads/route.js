import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMetaLeadSettings, setMetaLeadsEnabled, syncConversationsToLeads } from '@/lib/meta-leads'
import { isConfigured } from '@/lib/meta-messages'

/**
 * Comutatorul „conversațiile devin lead-uri" — doar SUPERADMIN.
 *
 * GET             → starea curentă
 * PUT  { enabled }→ pornește / oprește
 * POST            → sincronizează acum (manual)
 */

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

async function requireSuperadmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Neautentificat', status: 401 }
  if (session.user.role !== 'SUPERADMIN') {
    return { error: 'Doar superadminul poate schimba această setare', status: 403 }
  }
  return { userId: session.user.id }
}

const state = (settings) => ({
  enabled: !!settings.metaLeadsEnabled,
  lastSyncAt: settings.metaLeadsLastSyncAt ? settings.metaLeadsLastSyncAt.toISOString() : null,
  totalCreated: settings.metaLeadsCreated || 0,
  tokenConfigured: isConfigured(),
})

export async function GET() {
  const auth = await requireSuperadmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const settings = await getMetaLeadSettings()
  return NextResponse.json(state(settings))
}

export async function PUT(request) {
  const auth = await requireSuperadmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { enabled } = await request.json()
  const settings = await setMetaLeadsEnabled(enabled, auth.userId)

  return NextResponse.json(state(settings))
}

export async function POST() {
  const auth = await requireSuperadmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const settings = await getMetaLeadSettings()
    if (!settings.metaLeadsEnabled) {
      return NextResponse.json({ error: 'Funcția e oprită — pornește-o mai întâi' }, { status: 400 })
    }

    const result = await syncConversationsToLeads()
    const updated = await getMetaLeadSettings()

    return NextResponse.json({ ...result, ...state(updated) })
  } catch (error) {
    console.error('Eroare la sincronizarea lead-urilor din Meta:', error)
    return NextResponse.json({ error: error.message || 'Sincronizarea a eșuat' }, { status: 502 })
  }
}
