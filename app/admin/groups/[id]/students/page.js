export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import GroupStudentsManager from '@/components/admin/GroupStudentsManager'
import { checkPermission } from '@/lib/permissions'

export default async function GroupStudentsPage({ params }) {
  const { id } = await params
  
  // Check all group student permissions
  const [
    canViewStudents,
    canAddStudents,
    canRemoveStudents,
    canTransfer,
    canChangeStatus,
    canModifyLessons,
    canModifyAbsences,
    canViewPayments,
    canAddPayments,
    canDeletePayments
  ] = await Promise.all([
    checkPermission('groups.students.view'),
    checkPermission('groups.students.add'),
    checkPermission('groups.students.remove'),
    checkPermission('groups.students.transfer'),
    checkPermission('groups.students.status'),
    checkPermission('groups.students.lessons'),
    checkPermission('groups.students.absences'),
    checkPermission('groups.students.payments.view'),
    checkPermission('groups.students.payments.create'),
    checkPermission('groups.students.payments.delete')
  ])

  const permissions = {
    canViewStudents: canViewStudents.allowed,
    canAddStudents: canAddStudents.allowed,
    canRemoveStudents: canRemoveStudents.allowed,
    canTransfer: canTransfer.allowed,
    canChangeStatus: canChangeStatus.allowed,
    canModifyLessons: canModifyLessons.allowed,
    canModifyAbsences: canModifyAbsences.allowed,
    canViewPayments: canViewPayments.allowed,
    canAddPayments: canAddPayments.allowed,
    canDeletePayments: canDeletePayments.allowed
  }
  
  const [group, allStudents, allGroups] = await Promise.all([
    prisma.group.findUnique({
      where: { id },
      include: {
        groupStudents: {
          include: {
            student: true,
            payments: {
              orderBy: { paymentDate: 'desc' }
            }
          }
        },
        lessonSessions: {
          select: { attendances: { select: { studentId: true, status: true } } },
        },
      }
    }),
    prisma.student.findMany({ orderBy: { fullName: 'asc' } }),
    prisma.group.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    })
  ])

  if (!group) {
    notFound()
  }

  // Excludem grupa curentă din lista de grupe pentru transfer
  const otherGroups = allGroups.filter(g => g.id !== id)

  // Câte lecții a făcut fiecare elev în grupa asta (și câte a lipsit)
  const attendanceStats = {}
  for (const session of group.lessonSessions) {
    for (const a of session.attendances) {
      const acc = (attendanceStats[a.studentId] ||= { present: 0, absent: 0 })
      if (a.status === 'PRESENT') acc.present++
      else acc.absent++
    }
  }
  const totalSessions = group.lessonSessions.length

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">Elevi în grupă</h1>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600">{group.name}{group.level ? ` — ${group.level}` : ''}</p>
      </div>

      <GroupStudentsManager
        attendanceStats={attendanceStats}
        totalSessions={totalSessions} 
        group={JSON.parse(JSON.stringify(group))}
        allStudents={JSON.parse(JSON.stringify(allStudents))}
        allGroups={JSON.parse(JSON.stringify(otherGroups))}
        permissions={permissions}
      />
    </div>
  )
}
