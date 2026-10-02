import Link from 'next/link'
import { H2, WRAP } from './ui'
import { LEGAL_UPDATED } from './legal'

// Ce e între [paranteze drepte] e încă de completat — se vede evidențiat
function Text({ children }) {
  const parts = String(children).split(/(\[[^\]]+\])/)
  return parts.map((p, i) =>
    p.startsWith('[') ? (
      <mark key={i} className="rounded bg-amber-100 px-1 text-amber-900">{p}</mark>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}

export default function LegalPage({ title, sections, other }) {
  return (
    <section className="px-4 py-[clamp(2.5rem,1.76rem+3.05vw,4.5rem)] sm:px-[18px]">
      <div className={`${WRAP} max-w-[860px]`}>
        <h1 className={H2}>{title}</h1>
        <p className="mt-3 text-[15px] text-olla-navy/60">Ultima actualizare: {LEGAL_UPDATED}</p>

        <div className="mt-10 space-y-9">
          {sections.map((s, i) => (
            <div key={s.title}>
              <h2 className="text-[clamp(1.15rem,0.5vw+1rem,1.4rem)] font-bold text-olla-navy">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-[clamp(1rem,0.19vw+0.9625rem,1.125rem)] leading-[1.65] text-[#191a1b]">
                {s.body?.map((p) => <p key={p}><Text>{p}</Text></p>)}
                {s.list && (
                  <ul className="list-disc space-y-2 pl-6 marker:text-olla-coral">
                    {s.list.map((p) => <li key={p}><Text>{p}</Text></li>)}
                  </ul>
                )}
                {s.after?.map((p) => <p key={p}><Text>{p}</Text></p>)}
              </div>
            </div>
          ))}
        </div>

        {other && (
          <p className="mt-12 border-t border-olla-navy/10 pt-6 text-[16px] text-olla-navy">
            Vezi și <Link href={other.href} className="font-semibold text-olla-blue underline underline-offset-2">{other.label}</Link>.
          </p>
        )}
      </div>
    </section>
  )
}
