'use client'

import CosmeticArt from '@/components/student/CosmeticArt'
import TitleBadge from '@/components/student/TitleBadge'
import { getBannerStyle } from '@/lib/banner-presets'

const RANK_BG   = ['bg-yellow-400', 'bg-slate-300', 'bg-amber-600']
const RANK_RING = ['ring-yellow-300','ring-slate-200','ring-amber-400']
const RANK_TEXT = ['text-amber-900', 'text-slate-700','text-amber-100']

export default function LeaderboardPodium({ top3 }) {
  if (!top3 || top3.length < 3) return null

  return (
    <div className="flex items-end justify-center gap-3 max-w-xs mx-auto">
      {[1, 0, 2].map((pos) => {
        const s = top3[pos]
        const isFirst = pos === 0
        const barPy = pos === 0 ? 'py-5' : pos === 1 ? 'py-3' : 'py-2'
        const bannerStyle = getBannerStyle(s.bannerName)
        return (
          <div key={s.id} className="relative flex flex-col items-center gap-1.5 flex-1 min-w-0 rounded-2xl overflow-hidden">
            {bannerStyle && (
              <span aria-hidden className="absolute inset-0 pointer-events-none rounded-2xl" style={{ ...bannerStyle, opacity: 0.55 }} />
            )}
            {isFirst && <span className="text-yellow-400 text-lg">🏆</span>}
            <div className="relative">
              <div className={
                'rounded-full flex items-center justify-center font-extrabold shadow-lg ring-2 overflow-hidden ' +
                (isFirst ? 'w-16 h-16 text-xl ' : 'w-12 h-12 text-base ') +
                RANK_BG[pos] + ' ' + RANK_RING[pos] + ' ' + RANK_TEXT[pos]
              }>
                {s.titleIcon
                  ? <img src={s.titleIcon} alt="" className="w-full h-full object-cover" />
                  : s.titleRarity
                    ? <CosmeticArt type="TITLE" rarity={s.titleRarity} className="w-full h-full" />
                    : s.fullName.charAt(0).toUpperCase()}
              </div>
              <span className={
                'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center font-black ring-2 ring-white ' +
                (isFirst ? 'w-6 h-6 text-[10px] ' : 'w-5 h-5 text-[9px] ') +
                RANK_BG[pos] + ' ' + RANK_TEXT[pos]
              }>
                {pos + 1}
              </span>
            </div>
            <span className="text-[11px] font-bold text-white/80 text-center leading-tight truncate w-full px-1">
              {s.fullName.split(' ')[0]}
            </span>
            {s.titleName && (
              <TitleBadge
                name={s.titleName}
                effect={s.titleEffect || 'none'}
                rarity={s.titleRarity || 'COMMON'}
              />
            )}
            <div className={
              'w-full rounded-t-xl text-center ' + barPy + ' ' +
              (isFirst ? 'bg-yellow-500/20 border border-yellow-400/20' : 'bg-white/10')
            }>
              <div className={'font-extrabold text-sm ' + (isFirst ? 'text-yellow-300' : 'text-white')}>{s.xp}</div>
              <div className={'text-[9px] ' + (isFirst ? 'text-yellow-300/60' : 'text-white/40')}>XP</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
