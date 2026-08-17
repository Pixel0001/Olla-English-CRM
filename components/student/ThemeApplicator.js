'use client'
import { useEffect } from 'react'

/**
 * Aplică tema activă prin injectare directă în document.head.
 * Rulat client-side → bypassează Tailwind purge, garantat funcționează.
 * Ascultă la evenimentul 'olla:theme-change' pentru update în timp real (fără refresh).
 */
export default function ThemeApplicator({ initialTheme }) {
  useEffect(() => {
    apply(initialTheme)
  }, [initialTheme])

  useEffect(() => {
    const handler = (e) => apply(e.detail)
    window.addEventListener('olla:theme-change', handler)
    return () => window.removeEventListener('olla:theme-change', handler)
  }, [])

  return null
}

function apply(theme) {
  let el = document.getElementById('olla-theme-css')
  if (!el) {
    el = document.createElement('style')
    el.id = 'olla-theme-css'
    document.head.appendChild(el)
  }
  el.textContent = theme ? buildCSS(theme) : ''
}

function buildCSS(t) {
  const p = t.primary    || '#1e3a8a'
  const s = t.secondary  || '#1e40af'
  const a = t.accent     || '#fbbf24'
  const g = t.glowColor  || a

  const sidebarGrad = (t.bgGradient && !t.bgGradient.includes('from-'))
    ? t.bgGradient
    : `linear-gradient(180deg, ${p} 0%, ${s} 60%, ${p} 100%)`

  const hGrad = `linear-gradient(to bottom, ${p}, ${s}, ${p})`
  const hGrad135 = `linear-gradient(135deg, ${p}, ${s})`
  const hGrad90 = `linear-gradient(90deg, ${p}, ${s})`

  return `
/* ══ Olla Theme: ${t.name} ══ */
:root {
  --olla-primary:   ${p};
  --olla-secondary: ${s};
  --olla-accent:    ${a};
  --olla-glow:      ${g};
}

/* ══ Tailwind gradient vars (toate variantele de albastru) ══ */
.from-blue-950, .from-blue-900, .from-blue-800, .from-blue-700,
.from-indigo-900, .from-indigo-800 {
  --tw-gradient-from: ${p} !important;
  --tw-gradient-stops: ${p}, transparent !important;
}
.via-blue-900, .via-blue-800, .via-blue-700, .via-indigo-800 {
  --tw-gradient-stops: var(--tw-gradient-from), ${s}, var(--tw-gradient-to, transparent) !important;
}
.to-blue-950, .to-blue-900, .to-blue-800, .to-blue-700,
.to-indigo-800, .to-indigo-900 {
  --tw-gradient-to: ${p} !important;
}

/* ══ background-image directă (clasele combinate) ══ */
/* bg-gradient-to-b from-blue-* via-blue-* → leaderboard, levels page, etc. */
.bg-gradient-to-b.from-blue-950,
.bg-gradient-to-b.from-blue-900,
.bg-gradient-to-b.from-blue-800 {
  background-image: ${hGrad} !important;
}
/* bg-gradient-to-br from-blue-* → mobile header dashboard */
.bg-gradient-to-br.from-blue-950,
.bg-gradient-to-br.from-blue-900,
.bg-gradient-to-br.from-blue-800 {
  background-image: ${hGrad135} !important;
}
/* bg-gradient-to-r from-blue-* → level page header, topbar */
.bg-gradient-to-r.from-blue-900,
.bg-gradient-to-r.from-blue-800,
.bg-gradient-to-r.from-blue-700 {
  background-image: ${hGrad90} !important;
}

/* ══ BACKGROUNDS solid ══ */
.bg-blue-950, .bg-blue-900, .bg-blue-800, .bg-blue-700,
.bg-indigo-900, .bg-indigo-800 {
  background-color: ${p} !important;
}
.bg-blue-600, .bg-blue-500, .bg-indigo-600, .bg-indigo-700 {
  background-color: ${s} !important;
}

/* ══ Sidebar aside ══ */
aside {
  background: ${sidebarGrad} !important;
  background-image: none !important;
}

/* ══ Butoane amber action ══ */
button.bg-amber-400, a.bg-amber-400 { background-color: ${a} !important; }
.hover\\:bg-amber-300:hover { background-color: ${a} !important; filter: brightness(1.1); }
.hover\\:bg-blue-900:hover, .hover\\:bg-blue-800:hover { background-color: ${p} !important; }

/* ══ Text – doar în sidebar/header, NU în conținut ══ */
aside .text-yellow-300, aside .text-yellow-200,
aside .text-amber-300, aside .text-amber-200,
header .text-yellow-300, header .text-amber-300 {
  color: ${a} !important;
  text-shadow: 0 0 10px ${g}66;
}
aside h1 .text-yellow-300, aside h1 .text-amber-300 {
  color: ${a} !important;
  text-shadow: 0 0 14px ${g}99;
}

/* ══ Borders / rings ══ */
.border-blue-900, .border-blue-800, .border-blue-700 { border-color: ${p} !important; }
.ring-blue-200, .ring-blue-300 { --tw-ring-color: ${p}66 !important; }

/* ══ Scrollbar ══ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${s}; border-radius: 9px; }
::-webkit-scrollbar-thumb:hover { background: ${p}; }
`
}
