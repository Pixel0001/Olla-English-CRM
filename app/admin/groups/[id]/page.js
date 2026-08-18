export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import GroupForm from '@/components/admin/GroupForm'
import LessonPackagePanel from '@/components/groups/LessonPackagePanel'
import TrialLessonsPanel from '@/components/groups/TrialLessonsPanel'

export default async function EditGroupPage({ params }) {
  const { id } = await params
  
  const [group, teachers, branches] = await Promise.all([
    prisma.group.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { role: 'TEACHER', active: true } }),
    prisma.branch.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  ])

  if (!group) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editează grupă</h1>
        <p className="text-gray-600">{group.name}</p>
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
