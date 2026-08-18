export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import GroupForm from '@/components/admin/GroupForm'
import LessonPackagePanel from '@/components/groups/LessonPackagePanel'
import TrialLessonsPanel from '@/components/groups/TrialLessonsPanel'

export default async function EditGroupPage({ params }) {
  const { id } = await params
  
  const [group, teachers, branches, stats] = await Promise.all([
    prisma.group.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { role: 'TEACHER', active: true } }),
    prisma.branch.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    // Rezumatul grupei: elevi, lecții ținute, încasări
    (async () => {
      const [studentsCount, sessionsCount, payments] = await Promise.all([
        prisma.groupStudent.count({ where: { groupId: id, status: { notIn: ['LEFT', 'TRANSFERRED'] } } }),
        prisma.lessonSession.count({ where: { groupId: id } }),
        prisma.payment.findMany({
          where: { groupStudent: { groupId: id } },
          select: { amount: true },
        }),
      ])
      return {
        studentsCount,
        sessionsCount,
        paid: payments.reduce((s, p) => s + (p.amount || 0), 0),
      }
    })(),
  ])

  if (!group) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          <p className="text-gray-600">
            {group.level || 'fără nivel'} · {stats.studentsCount} elevi · {stats.sessionsCount} lecții ținute
            {stats.paid > 0 ? ` · ${stats.paid.toLocaleString('ro-RO')} lei încasați` : ''}
          </p>
        </div>

        {/* Istoricul complet al grupei, pentru arhivă sau contabilitate */}
        <div className="flex gap-2">
          <a
            href={`/api/admin/groups/${group.id}/export?format=csv`}
            className="px-3 py-1.5 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
          >
            Descarcă CSV
          </a>
          <a
            href={`/api/admin/groups/${group.id}/export?format=pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border border-rose-300 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
          >
            PDF
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <GroupForm 
          group={JSON.parse(JSON.stringify(group))}
          teachers={JSON.parse(JSON.stringify(teachers))}
          branches={JSON.parse(JSON.stringify(branches))}
        />
      </div>

      <LessonPackagePanel groupId={group.id} />

      <TrialLessonsPanel groupId={group.id} />
    </div>
  )
}
