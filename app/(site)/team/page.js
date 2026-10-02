import Image from 'next/image'
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { CONTACT, EYEBROW, TEAM_PAGE } from '@/components/site/content'
import { Eyebrow, H2, TEXT, WRAP } from '@/components/site/ui'

export const metadata = {
  title: 'Echipa',
  description: 'Echipa Olla English Center: profesori certificați internațional, cu experiență cu copii și adulți.',
}

export default function TeamPage() {
  return (
    <section className="bg-olla-lavender px-4 sm:px-[18px] py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)]">
      <div className={WRAP}>
        <div className="mx-auto max-w-[810px] text-center">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h1 className={`${H2} mt-[18px]`}>{TEAM_PAGE.title}</h1>
          <p className={`${TEXT} mx-auto mt-4 max-w-[520px] text-olla-navy`}>{TEAM_PAGE.text}</p>
        </div>

        <div className="mt-10 grid gap-[18px] md:grid-cols-3">
          {TEAM_PAGE.members.map((m) => (
            <article
              key={m.name}
              tabIndex={0}
              className="group relative overflow-hidden rounded-[20px] border border-olla-navy/10 bg-white outline-none"
            >
              <Image src={`/site/${m.photo}`} alt={m.name} width={769} height={1024} className="aspect-[454/604] w-full object-cover" />
              <div className="p-[13px]">
                <h2 className="text-2xl font-bold leading-[1.3] text-olla-navy">{m.name}</h2>
                <p className="mt-1 text-[18px] leading-[1.5] text-olla-navy">{m.role}</p>
              </div>

              {/* La hover (sau la atingere) biografia acoperă poza */}
              <div className="absolute inset-0 flex translate-y-full flex-col justify-between bg-white p-[18px] pb-[18px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
                <div className="space-y-3 overflow-y-auto text-[18px] leading-[1.5] text-olla-navy">
                  <h2 className="text-2xl font-bold">{m.name}</h2>
                  {m.bio.map((p) => <p key={p}>{p}</p>)}
                </div>
                <a href={`mailto:${CONTACT.email}`} className="mt-4 flex items-center gap-2.5 text-[18px] text-olla-blue">
                  <EnvelopeIcon className="h-5 w-5" />
                  {CONTACT.email}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
