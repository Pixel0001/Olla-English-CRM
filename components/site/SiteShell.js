'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRightIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { CONTACT, NAV, SOCIAL } from './content'
import { BUTTONS, WRAP } from './ui'
import LeadPopup from './LeadPopup'
import { ConsentEmbed, ConsentProvider, useConsent } from './CookieConsent'

const SiteContext = createContext({ openForm: () => {} })

/**
 * Deschide formularul „Rezervă o lecție" din orice buton al site-ului.
 * openForm({ intent, course, format }) — tot ce se știe deja vine bifat.
 */
export const useSiteForm = () => useContext(SiteContext).openForm

function Header({ openForm }) {
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const headerRef = useRef(null)
  const lockUntil = useRef(0)

  // Bara dispare când derulezi în jos și revine la primul pas în sus
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      // în timpul unui salt la o secțiune, bara rămâne cum am pus-o noi
      if (Date.now() < lockUntil.current) { lastY = y; return }
      if (y < 120) setHidden(false)
      else if (y > lastY + 12) setHidden(true)
      else if (y < lastY - 12) setHidden(false)
      else return // mișcare prea mică: nu schimbăm nimic și nu mutăm reperul
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Linkurile spre secțiuni (#cursuri, #despre, #test), de oriunde din pagină:
  // în jos, secțiunea ajunge exact sus și bara se ascunde; în sus, bara
  // apare și secțiunea se oprește imediat sub ea — fără spațiu gol.
  useEffect(() => {
    const scrollToId = (id, behavior = 'smooth') => {
      const el = document.getElementById(id)
      if (!el) return false
      const top = el.getBoundingClientRect().top + window.scrollY
      const down = top > window.scrollY
      const offset = down ? 0 : headerRef.current?.offsetHeight || 0
      lockUntil.current = Date.now() + 1200
      setHidden(down && top > 120)
      window.scrollTo({ top: Math.max(0, top - offset), behavior })
      return true
    }

    const onClick = (e) => {
      const a = e.target.closest?.('a[href*="#"]')
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return
      const url = new URL(a.href, window.location.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      const id = decodeURIComponent(url.hash.slice(1))
      if (!document.getElementById(id)) return
      e.preventDefault()
      e.stopPropagation()
      setMenu(false)
      history.replaceState(null, '', `#${id}`)
      // după închiderea meniului de pe telefon pagina se poate derula din nou
      setTimeout(() => scrollToId(id), 30)
    }

    document.addEventListener('click', onClick, true)
    // venit de pe altă pagină cu /#cursuri: aceeași poziție, fără gol
    if (window.location.hash) setTimeout(() => scrollToId(decodeURIComponent(window.location.hash.slice(1)), 'auto'), 60)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (!menu) return
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menu])

  return (
    <>
    <header
      ref={headerRef}
      // Ascunderea: alunecă în sus și se estompează, mai repede (400ms, accelerat).
      // Apariția: coboară lin și încetinește la final (650ms).
      className={`sticky top-0 z-50 bg-olla-gray px-4 transition-[transform,opacity,box-shadow] will-change-transform sm:px-[18px] ${
        hidden && !menu
          ? '-translate-y-full opacity-0 duration-[400ms] ease-[cubic-bezier(0.4,0,1,1)]'
          : 'translate-y-0 opacity-100 duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      } ${scrolled ? 'shadow-[0_8px_30px_-14px_rgba(2,16,68,0.4)]' : ''}`}
    >
      <div className={`${WRAP} flex min-h-[72px] items-center justify-between gap-6 py-2 lg:min-h-[86px] lg:py-[12.8px]`}>
        <div className="flex items-center">
          <Link href="/" aria-label="Olla English">
            <Image src="/site/olla-english.png" alt="Olla English" width={342} height={103} priority className="h-auto w-[160px] lg:w-[199px]" />
          </Link>
          <nav className="ml-[26px] hidden items-center gap-[17px] lg:flex">
            {NAV.map((item) => (
              <Link key={item.label} href={item.href} className="text-[14.2px] font-semibold leading-[21.3px] text-olla-navy transition-colors hover:text-olla-navy/80">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-[18px] lg:flex">
          <a href={CONTACT.phoneHref} className="flex items-center gap-[9px] text-[14.2px] font-semibold leading-[21.3px] tracking-[0.5px] text-olla-navy transition-colors hover:text-olla-navy/80">
            <PhoneIcon className="h-[15px] w-[15px]" />
            {CONTACT.phone}
          </a>
          <button type="button" onClick={() => openForm({ intent: 'Vreau informații' })} className={BUTTONS.navy}>Contactează-ne acum</button>
        </div>

        {/* Telefon: apel direct + meniu */}
        <div className="flex items-center gap-2 lg:hidden">
          <a href={CONTACT.phoneHref} aria-label={`Sună la ${CONTACT.phone}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-olla-coral text-white shadow-md shadow-olla-coral/30">
            <PhoneIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenu(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full bg-olla-navy"
            aria-label="Deschide meniul"
            aria-expanded={menu}
          >
            <span className="h-0.5 w-5 rounded bg-white" />
            <span className="h-0.5 w-5 rounded bg-white" />
            <span className="h-0.5 w-3.5 self-center rounded bg-white" style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>

    </header>

      {/* Meniul de pe telefon: în afara barei, ca să acopere tot ecranul (bara are transform) */}
      <div className={`fixed inset-0 z-[1000] lg:hidden ${menu ? 'visible' : 'invisible'}`} aria-hidden={!menu}>
        <div
          className={`absolute inset-0 bg-olla-navy/60 backdrop-blur-sm transition-opacity duration-300 ${menu ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenu(false)}
        />
        <nav
          aria-label="Meniu"
          className={`absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-olla-navy/10 px-5 py-4">
            <Image src="/site/olla-english.png" alt="Olla English" width={342} height={103} className="h-auto w-[130px]" />
            <button
              type="button"
              onClick={() => setMenu(false)}
              aria-label="Închide meniul"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-olla-gray text-olla-navy"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenu(false)}
                className="flex items-center justify-between rounded-2xl px-3 py-4 text-[18px] font-semibold text-olla-navy transition-colors hover:bg-olla-gray"
              >
                {item.label}
                <ArrowUpRightIcon className="h-4 w-4 rotate-45 text-olla-navy/40" />
              </Link>
            ))}

            <div className="mx-3 mt-4 flex gap-2">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-olla-navy/15 px-3 py-1.5 text-[13px] font-medium text-olla-navy">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-olla-navy/10 p-5">
            <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-2 rounded-2xl border border-olla-navy/15 py-3.5 text-[16px] font-semibold text-olla-navy">
              <PhoneIcon className="h-4 w-4" />
              {CONTACT.phone}
            </a>
            <button
              type="button"
              onClick={() => { setMenu(false); openForm({ intent: 'Lecție de probă' }) }}
              className="w-full rounded-2xl bg-olla-coral py-3.5 text-[16px] font-bold text-white shadow-lg shadow-olla-coral/25"
            >
              Rezervă o lecție de probă
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}

function Footer() {
  const { openSettings } = useConsent()
  const links = 'block text-[14.2px] leading-[21.3px] text-olla-navy hover:text-olla-coral'
  return (
    <footer className="bg-olla-gray">
      <div className={`${WRAP} px-4 sm:px-[18px]`}>
        <div className="border-b border-olla-navy/20 pb-4 pt-8 sm:pb-[26px]">
          <p className="text-2xl font-medium leading-[1.2] text-olla-navy">Let’s Talk</p>
          <a href={CONTACT.phoneHref} className="-mt-[15px] inline-flex items-center gap-4 lg:-mt-[7px] text-[clamp(1.375rem,4vw+0.4rem,4rem)] font-bold leading-[1.5] text-olla-navy">
            {CONTACT.phone}
            <ArrowUpRightIcon stroke="currentColor" strokeWidth={2.2} className="h-[0.5em] w-[0.5em] text-olla-blue" />
          </a>
        </div>

        <div className="flex flex-wrap justify-between gap-x-10 gap-y-[26px] border-b border-olla-navy/20 pb-[26px] pt-[25px]">
          <div>
            <Link href="/"><Image src="/site/olla-english.png" alt="Olla English" width={342} height={103} className="h-auto w-[250px]" /></Link>
            <p className="mt-[10px] text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-navy">
              Ai întrebări ?<br />Sună și imediat îți dăm răspunsul:{' '}
              <a href={CONTACT.phoneHref} className="font-semibold underline-offset-2 hover:underline">{CONTACT.phone}</a>
            </p>
          </div>
          <div className="flex gap-9">
            <div className="space-y-[12.7px]">
              <h2 className="text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] font-semibold leading-[1.2] text-olla-navy">Pagini</h2>
              {NAV.map((item) => (
                <p key={item.label}><Link href={item.href} className={links}>{item.label}</Link></p>
              ))}
            </div>
            <div className="space-y-[12.7px]">
              <h2 className="text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] font-semibold leading-[1.2] text-olla-navy">Social</h2>
              {SOCIAL.map((item) => (
                <p key={item.label}><a href={item.href} target="_blank" rel="noopener noreferrer" className={links}>{item.label}</a></p>
              ))}
            </div>
          </div>
        </div>

        <p className="pb-[18px] pt-[25px] text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-navy">
          Ne găsești pe:<br />
          <a href={CONTACT.mapsLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-2 hover:underline">
            {CONTACT.address}
          </a>
        </p>

        {/* Deschide locația în aplicația de hărți pe care o folosește omul */}
        <div className="mb-[18px] flex flex-wrap gap-2">
          {CONTACT.mapApps.map((app) => (
            <a
              key={app.label}
              href={app.href}
              target={app.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border border-olla-navy/15 bg-white px-4 py-2 text-[14.2px] font-semibold text-olla-navy shadow-sm transition-colors hover:border-olla-blue hover:bg-olla-blue hover:text-white ${app.mobileOnly ? 'md:hidden' : ''}`}
            >
              <span aria-hidden>{app.icon}</span>
              {app.label}
            </a>
          ))}
        </div>

        {/* Harta, în lățimea paginii, cu aceleași margini ca restul footer-ului */}
        <ConsentEmbed
          src={CONTACT.mapsEmbed}
          title={`Hartă: ${CONTACT.address}`}
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[300px] w-full rounded-2xl border-0 md:h-[420px]"
          allowFullScreen
          label="Harta Google pune cookie-uri proprii, așa că o încărcăm doar cu acordul tău."
          openHref={CONTACT.mapsLink}
          openLabel="Sau deschide locația în Google Maps"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 py-[25px] text-[14.2px] leading-[21.3px] text-olla-navy">
          <span className="font-semibold">Olla English Center © {new Date().getFullYear()}</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/politica-de-confidentialitate" className="font-semibold">Politica de confidențialitate</Link>
            <Link href="/termeni-si-conditii" className="font-semibold">Termeni și condiții</Link>
            <button type="button" onClick={openSettings} className="font-semibold">Setări cookie-uri</button>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function SiteShell({ children }) {
  const [preset, setPreset] = useState(null) // null = închis
  const openForm = useCallback((p) => setPreset(p && typeof p === 'object' && !p.nativeEvent ? p : {}), [])
  const close = useCallback(() => setPreset(null), [])

  return (
    <SiteContext.Provider value={{ openForm }}>
      <ConsentProvider>
        <div className="site-root min-h-screen bg-olla-gray text-[18px] leading-[1.5] text-[#191a1b]">
          <Header openForm={openForm} />
          <main>{children}</main>
          <Footer />
          {preset && <LeadPopup preset={preset} onClose={close} />}
        </div>
      </ConsentProvider>
    </SiteContext.Provider>
  )
}
