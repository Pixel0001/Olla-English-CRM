export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { checkPermission } from '@/lib/permissions'
import LessonEditor from '@/components/admin/LessonEditor'

export default async function LessonEditPage({ params }) {
  return (
    <Suspense fallback={<div className="space-y-4 animate-pulse max-w-4xl mx-auto"><div className="h-4 w-64 bg-gray-200 rounded" /><div className="h-[600px] bg-white rounded-2xl border border-gray-200" /></div>}>
      <PermissionGuard permission="modules.view">
        <Content params={params} />
      </PermissionGuard>
    </Suspense>
  )
}

async function Content({ params }) {
  const { id: moduleId, lessonId } = await params
  const [lesson, allProblems, canEdit] = await Promise.all([
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
        problems: { orderBy: { lessonOrder: 'asc' } },
      },
    }),
    prisma.problem.findMany({
      where: { active: true, OR: [{ lessonId: null }, { lessonId: { isSet: false } }, { lessonId }] },
      select: { id: true, title: true, difficulty: true, topic: true, type: true, lessonId: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    checkPermission('modules.edit'),
  ])
  if (!lesson) notFound()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/admin/modules" className="hover:text-indigo-600">📚 Module</Link>
        <span>›</span>
        <Link href={`/admin/modules/${moduleId}`} className="hover:text-indigo-600">{lesson.module.title}</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{lesson.title}</span>
      </div>

      <LessonEditor moduleId={moduleId} lesson={lesson} allProblems={allProblems} canEdit={canEdit.allowed} />
    </div>
  )
}
