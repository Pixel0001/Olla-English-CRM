export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import Link from 'next/link'
import PermissionGuard from '@/components/admin/PermissionGuard'
import DeleteSetButton from '@/components/admin/DeleteSetButton'
import CopySetLinkButton from '@/components/admin/CopySetLinkButton'

const POLICY_LABEL = {
  ALWAYS: '✅ Vezi oricând',
  AFTER_ANSWER: '⏸ După răspuns',
  AFTER_SET: '🏁 După finalizare',
}

export default async function AdminSetsPage() {
  return (
    <PermissionGuard permission="problems.view">
      <Content />
    </PermissionGuard>
  )
}

async function Content() {
  const sets = await prisma.generatedSet.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      student: { select: { id: true, fullName: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { setProblems: true, attempts: true } },
    },
  })

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <Link href="/admin/problems" className="text-indigo-600 hover:underline text-sm">← Banca de probleme</Link>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 mt-1">📚 Seturi generate</h1>
          <p className="text-sm text-gray-600">{sets.length} seturi create</p>
        </div>
        <Link href="/admin/problems/sets/new"
          className="px-3 xs:px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          ✨ Generează set nou
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titlu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elev</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probleme</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Politică</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creat</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sets.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Niciun set încă. Generează primul!
                </td></tr>
              ) : sets.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/problems/sets/${s.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                      {s.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.student?.fullName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {s._count.setProblems} • {s._count.attempts} încercări
                  </td>
                  <td className="px-4 py-3 text-xs">{POLICY_LABEL[s.explanationPolicy]}</td>
                  <td className="px-4 py-3 text-xs">
                    {s.completedAt ? '🏁 Finalizat' : s.startedAt ? '▶️ În curs' : '⏸ Neînceput'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <CopySetLinkButton token={s.accessToken} />
                      <Link href={`/admin/problems/sets/${s.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Vezi
                      </Link>
                      <DeleteSetButton id={s.id} title={s.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-gray-100">
          {sets.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500 text-sm">Niciun set încă.</div>
          ) : sets.map(s => (
            <div key={s.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/admin/problems/sets/${s.id}`} className="font-medium text-gray-900 text-sm">{s.title}</Link>
                <span className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString('ro-RO')}</span>
              </div>
              <div className="text-xs text-gray-600">
                👤 {s.student?.fullName || 'fără elev'} • 📝 {s._count.setProblems} probleme
              </div>
              <div className="text-xs">{POLICY_LABEL[s.explanationPolicy]} • {s.completedAt ? '🏁' : s.startedAt ? '▶️' : '⏸'}</div>
              <div className="flex gap-3 text-sm pt-1">
                <CopySetLinkButton token={s.accessToken} />
                <Link href={`/admin/problems/sets/${s.id}`} className="text-indigo-600 font-medium">Vezi</Link>
                <DeleteSetButton id={s.id} title={s.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
