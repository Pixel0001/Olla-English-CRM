export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import lazy from 'next/dynamic'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
const SubmissionsList = lazy(() => import('@/components/teacher/SubmissionsList'))

const PAGE_SIZE = 20

function SubmissionsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded-lg" />
      <div className="flex gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-8 w-28 bg-gray-200 rounded-full" />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {[1,2,3,4,5].map(i => <div key={i} className="h-16 px-4 py-3 flex gap-3 items-center"><div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0"/><div className="flex-1 space-y-1.5"><div className="h-3 w-48 bg-gray-200 rounded"/><div className="h-3 w-32 bg-gray-100 rounded"/></div></div>)}
      </div>
    </div>
  )
}

export default async function TeacherSubmissionsPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const sp = (await searchParams) || {}
  return (
    <Suspense fallback={<SubmissionsLoading />}>
      <SubmissionsContent session={session} searchParams={sp} />
    </Suspense>
  )
}

async function SubmissionsContent({ session, searchParams: sp }) {
  const status = sp.status || 'PENDING'
  const studentFilter = sp.studentId || ''
  const groupFilter = sp.groupId || ''
  const onlyCoding = sp.type === 'CODING'
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)
  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(session.user.role)

  // Run scope + groupFilter queries in parallel (were previously sequential)
  const [scopeLinks, groupLinks] = await Promise.all([
    !isAdmin
      ? prisma.groupStudent.findMany({
          where: { group: { teacherId: session.user.id, active: true } },
          select: { studentId: true }, distinct: ['studentId'],
        })
      : null,
    groupFilter
      ? prisma.groupStudent.findMany({
          where: { groupId: groupFilter, ...(isAdmin ? {} : { group: { teacherId: session.user.id } }) },
          select: { studentId: true }, distinct: ['studentId'],
        })
      : null,
  ])

  const studentIdsScope = scopeLinks ? scopeLinks.map(t => t.studentId) : null
  const groupStudentIds = groupLinks ? groupLinks.map(g => g.studentId) : null

  const where = {}
  if (studentFilter) {
    where.studentId = studentFilter
  } else if (groupStudentIds) {
    where.studentId = { in: groupStudentIds }
  } else if (studentIdsScope) {
    where.studentId = { in: studentIdsScope }
  }
  if (status && status !== 'ALL') where.status = status
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
    studentIdsScope
      ? prisma.student.findMany({ where: { id: { in: studentIdsScope } }, select: { id: true, fullName: true }, orderBy: { fullName: 'asc' } })
      : prisma.student.findMany({ select: { id: true, fullName: true }, orderBy: { fullName: 'asc' } }),
    prisma.group.findMany({
      where: isAdmin ? { active: true } : { teacherId: session.user.id, active: true },
      select: { id: true, name: true, level: true },
      orderBy: { name: 'asc' },
    }),
    prisma.problemSubmission.groupBy({
      by: ['status'],
      where: studentIdsScope ? { studentId: { in: studentIdsScope } } : {},
      _count: true,
    }),
  ])

  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const buildHref = (overrides = {}) => {
    const params = new URLSearchParams()
    const merged = { status, studentId: studentFilter, groupId: groupFilter, type: onlyCoding ? 'CODING' : '', page: String(page), ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== '' && !(k === 'page' && v === '1')) params.set(k, v)
    }
    const qs = params.toString()
    return `/teacher/submissions${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold">📨 Submisii Probleme</h1>
          <p className="text-sm text-gray-600">Răspunsurile elevilor — verifică, notează, dă feedback • {totalCount} pentru filtre</p>
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
        basePath="/teacher/submissions"
        canDelete={true}
      />
    </div>
  )
}
