import Image from 'next/image'
import { CheckBadgeIcon, CheckCircleIcon, FlagIcon, PhoneIcon, StarIcon } from '@heroicons/react/24/solid'
import {
  ABOUT, AUDIENCE, CONTACT, COURSES, DEMO, EYEBROW, FAQ, HERO, NEXT_COURSE, REVIEW_IMAGES,
  STEPS, TEAM, TICKER, TRIAL, VIDEO_REVIEWS,
} from './content'
import { BrandText, BUTTONS, Eyebrow, H2, H4, SECTION, TEXT, WRAP } from './ui'
import { FEATURE_ICONS, SKILL_ICONS, UserCheckIcon } from './icons'
import FormButton from './FormButton'
import { Counter, CourseTabs, Countdown, Faq, Slider, ZoomImage } from './interactive'
import { ConsentEmbed } from './CookieConsent'

const img = (name) => `/site/${name}`

function Heading({ eyebrow = true, title, text, light, textClass, wide }) {
  return (
    <div className="mx-auto max-w-[810px] text-center">
      {eyebrow && <Eyebrow light={light} className={light ? 'text-olla-coral' : 'text-olla-navy'}>{EYEBROW}</Eyebrow>}
      <h2 className={`${H2} ${eyebrow ? 'mt-[10px]' : ''} ${light ? '!text-white' : ''}`}><BrandText text={title} light={light} /></h2>
      {text && <p className={`${TEXT} mx-auto mt-[10px] ${wide ? '' : 'max-w-[540px]'} ${textClass || (light ? 'text-olla-lavender' : 'text-olla-blue')}`}>{text}</p>}
    </div>
  )
}

export function Hero() {
  const [left, center, right] = HERO.images
  const tilted = 'relative w-[min(360px,31vw)] shrink-0 overflow-hidden rounded-xl'
  return (
    <section className="px-4 sm:px-[18px] pb-0 pt-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]" style={{ background: 'radial-gradient(at 50% 0%, #08217d, #141952, #021044)' }}>
      <div className="mx-auto max-w-[810px] text-center">
        <Eyebrow light className="text-olla-coral">{EYEBROW}</Eyebrow>
        <h1 className="mt-[18px] text-[clamp(1.425rem,1.84vw+1.056rem,2.6625rem)] font-bold leading-[1.1] text-white">{HERO.title}</h1>
        <p className={`${TEXT} mx-auto mt-[18px] max-w-[540px] text-olla-lavender`}>{HERO.text}</p>
        <div className="mt-[22px] flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:items-center">
          <FormButton preset={{ intent: 'Lecție de probă' }} className={BUTTONS.coral}>Rezervă o lecție de probă <span aria-hidden>→</span></FormButton>
          <FormButton preset={{ intent: 'Testare gratuită' }} className={BUTTONS.cyanFlat}>Treci o testare gratuită</FormButton>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1100px] items-center justify-center pb-[calc(5.5vw+22.5px)] pt-[clamp(1.5rem,2.5vw,2.25rem)]">
        <div className={`${tilted} -mr-[min(25px,2vw)] aspect-[500/666] translate-y-[min(25px,2.5vw)] -rotate-[15deg]`}>
          <Image src={img(left)} alt="Cursanți Olla English cu diplomele" fill sizes="360px" className="object-cover" priority />
        </div>
        <div className={`${tilted} z-10 aspect-[500/666]`}>
          <Image src={img(center)} alt="Olga Lazarchevici, fondatoarea Olla English" fill sizes="360px" className="object-cover" priority />
        </div>
        <div className={`${tilted} -ml-[min(25px,2vw)] aspect-[500/666] translate-y-[min(25px,2.5vw)] rotate-[15deg]`}>
          <Image src={img(right)} alt="Lecție la Olla English" fill sizes="360px" className="object-cover" priority />
        </div>
      </div>
    </section>
  )
}

