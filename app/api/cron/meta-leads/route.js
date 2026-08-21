import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMetaLeadSettings, syncConversationsToLeads } from '@/lib/meta-leads'
import { isConfigured } from '@/lib/meta-messages'

/**
 * Aduce conversațiile noi de pe Messenger și Instagram ca lead-uri.
 *
 * Rulează la 15 minute, dar nu face nimic dacă SUPERADMIN-ul n-a pornit
 * comutatorul din Securitate — deci, oprit fiind, nu costă decât o citire.
 */

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  const fromCron = authHeader === `Bearer ${process.env.CRON_SECRET}`

  // Superadminul poate rula manual, ca să vadă rezultatul pe loc
  if (!fromCron) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'SUPERADMIN' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const settings = await getMetaLeadSettings()

    if (!settings.metaLeadsEnabled) {
      return NextResponse.json({ skipped: true, reason: 'Funcția e oprită din Securitate' })
    }
    if (!isConfigured()) {
      return NextResponse.json({ skipped: true, reason: 'META_ACCESS_TOKEN lipsește' })
    }

    const result = await syncConversationsToLeads()
    return NextResponse.json({ success: true, ...result, trigger: fromCron ? 'cron' : 'manual' })
  } catch (error) {
    console.error('Cron meta-leads:', error)
    return NextResponse.json({ error: error.message || 'Eroare' }, { status: 500 })
  }
}
