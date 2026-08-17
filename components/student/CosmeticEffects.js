'use client'
import CosmeticArt from '@/components/student/CosmeticArt'
/**
 * CosmeticEffects — render-uri și CSS-uri globale pentru toate cosmeticele echipate.
 *
 * Reacționează la evenimentul `olla:equipped-change` pentru update fără refresh.
 *
 * Convenții CSS aplicate:
 *  • USERNAME_COLOR    → `.olla-me-name` (gradient text)
 *  • ANIMATED_FRAME    → `.olla-me-avatar` (ring colorat + animație)
 *  • LEADERBOARD_EFFECT → `.olla-me-row` (glow + animație de fundal)
 *  • CODING_AURA       → `.monaco-editor, .cm-editor` (box-shadow / glow)
 *  • PROFILE_BANNER    → `.olla-profile-banner` (background image gradient)
 *  • ANIMATED_BACKGROUND → body::before fixed overlay
 *
 * Render direct în DOM:
 *  • PET             → emoji animat în colț bottom-left
 *  • PARTICLE_EFFECT → particule full-screen fixed
 */
import { useEffect, useState } from 'react'

// ── Mapări nume cosmetic → preset vizual ─────────────────
const FRAME_PRESETS = {
  'Ramă Bronz':    { ring: '#a16207', glow: '#fbbf24',  speed: '6s' },
  'Ramă Argint':   { ring: '#cbd5e1', glow: '#e2e8f0',  speed: '5s' },
  'Ramă Aur':      { ring: '#fbbf24', glow: '#fde68a',  speed: '4s' },
  'Ramă Diamant':  { ring: '#22d3ee', glow: '#a5f3fc',  speed: '3s' },
  'Ramă Phoenix':  { ring: '#ef4444', glow: '#fca5a5',  speed: '2.5s' },
}

const USERNAME_PRESETS = {
  'Insignă Începător':   { from: '#64748b', to: '#94a3b8' },
  'Insignă Codificator': { from: '#0ea5e9', to: '#3b82f6' },
  'Insignă Maestru':     { from: '#a855f7', to: '#ec4899' },
  'Insignă Hacker':      { from: '#10b981', to: '#22d3ee' },
}

const BANNER_PRESETS = {
  'Banner Curcubeu': 'linear-gradient(90deg, #ef4444, #f59e0b, #fbbf24, #10b981, #3b82f6, #a855f7)',
  'Banner Galaxie':  'radial-gradient(ellipse at top, #581c87, #1e1b4b, #000000)',
  'Banner Aurora':   'linear-gradient(120deg, #10b981, #06b6d4, #8b5cf6, #ec4899)',
}

const LEADERBOARD_PRESETS = {
  'Efect Top Aur':     { color: '#fbbf24', glow: '#fde68a' },
  'Efect Top Phoenix': { color: '#ef4444', glow: '#fca5a5' },
}

const AURA_PRESETS = {
  'Aură Cod Verde': '#10b981',
  'Aură Cod Neon':  '#22d3ee',
}

const BG_PRESETS = {
  'Fundal Cosmic': 'radial-gradient(ellipse at top, rgba(88,28,135,0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(30,27,75,0.2), transparent 50%)',
  'Fundal Neon':   'radial-gradient(ellipse at center, rgba(6,182,212,0.12), transparent 60%), radial-gradient(ellipse at top left, rgba(168,85,247,0.1), transparent 50%)',
}

const PARTICLE_PRESETS = {
  'Efect Stele':  { emoji: '✨', count: 18, duration: '8s' },
  'Efect Foc':    { emoji: '🔥', count: 14, duration: '6s' },
  'Efect Fulger': { emoji: '⚡', count: 12, duration: '5s' },
}

const PET_PRESETS = {
  'Pet Pisicuță':  { emoji: '🐱', anim: 'olla-pet-walk' },
  'Pet Dragonel':  { emoji: '🐲', anim: 'olla-pet-fly' },
  'Pet Phoenix':   { emoji: '🔥🦅', anim: 'olla-pet-fly' },
}

