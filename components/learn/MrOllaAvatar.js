'use client'

/**
 * Avatar SVG pentru Mr. Olla — un robot AI drăguț cu antenă și sclipiri.
 * Props: size (default 40), animated (default false — dacă true, antena clipește)
 */
export default function MrOllaAvatar({ size = 40, animated = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mrolla-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="mrolla-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      {/* fundal rotunjit cu gradient */}
      <rect width="40" height="40" rx="11" fill="url(#mrolla-bg)" />

      {/* sclipire stânga sus */}
      <circle cx="8" cy="9" r="0.8" fill="#fff" opacity="0.6" />
      <circle cx="33" cy="33" r="0.6" fill="#fff" opacity="0.5" />

      {/* antenă cu bec */}
      <line x1="20" y1="5.5" x2="20" y2="11" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="4.5" r="1.8" fill="#fbbf24">
        {animated && (
          <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* fața (capul robotului) */}
      <rect x="8" y="11" width="24" height="20" rx="6" fill="url(#mrolla-face)" stroke="#e0e7ff" strokeWidth="0.5" />

      {/* ochi */}
      <circle cx="15" cy="19.5" r="2.2" fill="#4f46e5" />
      <circle cx="25" cy="19.5" r="2.2" fill="#4f46e5" />
      <circle cx="15.7" cy="18.9" r="0.6" fill="#fff" />
      <circle cx="25.7" cy="18.9" r="0.6" fill="#fff" />

      {/* zâmbet */}
      <path d="M14 25 Q20 28.5 26 25" stroke="#4f46e5" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* obrăjori roz */}
      <circle cx="11.5" cy="24" r="1.3" fill="#fbcfe8" opacity="0.7" />
      <circle cx="28.5" cy="24" r="1.3" fill="#fbcfe8" opacity="0.7" />

      {/* sclipire AI dreapta jos */}
      <g transform="translate(30, 30)">
        <path d="M0 -2 L0.6 -0.6 L2 0 L0.6 0.6 L0 2 L-0.6 0.6 L-2 0 L-0.6 -0.6 Z" fill="#fde047">
          {animated && (
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          )}
        </path>
      </g>
    </svg>
  )
}
