'use client'

/**
 * CosmeticArt — desenează SVG unic pentru fiecare type+rarity.
 * Fără emoji „dezastru". Toate primesc culorile rarity-ului.
 */

const RARITY_COLORS = {
  COMMON:    { c1: '#94a3b8', c2: '#475569', glow: '#cbd5e1' },
  RARE:      { c1: '#38bdf8', c2: '#1d4ed8', glow: '#7dd3fc' },
  EPIC:      { c1: '#d946ef', c2: '#7e22ce', glow: '#f0abfc' },
  LEGENDARY: { c1: '#fbbf24', c2: '#c2410c', glow: '#fde68a' },
  MYTHIC:    { c1: '#fb7185', c2: '#7c3aed', glow: '#fda4af' },
}

export default function CosmeticArt({ type, rarity = 'COMMON', name = '', className = '' }) {
  const c = RARITY_COLORS[rarity] || RARITY_COLORS.COMMON
  const uid = `${type}-${rarity}-${name.replace(/\s+/g, '_')}`
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={c.c1} />
          <stop offset="100%" stopColor={c.c2} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0%"   stopColor={c.glow} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#glow-${uid})`} />
      {renderShape(type, `url(#g-${uid})`, c, name)}
    </svg>
  )
}

function renderShape(type, fill, c, name = '') {
  const stroke = c.c2

  // ── Named overrides ──────────────────────────────────────────────────────
  if (type === 'PET') {
    if (name.includes('Pisic')) {
      // Cat — detailed face with whiskers, round ears
      return (
        <g>
          {/* body */}
          <ellipse cx="50" cy="66" rx="24" ry="18" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* head */}
          <circle cx="50" cy="40" r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* ears */}
          <polygon points="30,24 24,10 40,22" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <polygon points="70,24 76,10 60,22" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <polygon points="32,22 27,13 40,22" fill={c.glow} opacity="0.7" />
          <polygon points="68,22 73,13 60,22" fill={c.glow} opacity="0.7" />
          {/* eyes */}
          <ellipse cx="42" cy="40" rx="5" ry="6" fill="#fff" />
          <ellipse cx="58" cy="40" rx="5" ry="6" fill="#fff" />
          <ellipse cx="42" cy="41" rx="3" ry="5" fill="#1a1a2e" />
          <ellipse cx="58" cy="41" rx="3" ry="5" fill="#1a1a2e" />
          <circle cx="43" cy="39" r="1.2" fill="#fff" />
          <circle cx="59" cy="39" r="1.2" fill="#fff" />
          {/* nose */}
          <path d="M48 48 L50 50 L52 48 Z" fill="#f9a8d4" />
          {/* mouth */}
          <path d="M50 50 Q46 54 43 53" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M50 50 Q54 54 57 53" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* whiskers */}
          <line x1="28" y1="47" x2="44" y2="49" stroke={c.c2} strokeWidth="0.9" opacity="0.7" />
          <line x1="28" y1="50" x2="44" y2="51" stroke={c.c2} strokeWidth="0.9" opacity="0.7" />
          <line x1="72" y1="47" x2="56" y2="49" stroke={c.c2} strokeWidth="0.9" opacity="0.7" />
          <line x1="72" y1="50" x2="56" y2="51" stroke={c.c2} strokeWidth="0.9" opacity="0.7" />
          {/* tail */}
          <path d="M74 68 Q86 58 80 48 Q76 40 82 35" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d="M74 68 Q86 58 80 48 Q76 40 82 35" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    }
    if (name.includes('Dragon')) {
      // Dragon — winged, horned, fire-breathing
      return (
        <g>
          {/* wings */}
          <path d="M28 50 Q10 30 18 18 Q30 35 38 45 Z" fill={fill} opacity="0.85" stroke={stroke} strokeWidth="1" />
          <path d="M72 50 Q90 30 82 18 Q70 35 62 45 Z" fill={fill} opacity="0.85" stroke={stroke} strokeWidth="1" />
          {/* body */}
          <ellipse cx="50" cy="68" rx="20" ry="14" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* neck */}
          <path d="M42 58 Q44 45 50 38 Q56 45 58 58 Z" fill={fill} stroke={stroke} strokeWidth="1" />
          {/* head */}
          <ellipse cx="50" cy="34" rx="18" ry="14" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* snout */}
          <ellipse cx="50" cy="42" rx="8" ry="5" fill={c.c2} stroke={stroke} strokeWidth="1" />
          {/* horns */}
          <path d="M40 24 L36 12 L42 22" fill={c.c2} stroke={stroke} strokeWidth="1" />
          <path d="M60 24 L64 12 L58 22" fill={c.c2} stroke={stroke} strokeWidth="1" />
          {/* eyes */}
          <ellipse cx="43" cy="32" rx="4" ry="4" fill="#fff" />
          <ellipse cx="57" cy="32" rx="4" ry="4" fill="#fff" />
          <ellipse cx="43" cy="33" rx="2.5" ry="3" fill="#dc2626" />
          <ellipse cx="57" cy="33" rx="2.5" ry="3" fill="#dc2626" />
          <circle cx="44" cy="31" r="1" fill="#fff" />
          <circle cx="58" cy="31" r="1" fill="#fff" />
          {/* nostrils */}
          <circle cx="47" cy="43" r="1.2" fill={stroke} opacity="0.7" />
          <circle cx="53" cy="43" r="1.2" fill={stroke} opacity="0.7" />
          {/* fire breath */}
          <path d="M50 47 Q44 54 40 58 Q48 55 50 52 Q52 55 60 58 Q56 54 50 47 Z" fill="#f97316" opacity="0.85" />
          <path d="M50 50 Q46 56 43 60" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* spine spikes */}
          <path d="M50 54 L47 62 L50 60 L53 62 Z" fill={c.glow} />
          {/* tail */}
          <path d="M70 72 Q82 80 84 72 Q80 65 76 68" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      )
    }
    if (name.includes('Phoenix')) {
      // Phoenix bird — majestic flaming bird
      return (
        <g>
          {/* tail feathers */}
          <path d="M50 72 Q38 88 30 92 Q40 82 42 75" fill="#f97316" opacity="0.8" />
          <path d="M50 72 Q50 90 48 95 Q50 84 52 76" fill="#fbbf24" opacity="0.8" />
          <path d="M50 72 Q62 88 70 92 Q60 82 58 75" fill="#ef4444" opacity="0.8" />
          {/* body */}
          <ellipse cx="50" cy="58" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* wings */}
          <path d="M32 52 Q14 38 16 22 Q28 38 38 50 Z" fill="#f97316" stroke="#dc2626" strokeWidth="1" />
          <path d="M68 52 Q86 38 84 22 Q72 38 62 50 Z" fill="#f97316" stroke="#dc2626" strokeWidth="1" />
          <path d="M32 52 Q16 42 20 30 Q30 42 38 50 Z" fill="#fbbf24" opacity="0.7" />
          <path d="M68 52 Q84 42 80 30 Q70 42 62 50 Z" fill="#fbbf24" opacity="0.7" />
          {/* head */}
          <circle cx="50" cy="36" r="16" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* crest feathers */}
          <path d="M44 24 Q40 14 42 8 Q46 16 46 22" fill="#f97316" stroke="#dc2626" strokeWidth="1" />
          <path d="M50 22 Q50 12 52 6 Q54 14 52 22" fill="#fbbf24" stroke="#dc2626" strokeWidth="1" />
          <path d="M56 24 Q60 14 58 8 Q54 16 54 22" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
          {/* eye */}
          <circle cx="46" cy="36" r="4" fill="#fff" />
          <circle cx="46" cy="37" r="2.5" fill="#1a1a2e" />
          <circle cx="47" cy="35" r="1" fill="#fff" />
          {/* beak */}
          <path d="M34 40 L40 38 L38 43 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="0.8" />
          {/* flame aura */}
          <path d="M20 58 Q14 50 18 42 Q22 52 24 58" fill="#f97316" opacity="0.5" />
          <path d="M80 58 Q86 50 82 42 Q78 52 76 58" fill="#f97316" opacity="0.5" />
          <circle cx="50" cy="58" r="18" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        </g>
      )
    }
  }

  if (type === 'LEADERBOARD_EFFECT') {
    if (name.includes('Phoenix')) {
      // Phoenix trophy — flaming trophy
      return (
        <g>
          {/* glow base */}
          <ellipse cx="50" cy="82" rx="22" ry="5" fill="#ef444466" />
          {/* trophy cup */}
          <path d="M34 22 L66 22 L62 58 Q50 66 38 58 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          {/* handles */}
          <path d="M34 28 Q20 30 22 46 Q24 56 34 52" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
          <path d="M66 28 Q80 30 78 46 Q76 56 66 52" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
          {/* stem */}
          <rect x="44" y="58" width="12" height="14" fill={c.c2} />
          <rect x="36" y="72" width="28" height="7" rx="2" fill={c.c2} />
          {/* star on cup */}
          <text x="50" y="48" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff" opacity="0.9">★</text>
          {/* flames */}
          <path d="M42 22 Q40 12 44 8 Q46 14 44 20" fill="#f97316" opacity="0.9" />
          <path d="M50 20 Q50 8 52 4 Q54 10 52 20" fill="#fbbf24" opacity="0.9" />
          <path d="M58 22 Q60 12 56 8 Q54 14 56 20" fill="#ef4444" opacity="0.9" />
          <path d="M46 22 Q46 14 50 12 Q54 14 54 22" fill="#fde68a" opacity="0.6" />
        </g>
      )
    }
    // Default: Aur — gold trophy with star
    return (
      <g>
        {/* glow base */}
        <ellipse cx="50" cy="82" rx="22" ry="5" fill="#fbbf2455" />
        {/* trophy cup */}
        <path d="M34 22 L66 22 L62 58 Q50 66 38 58 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        {/* handles */}
        <path d="M34 28 Q20 30 22 46 Q24 56 34 52" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
        <path d="M66 28 Q80 30 78 46 Q76 56 66 52" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
        {/* stem */}
        <rect x="44" y="58" width="12" height="14" fill={c.c2} />
        <rect x="36" y="72" width="28" height="7" rx="2" fill={c.c2} />
        {/* star + rank */}
        <text x="50" y="44" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" opacity="0.95">1</text>
        <path d="M50 52 L52 58 L58 58 L53 62 L55 68 L50 64 L45 68 L47 62 L42 58 L48 58 Z" fill={c.glow} opacity="0.8" />
        {/* shine */}
        <path d="M40 28 Q44 26 46 30" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
    )
  }

  // ── Default per-type shapes ──────────────────────────────────────────────
  switch (type) {
    case 'THEME':
      return (
        <g>
          <rect x="20" y="20" width="60" height="60" rx="10" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="35" cy="40" r="6" fill={c.glow} />
          <circle cx="55" cy="40" r="6" fill="#fff" opacity="0.7" />
          <circle cx="45" cy="60" r="6" fill={c.c1} opacity="0.9" />
          <path d="M25 70 L75 70" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        </g>
      )
    case 'PROFILE_BANNER':
      return (
        <g>
          <path d="M20 18 L80 18 L80 78 L50 65 L20 78 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="40" r="10" fill="#fff" opacity="0.85" />
          <path d="M40 55 L60 55" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        </g>
      )
    case 'USERNAME_COLOR':
      return (
        <g>
          {/* badge cu coroniță */}
          <circle cx="50" cy="55" r="26" fill={fill} stroke={stroke} strokeWidth="2.5" />
          <path d="M30 35 L40 50 L50 30 L60 50 L70 35 L66 55 L34 55 Z" fill={c.glow} stroke={stroke} strokeWidth="1.5" />
          <text x="50" y="62" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">★</text>
        </g>
      )
    case 'ANIMATED_FRAME':
      return (
        <g>
          <rect x="15" y="15" width="70" height="70" rx="14" fill="none" stroke={fill} strokeWidth="6" />
          <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke={c.glow} strokeWidth="2" opacity="0.8" />
          <circle cx="50" cy="50" r="14" fill={fill} opacity="0.4" />
          <path d="M50 38 L50 62 M38 50 L62 50" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </g>
      )
    case 'LEADERBOARD_EFFECT':
      return (
        <g>
          {/* trofeu */}
          <path d="M35 25 L65 25 L63 50 Q50 62 37 50 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <rect x="42" y="60" width="16" height="8" fill={c.c2} />
          <rect x="35" y="68" width="30" height="6" rx="2" fill={c.c2} />
          <path d="M35 30 Q22 32 24 45 Q26 52 35 50" fill="none" stroke={fill} strokeWidth="3" />
          <path d="M65 30 Q78 32 76 45 Q74 52 65 50" fill="none" stroke={fill} strokeWidth="3" />
          <text x="50" y="44" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">1</text>
        </g>
      )
    case 'ENTRY_EFFECT':
      return (
        <g>
          {/* portal/uşă cu raze */}
          <ellipse cx="50" cy="50" rx="22" ry="30" fill={fill} stroke={stroke} strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="14" ry="22" fill={c.glow} opacity="0.6" />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line key={a} x1="50" y1="50" x2={50 + 40 * Math.cos((a * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((a * Math.PI) / 180)}
              stroke={c.glow} strokeWidth="1.5" opacity="0.6" />
          ))}
        </g>
      )
    case 'CODING_AURA':
      return (
        <g>
          {/* {} bracket cu aură */}
          <circle cx="50" cy="50" r="32" fill="none" stroke={fill} strokeWidth="3" opacity="0.5" />
          <circle cx="50" cy="50" r="22" fill={fill} opacity="0.25" />
          <text x="32" y="62" fontSize="32" fontWeight="900" fill={fill}>{'{'}</text>
          <text x="56" y="62" fontSize="32" fontWeight="900" fill={fill}>{'}'}</text>
          <circle cx="50" cy="50" r="3" fill={c.glow} />
        </g>
      )
    case 'TITLE':
      return (
        <g>
          {/* coroană */}
          <path d="M22 60 L28 30 L40 50 L50 25 L60 50 L72 30 L78 60 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <rect x="22" y="60" width="56" height="10" rx="2" fill={c.c2} />
          <circle cx="28" cy="30" r="3" fill={c.glow} />
          <circle cx="50" cy="25" r="3" fill={c.glow} />
          <circle cx="72" cy="30" r="3" fill={c.glow} />
          <circle cx="40" cy="65" r="2.5" fill={c.glow} opacity="0.8" />
          <circle cx="60" cy="65" r="2.5" fill={c.glow} opacity="0.8" />
        </g>
      )
    case 'PET':
      return (
        <g>
          {/* mascota / animal stilizat */}
          <ellipse cx="50" cy="60" rx="26" ry="20" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="50" cy="38" r="18" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M34 28 L38 18 L46 28 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M66 28 L62 18 L54 28 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="44" cy="38" r="2.5" fill="#fff" />
          <circle cx="56" cy="38" r="2.5" fill="#fff" />
          <circle cx="44" cy="38" r="1.2" fill="#000" />
          <circle cx="56" cy="38" r="1.2" fill="#000" />
          <path d="M46 46 Q50 50 54 46" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'RARE_COSMETIC':
      return (
        <g>
          {/* diamant */}
          <path d="M50 20 L75 40 L50 80 L25 40 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M25 40 L75 40" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
          <path d="M50 20 L50 40" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
          <path d="M37 30 L50 40 L63 30" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
          <path d="M37 40 L50 80" stroke="#fff" strokeWidth="1" opacity="0.4" />
          <path d="M63 40 L50 80" stroke="#fff" strokeWidth="1" opacity="0.4" />
        </g>
      )
    case 'ANIMATED_BACKGROUND':
      return (
        <g>
          <rect x="15" y="15" width="70" height="70" rx="10" fill={fill} />
          {/* munți / orizont */}
          <path d="M15 75 L35 50 L55 70 L75 45 L85 65 L85 85 L15 85 Z" fill={c.c2} opacity="0.7" />
          <circle cx="68" cy="32" r="7" fill={c.glow} />
          <path d="M20 25 L22 27 M30 22 L32 24 M70 20 L72 22 M50 30 L52 32" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>
      )
    case 'PARTICLE_EFFECT':
      return (
        <g>
          {/* explozie particule */}
          <circle cx="50" cy="50" r="10" fill={c.glow} />
          <circle cx="50" cy="50" r="6" fill="#fff" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
            const r = 28 + (i % 2) * 6
            const x = 50 + r * Math.cos((a * Math.PI) / 180)
            const y = 50 + r * Math.sin((a * Math.PI) / 180)
            return <circle key={a} cx={x} cy={y} r="3.5" fill={fill} />
          })}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => {
            const x = 50 + 22 * Math.cos((a * Math.PI) / 180)
            const y = 50 + 22 * Math.sin((a * Math.PI) / 180)
            return <circle key={a} cx={x} cy={y} r="1.8" fill={c.glow} />
          })}
        </g>
      )
    default:
      return <circle cx="50" cy="50" r="30" fill={fill} stroke={stroke} strokeWidth="2" />
  }
}
