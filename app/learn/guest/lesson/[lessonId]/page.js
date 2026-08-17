// Guest lesson page — server-renders o lecție FREE și o rulează cu LessonRunner în mod isGuest.
// Zero DB writes, zero acces AI, zero submisii — totul e local în browser.

export const revalidate = 1800 // cache 30 min

import { Suspense } from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import LessonRunner from '@/components/student/LessonRunner'
import LessonLoading from '@/app/learn/[token]/lesson/[lessonId]/loading'
import { LockClosedIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

async function GuestLessonContent({ lessonId }) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: { select: { id: true, title: true, slug: true } },
      problems: { orderBy: { lessonOrder: 'asc' } },
    },
  })

  if (!lesson) notFound()

  // Doar lecțiile FREE sunt disponibile în mod demo
  if (!lesson.isFree) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-amber-100 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Lecție rezervată elevilor înscriși</h1>
          <p className="text-slate-600 text-sm mb-5">
            Lecția <strong>{lesson.title}</strong> face parte din modulul <strong>{lesson.module.title}</strong> și nu este disponibilă în modul demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/learn/guest" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
              <ChevronLeftIcon className="w-4 h-4" /> Înapoi la lecții
            </Link>
            <Link href="/learn/login" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition">
              Intră în contul tău
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Pregătim toate lecțiile din același modul pentru sidebar (toate accesibile dacă sunt FREE)
  const moduleLessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.module.id, active: true },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, order: true, isFree: true, _count: { select: { problems: true } } },
  })

  // Probleme — în mod guest fără submisii / hint-uri / locks din DB
  const problemsWithSub = lesson.problems.map(p => ({
    ...p,
    submission: null,
    attemptsCount: 0,
    hintUsed: false,
    locked: false,
    solutionViewed: false,
  }))

  return (
    <LessonRunner
      token="guest"
      lesson={lesson}
      problems={problemsWithSub}
      initialProgress={null}
      advanceGranted={false}
      moduleLessons={moduleLessons}
      progressByLesson={{}}
      superStudent={false}
      grantedLessonIds={[]}
      canUseAi={false}
      isGuest
    />
  )
}

export default async function GuestLessonPage({ params }) {
  const { lessonId } = await params
  return (
    <Suspense fallback={<LessonLoading />}>
      <GuestLessonContent lessonId={lessonId} />
    </Suspense>
  )
}

export const metadata = {
  title: 'Mod demo — Olla English',
  robots: { index: false, follow: false },
}
