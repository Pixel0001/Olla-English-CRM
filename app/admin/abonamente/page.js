export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { getSystemSettings } from '@/lib/student-limits'
import GamificationHub from '@/components/admin/gamification/GamificationHub'
import Link from 'next/link'
import { BanknotesIcon } from '@heroicons/react/24/outline'

export default async function AbonamentePage() {
  return (
    <PermissionGuard permission="system.settings">
      <Suspense fallback={<div className="space-y-4 animate-pulse"><div className="h-10 w-64 bg-gray-200 rounded-xl" /><div className="h-96 bg-white rounded-2xl border border-gray-200" /></div>}>
        <Content />
      </Suspense>
    </PermissionGuard>
  )
}

async function Content() {
  const settings = await getSystemSettings({ fresh: true })
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              🎮 Gamification Hub
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Abonamente, cosmetice, theme-uri, cufere și leaderboard events.
          </p>
        </div>
        <Link
          href="/admin/abonamente/conturi"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors shrink-0"
        >
          <BanknotesIcon className="w-4 h-4" />
          Conturi & Plăți elevi
        </Link>
      </div>

      <GamificationHub initialSettings={settings} />
    </div>
  )
}
