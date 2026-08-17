export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RandomProblemsRunner from '@/components/student/RandomProblemsRunner'
import { LockClosedIcon, ChevronLeftIcon, FireIcon } from '@heroicons/react/24/outline'
import { getStudentLearningAccess } from '@/lib/learning-access'

export default async function RandomPage({ params }) {
  const { token } = await params
  const student = await prisma.student.findFirst({ where: { accessToken: token }, select: { id: true, fullName: true, active: true } })
  if (!student) notFound()
  if (student.active === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1a1d] p-6">
        <div className="max-w-md bg-[#0f2127] rounded-2xl shadow-lg border border-rose-500/30 p-8 text-center">
          <h1 className="text-xl font-bold text-white">Cont dezactivat</h1>
          <p className="text-sm text-[#a0b8bc] mt-2">Contul tău este momentan dezactivat.</p>
        </div>
      </div>
    )
  }

  // Antrenamentul aleatoriu necesită abonament activ
  const access = await getStudentLearningAccess(student.id)
  if (!access.canAccessRandom) {
    return (
      <div className="min-h-screen bg-[#0c1a1d] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white/60 uppercase tracking-wider mb-6">
            <FireIcon className="w-3.5 h-3.5 text-yellow-300" /> Probleme aleatorii
          </div>

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-rose-500/40">
            <LockClosedIcon className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">Antrenament blocat</h1>
          <p className="text-white/60 text-sm mb-1">Problemele aleatorii necesită un abonament activ.</p>
          <p className="text-white/50 text-sm mb-7">
            Vorbește cu profesorul pentru a achita.{' '}
            <span className="text-emerald-400 font-semibold">Progresul tău este salvat.</span>
          </p>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-yellow-400/20 rounded-xl flex items-center justify-center shrink-0 text-lg">💳</div>
              <div>
                <div className="text-sm font-bold text-white">Cum activez accesul?</div>
                <div className="text-xs text-white/50 mt-0.5">Contactează profesorul, achită abonamentul și vei primi acces instant la toate problemele și antrenamentul aleatoriu.</div>
              </div>
            </div>
          </div>

          <Link href={`/learn/${token}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-sm font-bold transition">
            <ChevronLeftIcon className="w-4 h-4" /> Înapoi la modulele tale
          </Link>
        </div>
      </div>
    )
  }

  const modules = await prisma.learningModule.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: { id: true, slug: true, title: true, language: true },
  })

  return <RandomProblemsRunner token={token} student={student} modules={modules} />
}