export function Ticker() {
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER]
  return (
    <section className="overflow-hidden bg-olla-peach py-4 sm:py-[18px]" aria-hidden>
      <div className="site-marquee" style={{ '--marquee-duration': '75s' }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((t, i) => (
              <p key={i} className="whitespace-nowrap px-8 text-[clamp(1.3rem,1.05vw+1.05rem,2rem)] font-bold leading-[1.5] text-olla-navy">{t}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export function NextCourse() {
  return (
    <section className="bg-olla-lavender px-4 py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)] sm:px-[18px]">
      <div className={`${WRAP} grid gap-[18px] rounded-xl bg-white p-4 sm:rounded-[20px] sm:p-9 md:grid-cols-2`}>
        <div>
          <h2 className={H2}>{NEXT_COURSE.title}</h2>
          <p className="mt-3 text-[16px] leading-[1.5] sm:text-[18px]">{NEXT_COURSE.text}</p>
          <div className="mt-2">
            <Countdown numberClass="text-olla-coral" labelClass="text-olla-blue" separatorClass="text-olla-navy" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <FormButton preset={{ intent: 'Lecție de probă' }} className={BUTTONS.coral}>Rezervă o lecție de probă <span aria-hidden>→</span></FormButton>
            <FormButton preset={{ intent: 'Testare gratuită' }} className={BUTTONS.cyan}>Treci o testare gratuită</FormButton>
          </div>
        </div>
        <div>
          <ul className="space-y-[10px]">
            {NEXT_COURSE.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[16px] text-olla-navy sm:text-[18px]">
                <CheckCircleIcon className="h-6 w-6 shrink-0 text-olla-coral" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-[34px] flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex">
              {NEXT_COURSE.avatars.map((a, i) => (
                <Image key={a} src={img(a)} alt="" width={40} height={40} className={`h-10 w-10 rounded-full border-2 border-white object-cover ${i ? '-ml-1.5' : ''}`} />
              ))}
            </div>
            <div className="flex gap-1 text-olla-coral">
              {[0, 1, 2, 3, 4].map((s) => <StarIcon key={s} className="h-6 w-6" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CourseCard({ card, courseIndex }) {
  // Pe desktop: textul sus-stânga, butonul jos-stânga, detaliile în dreapta pe
  // toată înălțimea. Pe telefon: text, detalii, apoi butonul la finalul cardului.
  return (
    <article className="grid gap-[21px] rounded-xl border border-olla-blue p-[18px] lg:grid-cols-[57.3fr_42.7fr] lg:grid-rows-[auto_1fr] lg:gap-0">
      <div className="lg:col-start-1 lg:row-start-1 lg:pr-[25.4px]">
        <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(1.425rem,1.84vw+1.056rem,2.6625rem)] font-bold leading-[1.2] text-olla-navy">
            {card.name}
            <span className="rounded-full bg-olla-coral px-2.5 py-[5.35px] text-[14.2px] font-normal leading-[21.3px] text-white">{card.age}</span>
          </p>
          <h3 className="w-fit shrink-0 rounded-full border border-olla-navy/10 bg-olla-cyan px-[6.6px] py-[5.2px] text-[14.2px] font-semibold leading-[1.3] text-olla-navy">
            {card.label}
          </h3>
        </div>
        <p className="mt-[10px] text-[16px] leading-[1.5] text-olla-navy/90 sm:text-[18px]">{card.text}</p>
      </div>

      <ul className="space-y-[18px] border-t border-olla-navy/10 pt-[33px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:space-y-[12.7px] lg:border-l lg:border-t-0 lg:pl-[24px] lg:pt-0">
        {card.features.map(([icon, text]) => {
          const Icon = FEATURE_ICONS[icon]
          return (
            <li key={text} className="flex items-center gap-2.5 text-[16px] text-olla-navy sm:text-[18px]">
              <Icon className="h-6 w-6 shrink-0 text-olla-blue" />
              {text}
            </li>
          )
        })}
      </ul>

      <div className="lg:col-start-1 lg:row-start-2 lg:flex lg:items-end lg:pr-[25.4px] lg:pt-5">
        <FormButton preset={{ intent: 'Lecție de probă', course: courseIndex, format: card.label }} className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-olla-blue px-4 py-[10.2px] text-[18px] font-semibold text-white transition-colors hover:bg-olla-navy sm:px-[18px] lg:w-fit">
          Sună sau scrie-ne <PhoneIcon className="h-5 w-5" />
        </FormButton>
      </div>
    </article>
  )
}

function CoursePanel({ tab, index }) {
  return (
    <div>
      <h4 className={H4}>{tab.title}</h4>
      {tab.text && <p className="mt-3 text-[16px] leading-[1.5] text-[#191a1b] sm:text-[18px]">{tab.text}</p>}
      {tab.skills && (
        <div className="mt-4 rounded-xl border border-olla-blue p-[18px]">
          <p className="text-[16px] leading-[1.5] text-olla-navy/90 sm:text-[18px]">{tab.intro}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {tab.skills.map(([icon, name, text]) => {
              const Icon = SKILL_ICONS[icon]
              return (
                <li key={name} className="flex items-start gap-3 rounded-xl bg-olla-gray p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-olla-blue text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[16px] leading-[1.45] text-olla-navy sm:text-[17px]">
                    <b className="block text-olla-navy">{name}</b>
                    {text}
                  </span>
                </li>
              )
            })}
          </ul>
          {tab.note && (
            <p className="mt-4 flex items-start gap-3 text-[16px] leading-[1.5] text-olla-navy/90 sm:text-[17px]">
              <CheckBadgeIcon className="mt-0.5 h-6 w-6 shrink-0 text-olla-blue" />
              {tab.note}
            </p>
          )}
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-olla-coral/10 p-4">
            <FlagIcon className="mt-0.5 h-6 w-6 shrink-0 text-olla-coral" />
            <p className="text-[16px] leading-[1.5] text-olla-navy sm:text-[17px]">
              <b>Scopul nostru: </b>{tab.goal}
            </p>
          </div>
          {/* BAC și Cambridge n-au carduri de preț — butonul stă la baza cardului */}
          <FormButton
            preset={{ intent: 'Lecție de probă', course: index }}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-olla-blue px-[18px] py-[10.2px] text-[18px] font-semibold text-white transition-colors hover:bg-olla-navy sm:w-fit"
          >
            Sună sau scrie-ne <PhoneIcon className="h-5 w-5" />
          </FormButton>
        </div>
      )}

      {tab.cards && <div className="mt-4 space-y-4">{tab.cards.map((c) => <CourseCard key={c.label} card={c} courseIndex={index} />)}</div>}
    </div>
  )
}

export function Courses() {
  return (
    <section id="cursuri" className="bg-white px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={WRAP}>
        <Heading title={COURSES.title} text={COURSES.text} textClass="text-olla-blue" />
        <div className="mt-10">
          <CourseTabs tabs={COURSES.tabs} panels={COURSES.tabs.map((tab, i) => <CoursePanel key={tab.tab} tab={tab} index={i} />)} />
        </div>
      </div>
    </section>
  )
}

export function Trial() {
  return (
    <section id="test" className="bg-olla-lavender px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={`${WRAP} rounded-[32px] px-5 py-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] text-center`} style={{ background: 'linear-gradient(135deg, #08217d, #141952)' }}>
        <Heading title={TRIAL.title} text={TRIAL.text} light />
        <div className="mt-6 flex justify-center">
          <Countdown numberClass="text-olla-cyan" labelClass="text-olla-lime/90" separatorClass="text-olla-cyan" />
        </div>
        <p className="mx-auto mt-[38px] max-w-[810px] text-[clamp(1.15rem,0.6vw+1rem,1.5rem)] font-semibold leading-[1.5] text-white">{TRIAL.closing}</p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <FormButton preset={{ intent: 'Lecție de probă' }} className={BUTTONS.white}>Rezervă o lecție de probă</FormButton>
          <a href={CONTACT.phoneHref} className={BUTTONS.outline}>Sună: {CONTACT.phoneShort}</a>
        </div>
      </div>
    </section>
  )
}

export function Audience() {
  const tones = ['bg-olla-navy', 'bg-olla-blue', 'bg-olla-navy']
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Heading eyebrow={false} title={AUDIENCE.title} text={AUDIENCE.text} textClass="text-olla-navy" />
        <div className="mt-[clamp(1.4375rem,1.24vw+1.1375rem,2.25rem)] grid gap-[18px] lg:grid-cols-3">
          {AUDIENCE.cards.map((c, i) => (
            <article key={c.title} className={`rounded-xl p-[clamp(1.3125rem,0.42vw+1.2125rem,1.5875rem)] ${tones[i]}`}>
              <div className="flex h-[50px] w-14 items-center justify-center rounded-xl bg-olla-cyan">
                <UserCheckIcon className="h-7 w-7 text-olla-navy" />
              </div>
              <h3 className="mt-5 text-[clamp(1.156rem,0.52vw+1.03rem,1.5rem)] font-bold leading-[1.3] text-white">{c.title}</h3>
              <p className="mt-2 text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-lavender">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const REVIEW_SLIDER = {
  type: 'loop', height: '50vh', gap: '14px', perPage: 5, perMove: 1, speed: 5000, interval: 5000,
  autoplay: true, pauseOnHover: true, pauseOnFocus: true, arrows: true, pagination: false, keyboard: 'global',
  breakpoints: { 1279: { perPage: 5 }, 767: { perPage: 2 }, 478: { perPage: 1 } },
}

export function Reviews() {
  return (
    <section className="bg-olla-cyan px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={WRAP}>
        <Slider options={REVIEW_SLIDER} label="Recenzii de la părinți și cursanți" arrowColor="#000">
          {REVIEW_IMAGES.map((name) => (
            <li key={name} className="splide__slide h-full">
              <ZoomImage src={img(name)} className="h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(name)} alt="Recenzie" loading="lazy" className="h-full w-full object-cover" />
              </ZoomImage>
            </li>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export function Marquee({ images, size, duration = 35, round = true }) {
  return (
    <div className="site-marquee-fade overflow-hidden">
      <div className="site-marquee" style={{ '--marquee-duration': `${duration}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-[18px] pr-[18px]" aria-hidden={copy === 1}>
            {images.map((name, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img(name)} alt="" loading="lazy" className={`shrink-0 object-cover ${round ? 'rounded-xl' : ''}`} style={{ width: size[0], height: size[1] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="despre" className="bg-white py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className="px-4 sm:px-[18px]">
      <div className={WRAP}>
        <div className="grid gap-[18px] md:grid-cols-2">
          <div className="self-start">
            <p className="text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] font-semibold text-olla-navy">{ABOUT.tagline}</p>
            <h1 className={`${H2} mt-[10px] !leading-[1.1]`}><BrandText text={ABOUT.title} /></h1>
            <p className="mt-[10px] max-w-[540px] text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-[#191a1b]">{ABOUT.text}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-[18px] gap-y-[18px]">
            {ABOUT.counters.map((c) => (
              <div key={c.label}>
                <Counter value={c.value} suffix={c.suffix} className={`${H2} block`} />
                <p className="mt-2 text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-navy/60 sm:mt-[18px]">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <div className="mt-[30px] sm:mt-10">
        <Marquee images={ABOUT.images} size={['clamp(194px, calc(15.8vw + 132px), 360px)', 'clamp(145.5px, calc(11.85vw + 99px), 270px)']} round={false} />
      </div>
    </section>
  )
}

export function Team() {
  return (
    <section className="bg-white">
      <div className="bg-olla-navy px-4 pt-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)] pb-[222px] sm:px-[18px] lg:pb-[398px]">
        <Heading eyebrow={false} title={TEAM.title} text={TEAM.text} light textClass="text-white/80" />
      </div>
      <div className={`${WRAP} px-4 sm:px-[18px]`}>
        <div className="grid gap-[18px] pb-[72px] -mt-[210px] md:grid-cols-2 lg:-mt-[358px] lg:grid-cols-[repeat(4,minmax(0,338px))] lg:justify-center">
          {TEAM.members.map((m) => (
            <div key={m.name}>
              <Image src={img(m.photo)} alt={m.name} width={338} height={450} className="aspect-[338/450] w-full rounded-[20px] object-cover" />
              <h3 className="mt-4 text-[clamp(1rem,0.19vw+0.96rem,1.125rem)] font-bold leading-[1.3] text-olla-navy">{m.name}</h3>
              <p className="text-[14.2px] leading-[1.5] text-olla-navy/80">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const VIDEO_SLIDER = {
  type: 'loop', height: '500px', gap: '0px', perPage: 4, perMove: 1, speed: 400, autoplay: false,
  arrows: true, pagination: false, keyboard: 'global',
  breakpoints: { 1279: { perPage: 4 }, 991: { perPage: 3 }, 767: { perPage: 2 } },
}

export function VideoReviews() {
  return (
    <section id="video-res" className="bg-white px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={WRAP}>
        <div className="mx-auto max-w-[810px] text-center">
          <p className="text-[18px] font-semibold text-olla-navy">{VIDEO_REVIEWS.eyebrow}</p>
          <h2 className={`${H2} mx-auto mt-[10px]`}>{VIDEO_REVIEWS.title}</h2>
          <p className={`${TEXT} mx-auto mt-[10px] max-w-[540px] text-olla-blue`}>{VIDEO_REVIEWS.text}</p>
        </div>
        <div className="mt-[18px]">
          <Slider options={VIDEO_SLIDER} arrowColor="#ff5252" label="Recenzii video">
            {VIDEO_REVIEWS.videos.map((id, i) => (
              <li key={`${id}-${i}`} className="splide__slide h-full bg-white">
                <ConsentEmbed
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={`Recenzie video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="mx-auto block h-full w-full md:w-[calc(100%-35px)]"
                  label="Videoclipurile YouTube pun cookie-uri proprii, așa că le încărcăm doar cu acordul tău."
                  openHref={`https://www.youtube.com/shorts/${id}`}
                  openLabel="Sau vezi videoclipul pe YouTube"
                />
              </li>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export function Steps() {
  return (
    <section className="bg-white px-4 sm:px-[18px] pb-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)] pt-0">
      <div className={WRAP}>
        <Heading title={STEPS.title} text={STEPS.text} textClass="text-olla-blue" wide />
        <div className="mt-[clamp(0.6875rem,2.48vw+1.25px,2.3125rem)] grid gap-[18px] px-2 sm:px-[18px] md:grid-cols-3">
          {STEPS.items.map((s, i) => (
            <article key={s.title} className="rounded-xl bg-olla-blue p-4 sm:p-[18px]">
              <p className="text-[clamp(1.3125rem,1.05vw+1.056rem,2rem)] font-bold leading-[1.2] text-olla-cyan">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-[clamp(0.25rem,0.5vw+0.2rem,0.64rem)] text-[clamp(1.3125rem,1.05vw+1.056rem,2rem)] font-bold leading-[1.3] text-white">{s.title}</h3>
              <p className="mt-[clamp(0.25rem,0.5vw+0.2rem,0.64rem)] text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-lavender">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FaqSection() {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <Heading eyebrow={false} title={FAQ.title} text={FAQ.text} textClass="text-olla-navy" wide />
        <Faq items={FAQ.items} />
      </div>
    </section>
  )
}

export function Demo() {
  return (
    <section className={SECTION}>
      <div className={`${WRAP} overflow-hidden rounded-[32px] bg-olla-navy py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)] text-center`}>
        <div className="px-4 sm:px-5">
          <div aria-hidden className="h-[37px]" />
          <Heading eyebrow={false} title={DEMO.title} text={DEMO.text} light textClass="text-olla-lavender" />
          <ol className="mx-auto mt-6 w-fit max-w-full space-y-3 text-left">
            {DEMO.points.map((p, i) => (
              <li key={p} className="flex items-center gap-3 text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.5] text-olla-lime/90">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olla-cyan text-[15px] font-bold text-olla-navy shadow-[0_0_0_4px_rgba(32,207,245,0.18)]">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:items-center">
            <FormButton preset={{ intent: 'Lecție de probă' }} className={BUTTONS.coral}>Rezervă o lecție de probă <span aria-hidden>→</span></FormButton>
            <FormButton preset={{ intent: 'Testare gratuită' }} className={BUTTONS.cyanFlat}>Treci o testare gratuită</FormButton>
          </div>
        </div>
        <div className="mt-9">
          <Marquee images={DEMO.images} size={['clamp(138px, calc(14.3vw + 82px), 288px)', 'clamp(138px, calc(14.3vw + 82px), 288px)']} />
        </div>
      </div>
    </section>
  )
}
