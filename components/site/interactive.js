'use client'

import { useEffect, useRef, useState } from 'react'
import Splide from '@splidejs/splide'
import '@splidejs/splide/css/core'
import { ChevronUpIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { COUNTDOWN_SECONDS } from './content'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Cronometru „evergreen": 4 zile, 7 ore, 45 de minute de la prima vizită a
 * fiecărui vizitator, apoi o ia de la capăt (la fel ca pe site-ul vechi).
 */
export function Countdown({ numberClass, labelClass, separatorClass }) {
  const [left, setLeft] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    let start = Date.now()
    try {
      const saved = Number(localStorage.getItem('olla-countdown-start'))
      if (saved && saved <= Date.now()) start = saved
      else localStorage.setItem('olla-countdown-start', String(start))
    } catch {}

    const tick = () => {
      let elapsed = Math.floor((Date.now() - start) / 1000)
      if (elapsed >= COUNTDOWN_SECONDS) {
        start = Date.now()
        elapsed = 0
        try { localStorage.setItem('olla-countdown-start', String(start)) } catch {}
      }
      setLeft(COUNTDOWN_SECONDS - elapsed)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const parts = [
    [Math.floor(left / 86400), 'zile'],
    [Math.floor((left % 86400) / 3600), 'ore'],
    [Math.floor((left % 3600) / 60), 'minute'],
    [left % 60, 'secunde'],
  ]

  return (
    <div className="flex items-start gap-[5px]" role="timer" aria-atomic="true">
      {parts.map(([value, label], i) => (
        <div key={label} className="flex items-start gap-[5px]">
          <div className="text-center leading-none">
            <div className={`text-[clamp(1.75rem,0.76vw+1.564rem,2.25rem)] font-normal tabular-nums ${numberClass}`}>{pad(value)}</div>
            <div className={`mt-1 text-[clamp(0.9375rem,0.29vw+0.868rem,1.125rem)] ${labelClass}`}>{label}</div>
          </div>
          {i < parts.length - 1 && <span className={`pt-[14px] text-[14px] ${separatorClass}`}>:</span>}
        </div>
      ))}
    </div>
  )
}

/** Cifră care urcă de la 0 când ajunge în ecran (1 secundă, ca pe site-ul vechi). */
export function Counter({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const t0 = performance.now()
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1000)
        setShown(Math.round(value * p))
        if (p < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    })
    observer.observe(el)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])

  return <span ref={ref} className={className}>{shown}{suffix}</span>
}

/** Cursuri: tab-uri pe desktop, acordeon sub 768px. */
export function CourseTabs({ tabs, panels }) {
  const [active, setActive] = useState(0)
  const last = tabs.length - 1

  return (
    <div>
      <div className="hidden overflow-hidden rounded-[20px] bg-olla-navy md:flex" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.tab}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`px-5 py-5 text-[18px] uppercase leading-[27px] transition-colors ${
              active === i ? 'bg-olla-coral text-white' : 'text-olla-cyan hover:text-white'
            } ${i === 0 ? 'rounded-l-[20px]' : ''} ${i === last ? 'rounded-r-[20px]' : ''}`}
          >
            {t.tab}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div key={t.tab}>
          <button
            type="button"
            onClick={() => setActive(i)}
            aria-expanded={active === i}
            className={`mt-3 flex w-full items-center justify-between rounded-xl px-5 py-5 text-left text-[16px] leading-[27px] md:hidden ${
              active === i ? 'bg-olla-coral text-white' : 'bg-olla-navy text-olla-cyan'
            }`}
          >
            {t.mobile || t.tab}
            <ChevronUpIcon className={`h-4 w-4 transition-transform ${active === i ? '' : 'rotate-180'}`} />
          </button>
          {active === i && <div className="mt-8 md:mt-10">{panels[i]}</div>}
        </div>
      ))}
    </div>
  )
}

export function Faq({ items }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="mx-auto mt-[clamp(1.6875rem,0.86vw+1.48rem,2.25rem)] max-w-[1080px] space-y-[18px]">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="rounded-md border border-olla-blue md:rounded-lg">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-[18px] py-4 text-left md:min-h-[79px]"
            >
              <span className="text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] font-bold leading-[1.3] text-olla-navy">{item.q}</span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-olla-blue text-olla-cyan md:h-[42px] md:w-[42px] md:rounded-lg">
                <PlusIcon className={`h-4 w-4 transition-transform duration-200 md:h-6 md:w-6 ${isOpen ? 'rotate-45' : ''}`} />
              </span>
            </button>
            <div className="site-faq-answer" data-open={isOpen}>
              <div>
                <div className="space-y-3 px-[18px] pb-5 text-[16px] leading-[1.5] text-[#191a1b]">
                  {item.a.map((p) => (
                    <p key={p} className="whitespace-pre-line">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Slider Splide cu setările de pe site-ul vechi (buclă, săgeți, autoplay opțional). */
export function Slider({ options, arrowColor = '#000', children, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const splide = new Splide(ref.current, options).mount()
    return () => splide.destroy()
  }, [options])

  return (
    <div ref={ref} className="splide site-slider relative" style={{ '--arrow-color': arrowColor }} aria-label={label}>
      <div className="splide__track">
        <ul className="splide__list">{children}</ul>
      </div>
    </div>
  )
}

/** Poză care se deschide mare, peste pagină (în locul lightbox-ului Bricks). */
export function ZoomImage({ src, alt = '', className = '', children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`block cursor-zoom-in ${className}`}>
        {children}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" aria-label="Închide" className="absolute right-4 top-4 text-white">
            <XMarkIcon className="h-8 w-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  )
}
