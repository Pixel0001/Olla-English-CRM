// Guest dashboard pentru /learn - fara cont, fara DB writes, fara AI.
// Listeaza modulele active. Doar lectiile FREE sunt accesibile (link-uri activate).
// Restul lectiilor se afiseaza blocate cu CTA catre /learn/login.

// Randare la cerere: build-ul nu trebuie sa depinda de disponibilitatea bazei
// de date (pe Vercel build-ul ruleaza de pe IP-uri care pot fi blocate de Atlas).
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import {
  BookOpenIcon, RocketLaunchIcon, ChevronLeftIcon,
  AcademicCapIcon, SparklesIcon,
  TrophyIcon, BoltIcon, ChatBubbleLeftRightIcon,
  ShieldCheckIcon, FireIcon, UserGroupIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid'
import GuestModuleAccordion from '@/components/learn/GuestModuleAccordion'

const MODULE_THEMES = [
  { from: 'from-amber-400', to: 'to-orange-500', soft: 'from-amber-50 to-orange-50', ring: 'ring-amber-200' },
  { from: 'from-yellow-400', to: 'to-amber-500', soft: 'from-yellow-50 to-amber-50', ring: 'ring-yellow-200' },
  { from: 'from-rose-400', to: 'to-pink-500', soft: 'from-rose-50 to-pink-50', ring: 'ring-rose-200' },
  { from: 'from-sky-400', to: 'to-blue-500', soft: 'from-sky-50 to-blue-50', ring: 'ring-sky-200' },
  { from: 'from-emerald-400', to: 'to-teal-500', soft: 'from-emerald-50 to-teal-50', ring: 'ring-emerald-200' },
  { from: 'from-violet-400', to: 'to-purple-500', soft: 'from-violet-50 to-purple-50', ring: 'ring-violet-200' },
]

const BENEFITS = [
  {
    icon: BookOpenIcon,
    color: 'text-[#30919f]',
    bg: 'bg-[#30919f]/10',
    title: 'Toate lecțiile deblocate',
    desc: 'Acces la 100% din conținut — teorie, exerciții și proiecte pentru fiecare modul.',
  },
  {
    icon: SparklesIcon,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    title: 'AI Tutor personalizat',
    desc: 'Întreabă AI-ul orice, primești explicații personalizate și feedback instant pe codul tău.',
  },
  {
    icon: CheckSolid,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    title: 'Progres salvat automat',
    desc: 'Lecțiile completate, XP-ul și nivelul tău se salvează și te așteaptă la revenire.',
  },
  {
    icon: TrophyIcon,
    color: 'text-[#f8b316]',
    bg: 'bg-[#f8b316]/10',
    title: 'Clasament & niveluri XP',
    desc: 'Câștigă XP la fiecare problemă rezolvată și urcă în clasamentul platformei.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    title: 'Feedback de la profesor',
    desc: 'Soluțiile tale ajung la profesor pentru recenzie, notare și feedback detaliat.',
  },
  {
    icon: FireIcon,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    title: 'Antrenament aleator',
    desc: 'Rezolvă probleme aleatoare din toată platforma pentru a-ți testa cunoștințele.',
  },
  {
    icon: BoltIcon,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    title: 'Bonus XP de la profesor',
    desc: 'Profesorul poate acorda puncte bonus pentru progres excepțional.',
  },
  {
    icon: UserGroupIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    title: 'Comunitate & notificări',
    desc: 'Primești notificări când ai teme de refăcut și faci parte din grupul tău.',
  },
]

export const metadata = {
  title: 'Mod demo — Olla English',
  description: 'Încearcă platforma Olla English fără cont. Lecții gratuite și exerciții interactive.',
  robots: { index: false, follow: false },
}

async function getModules() {
  try {
    return await prisma.learningModule.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true, title: true, description: true, language: true, order: true,
        lessons: {
          where: { active: true },
          orderBy: { order: 'asc' },
          select: {
            id: true, title: true, slug: true, order: true, isFree: true,
            _count: { select: { problems: true } },
          },
        },
      },
    })
  } catch (error) {
    // Baza indisponibila: afisam starea goala in loc sa rupem randarea/build-ul.
    console.error('Guest dashboard — nu pot citi modulele:', error.message)
    return []
  }
}

