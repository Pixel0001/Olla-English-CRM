import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import { fetchAdsOverview, fetchTokenInfo, isConfigured } from '@/lib/meta-ads'

/**
 * Datele de reclame din Meta, pentru pagina /admin/ads.
 *
 * Apelurile către Meta sunt lente (zeci de secunde la conturi vechi), așa că
 * răspunsul se ține în memorie 15 minute. Butonul „Actualizează" trimite
 * ?refresh=1 și forțează o citire nouă.
 */

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CACHE_MS = 15 * 60 * 1000
let cache = null // { data, at }

export async function GET(request) {
  try {
    await requireAdmin()

    const canView = await checkPermission('ads.view')
    if (!canView.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să vezi reclamele' }, { status: 403 })
    }

    if (!isConfigured()) {
      return NextResponse.json({
        error: 'META_ACCESS_TOKEN nu este setat',
        hint: 'Adaugă token-ul Meta în variabilele de mediu (Vercel → Settings → Environment Variables) și redeployează.',
      }, { status: 503 })
    }

    const refresh = new URL(request.url).searchParams.get('refresh') === '1'
    const fresh = cache && Date.now() - cache.at < CACHE_MS

    if (!refresh && fresh) {
      return NextResponse.json({ ...cache.data, cached: true, cachedAt: new Date(cache.at).toISOString() })
    }

    const [data, token] = await Promise.all([
      fetchAdsOverview(),
      fetchTokenInfo().catch(() => null),
    ])

    const payload = { ...data, token }
    cache = { data: payload, at: Date.now() }

    return NextResponse.json({ ...payload, cached: false })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Eroare la citirea datelor Meta:', error)
    return NextResponse.json(
      { error: error.message || 'Nu s-au putut citi datele de la Meta' },
      { status: 502 }
    )
  }
}
