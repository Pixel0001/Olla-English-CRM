export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'
import { getStudentByToken, preloadStudent, getShopCosmetics, getShopChests, getAllThemes, getStudentShopData } from '@/lib/student-cache'
import ShopClient from '@/components/student/ShopClient'

// Skeleton shown while data loads — gives instant FCP
function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-[#f0fafb] animate-pulse">
      {/* Static header rendered immediately by server — skeleton matches real header */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg, #0c1a1d, #0f2127, #136976)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-16 bg-white/20 rounded-full" />
              <div className="h-7 w-40 bg-white/20 rounded-lg" />
              <div className="h-3 w-24 bg-white/10 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-white/10 rounded-2xl" />)}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-9 w-20 bg-white rounded-xl shadow-sm border border-teal-100" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-white rounded-2xl shadow-sm border border-teal-100" />)}
        </div>
      </div>
    </div>
  )
}

// Async data-fetcher — runs inside Suspense so the skeleton above shows first
async function ShopDataFetcher({ token }) {
  const student = await getStudentByToken(token)
  if (!student) notFound()

  const [cosmetics, chests, themes, { econ, inventory, equipped, activeEvents }] = await Promise.all([
    getShopCosmetics(),
    getShopChests(),
    getAllThemes(),
    getStudentShopData(student.id),
  ])

  const initialData = {
    economy: econ,
    cosmetics,
    chests,
    themes,
    inventory: inventory.map(i => ({ ...i.cosmetic, acquiredAt: i.acquiredAt })),
    equipped: equipped.map(e => ({ type: e.type, cosmeticId: e.cosmeticId, cosmetic: e.cosmetic })),
    activeEvents,
  }

  return (
    <>
      {/* Static header — rendered server-side so it's in the initial HTML (LCP element) */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg, #0c1a1d, #0f2127, #136976)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/learn/${token}`}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition shrink-0">
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                <SparklesIcon className="w-3 h-3 text-yellow-300" /> Magazin
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight text-white">
                Shop & <span className="text-yellow-300">Cufere</span>
              </h1>
              <p className="text-white/70 text-xs mt-0.5 truncate">{student.fullName}</p>
            </div>
          </div>
        </div>
      </div>
      <ShopClient token={token} studentName={student.fullName} initialData={initialData} />
    </>
  )
}

export default async function ShopPage({ params }) {
  const { token } = await params
  // Fire student query immediately — ShopDataFetcher gets React cache hit (0ms wait)
  preloadStudent(token)
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopDataFetcher token={token} />
    </Suspense>
  )
}
