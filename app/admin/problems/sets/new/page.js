export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import SetGenerator from '@/components/admin/SetGenerator'
import Link from 'next/link'

export default async function NewSetPage() {
  return (
    <PermissionGuard permission="problems.assign">
      <Content />
    </PermissionGuard>
  )
}

async function Content() {
  const [students, problems, topicsRaw] = await Promise.all([
    prisma.student.findMany({ orderBy: { fullName: 'asc' }, select: { id: true, fullName: true } }),
    prisma.problem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, topic: true, difficulty: true, type: true, points: true },
    }),
    prisma.problem.findMany({ where: { active: true }, select: { topic: true }, distinct: ['topic'] }),
  ])
  const topics = [...new Set(topicsRaw.map(t => t.topic))].sort()

  return (
    <div className="space-y-4 max-w-5xl">
      <Link href="/admin/problems/sets" className="text-indigo-600 hover:underline text-sm">← Înapoi la seturi</Link>
      <h1 className="text-2xl font-bold text-gray-900">✨ Generează set de probleme</h1>
      <SetGenerator students={students} problems={problems} topics={topics} />
    </div>
  )
}
