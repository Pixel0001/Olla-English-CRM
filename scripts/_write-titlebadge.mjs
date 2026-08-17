import { writeFileSync } from 'fs'

const out = `'use client'
import { useEffect } from 'react'

export const TITLE_EFFECTS = [
  { value: 'none',      label: '— Simplu (fără efect)' },
  { value: 'lightning', label: '⚡ Fulger Electric' },
  { value: 'fire',      label: '🔥 Foc Infernal' },
  { value: 'ice',       label: '❄️ Cristal de Gheață' },
  { value: 'neon',      label: '💜 Neon Cyber' },
  { value: 'rainbow',   label: '🌈 Curcubeu Legendar' },
  { value: 'mythic',    label: '🌟 Mythic Auriu' },
  { value: 'shadow',    label: '🖤 Shadow Abyss' },
]

const KEYFRAMES = \`
@keyframes tb-lightning-flash {
  0%,90%,100% { opacity:1; }
  92%,96%     { opacity:0.15; }
  94%          { opacity:1; }
}
@keyframes tb-lightning-bolt {
  0%,85%  { opacity:0; transform:scaleY(0.6) translateY(-4px); }
  86%,90% { opacity:1; transform:scaleY(1) translateY(0); }
  100%    { opacity:0; }
}
@keyframes tb-fire-flicker {
  0%,100% { transform:scaleX(1) scaleY(1) rotate(-1deg); filter:brightness(1); }
  25%     { transform:scaleX(0.97) scaleY(1.04) rotate(1.5deg); filter:brightness(1.15); }
  50%     { transform:scaleX(1.02) scaleY(0.97) rotate(-0.5deg); filter:brightness(0.95); }
  75%     { transform:scaleX(0.98) scaleY(1.03) rotate(1deg); filter:brightness(1.1); }
}
@keyframes tb-fire-rise {
  0%   { transform:translateY(0) scaleX(1) scaleY(1); opacity:1; }
  100% { transform:translateY(-14px) scaleX(0.4) scaleY(0.3); opacity:0; }
}
@keyframes tb-ice-shimmer {
  0%,100% { background-position:0% 50%; }
  50%     { background-position:100% 50%; }
}
@keyframes tb-ice-sparkle {
  0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
  50%     { opacity:1; transform:scale(1) rotate(180deg); }
}
@keyframes tb-neon-pulse {
  0%,100% { opacity:1; filter:brightness(1); }
  50%     { opacity:0.7; filter:brightness(1.6); }
}
@keyframes tb-neon-scanline {
  0%   { transform:translateY(-100%); }
  100% { transform:translateY(200%); }
}
@keyframes tb-rainbow-shift {
  0%   { background-position:0% 50%; }
  100% { background-position:300% 50%; }
}
@keyframes tb-rainbow-glow {
  0%,100% { box-shadow:0 0 8px 2px #ef444488, 0 0 16px 4px #f97316aa; }
  25%     { box-shadow:0 0 8px 2px #22c55e88, 0 0 16px 4px #3b82f6aa; }
  50%     { box-shadow:0 0 8px 2px #a855f788, 0 0 16px 4px #ec489999; }
  75%     { box-shadow:0 0 8px 2px #06b6d488, 0 0 16px 4px #eab30899; }
}
@keyframes tb-mythic-glow {
  0%,100% { box-shadow:0 0 6px 2px #fbbf2466, 0 0 18px 4px #a855f755; }
  50%     { box-shadow:0 0 14px 4px #fbbf24cc, 0 0 30px 8px #a855f799; }
}
@keyframes tb-mythic-star {
  0%   { transform:translate(0,0) scale(1) rotate(0deg); opacity:1; }
  100% { transform:translate(var(--sx),var(--sy)) scale(0) rotate(360deg); opacity:0; }
}
@keyframes tb-shadow-breathe {
  0%,100% { box-shadow:inset 0 0 12px 4px #7c3aed44, 0 0 8px 2px #4c1d9544; }
  50%     { box-shadow:inset 0 0 20px 8px #7c3aed88, 0 0 20px 6px #7c3aed66; }
}
@keyframes tb-shadow-tendrils {
  0%   { stroke-dashoffset:60; opacity:0.6; }
  100% { stroke-dashoffset:0; opacity:0; }
}
@keyframes tb-3d-float {
  0%,100% { transform:translateY(0px); }
  50%     { transform:translateY(-1.5px); }
}
\`

let cssInjected = false
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return
  if (document.getElementById('olla-titlebadge-kf')) { cssInjected = true; return }
  const s = document.createElement('style')
  s.id = 'olla-titlebadge-kf'
  s.textContent = KEYFRAMES
  document.head.appendChild(s)
  cssInjected = true
}

function cleanName(name) {
  return (name || '').replace(/^Titlu\\s+[\u201e\u201d'"]?/, '').replace(/[\u201d\u201e'"\u201c]$/, '').toUpperCase()
}

function LightningBadge({ label }) {
  const bolt = (delay) => ({
    flexShrink: 0,
    animation: 'tb-lightning-bolt 2.5s ease-in-out infinite',
    animationDelay: delay,
    filter: 'drop-shadow(0 0 3px #facc15)',
  })
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 8px 3px 6px', borderRadius: 6,
      background: 'linear-gradient(180deg,#1a1a2e 0%,#0d0d1a 100%)',
      border: '1.5px solid #facc15',
      boxShadow: '0 0 10px 2px #facc1566, inset 0 0 8px 2px #facc1522',
      animation: 'tb-3d-float 3s ease-in-out infinite', overflow: 'hidden',
    }}>
      <span style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(90deg,transparent,rgba(250,204,21,0.15),transparent)',
        animation: 'tb-neon-scanline 2.5s linear infinite', zIndex: 0,
      }} />
      <svg width="10" height="18" viewBox="0 0 10 18" style={bolt('-0.3s')}>
        <polygon points="7,0 3,8 6,8 3,18 10,6 6,6" fill="#facc15" />
        <polygon points="7,0 3,8 6,8 3,18 10,6 6,6" fill="#fff" opacity="0.4" />
      </svg>
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.08em',
        color: '#facc15', WebkitTextStroke: '0.5px #f59e0b',
        textShadow: '0 1px 0 #92400e, 0 2px 0 #78350f, 0 3px 4px rgba(0,0,0,0.8), 0 0 10px #fbbf24',
        animation: 'tb-lightning-flash 3.5s ease-in-out infinite',
      }}>⚡{label}</span>
      <svg width="10" height="18" viewBox="0 0 10 18" style={bolt('-1.1s')}>
        <polygon points="7,0 3,8 6,8 3,18 10,6 6,6" fill="#facc15" />
        <polygon points="7,0 3,8 6,8 3,18 10,6 6,6" fill="#fff" opacity="0.4" />
      </svg>
    </span>
  )
}

function FireBadge({ label }) {
  const flames = [
    { x: 4,  delay: '0s',    dur: '1.1s', color: '#ef4444' },
    { x: 9,  delay: '-0.3s', dur: '0.9s', color: '#f97316' },
    { x: 14, delay: '-0.7s', dur: '1.2s', color: '#fbbf24' },
    { x: 19, delay: '-0.1s', dur: '1s',   color: '#ef4444' },
  ]
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '4px 8px 3px', borderRadius: 6,
      background: 'linear-gradient(180deg,#1c0a00,#0d0000)',
      border: '1.5px solid #c2410c',
      boxShadow: '0 0 12px 3px #ef444455, inset 0 0 10px 2px #ef444422',
      animation: 'tb-3d-float 2.5s ease-in-out infinite', overflow: 'visible',
    }}>
      <svg style={{ position: 'absolute', top: -12, left: 0, right: 0, width: '100%', height: 14, overflow: 'visible', pointerEvents: 'none' }} viewBox="0 0 28 14" preserveAspectRatio="none">
        {flames.map((f, i) => (
          <g key={i}>
            <ellipse cx={f.x} cy={12} rx={3} ry={5} fill={f.color}
              style={{ animation: \`tb-fire-rise \${f.dur} ease-out infinite\`, animationDelay: f.delay, filter: \`drop-shadow(0 0 3px \${f.color})\` }} />
            <ellipse cx={f.x} cy={11} rx={1.5} ry={3} fill="#fff9" />
          </g>
        ))}
      </svg>
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.06em',
        background: 'linear-gradient(180deg,#fef08a 0%,#fbbf24 30%,#f97316 65%,#ef4444 100%)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        WebkitTextStroke: '0.6px #7c1d08',
        filter: 'drop-shadow(0 0 4px #ef4444bb)',
        animation: 'tb-fire-flicker 1.8s ease-in-out infinite',
      }}>🔥{label}</span>
    </span>
  )
}

function IceBadge({ label }) {
  const sparkles = [
    { x: '10%', y: '20%', d: '-0.1s' }, { x: '80%', y: '15%', d: '-0.5s' },
    { x: '50%', y: '80%', d: '-0.8s' }, { x: '90%', y: '70%', d: '-0.2s' },
    { x: '15%', y: '70%', d: '-1.1s' },
  ]
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6,
      background: 'linear-gradient(135deg,#0c1a3a,#071228,#0f2555)',
      border: '1.5px solid #38bdf8',
      boxShadow: '0 0 12px 3px #38bdf866, inset 0 0 10px 2px #7dd3fc22',
      animation: 'tb-3d-float 4s ease-in-out infinite', overflow: 'hidden',
    }}>
      {sparkles.map((sp, i) => (
        <span key={i} style={{
          position: 'absolute', left: sp.x, top: sp.y, width: 4, height: 4, pointerEvents: 'none',
          background: 'radial-gradient(circle,#e0f2fe,#38bdf8)', borderRadius: '50%',
          animation: 'tb-ice-sparkle 2s ease-in-out infinite', animationDelay: sp.d,
        }} />
      ))}
      <span style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(120deg,transparent 30%,rgba(224,242,254,0.12) 50%,transparent 70%)',
        backgroundSize: '200% 200%', animation: 'tb-ice-shimmer 3s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.08em',
        background: 'linear-gradient(180deg,#f0f9ff 0%,#bae6fd 40%,#38bdf8 100%)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        WebkitTextStroke: '0.5px #0c4a6e',
        textShadow: '0 1px 0 #0369a1, 0 2px 4px rgba(0,0,0,0.8), 0 0 12px #38bdf8',
        filter: 'drop-shadow(0 0 5px #38bdf8cc)',
      }}>❄️{label}</span>
    </span>
  )
}

function NeonBadge({ label }) {
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6, background: '#08001a',
      border: '1.5px solid #c026d3',
      boxShadow: '0 0 8px 2px #c026d366, 0 0 20px 4px #7e22ce44, inset 0 0 12px 3px #a21caf22',
      animation: 'tb-3d-float 3s ease-in-out infinite', overflow: 'hidden',
    }}>
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg,rgba(192,38,211,0.08),transparent)', pointerEvents: 'none',
      }} />
      <span style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
        background: 'linear-gradient(90deg,transparent,#c026d3,#e879f9,#c026d3,transparent)',
        boxShadow: '0 0 8px 2px #c026d3',
        animation: 'tb-neon-pulse 2s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.1em',
        color: '#f0abfc', WebkitTextStroke: '0.5px #86198f',
        textShadow: '0 0 6px #e879f9, 0 0 14px #c026d3, 0 0 28px #a21caf, 0 1px 0 #4a044e, 0 2px 4px rgba(0,0,0,0.9)',
        animation: 'tb-neon-pulse 2s ease-in-out infinite',
      }}>💜{label}</span>
    </span>
  )
}

function RainbowBadge({ label }) {
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6, background: '#0a0a0a',
      animation: 'tb-rainbow-glow 3s linear infinite, tb-3d-float 4s ease-in-out infinite',
    }}>
      <span style={{
        position: 'absolute', inset: -1.5, borderRadius: 7,
        background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#22c55e,#3b82f6,#a855f7,#ef4444)',
        backgroundSize: '300% 100%', animation: 'tb-rainbow-shift 3s linear infinite', zIndex: -1, pointerEvents: 'none',
      }} />
      <span style={{ position: 'absolute', inset: 1, borderRadius: 5, background: '#0a0a0a', zIndex: 0, pointerEvents: 'none' }} />
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.06em',
        background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#22c55e,#3b82f6,#a855f7,#ef4444)',
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        WebkitTextStroke: '0.4px rgba(0,0,0,0.4)',
        animation: 'tb-rainbow-shift 3s linear infinite',
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
      }}>🌈{label}</span>
    </span>
  )
}

function MythicBadge({ label }) {
  const stars = [
    { sx: '-12px', sy: '-10px', d: '0s',    dur: '2.2s' },
    { sx: '14px',  sy: '-12px', d: '-0.6s', dur: '1.8s' },
    { sx: '-10px', sy: '10px',  d: '-1.2s', dur: '2s'   },
    { sx: '12px',  sy: '8px',   d: '-0.3s', dur: '1.6s' },
    { sx: '0px',   sy: '-14px', d: '-0.9s', dur: '2.4s' },
  ]
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6,
      background: 'linear-gradient(135deg,#1a0533,#0d001f,#1a0533)',
      border: '1.5px solid #a855f7',
      animation: 'tb-mythic-glow 2.5s ease-in-out infinite, tb-3d-float 4s ease-in-out infinite',
      overflow: 'visible',
    }}>
      {stars.map((st, i) => (
        <span key={i} style={{
          position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, borderRadius: '50%',
          background: 'radial-gradient(circle,#fff,#fbbf24)', pointerEvents: 'none',
          '--sx': st.sx, '--sy': st.sy,
          animation: \`tb-mythic-star \${st.dur} ease-out infinite\`, animationDelay: st.d,
          boxShadow: '0 0 4px #fbbf24',
        }} />
      ))}
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.08em',
        background: 'linear-gradient(180deg,#fef9c3 0%,#fbbf24 35%,#d97706 65%,#fbbf24 100%)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
        WebkitTextStroke: '0.6px #4c1d95',
        textShadow: '0 1px 0 #4c1d95, 0 2px 0 #2e1065, 0 0 14px #fbbf24, 0 0 28px #a855f7',
        filter: 'drop-shadow(0 0 5px #fbbf24bb)',
      }}>✦{label}✦</span>
    </span>
  )
}

function ShadowBadge({ label }) {
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', borderRadius: 6,
      background: 'linear-gradient(180deg,#0a0014,#000008)',
      border: '1.5px solid #4c1d95',
      animation: 'tb-shadow-breathe 3s ease-in-out infinite, tb-3d-float 5s ease-in-out infinite',
      overflow: 'hidden',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none' }} preserveAspectRatio="none">
        <path d="M0,10 Q15,5 30,10 Q45,15 60,10" fill="none" stroke="#7c3aed" strokeWidth="1"
          strokeDasharray="60" style={{ animation: 'tb-shadow-tendrils 4s linear infinite' }} />
        <path d="M10,0 Q20,8 10,16 Q0,24 10,30" fill="none" stroke="#6d28d9" strokeWidth="0.8"
          strokeDasharray="40" style={{ animation: 'tb-shadow-tendrils 3s linear infinite', animationDelay: '-1s' }} />
      </svg>
      <span style={{
        position: 'relative', zIndex: 1,
        fontWeight: 900, fontSize: 11, letterSpacing: '0.08em',
        color: '#e9d5ff', WebkitTextStroke: '0.5px #1e0040',
        textShadow: '0 0 8px #7c3aed, 0 0 20px #4c1d9566, 1px 1px 0 #1e0040, 2px 2px 0 #0a0018, 3px 3px 6px rgba(0,0,0,0.9)',
      }}>🖤{label}</span>
    </span>
  )
}

function SimpleBadge({ label, rarity }) {
  const RARITY_STYLE = {
    COMMON:    { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', stroke: '#94a3b8' },
    RARE:      { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd', stroke: '#3b82f6' },
    EPIC:      { bg: '#faf5ff', text: '#7e22ce', border: '#d8b4fe', stroke: '#a855f7' },
    LEGENDARY: { bg: '#fffbeb', text: '#92400e', border: '#fcd34d', stroke: '#f59e0b' },
    MYTHIC:    { bg: '#fff1f2', text: '#9f1239', border: '#fda4af', stroke: '#f43f5e' },
  }
  const s = RARITY_STYLE[rarity] || RARITY_STYLE.COMMON
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      padding: '2px 7px', borderRadius: 6,
      background: s.bg, border: \`1.5px solid \${s.border}\`,
      fontWeight: 800, fontSize: 10, letterSpacing: '0.05em',
      color: s.text, WebkitTextStroke: \`0.3px \${s.stroke}\`,
      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
    }}>✨{label}</span>
  )
}

export default function TitleBadge({ name, effect = 'none', rarity = 'COMMON', className = '' }) {
  useEffect(() => { injectCSS() }, [])
  const label = cleanName(name)

  const inner = (() => {
    switch (effect) {
      case 'lightning': return <LightningBadge label={label} />
      case 'fire':      return <FireBadge label={label} />
      case 'ice':       return <IceBadge label={label} />
      case 'neon':      return <NeonBadge label={label} />
      case 'rainbow':   return <RainbowBadge label={label} />
      case 'mythic':    return <MythicBadge label={label} />
      case 'shadow':    return <ShadowBadge label={label} />
      default:          return <SimpleBadge label={label} rarity={rarity} />
    }
  })()

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
      {inner}
    </span>
  )
}
`

writeFileSync('components/student/TitleBadge.js', out, 'utf8')
console.log('Written OK, lines:', out.split('\n').length)