export default async function GuestDashboard() {
  const modules = await getModules()

  const totalFreeLessons = modules.reduce((s, m) => s + m.lessons.filter(l => l.isFree).length, 0)
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)

  return (
    <div className="min-h-screen bg-[#0c1a1d]">
      {/* Top bar */}
      <header className="bg-gradient-to-r from-[#0c1a1d] via-[#0f2127] to-[#136976]/40 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition shrink-0 p-1.5 rounded-lg hover:bg-white/10">
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Înapoi</span>
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#f8b316] flex items-center justify-center shrink-0">
            <AcademicCapIcon className="w-5 h-5 text-[#0c1a1d]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[#f8b316] font-bold leading-none">Mod demo</div>
            <h1 className="font-extrabold text-base sm:text-lg truncate leading-tight">Olla English — vizitator</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/learn/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition">
              Am cont
            </Link>
            <Link href="/learn/login"
              className="sm:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f8b316] hover:bg-[#e5a310] text-[#0c1a1d] rounded-lg text-sm font-bold transition">
              <RocketLaunchIcon className="w-3.5 h-3.5" />
              <span>Intră în cont</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Hero banner */}
        <div className="bg-gradient-to-br from-[#0c1a1d] via-[#0f2127] to-[#136976]/40 rounded-2xl p-5 sm:p-7 text-white shadow-lg overflow-hidden relative">
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-6 w-36 h-36 bg-[#f8b316]/10 rounded-full pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8b316]/20 text-[#f8b316] rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3">
                <SparklesIcon className="w-3 h-3" /> Bine ai venit în modul demo
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Încearcă Olla English<br />
                <span className="text-[#f8b316]">fără cont</span>
              </h2>
              <p className="text-[#a0b8bc] text-sm mt-2 leading-relaxed">
                Parcurge teorie și rezolvă exerciții la{' '}
                <strong className="text-white">{totalFreeLessons} lecții gratuite</strong> din{' '}
                {totalLessons} disponibile. Progresul nu se salvează și AI-ul este dezactivat.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 shrink-0">
              <Link href="/learn/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#f8b316] hover:bg-[#e5a310] text-[#0c1a1d] rounded-xl font-extrabold text-sm transition shadow-md active:scale-95">
                <RocketLaunchIcon className="w-4 h-4" />
                Intră în contul tău
              </Link>
              <Link href="/learn/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition">
                <BookOpenIcon className="w-4 h-4" />
                Am deja cont
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-[#0f2127] rounded-2xl border border-[#30919f]/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#30919f]/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#30919f] to-[#136976] flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Ce pierzi fără abonament</h3>
              <p className="text-xs text-[#a0b8bc]">Intră în cont pentru a debloca toate funcționalitățile platformei</p>
            </div>
          </div>
          <div className="p-4 grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0c1a1d] border border-[#30919f]/10">
                <div className={`w-8 h-8 rounded-lg ${b.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <b.icon className={`w-4 h-4 ${b.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white leading-snug">{b.title}</div>
                  <div className="text-[11px] text-[#a0b8bc] mt-0.5 leading-relaxed">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <Link href="/learn/login"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#30919f] to-[#136976] hover:from-[#136976] hover:to-[#0f5460] text-white rounded-xl font-extrabold text-sm transition shadow-sm active:scale-[0.99]">
              <RocketLaunchIcon className="w-4 h-4" />
              Deblochează tot — intră în cont
            </Link>
          </div>
        </div>

        {/* Modules heading */}
        <div>
          <h2 className="text-xl font-extrabold text-white">Module disponibile</h2>
          <p className="text-sm text-[#a0b8bc] mt-0.5">
            Apasă pe un modul ca să îl deschizi, apoi alege o lecție gratuită.
          </p>
        </div>

        {modules.length === 0 && (
          <div className="bg-[#0f2127] rounded-2xl border border-[#30919f]/20 p-12 text-center text-[#a0b8bc]">
            Nu exista module active momentan.
          </div>
        )}

        <div className="space-y-4">
          {modules.map((m, mi) => (
            <GuestModuleAccordion
              key={m.id}
              module={m}
              moduleIndex={mi}
              theme={MODULE_THEMES[mi % MODULE_THEMES.length]}
              defaultOpen={mi === 0}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#0f2127] to-[#136976]/30 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#f8b316] flex items-center justify-center shrink-0">
              <RocketLaunchIcon className="w-8 h-8 text-[#0c1a1d]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                Vrei tot conținutul, AI tutor și progres salvat?
              </h3>
              <p className="text-[#a0b8bc] text-sm mt-1.5 leading-relaxed">
                Cu un cont Olla English ai acces la toate lecțiile, AI tutor personalizat,
                feedback de la profesor și salvare automată a progresului tău.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/learn/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f8b316] hover:bg-[#e5a310] text-[#0c1a1d] rounded-xl font-bold text-sm transition shadow active:scale-95">
                  <RocketLaunchIcon className="w-4 h-4" /> Intră în contul tău
                </Link>
                <Link href="/learn/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition">
                  <BookOpenIcon className="w-4 h-4" /> Am deja cont
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </main>
    </div>
  )
}
