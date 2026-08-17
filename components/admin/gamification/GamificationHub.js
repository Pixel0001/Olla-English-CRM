'use client'

import { useState } from 'react'
import AbonamenteForm from '@/components/admin/AbonamenteForm'
import CosmeticsManager from './CosmeticsManager'
import ThemesManager from './ThemesManager'
import ChestsManager from './ChestsManager'
import LeaderboardEventsManager from './LeaderboardEventsManager'
import {
  Cog6ToothIcon, SparklesIcon, SwatchIcon, GiftIcon, TrophyIcon,
} from '@heroicons/react/24/outline'

const TABS = [
  { id: 'subscription', label: 'Abonamente',  icon: Cog6ToothIcon, color: 'from-slate-500 to-slate-700' },
  { id: 'cosmetics',    label: 'Cosmetice',   icon: SparklesIcon,  color: 'from-fuchsia-500 to-pink-600' },
  { id: 'themes',       label: 'Theme-uri',   icon: SwatchIcon,    color: 'from-cyan-500 to-blue-600' },
  { id: 'chests',       label: 'Cufere',      icon: GiftIcon,      color: 'from-amber-500 to-orange-600' },
  { id: 'leaderboards', label: 'Leaderboard Events', icon: TrophyIcon, color: 'from-violet-500 to-indigo-600' },
]

export default function GamificationHub({ initialSettings }) {
  const [tab, setTab] = useState('subscription')

  return (
    <div className="space-y-4">
      {/* Tab strip — neon gaming style */}
      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto p-1.5 bg-slate-900 rounded-2xl ring-1 ring-slate-800 shadow-lg">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-r ${t.color} text-white shadow-lg scale-105`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {active && (
                  <span className="absolute inset-0 rounded-xl ring-2 ring-white/30 pointer-events-none animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-4 sm:p-6">
        {tab === 'subscription' && (
          <div className="max-w-3xl">
            <AbonamenteForm initial={initialSettings} />
          </div>
        )}
        {tab === 'cosmetics'    && <CosmeticsManager />}
        {tab === 'themes'       && <ThemesManager />}
        {tab === 'chests'       && <ChestsManager />}
        {tab === 'leaderboards' && <LeaderboardEventsManager />}
      </div>
    </div>
  )
}