function buildCSS(items) {
  let css = `
@keyframes olla-frame-spin {
  0%   { box-shadow: 0 0 0 3px var(--frame-ring), 0 0 12px 2px var(--frame-glow); }
  50%  { box-shadow: 0 0 0 4px var(--frame-glow), 0 0 20px 6px var(--frame-ring); }
  100% { box-shadow: 0 0 0 3px var(--frame-ring), 0 0 12px 2px var(--frame-glow); }
}
@keyframes olla-row-pulse {
  0%, 100% { box-shadow: inset 4px 0 0 var(--lb-color), 0 0 0 0 transparent; }
  50%      { box-shadow: inset 4px 0 0 var(--lb-color), 0 0 18px 2px var(--lb-glow); }
}
@keyframes olla-float-up {
  0%   { transform: translateY(100vh) scale(0.6); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
}
@keyframes olla-pet-walk {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%      { transform: translateY(-6px) rotate(3deg); }
}
@keyframes olla-pet-fly {
  0%, 100% { transform: translateY(0) translateX(0); }
  25%      { transform: translateY(-8px) translateX(4px); }
  75%      { transform: translateY(-4px) translateX(-4px); }
}
@keyframes olla-bg-drift {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(2%, -2%) scale(1.05); }
}
`

  // ─── ANIMATED_FRAME ───
  const frame = items.find(i => i.type === 'ANIMATED_FRAME')
  if (frame) {
    const p = FRAME_PRESETS[frame.name] || FRAME_PRESETS['Ramă Bronz']
    css += `
.olla-me-avatar {
  --frame-ring: ${p.ring};
  --frame-glow: ${p.glow};
  animation: olla-frame-spin ${p.speed} ease-in-out infinite !important;
}
`
  }

  // ─── USERNAME_COLOR ───
  const uname = items.find(i => i.type === 'USERNAME_COLOR')
  if (uname) {
    const p = USERNAME_PRESETS[uname.name] || { from: '#3b82f6', to: '#a855f7' }
    css += `
.olla-me-name {
  background: linear-gradient(90deg, ${p.from}, ${p.to}) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  font-weight: 800;
}
`
  }

  // ─── LEADERBOARD_EFFECT ───
  const lb = items.find(i => i.type === 'LEADERBOARD_EFFECT')
  if (lb) {
    const p = LEADERBOARD_PRESETS[lb.name] || { color: '#fbbf24', glow: '#fde68a' }
    const icon = lb.name.includes('Phoenix') ? '🔥' : '👑'
    css += `
.olla-me-row {
  position: relative;
  box-shadow: inset 4px 0 0 ${p.color} !important;
  animation: olla-row-pulse-${lb.name.replace(/\s+/g, '_')} 2.4s ease-in-out infinite !important;
}
@keyframes olla-row-pulse-${lb.name.replace(/\s+/g, '_')} {
  0%, 100% { box-shadow: inset 4px 0 0 ${p.color}, 0 0 0 0 transparent; }
  50%      { box-shadow: inset 4px 0 0 ${p.color}, 0 0 20px 4px ${p.glow}88; }
}
.olla-me-row::after {
  content: '${icon}';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  z-index: 20;
  filter: drop-shadow(0 0 6px ${p.glow});
  pointer-events: none;
  animation: olla-icon-bounce 1.2s ease-in-out infinite;
}
@keyframes olla-icon-bounce {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50%       { transform: translateY(-60%) scale(1.2); }
}
`
  }

  // ─── CODING_AURA ───
  const aura = items.find(i => i.type === 'CODING_AURA')
  if (aura) {
    const c = AURA_PRESETS[aura.name] || '#10b981'
    css += `
.monaco-editor, .cm-editor {
  box-shadow: 0 0 0 2px ${c}66, 0 0 24px 4px ${c}44 !important;
  border-radius: 8px;
  transition: box-shadow .3s;
}
.monaco-editor:hover, .cm-editor:hover {
  box-shadow: 0 0 0 2px ${c}, 0 0 32px 6px ${c}66 !important;
}
`
  }

  // ─── PROFILE_BANNER ───
  const banner = items.find(i => i.type === 'PROFILE_BANNER')
  if (banner) {
    const bg = BANNER_PRESETS[banner.name] || 'linear-gradient(90deg, #3b82f6, #a855f7)'
    css += `
.olla-profile-banner {
  background: ${bg} !important;
  background-size: 200% 200% !important;
  animation: olla-banner-shift 6s ease-in-out infinite !important;
}
@keyframes olla-banner-shift {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
`
  }

  // ─── ANIMATED_BACKGROUND — rendered as fixed div in component, not here ───

  return css
}

export default function CosmeticEffects({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    function handle(e) {
      const { equipped } = e.detail || {}
      if (equipped !== undefined) setItems(equipped)
    }
    window.addEventListener('olla:equipped-change', handle)
    return () => window.removeEventListener('olla:equipped-change', handle)
  }, [])

  // Inject CSS în head
  useEffect(() => {
    const STYLE_ID = 'olla-cosmetic-effects'
    let style = document.getElementById(STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      document.head.appendChild(style)
    }
    style.textContent = buildCSS(items)
    return () => {
      // nu eliminăm la unmount — vrem să persiste între pagini
    }
  }, [items])

  // ─── PET ───
  const pet = items.find(i => i.type === 'PET')
  const petPreset = pet && (PET_PRESETS[pet.name] || PET_PRESETS['Pet Pisicuță'])

  // ─── PARTICLE_EFFECT ───
  const particle = items.find(i => i.type === 'PARTICLE_EFFECT')
  const particlePreset = particle && (PARTICLE_PRESETS[particle.name] || PARTICLE_PRESETS['Efect Stele'])

  // ─── ANIMATED_BACKGROUND ───
  const bgItem = items.find(i => i.type === 'ANIMATED_BACKGROUND')
  const bgOverlay = bgItem ? (BG_PRESETS[bgItem.name] || BG_PRESETS['Fundal Cosmic']) : null

  return (
    <>
      {bgOverlay && (
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            background: bgOverlay,
            animation: 'olla-bg-drift 18s ease-in-out infinite alternate',
          }}
        />
      )}
      {pet && petPreset && (
        <div
          className="fixed bottom-20 left-3 z-40 pointer-events-none select-none w-14 h-14"
          style={{ animation: `${petPreset.anim} 2.4s ease-in-out infinite`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
          aria-hidden
        >
          <CosmeticArt type="PET" name={pet.name} rarity={pet.rarity || 'COMMON'} className="w-full h-full" />
        </div>
      )}

      {particlePreset && (
        <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden" aria-hidden>
          {Array.from({ length: particlePreset.count }).map((_, i) => {
            const left = `${(i * 100 / particlePreset.count) + Math.random() * 6}%`
            const delay = `${(i * 0.4).toFixed(1)}s`
            const size = 12 + Math.floor(Math.random() * 14)
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left,
                  bottom: '-30px',
                  fontSize: size,
                  animation: `olla-float-up ${particlePreset.duration} linear infinite`,
                  animationDelay: delay,
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
                }}
              >
                {particlePreset.emoji}
              </span>
            )
          })}
        </div>
      )}
    </>
  )
}
