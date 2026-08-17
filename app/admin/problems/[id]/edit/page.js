export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import ProblemForm from '@/components/admin/ProblemForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProblemPage({ params, searchParams }) {
  return (
    <PermissionGuard permission="problems.edit">
      <Suspense fallback={<div className="space-y-4 animate-pulse"><div className="h-6 w-32 bg-gray-200 rounded" /><div className="h-8 w-64 bg-gray-200 rounded" /><div className="h-96 bg-white rounded-2xl border border-gray-200" /></div>}>
        <Content params={params} searchParams={searchParams} />
      </Suspense>
    </PermissionGuard>
  )
}

async function Content({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const backUrl = sp?.back ? decodeURIComponent(sp.back) : '/admin/problems'
  const problem = await prisma.problem.findUnique({ where: { id } })
  if (!problem) notFound()

  return (
    <div className="space-y-4">
      <Link href={backUrl} className="text-indigo-600 hover:underline text-sm">← Înapoi</Link>
      <h1 className="text-2xl font-bold text-gray-900">✏️ Editează problemă</h1>
      <ProblemForm problem={problem} backUrl={backUrl} />
    </div>
  )
}
