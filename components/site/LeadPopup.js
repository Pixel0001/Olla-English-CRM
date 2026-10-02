'use client'

import { useEffect, useState } from 'react'
import { ArrowRightIcon, CheckIcon, EnvelopeIcon, PhoneIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { CONTACT, COURSES, POPUP } from './content'

/**
 * Formularul „Rezervă o lecție de probă". Cursul și formatul vin bifate din
 * butonul apăsat (ex. cardul „Lecții Individuale (1:1)" de la 7–14 ani), dar
 * omul le poate schimba. Tot ce alege ajunge în lead, în CRM.
 */

export const INTENTS = ['Lecție de probă', 'Testare gratuită', 'Vreau informații']
const DEFAULT_FORMATS = ['În grupă', 'Individual (1:1)']
const PLACES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'La sediu' },
]

export const COURSE_OPTIONS = COURSES.tabs.map((t) => ({
  label: t.mobile || t.tab,
  formats: t.cards?.length ? [...new Set(t.cards.map((c) => c.label))] : DEFAULT_FORMATS,
}))

function MoldovaFlag() {
  return (
    <svg viewBox="0 0 20 14" className="h-[14px] w-5 rounded-[2px]" aria-hidden>
      <rect width="7" height="14" fill="#0046ae" />
      <rect x="7" width="6" height="14" fill="#ffd200" />
      <rect x="13" width="7" height="14" fill="#cc092f" />
      <circle cx="10" cy="7" r="1.6" fill="#8a5a1a" />
    </svg>
  )
}

function Chips({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-olla-navy/60">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value
          const text = typeof o === 'string' ? o : o.label
          const active = value === v
          return (
            <button
              key={v}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[14px] font-medium transition-all ${
                active
                  ? 'border-olla-blue bg-olla-blue text-white shadow-sm'
                  : 'border-olla-navy/15 bg-white text-olla-navy hover:border-olla-blue/50 hover:bg-olla-blue/5'
              }`}
            >
              {active && <CheckIcon className="h-3.5 w-3.5" />}
              {text}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function Field({ icon: Icon, prefix, ...props }) {
  return (
    <label className="group relative block">
      <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-olla-navy/40 group-focus-within:text-olla-blue">
        {Icon ? <Icon className="h-[18px] w-[18px]" /> : prefix}
      </span>
      <input
        {...props}
        className={`h-12 w-full rounded-xl border border-olla-navy/15 bg-olla-gray/60 pr-4 text-[15px] text-olla-navy outline-none transition-colors placeholder:text-olla-navy/45 focus:border-olla-blue focus:bg-white focus:ring-4 focus:ring-olla-blue/10 ${
          prefix ? 'pl-[84px]' : 'pl-11'
        }`}
      />
    </label>
  )
}

export default function LeadPopup({ preset, onClose }) {
  const [intent, setIntent] = useState(preset?.intent || INTENTS[0])
  const [course, setCourse] = useState(preset?.course ?? null) // indexul cursului
  const [format, setFormat] = useState(preset?.format ?? null)
  const [place, setPlace] = useState(null)
  const [state, setState] = useState('idle') // idle | sending | done
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const formats = course != null ? COURSE_OPTIONS[course].formats : DEFAULT_FORMATS

  const pickCourse = (i) => {
    setCourse(i)
    // formatul ales rămâne doar dacă există și la cursul nou
    if (i == null || !COURSE_OPTIONS[i].formats.includes(format)) setFormat(null)
  }

  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const phone = String(form.get('phone') || '').trim()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          // fără prefix scris de om, numărul e din Moldova
          phone: /^(\+|00)/.test(phone) ? phone : `+373 ${phone.replace(/^0+/, '')}`,
          intent,
          course: course != null ? COURSE_OPTIONS[course].label : null,
          format,
          place,
          website: form.get('website'),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Nu am putut trimite. Încearcă din nou sau sună-ne.')
      setState('done')
    } catch (err) {
      setError(err.message)
      setState('idle')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-olla-navy/85 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div className="mx-auto my-auto flex min-h-full max-w-[600px] items-center">
        <div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30">
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#08217d,#021044)] px-6 pb-7 pt-9 text-center sm:px-10">
            <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-olla-cyan/20 blur-2xl" />
            <div aria-hidden className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-olla-coral/25 blur-2xl" />
            <p className="relative inline-flex items-center gap-1.5 text-[15px] font-semibold text-olla-cyan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/site/olla-icon.png" alt="" width={101} height={103} className="h-[1.1em] w-auto brightness-0 invert" />
              OLLA English Center
            </p>
            <h3 id="lead-popup-title" className="relative mx-auto mt-2 max-w-[460px] text-[clamp(1.25rem,1.2vw+1rem,1.6rem)] font-bold leading-snug text-white">
              {POPUP.title}
            </h3>
            <a
              href={CONTACT.phoneHref}
              className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-olla-coral px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-olla-coral/30 transition-transform hover:scale-[1.03]"
            >
              <PhoneIcon className="h-4 w-4" />
              {CONTACT.phone}
            </a>
          </div>

          {state === 'done' ? (
            <div className="px-6 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-5 text-xl font-bold text-olla-navy">{POPUP.success}</p>
              {(course != null || format) && (
                <p className="mt-2 text-[15px] text-olla-navy/70">
                  {[course != null && COURSE_OPTIONS[course].label, format].filter(Boolean).join(' · ')}
                </p>
              )}
              <button type="button" onClick={onClose} className="mt-7 rounded-full bg-olla-navy px-7 py-3 text-[15px] font-semibold text-white hover:bg-olla-blue">
                Închide
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5 px-6 pb-8 pt-7 sm:px-10">
              {/* capcană pentru roboți: un om nu vede câmpul ăsta */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              <Chips label="Ce dorești" options={INTENTS} value={intent} onChange={(v) => setIntent(v || INTENTS[0])} />
              <Chips
                label="Cursul"
                options={COURSE_OPTIONS.map((c, i) => ({ value: i, label: c.label }))}
                value={course}
                onChange={pickCourse}
              />
              <Chips label="Formatul" options={formats} value={format} onChange={setFormat} />
              <Chips label="Unde" options={PLACES} value={place} onChange={setPlace} />

              <div className="space-y-3 pt-1">
                <Field icon={UserIcon} name="name" required placeholder="Nume complet*" autoComplete="name" />
                <Field icon={EnvelopeIcon} name="email" type="email" required placeholder="Email*" autoComplete="email" />
                <Field
                  prefix={<><MoldovaFlag /><span className="text-[15px] font-medium text-olla-navy">+373</span></>}
                  name="phone"
                  type="tel"
                  required
                  placeholder="Telefon*"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <label className="flex items-start gap-3 text-[14px] leading-snug text-olla-navy/80">
                <input type="checkbox" name="terms" required className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-olla-blue" />
                <span>
                  {POPUP.consent}{' '}
                  <a href="/politica-de-confidentialitate" target="_blank" rel="noopener noreferrer" className="font-semibold text-olla-blue underline underline-offset-2">
                    {POPUP.consentLink}
                  </a>
                  .
                </span>
              </label>

              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-olla-coral text-[17px] font-bold tracking-wide text-white shadow-lg shadow-olla-coral/25 transition-all hover:bg-[#e84646] hover:shadow-olla-coral/40 disabled:opacity-60"
              >
                {state === 'sending' ? 'SE TRIMITE…' : POPUP.submit}
                {state !== 'sending' && <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
