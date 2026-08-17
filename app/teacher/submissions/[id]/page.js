export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SubmissionGrader from '@/components/teacher/SubmissionGrader'

export default async function SubmissionDetailPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(session.user.role)

  const { id } = await params
  const sub = await prisma.problemSubmission.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, fullName: true, parentName: true, parentEmail: true } },
      problem: true,
      lesson: { include: { module: true } },
    },
  })
  if (!sub) notFound()

  if (!isAdmin) {
    const link = await prisma.groupStudent.findFirst({
      where: { studentId: sub.studentId, group: { teacherId: session.user.id, active: true } },
    })
    if (!link) redirect('/teacher/submissions')
  }

  // Stats elev — câte rezolvate, accuracy
  const [totalSubs, gradedSubs, pendingSubs] = await Promise.all([
    prisma.problemSubmission.count({ where: { studentId: sub.studentId } }),
    prisma.problemSubmission.count({ where: { studentId: sub.studentId, status: 'GRADED', grade: { gte: 60 } } }),
    prisma.problemSubmission.count({ where: { studentId: sub.studentId, status: 'PENDING' } }),
  ])

  // Lecția — câte probleme a făcut elevul, dacă a terminat
  let lessonStats = null
  if (sub.lessonId) {
    const lessonProblems = await prisma.problem.count({ where: { lessonId: sub.lessonId } })
    const studentSubs = await prisma.problemSubmission.findMany({
      where: { studentId: sub.studentId, lessonId: sub.lessonId },
      orderBy: { createdAt: 'desc' },
      distinct: ['problemId'],
      select: { problemId: true, status: true, grade: true },
    })
    lessonStats = { total: lessonProblems, done: studentSubs.length, allGraded: studentSubs.length === lessonProblems && studentSubs.every(s => s.status === 'GRADED' && (s.grade ?? 0) >= 60) }
  }

  // Există deja advance?
  let existingAdvance = null
  if (sub.lesson) {
    existingAdvance = await prisma.moduleAdvance.findUnique({
      where: { studentId_moduleId: { studentId: sub.studentId, moduleId: sub.lesson.module.id } },
    })
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/teacher/submissions" className="hover:text-indigo-600">📨 Submisii</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium truncate">{sub.problem?.title}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{sub.student.fullName}</h1>
            <p className="text-sm text-gray-600">
              {sub.lesson ? <>📖 {sub.lesson.module.title} → {sub.lesson.title}</> : <>🎲 Problemă aleatorie ({sub.difficulty})</>}
            </p>
          </div>
          <div className="flex gap-3 text-xs">
            <div><div className="text-gray-500">Total submisii</div><div className="font-bold">{totalSubs}</div></div>
            <div><div className="text-gray-500">Reușite</div><div className="font-bold text-emerald-600">{gradedSubs}</div></div>
            <div><div className="text-gray-500">În așteptare</div><div className="font-bold text-amber-600">{pendingSubs}</div></div>
          </div>
        </div>
      </div>

      {/* Problema */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 text-xs flex-wrap mb-2">
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">{sub.problem.topic}</span>
          <span>{sub.problem.difficulty}</span>
          <span>{sub.problem.type}</span>
          <span className="text-gray-500">• {sub.problem.points} pct</span>
        </div>
        <h2 className="text-lg font-bold">{sub.problem.title}</h2>
        <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{sub.problem.description}</div>
        {sub.problem.correctAnswer && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
            <strong>Răspuns corect:</strong> <code className="bg-white px-1.5 py-0.5 rounded">{sub.problem.correctAnswer}</code>
          </div>
        )}
        {sub.problem.explanation && (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-indigo-600 font-medium">📖 Vezi explicația oficială</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{sub.problem.explanation}</div>
          </details>
        )}
      </div>

      {/* Răspunsul elevului */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-2">📝 Răspunsul elevului</h3>
        {sub.code ? (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">{sub.code}</pre>
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">{sub.answer || '(gol)'}</div>
        )}
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-3 flex-wrap">
          <span>Trimis: {new Date(sub.createdAt).toLocaleString('ro-RO')}</span>
          {sub.timeSpent > 0 && <span>⏱️ {Math.floor(sub.timeSpent / 60)}m {sub.timeSpent % 60}s</span>}
          {sub.autoCorrect === true && <span className="text-emerald-600">✓ Auto-verificat OK</span>}
          {sub.autoCorrect === false && <span className="text-red-600">✗ Auto-verificare a eșuat</span>}
        </div>
      </div>

      {/* Grader */}
      <SubmissionGrader submission={sub} lessonStats={lessonStats} existingAdvance={existingAdvance} />
    </div>
  )
}
