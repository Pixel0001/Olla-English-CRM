'use client'

/**
 * ThemePreview — randează o mini-pagină cu culorile reale ale temei.
 * Folosește primary / secondary / accent + bgGradient (tailwind class) sau
 * gradient real CSS dacă vine ca string CSS.
 */

export default function ThemePreview({ theme, className = '' }) {
  const primary = theme.primary || '#1e3a8a'
  const secondary = theme.secondary || '#3b82f6'
  const accent = theme.accent || '#fbbf24'
  const glow = theme.glowColor || secondary

  // bgGradient poate fi tailwind class sau plain CSS
  const bgIsTailwind = typeof theme.bgGradient === 'string' && theme.bgGradient.includes('from-')
  const bgGradientStyle = !bgIsTailwind && theme.bgGradient
    ? { background: theme.bgGradient }
    : { background: `linear-gradient(135deg, ${primary}, ${secondary})` }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={bgGradientStyle}>
      {/* glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-50"
        style={{ background: glow }}
      />

      {/* mock UI: bara de sus */}
      <div className="relative z-10 flex items-center gap-2 px-3 py-2"
        style={{ background: `${primary}cc`, backdropFilter: 'blur(4px)' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
        <div className="w-12 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }} />
        <div className="w-6 h-1.5 rounded-full ml-auto" style={{ background: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* mock card central */}
      <div className="relative z-10 mx-auto mt-3 w-[70%] rounded-md p-2"
        style={{ background: 'rgba(255,255,255,0.18)', boxShadow: `0 4px 12px ${glow}66` }}>
        <div className="w-full h-1.5 rounded-full mb-1.5" style={{ background: accent }} />
        <div className="w-2/3 h-1 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.6)' }} />
        <div className="w-1/2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
      </div>

      {/* mock buton */}
      <div className="absolute bottom-2 right-2 z-10 px-2.5 py-1 rounded-md text-[8px] font-extrabold"
        style={{ background: accent, color: primary }}>
        BUTON
      </div>

      {/* paletă jos-stânga */}
      <div className="absolute bottom-2 left-2 z-10 flex gap-1">
        <div className="w-3 h-3 rounded-full ring-1 ring-white/40" style={{ background: primary }} />
        <div className="w-3 h-3 rounded-full ring-1 ring-white/40" style={{ background: secondary }} />
        <div className="w-3 h-3 rounded-full ring-1 ring-white/40" style={{ background: accent }} />
      </div>
    </div>
  )
}
