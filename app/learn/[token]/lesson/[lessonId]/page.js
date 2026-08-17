export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getStudentByToken, preloadStudent, getLesson, preloadLesson, getCachedModuleLessons } from '@/lib/student-cache'
import LessonRunner from '@/components/student/LessonRunner'
import LessonLoading from './loading'
import { LockClosedIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

async function LessonContent({ token, lessonId }) {
  // Both queries preloaded by LessonPage — React cache hits, effectively 0ms wait
  const [student, lesson] = await Promise.all([
    getStudentByToken(token),
    getLesson(lessonId),
  ])

  if (!student || !lesson) notFound()

  if (student.active === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1a1d] p-6">
        <div className="max-w-md bg-[#0f2127] rounded-2xl shadow-lg border border-rose-500/30 p-8 text-center">
          <LockClosedIcon className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-white">Cont dezactivat</h1>
          <p className="text-sm text-[#a0b8bc] mt-2">Contul tău este momentan dezactivat. Te rugăm să contactezi profesorul.</p>
        </div>
      </div>
    )
  }

  const moduleId = lesson.module.id
  const problemIds = lesson.problems.map(p => p.id)

  // ── BATCH 2: ALL remaining queries in PARALLEL ──
  // getCachedModuleLessons — 120s unstable_cache, no DB hit on warm cache
  // allProgresses — simple studentId filter (no nested $lookup join)
  const [latestPayment, manualAccesses, manualLessonAccesses, subs, progress, advance, moduleLessons, allProgresses] = await Promise.all([
    prisma.learningPayment.findFirst({ where: { studentId: student.id }, orderBy: { paymentDate: 'desc' } }),
    prisma.moduleAccess.findMany({ where: { studentId: student.id }, select: { moduleId: true } }),
    prisma.lessonAccess.findMany({ where: { studentId: student.id }, select: { lessonId: true } }),
    prisma.problemSubmission.findMany({
      where: { studentId: student.id, lessonId, problemId: { in: problemIds } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lessonProgress.findUnique({
      where: { studentId_lessonId: { studentId: student.id, lessonId } },
    }),
    prisma.moduleAdvance.findUnique({
      where: { studentId_moduleId: { studentId: student.id, moduleId } },
    }),
    // Cached 120s — sidebar lesson list changes rarely
    getCachedModuleLessons(moduleId),
    // Simple indexed filter (studentId) — no $lookup join
    prisma.lessonProgress.findMany({
      where: { studentId: student.id },
      select: { lessonId: true, completedAt: true, theoryCompleted: true },
    }),
  ])

  // Acces inline — fără DB call extra
  const subscriptionActive = latestPayment && new Date(latestPayment.expiresAt) > new Date()
  const manualModuleIds = new Set(manualAccesses.map(a => a.moduleId))
  const manualLessonIds = new Set(manualLessonAccesses.map(a => a.lessonId))
  const canAccess = student.superStudent || subscriptionActive || lesson.isFree || manualModuleIds.has(moduleId) || manualLessonIds.has(lesson.id)

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-[#0c1a1d] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0f2127] rounded-3xl shadow-xl border border-rose-500/20 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2">Abonament necesar</h1>
          <p className="text-[#a0b8bc] text-sm mb-2">
            Lecția <strong className="text-white">{lesson.title}</strong> face parte din modulul <strong className="text-white">{lesson.module.title}</strong> și necesită un abonament activ.
          </p>
          <p className="text-[#a0b8bc] text-sm mb-5">
            Vorbește cu profesorul pentru a achita abonamentul și a continua aceste module.{' '}
            <span className="text-[#30919f] font-semibold">Progresul tău este salvat</span> și te așteaptă.
          </p>
          <Link href={`/learn/${token}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#30919f] text-white rounded-xl text-sm font-bold hover:bg-[#136976] transition">
            <ChevronLeftIcon className="w-4 h-4" /> Înapoi la modulele tale
          </Link>
        </div>
      </div>
    )
  }

  const subsByProblem = {}
  for (const s of subs) {
    if (!subsByProblem[s.problemId]) subsByProblem[s.problemId] = []
    subsByProblem[s.problemId].push(s)
  }
  const hintsUsed = Array.isArray(progress?.hintsUsed) ? progress.hintsUsed : []
  const problemsWithSub = lesson.problems.map(p => {
    const all = subsByProblem[p.id] || []
    const latest = all[0] || null
    const allLockedOrCorrect = all.some(s => s.locked || (s.status === 'GRADED' && (s.grade ?? 0) >= 60 && s.autoCorrect !== false))
    const solutionViewed = all.some(s => s.solutionViewed)
    return {
      ...p,
      submission: latest,
      attemptsCount: all.length,
      hintUsed: hintsUsed.includes(p.id) || all.some(s => s.hintUsed),
      locked: allLockedOrCorrect,
      solutionViewed,
    }
  })
  const progressByLesson = Object.fromEntries(allProgresses.map(p => [p.lessonId, p]))

  return (
    <LessonRunner
      token={token}
      lesson={lesson}
      problems={problemsWithSub}
      initialProgress={progress}
      advanceGranted={!!advance}
      moduleLessons={moduleLessons}
      progressByLesson={progressByLesson}
      superStudent={student.superStudent ?? false}
      grantedLessonIds={[...manualLessonIds]}
      canUseAi={student.superStudent || subscriptionActive || lesson.isFree}
    />
  )
}

export default async function LessonPage({ params }) {
  const { token, lessonId } = await params
  // Preload BOTH queries immediately — before Suspense even renders LessonContent.
  // By the time LessonContent calls getStudentByToken/getLesson, the promises
  // are already in-flight or resolved (React cache dedup). Eliminates BATCH 1
  // from the critical path — LessonContent can go straight to BATCH 2.
  preloadStudent(token)
  preloadLesson(lessonId)
  return (
    <Suspense fallback={<LessonLoading />}>
      <LessonContent token={token} lessonId={lessonId} />
    </Suspense>
  )
}
