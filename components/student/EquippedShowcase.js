'use client'
import { useEffect, useState } from 'react'
import { TrophyIcon, BoltIcon, SparklesIcon, StarIcon, PaintBrushIcon, FaceSmileIcon } from '@heroicons/react/24/solid'

const TYPE_META = {
  TITLE:               { label: 'Titlu',          Icon: StarIcon,        color: 'from-amber-400 to-orange-500',  text: 'text-amber-50' },
  LEADERBOARD_EFFECT:  { label: 'Trofeu',         Icon: TrophyIcon,      color: 'from-yellow-400 to-amber-500',  text: 'text-yellow-950' },
  ENTRY_EFFECT:        { label: 'Efect intrare',  Icon: BoltIcon,        color: 'from-cyan-400 to-blue-500',     text: 'text-cyan-950' },
  ANIMATED_FRAME:      { label: 'Cadru',          Icon: SparklesIcon,    color: 'from-fuchsia-400 to-pink-500',  text: 'text-fuchsia-950' },
  USERNAME_COLOR:      { label: 'Culoare nume',   Icon: PaintBrushIcon,  color: 'from-rose-400 to-red-500',      text: 'text-rose-50' },
  PROFILE_BANNER:      { label: 'Banner',         Icon: SparklesIcon,    color: 'from-indigo-400 to-violet-500', text: 'text-indigo-50' },
  CODING_AURA:         { label: 'Aură cod',       Icon: BoltIcon,        color: 'from-emerald-400 to-teal-500',  text: 'text-emerald-950' },
  PARTICLE_EFFECT:     { label: 'Particule',      Icon: SparklesIcon,    color: 'from-purple-400 to-pink-500',   text: 'text-purple-50' },
  ANIMATED_BACKGROUND: { label: 'Fundal',         Icon: SparklesIcon,    color: 'from-slate-400 to-slate-600',   text: 'text-slate-50' },
  RARE_COSMETIC:       { label: 'Rar',            Icon: SparklesIcon,    color: 'from-pink-400 to-rose-500',     text: 'text-pink-50' },
  PET:                 { label: 'Pet',            Icon: FaceSmileIcon,   color: 'from-lime-400 to-green-500',    text: 'text-lime-950' },
  THEME:               { label: 'Temă',           Icon: PaintBrushIcon,  color: 'from-violet-400 to-purple-500', text: 'text-violet-50' },
}

export default function EquippedShowcase({ items: initialItems = [], themeName: initialThemeName }) {
  const [items, setItems] = useState(initialItems)
  const [themeName, setThemeName] = useState(initialThemeName)
  const [open, setOpen] = useState(true)
  const [showEntryFx, setShowEntryFx] = useState(false)

  const hasEntry = items.some(i => i.type === 'ENTRY_EFFECT')

  useEffect(() => {
    if (hasEntry) {
      setShowEntryFx(true)
      const t = setTimeout(() => setShowEntryFx(false), 1800)
      return () => clearTimeout(t)
    }
  }, [hasEntry])

  // Ascultă la update-uri live de la ShopClient (equip/unequip fără refresh)
  useEffect(() => {
    function handleEquipChange(e) {
      const { equipped, themeName: tn } = e.detail || {}
      if (equipped !== undefined) setItems(equipped)
      if (tn !== undefined) setThemeName(tn)
    }
    window.addEventListener('olla:equipped-change', handleEquipChange)
    return () => window.removeEventListener('olla:equipped-change', handleEquipChange)
  }, [])

  if (!items.length && !themeName) return null

  return (
    <>
      {/* ── ENTRY EFFECT — fulger la încărcare ── */}
      {showEntryFx && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-transparent to-yellow-200/20 animate-pulse" />
          <svg
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 drop-shadow-[0_0_30px_rgba(56,189,248,0.9)]"
            style={{ animation: 'olla-bolt 1.6s ease-out forwards' }}
          >
            <defs>
              <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path
              d="M55 5 L25 55 L45 55 L35 95 L80 40 L55 40 L70 5 Z"
              fill="url(#bolt-grad)"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
          <style jsx>{`
            @keyframes olla-bolt {
              0%   { transform: translate(-50%, -50%) scale(0.3) rotate(-12deg); opacity: 0; }
              30%  { transform: translate(-50%, -50%) scale(1.2) rotate(0deg); opacity: 1; }
              60%  { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(1.5) rotate(8deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* ── PANOU FIX — items echipate ── */}
      <div className="fixed top-3 right-3 z-50 max-w-[280px] hidden md:block">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full bg-white/95 backdrop-blur-md rounded-t-2xl px-3 py-2 shadow-lg border border-amber-200 flex items-center gap-2 text-left hover:bg-white transition"
        >
          <SparklesIcon className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-blue-900 flex-1">Echipat</span>
          <span className="text-[10px] font-extrabold text-slate-400">{open ? '▼' : '▲'}</span>
        </button>

        {open && (
          <div className="bg-white/95 backdrop-blur-md rounded-b-2xl p-3 shadow-lg border-x border-b border-amber-200 space-y-2">
            {themeName && (
              <div className="flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg ring-1 ring-violet-200">
                <PaintBrushIcon className="w-4 h-4 text-violet-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-violet-500">Temă activă</div>
                  <div className="text-xs font-extrabold text-violet-900 truncate">{themeName}</div>
                </div>
              </div>
            )}

            {items.length === 0 && !themeName && (
              <div className="text-xs text-slate-500 text-center py-2">Nimic echipat încă</div>
            )}

            {items.map(it => {
              const meta = TYPE_META[it.type] || TYPE_META.RARE_COSMETIC
              const Icon = meta.Icon
              return (
                <div
                  key={it.type}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gradient-to-r ${meta.color} ${meta.text} shadow-sm`}
                >
                  <Icon className="w-4 h-4 shrink-0 drop-shadow" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">{meta.label}</div>
                    <div className="text-xs font-extrabold truncate">{it.name}</div>
                  </div>
                  {it.type === 'LEADERBOARD_EFFECT' && (
                    <span className="text-base animate-pulse">🏆</span>
                  )}
                  {it.type === 'ENTRY_EFFECT' && (
                    <span className="text-base animate-bounce">⚡</span>
                  )}
                  {it.type === 'TITLE' && (
                    <span className="text-base">⭐</span>
                  )}
                  {it.type === 'PET' && (
                    <span className="text-base animate-bounce">🐾</span>
                  )}
                </div>
              )
            })}

            <div className="pt-1 text-[10px] text-slate-400 text-center">
              Schimbă din <span className="font-bold text-blue-600">Shop</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BARĂ MOBILĂ — un singur rând cu icoane ── */}
      {(items.length > 0 || themeName) && (
        <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-full px-3 py-2 shadow-xl border border-amber-200 flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
          {themeName && <span title={`Temă: ${themeName}`} className="text-sm">🎨</span>}
          {items.map(it => {
            const meta = TYPE_META[it.type] || TYPE_META.RARE_COSMETIC
            const Icon = meta.Icon
            return (
              <span
                key={it.type}
                title={`${meta.label}: ${it.name}`}
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${meta.color} ${meta.text} flex items-center justify-center shadow`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
            )
          })}
        </div>
      )}
    </>
  )
}
