export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { checkPermission } from '@/lib/permissions'
import DeleteModuleButton from '@/components/admin/DeleteModuleButton'

export default async function AdminModulesPage() {
  return (
    <PermissionGuard permission="modules.view">
      <Content />
    </PermissionGuard>
  )
}

async function Content() {
  const [canCreate, canDelete] = await Promise.all([
    checkPermission('modules.create'),
    checkPermission('modules.delete'),
  ])

  const modules = await prisma.learningModule.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { lessons: true, accesses: true } } },
  })

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">📚 Module de Învățare</h1>
          <p className="text-sm text-gray-600">{modules.length} {modules.length === 1 ? 'modul' : 'module'} • Lecții, teorie + probleme cu submisii</p>
        </div>
        {canCreate.allowed && (
          <Link href="/admin/modules/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            + Modul nou
          </Link>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            Niciun modul încă. Creează primul (ex: <strong>Python</strong>).
          </div>
        ) : modules.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">#{m.order}</span>
                  {!m.active && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">inactiv</span>}
                  {m.language && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{m.language}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mt-1.5 truncate">{m.title}</h3>
                <p className="text-xs text-gray-500 truncate">/{m.slug}</p>
              </div>
            </div>
            {m.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.description}</p>}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
              <span>📖 {m._count.lessons} lecții</span>
              <span>🎟️ {m._count.accesses} accesuri</span>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link href={`/admin/modules/${m.id}`} className="flex-1 text-center text-sm text-indigo-600 font-medium hover:underline">
                Deschide →
              </Link>
              {canDelete.allowed && <DeleteModuleButton id={m.id} title={m.title} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
