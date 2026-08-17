export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import lazy from 'next/dynamic'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
const SubmissionsList = lazy(() => import('@/components/teacher/SubmissionsList'))

const PAGE_SIZE = 20

export default async function AdminSubmissionsPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(session.user.role)
  if (!isAdmin) redirect('/admin')

  const sp = (await searchParams) || {}
  const status = sp.status || 'PENDING'
  const studentFilter = sp.studentId || ''
  const groupFilter = sp.groupId || ''
  const onlyCoding = sp.type === 'CODING'
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)

  // Group filter -> studentIds
  let groupStudentIds = null
  if (groupFilter) {
    const gs = await prisma.groupStudent.findMany({
      where: { groupId: groupFilter },
      select: { studentId: true }, distinct: ['studentId'],
    })
    groupStudentIds = gs.map(g => g.studentId)
  }

  const where = {}
  if (status && status !== 'ALL') where.status = status
  if (studentFilter) where.studentId = studentFilter
  else if (groupStudentIds) where.studentId = { in: groupStudentIds }
  if (onlyCoding) where.problem = { type: 'CODING' }

  const [submissions, totalCount, students, groups, counts] = await Promise.all([
    prisma.problemSubmission.findMany({
      where,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        student: { select: { id: true, fullName: true } },
        problem: { select: { id: true, title: true, difficulty: true, topic: true, type: true } },
        lesson: { select: { id: true, title: true, module: { select: { id: true, title: true } } } },
      },
    }),
    prisma.problemSubmission.count({ where }),
    prisma.student.findMany({ select: { id: true, fullName: true }, orderBy: { fullName: 'asc' } }),
    prisma.group.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.problemSubmission.groupBy({ by: ['status'], _count: true }),
  ])

  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))
  const total = counts.reduce((s, c) => s + c._count, 0)
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const buildHref = (overrides = {}) => {
    const params = new URLSearchParams()
    const merged = { status, studentId: studentFilter, groupId: groupFilter, type: onlyCoding ? 'CODING' : '', page: String(page), ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== '' && !(k === 'page' && v === '1')) params.set(k, v)
    }
    const qs = params.toString()
    return `/admin/submissions${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold">📨 Submisii Probleme</h1>
          <p className="text-sm text-gray-600">{total} total în DB • {totalCount} pentru filtrele active</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'PENDING', label: '⏳ În așteptare', color: 'amber' },
          { key: 'GRADED', label: '✅ Notate', color: 'emerald' },
          { key: 'NEEDS_REVISION', label: '⚠️ Refacere', color: 'red' },
          { key: 'ALL', label: 'Toate', color: 'gray' },
        ].map(p => (
          <Link key={p.key}
            href={buildHref({ status: p.key, page: '1' })}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status === p.key ? `bg-${p.color}-600 text-white border-transparent` : `bg-white text-gray-700 border-gray-200 hover:border-${p.color}-300`}`}>
            {p.label} {p.key !== 'ALL' && countMap[p.key] ? <span className="ml-1 text-xs opacity-75">({countMap[p.key]})</span> : null}
          </Link>
        ))}
      </div>

      <SubmissionsList
        submissions={submissions}
        students={students}
        groups={groups}
        currentStudent={studentFilter}
        currentGroup={groupFilter}
        onlyCoding={onlyCoding}
        status={status}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        basePath="/admin/submissions"
        canDelete={true}
      />
    </div>
  )
}
