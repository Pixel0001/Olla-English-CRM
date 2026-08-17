import { writeFileSync } from 'fs'

const src = `'use client'
import { useEffect } from 'react'

export const TITLE_EFFECTS = [
  { value: 'none',      label: 'Simplu (fara efect)' },
  { value: 'lightning', label: 'Fulger Electric' },
  { value: 'fire',      label: 'Foc Infernal' },
  { value: 'ice',       label: 'Cristal de Gheata' },
  { value: 'neon',      label: 'Neon Cyber' },
  { value: 'rainbow',   label: 'Curcubeu Legendar' },
  { value: 'mythic',    label: 'Mythic Auriu' },
  { value: 'shadow',    label: 'Shadow Abyss' },
]

const KEYFRAMES = \`
@keyframes tb-flash {
  0%,88%,100% { opacity:1; }
  90%,96%     { opacity:0.08; }
  93%         { opacity:1; }
}
@keyframes tb-bolt-left {
  0%,80%    { opacity:0; transform:translateY(-3px) scaleY(0.5); }
  82%,88%   { opacity:1; transform:translateY(0) scaleY(1); }
  100%      { opacity:0; }
}
@keyframes tb-bolt-right {
  0%,84%    { opacity:0; transform:translateY(-3px) scaleY(0.5); }
  86%,92%   { opacity:1; transform:translateY(0) scaleY(1); }
  100%      { opacity:0; }
}
@keyframes tb-fire-flicker {
  0%,100% { transform:skewX(-1deg) scaleY(1); filter:brightness(1) saturate(1); }
  20%     { transform:skewX(1.5deg) scaleY(1.03); filter:brightness(1.2) saturate(1.2); }
  40%     { transform:skewX(-1deg) scaleY(0.98); filter:brightness(0.9) saturate(0.9); }
  60%     { transform:skewX(1deg) scaleY(1.04); filter:brightness(1.15) saturate(1.1); }
  80%     { transform:skewX(-0.5deg) scaleY(0.99); filter:brightness(1.05); }
}
@keyframes tb-fire-rise {
  0%   { transform:translateY(0) scaleX(1); opacity:0.9; }
  100% { transform:translateY(-18px) scaleX(0.2); opacity:0; }
}
@keyframes tb-ice-shimmer {
  0%   { background-position:200% center; }
  100% { background-position:-200% center; }
}
@keyframes tb-ice-crystal {
  0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
  50%     { opacity:1; transform:scale(1) rotate(180deg); }
}
@keyframes tb-neon-flicker {
  0%,19%,21%,23%,100% { opacity:1; filter:brightness(1); }
  20%,22%             { opacity:0.6; filter:brightness(0.4); }
}
@keyframes tb-neon-glow-pulse {
  0%,100% { text-shadow:0 0 4px #e879f9, 0 0 10px #c026d3, 0 0 20px #a21caf, 0 0 40px #7e22ce; }
  50%     { text-shadow:0 0 8px #f0abfc, 0 0 20px #e879f9, 0 0 40px #c026d3, 0 0 60px #a21caf; }
}
@keyframes tb-rainbow-move {
  0%   { background-position:0% center; }
  100% { background-position:400% center; }
}
@keyframes tb-mythic-float {
  0%,100% { transform:translateY(0) scale(1); }
  50%     { transform:translateY(-2px) scale(1.01); }
}
@keyframes tb-mythic-shimmer {
  0%   { background-position:200% center; }
  100% { background-position:-200% center; }
}
@keyframes tb-star-burst {
  0%   { transform:translate(0,0) scale(1); opacity:1; }
  100% { transform:translate(var(--tx),var(--ty)) scale(0); opacity:0; }
}
@keyframes tb-shadow-drift {
  0%,100% { text-shadow:2px 2px 0 #1e0040, 4px 4px 0 #0a0018, 6px 6px 8px rgba(0,0,0,0.9), 0 0 12px #7c3aed55; }
  50%     { text-shadow:2px 2px 0 #2d0060, 4px 4px 0 #150030, 6px 6px 12px rgba(0,0,0,0.9), 0 0 24px #7c3aedaa; }
}
@keyframes tb-shadow-corrupt {
  0%,95%,100% { clip-path:inset(0 0 0 0); transform:translateX(0); }
  96%         { clip-path:inset(20% 0 40% 0); transform:translateX(-2px); color:#c4b5fd; }
  97%         { clip-path:inset(60% 0 10% 0); transform:translateX(2px); color:#7c3aed; }
  98%         { clip-path:inset(0 0 0 0); transform:translateX(0); }
}
@keyframes tb-simple-in {
  from { opacity:0; transform:scale(0.85) translateY(2px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}
\`

let cssInjected = false
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return
  if (document.getElementById('olla-tb2')) { cssInjected = true; return }
  const s = document.createElement('style')
  s.id = 'olla-tb2'
  s.textContent = KEYFRAMES
  document.head.appendChild(s)
  cssInjected = true
}

function cleanName(name) {
  return (name || '').replace(/^Titlu\\s+[\\u201e\\u201c\\u201d\\u2018\\u2019"']*/, '').replace(/[\\u201e\\u201c\\u201d\\u2018\\u2019"']*$/, '').toUpperCase()
}

// ── LIGHTNING ── galben electric, fulgere SVG la stanga/dreapta, flash pe text
function LightningBadge({ label }) {
  const bolt = (
    <svg width="9" height="20" viewBox="0 0 9 20" style={{flexShrink:0,display:'inline-block'}}>
      <polygon points="6,0 2,9 5,9 2,20 9,7 5,7" fill="#facc15" opacity="0.95"/>
      <polygon points="6,0 2,9 5,9 2,20 9,7 5,7" fill="#fff" opacity="0.35"/>
    </svg>
  )
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
      <span style={{animation:'tb-bolt-left 3s ease-in-out infinite',filter:'drop-shadow(0 0 4px #facc15)'}}>
        {bolt}
      </span>
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.12em',
        color:'#facc15',
        WebkitTextStroke:'0.8px #b45309',
        textShadow:'0 1px 0 #92400e, 0 2px 0 #78350f, 0 3px 6px rgba(0,0,0,0.8), 0 0 16px #fbbf24cc',
        animation:'tb-flash 4s ease-in-out infinite',
      }}>{label}</span>
      <span style={{animation:'tb-bolt-right 3s ease-in-out infinite',filter:'drop-shadow(0 0 4px #facc15)'}}>
        {bolt}
      </span>
    </span>
  )
}

// ── FIRE ── gradient rosu-portocaliu-galben, distorsionat, cu flacari SVG deasupra
function FireBadge({ label }) {
  const flames = [
    {cx:8,  d:'0s',    dur:'1.0s', c1:'#ef4444', c2:'#fbbf24'},
    {cx:20, d:'-0.4s', dur:'1.3s', c1:'#f97316', c2:'#fef08a'},
    {cx:32, d:'-0.8s', dur:'1.1s', c1:'#ef4444', c2:'#f97316'},
    {cx:44, d:'-0.2s', dur:'0.9s', c1:'#dc2626', c2:'#fbbf24'},
    {cx:56, d:'-0.6s', dur:'1.2s', c1:'#f97316', c2:'#fef08a'},
    {cx:68, d:'-1.0s', dur:'1.0s', c1:'#ef4444', c2:'#f97316'},
  ]
  return (
    <span style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:0}}>
      <svg width="76" height="14" viewBox="0 0 76 14" style={{display:'block',overflow:'visible',pointerEvents:'none'}}>
        {flames.map((f,i) => (
          <g key={i}>
            <ellipse cx={f.cx} cy={12} rx={4} ry={6}
              style={{fill:f.c1, animation:\`tb-fire-rise \${f.dur} ease-out infinite\`, animationDelay:f.d,
                filter:\`drop-shadow(0 0 3px \${f.c1})\`}}/>
            <ellipse cx={f.cx} cy={11} rx={2} ry={3.5}
              style={{fill:f.c2, animation:\`tb-fire-rise \${f.dur} ease-out infinite\`, animationDelay:f.d}}/>
          </g>
        ))}
      </svg>
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.1em',
        background:'linear-gradient(180deg,#fef08a 0%,#fb923c 40%,#ef4444 100%)',
        backgroundClip:'text', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        WebkitTextStroke:'0.8px #7c1d08',
        filter:'drop-shadow(0 2px 6px #ef4444cc)',
        animation:'tb-fire-flicker 1.6s ease-in-out infinite',
      }}>{label}</span>
    </span>
  )
}

// ── ICE ── gradient alb-albastru shimmer, cristale SVG care apar
function IceBadge({ label }) {
  const crystals = [
    {x:'-14px',y:'-4px',d:'0s'},{x:'calc(100% + 8px)',y:'-6px',d:'-0.7s'},
    {x:'20%',y:'-10px',d:'-1.2s'},{x:'70%',y:'-8px',d:'-0.4s'},
  ]
  return (
    <span style={{display:'inline-flex',alignItems:'center',position:'relative'}}>
      {crystals.map((c,i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" style={{
          position:'absolute', left:c.x, top:c.y, pointerEvents:'none',
          animation:\`tb-ice-crystal 2.4s ease-in-out infinite\`, animationDelay:c.d,
        }}>
          <line x1="5" y1="0" x2="5" y2="10" stroke="#bae6fd" strokeWidth="1.5"/>
          <line x1="0" y1="5" x2="10" y2="5" stroke="#bae6fd" strokeWidth="1.5"/>
          <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="#7dd3fc" strokeWidth="1"/>
          <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="#7dd3fc" strokeWidth="1"/>
        </svg>
      ))}
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.12em',
        background:'linear-gradient(90deg,#f0f9ff,#bae6fd,#38bdf8,#f0f9ff,#bae6fd)',
        backgroundSize:'300% auto',
        backgroundClip:'text', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        WebkitTextStroke:'0.7px #0c4a6e',
        filter:'drop-shadow(0 0 8px #38bdf8bb) drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
        animation:'tb-ice-shimmer 3s linear infinite',
      }}>{label}</span>
    </span>
  )
}

// ── NEON ── roz-violet, flickering neon sign, glow pulsator
function NeonBadge({ label }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center'}}>
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.15em',
        color:'#f0abfc',
        WebkitTextStroke:'0.6px #701a75',
        animation:'tb-neon-flicker 5s step-end infinite, tb-neon-glow-pulse 2s ease-in-out infinite',
      }}>{label}</span>
    </span>
  )
}

// ── RAINBOW ── gradient care se misca orizontal, text mare
function RainbowBadge({ label }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center'}}>
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.1em',
        background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#22c55e,#3b82f6,#a855f7,#ec4899,#ef4444)',
        backgroundSize:'400% auto',
        backgroundClip:'text', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        WebkitTextStroke:'0.4px rgba(0,0,0,0.2)',
        filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
        animation:'tb-rainbow-move 3s linear infinite',
      }}>{label}</span>
    </span>
  )
}

// ── MYTHIC ── auriu cu shimmer + stelute SVG care zboara
function MythicBadge({ label }) {
  const stars = [
    {tx:'-18px',ty:'-14px',d:'0s',dur:'2s'},
    {tx:'20px', ty:'-16px',d:'-0.5s',dur:'1.8s'},
    {tx:'-14px',ty:'12px', d:'-1s',  dur:'2.2s'},
    {tx:'16px', ty:'10px', d:'-0.3s',dur:'1.6s'},
    {tx:'4px',  ty:'-18px',d:'-0.8s',dur:'2.4s'},
  ]
  return (
    <span style={{display:'inline-flex',alignItems:'center',position:'relative'}}>
      {stars.map((st,i) => (
        <svg key={i} width="6" height="6" viewBox="0 0 6 6" style={{
          position:'absolute', left:'50%', top:'50%',
          '--tx':st.tx, '--ty':st.ty,
          animation:\`tb-star-burst \${st.dur} ease-out infinite\`, animationDelay:st.d,
          filter:'drop-shadow(0 0 3px #fbbf24)', pointerEvents:'none',
        }}>
          <polygon points="3,0 3.6,2.4 6,2.4 4.2,3.8 4.8,6 3,4.8 1.2,6 1.8,3.8 0,2.4 2.4,2.4" fill="#fbbf24"/>
        </svg>
      ))}
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.1em',
        background:'linear-gradient(90deg,#fef3c7,#fbbf24,#f59e0b,#fde68a,#fbbf24,#fef3c7)',
        backgroundSize:'300% auto',
        backgroundClip:'text', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        WebkitTextStroke:'0.7px #4c1d95',
        filter:'drop-shadow(0 0 6px #fbbf24aa) drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
        animation:'tb-mythic-shimmer 4s linear infinite, tb-mythic-float 3s ease-in-out infinite',
      }}>{label}</span>
    </span>
  )
}

// ── SHADOW ── violet-negru, efect 3D extruzat, glitch ocazional
function ShadowBadge({ label }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center'}}>
      <span style={{
        fontWeight:900, fontSize:15, letterSpacing:'0.1em',
        color:'#c4b5fd',
        WebkitTextStroke:'0.6px #1e0040',
        animation:'tb-shadow-drift 3s ease-in-out infinite, tb-shadow-corrupt 6s step-end infinite',
      }}>{label}</span>
    </span>
  )
}

// ── SIMPLE ── curat, bazat pe raritate, fara animatie
function SimpleBadge({ label, rarity }) {
  const RARITY = {
    COMMON:    {color:'#64748b', stroke:'#94a3b8', shadow:'rgba(0,0,0,0.15)'},
    RARE:      {color:'#1d4ed8', stroke:'#3b82f6', shadow:'rgba(59,130,246,0.3)'},
    EPIC:      {color:'#7e22ce', stroke:'#a855f7', shadow:'rgba(168,85,247,0.3)'},
    LEGENDARY: {color:'#92400e', stroke:'#f59e0b', shadow:'rgba(245,158,11,0.4)'},
    MYTHIC:    {color:'#9f1239', stroke:'#f43f5e', shadow:'rgba(244,63,94,0.3)'},
  }
  const r = RARITY[rarity] || RARITY.COMMON
  return (
    <span style={{
      fontWeight:800, fontSize:13, letterSpacing:'0.08em',
      color:r.color,
      WebkitTextStroke:\`0.4px \${r.stroke}\`,
      textShadow:\`0 1px 4px \${r.shadow}, 0 2px 8px \${r.shadow}\`,
      animation:'tb-simple-in 0.3s ease-out',
    }}>{label}</span>
  )
}

export default function TitleBadge({ name, effect = 'none', rarity = 'COMMON', className = '' }) {
  useEffect(() => { injectCSS() }, [])
  const label = cleanName(name)

  const inner = (() => {
    switch (effect) {
      case 'lightning': return <LightningBadge label={label}/>
      case 'fire':      return <FireBadge label={label}/>
      case 'ice':       return <IceBadge label={label}/>
      case 'neon':      return <NeonBadge label={label}/>
      case 'rainbow':   return <RainbowBadge label={label}/>
      case 'mythic':    return <MythicBadge label={label}/>
      case 'shadow':    return <ShadowBadge label={label}/>
      default:          return <SimpleBadge label={label} rarity={rarity}/>
    }
  })()

  return (
    <span className={className} style={{display:'inline-flex',alignItems:'center',lineHeight:1}}>
      {inner}
    </span>
  )
}
`

writeFileSync('components/student/TitleBadge.js', src, 'utf8')
console.log('Done! Lines:', src.split('\n').length)
