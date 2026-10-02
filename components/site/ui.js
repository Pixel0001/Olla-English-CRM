/**
 * Piese de bază ale site-ului public: tipografie, containere, butoane.
 * Mărimile urmează site-ul vechi (Inter, 18px text, titluri 42.6px pe desktop)
 * și scad fluid pe telefon, ca acolo.
 */

export const WRAP = 'mx-auto w-full max-w-[1400px]'
export const SECTION = 'px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]'

export const H2 = 'text-[clamp(1.425rem,1.84vw+1.056rem,2.6625rem)] font-bold leading-[1.2] text-olla-navy'
export const TEXT = 'text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5]'
export const H4 = 'text-[clamp(1.125rem,0.55vw+1.0125rem,1.5rem)] font-bold leading-[1.3] text-olla-navy'
export const XL = 'text-[clamp(1.2625rem,1.09vw+1.05rem,2rem)] font-bold leading-[1.3]'

const BTN = 'inline-flex items-center justify-center gap-2 rounded-[4px] px-[18px] text-[14.2px] font-semibold leading-[1.5] tracking-[0.5px] transition-colors'

export const BUTTONS = {
  coral: `${BTN} py-[14px] bg-olla-coral text-white hover:bg-[#e84646]`,
  cyan: `${BTN} py-[13px] border border-olla-navy bg-olla-cyan text-olla-navy hover:bg-[#12bfe4]`,
  cyanFlat: `${BTN} py-[14px] bg-olla-cyan text-olla-navy hover:bg-[#12bfe4]`,
  white: `${BTN} py-[11.35px] bg-white text-olla-navy hover:bg-olla-gray`,
  outline: `${BTN} py-[10.35px] border border-white text-white hover:bg-white/10`,
  navy: `${BTN} py-[10.2px] bg-olla-navy text-white hover:bg-olla-blue`,
}

// Eticheta de deasupra titlurilor, cu iconița Olla în fața textului
export function Eyebrow({ children = 'OLLA English Center', className = 'text-olla-navy', light = false }) {
  return (
    <p className={`inline-flex items-center justify-center gap-1.5 text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] font-semibold leading-[1.5] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/site/olla-icon.png" alt="" width={101} height={103} className={`h-[1.1em] w-auto ${light ? 'brightness-0 invert' : ''}`} />
      {children}
    </p>
  )
}

// Titlu în care „OLLA English Center" primește iconița Olla în față
export function BrandText({ text, light = false }) {
  const parts = String(text).split('OLLA English Center')
  if (parts.length === 1) return text
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <span className="whitespace-nowrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/site/olla-icon.png" alt="" width={101} height={103} className={`mr-[0.18em] inline-block h-[0.85em] w-auto align-[-0.06em] ${light ? 'brightness-0 invert' : ''}`} />
          OLLA English Center
        </span>
      )}
    </span>
  ))
}
