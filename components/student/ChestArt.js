'use client'

/**
 * ChestArt — desen SVG real al unui cufăr (lid + corp + lacăt + sclipiri),
 * cu paletă pe tier.
 */

const TIER = {
  COMMON:    { wood1: '#a8a29e', wood2: '#57534e', metal: '#737373', gem: '#cbd5e1' },
  RARE:      { wood1: '#60a5fa', wood2: '#1d4ed8', metal: '#93c5fd', gem: '#bfdbfe' },
  EPIC:      { wood1: '#c084fc', wood2: '#6b21a8', metal: '#d8b4fe', gem: '#e9d5ff' },
  LEGENDARY: { wood1: '#fbbf24', wood2: '#b45309', metal: '#fde047', gem: '#fef3c7' },
}

export default function ChestArt({ tier = 'COMMON', className = '' }) {
  const t = TIER[tier] || TIER.COMMON
  return (
    <svg viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`body-${tier}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={t.wood1} />
          <stop offset="100%" stopColor={t.wood2} />
        </linearGradient>
        <linearGradient id={`lid-${tier}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={t.wood1} />
          <stop offset="100%" stopColor={t.wood2} />
        </linearGradient>
        <radialGradient id={`shine-${tier}`}>
          <stop offset="0%"  stopColor={t.gem} stopOpacity="0.8" />
          <stop offset="100%" stopColor={t.gem} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glow înconjurător */}
      <ellipse cx="60" cy="55" rx="55" ry="38" fill={`url(#shine-${tier})`} />

      {/* corp cufăr */}
      <rect x="20" y="48" width="80" height="40" rx="3" fill={`url(#body-${tier})`} stroke={t.wood2} strokeWidth="1.5" />
      {/* benzi metalice */}
      <rect x="20" y="55" width="80" height="3" fill={t.metal} opacity="0.8" />
      <rect x="20" y="78" width="80" height="3" fill={t.metal} opacity="0.8" />
      <rect x="36" y="48" width="3" height="40" fill={t.metal} opacity="0.6" />
      <rect x="80" y="48" width="3" height="40" fill={t.metal} opacity="0.6" />

      {/* capac (semi-arc) */}
      <path d="M20 48 Q60 18 100 48 Z" fill={`url(#lid-${tier})`} stroke={t.wood2} strokeWidth="1.5" />
      <path d="M20 48 Q60 25 100 48" fill="none" stroke={t.metal} strokeWidth="2" opacity="0.8" />

      {/* lacăt */}
      <rect x="54" y="48" width="12" height="14" rx="2" fill={t.metal} stroke={t.wood2} strokeWidth="1" />
      <circle cx="60" cy="55" r="2.5" fill={t.wood2} />
      <path d="M56 48 Q56 42 60 42 Q64 42 64 48" fill="none" stroke={t.metal} strokeWidth="2" />

      {/* gem central pe lid */}
      <polygon points="60,30 65,36 60,42 55,36" fill={t.gem} stroke={t.wood2} strokeWidth="0.8" />
      <polygon points="60,30 65,36 60,42 55,36" fill="#fff" opacity="0.3" />

      {/* sclipiri */}
      <circle cx="28" cy="38" r="1.5" fill="#fff" opacity="0.9" />
      <circle cx="92" cy="42" r="1.2" fill="#fff" opacity="0.8" />
      <circle cx="78" cy="32" r="1" fill="#fff" opacity="0.7" />
      <circle cx="40" cy="28" r="1" fill="#fff" opacity="0.7" />
    </svg>
  )
}
