'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Acordul pentru cookie-uri.
 *
 * Site-ul în sine nu pune cookie-uri (statisticile Vercel sunt fără cookie-uri,
 * iar cronometrul ține doar ora primei vizite în browser). Cookie-uri pun
 * harta Google și videoclipurile YouTube — de aceea ele se încarcă doar după
 * „Accept toate". Alegerea rămâne în browser și se poate schimba din subsol.
 */

const KEY = 'olla-cookie-consent' // 'all' | 'necessary'

const ConsentContext = createContext({ consent: null, setConsent: () => {}, openSettings: () => {} })
export const useConsent = () => useContext(ConsentContext)

export function ConsentProvider({ children }) {
  const [consent, setConsentState] = useState(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let saved = null
    try { saved = localStorage.getItem(KEY) } catch {}
    const id = setTimeout(() => {
      setConsentState(saved === 'all' || saved === 'necessary' ? saved : null)
      setReady(true)
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const setConsent = useCallback((value) => {
    setConsentState(value)
    setOpen(false)
    try { localStorage.setItem(KEY, value) } catch {}
  }, [])

  const openSettings = useCallback(() => setOpen(true), [])

  return (
    <ConsentContext.Provider value={{ consent, setConsent, openSettings }}>
      {children}
      {ready && (consent === null || open) && <CookieBanner onChoose={setConsent} />}
    </ConsentContext.Provider>
  )
}

function CookieBanner({ onChoose }) {
  return (
    <div
      role="dialog"
      aria-label="Cookie-uri"
      className="fixed inset-x-3 bottom-3 z-[900] mx-auto max-w-[720px] rounded-2xl border border-olla-navy/10 bg-white p-5 shadow-2xl shadow-olla-navy/25 sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <p className="text-[17px] font-bold text-olla-navy">🍪 Cookie-uri</p>
      <p className="mt-2 text-[15px] leading-relaxed text-olla-navy/80">
        Site-ul funcționează fără cookie-uri. Harta Google și videoclipurile de pe YouTube pun însă
        cookie-uri proprii, așa că le încărcăm doar cu acordul tău. Detalii în{' '}
        <Link href="/politica-de-confidentialitate" className="font-semibold text-olla-blue underline underline-offset-2">
          Politica de confidențialitate
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => onChoose('necessary')}
          className="rounded-xl border border-olla-navy/20 px-5 py-2.5 text-[15px] font-semibold text-olla-navy transition-colors hover:bg-olla-gray"
        >
          Doar necesare
        </button>
        <button
          type="button"
          onClick={() => onChoose('all')}
          className="rounded-xl bg-olla-coral px-5 py-2.5 text-[15px] font-semibold text-white shadow-md shadow-olla-coral/25 transition-colors hover:bg-[#e84646]"
        >
          Accept toate
        </button>
      </div>
    </div>
  )
}

/**
 * Hartă sau video de la Google: fără acord, în locul lui apare un buton
 * care îl încarcă (și salvează acordul) plus un link direct spre serviciu.
 */
export function ConsentEmbed({ src, title, className = '', label, openHref, openLabel, ...rest }) {
  const { consent, setConsent } = useConsent()

  if (consent === 'all') {
    return <iframe src={src} title={title} loading="lazy" className={className} {...rest} />
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 bg-olla-gray p-4 text-center ${className}`}>
      <p className="max-w-[320px] text-[14px] leading-snug text-olla-navy/70">{label}</p>
      <button
        type="button"
        onClick={() => setConsent('all')}
        className="rounded-full bg-olla-blue px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-olla-navy"
      >
        Accept cookie-urile și încarcă
      </button>
      {openHref && (
        <a href={openHref} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-olla-blue underline underline-offset-2">
          {openLabel}
        </a>
      )}
    </div>
  )
}
