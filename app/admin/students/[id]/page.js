export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'

const STATUS_LABELS = {
  ACTIVE: { label: 'Activ', color: 'bg-green-100 text-green-700' },
  PAUSED: { label: 'Pauză', color: 'bg-amber-100 text-amber-700' },
  LEFT: { label: 'Plecat', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Terminat', color: 'bg-blue-100 text-blue-700' },
  TRANSFERRED: { label: 'Transferat', color: 'bg-purple-100 text-purple-700' },
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

const isThisMonth = (d) => {
  const now = new Date()
  const date = new Date(d)
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

export default async function StudentDetailPage({ params }) {
  await requireAdmin()
  const canView = await checkPermission('students.view')
  if (!canView.allowed) notFound()
  const canEdit = await checkPermission('students.edit')

  const { id } = await params

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      groupStudents: {
        include: {
          group: {
            include: { teacher: { select: { id: true, name: true } } },
          },
          payments: {
            orderBy: { paymentDate: 'desc' },
            include: { createdBy: { select: { name: true, role: true } } },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      },
      createdBy: { select: { name: true, role: true } },
    },
  })

  if (!student) notFound()

  // Prezențele elevului, din sesiunile grupelor în care e înscris
  const attendances = await prisma.attendance.findMany({
    where: { studentId: id },
    select: { status: true, session: { select: { date: true, groupId: true } } },
  })

  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length

  const allPayments = student.groupStudents.flatMap((gs) =>
    gs.payments.map((p) => ({ ...p, groupName: gs.group.name }))
  )
  const totalPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const paidThisMonth = allPayments
    .filter((p) => isThisMonth(p.paymentDate))
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const activeGroups = student.groupStudents.filter(
    (gs) => !['LEFT', 'TRANSFERRED'].includes(gs.status)
  )

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Antet */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link href="/admin/students" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900">{student.fullName}</h1>
            <p className="text-sm text-gray-600">
              {student.age ? `${student.age} ani` : 'vârstă nespecificată'}
              {student.grade ? ` · clasa ${student.grade}` : ''}
              {activeGroups.length > 0 ? ` · ${activeGroups.length} ${activeGroups.length === 1 ? 'grupă' : 'grupe'}` : ''}
            </p>
          </div>
        </div>

        {canEdit.allowed && (
          <Link
            href={`/admin/students/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editează
          </Link>
        )}
      </div>

      {/* Sinteză */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Prezențe" value={presentCount} color="text-emerald-600" />
        <StatCard label="Absențe" value={absentCount} color="text-red-600" />
        <StatCard label="Total plătit" value={`${totalPaid.toLocaleString('ro-RO')} MDL`} color="text-gray-900" />
        <StatCard
          label="Luna curentă"
          value={paidThisMonth > 0 ? `${paidThisMonth.toLocaleString('ro-RO')} MDL` : 'neachitat'}
          color={paidThisMonth > 0 ? 'text-emerald-600' : 'text-red-600'}
        />
      </div>

      {/* Date de contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 xs:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-indigo-600" />
          Date de contact
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <Field label="Părinte" value={student.parentName} />
          <Field label="Telefon">
            {student.parentPhone ? (
              <a href={`tel:${student.parentPhone}`} className="text-indigo-600 hover:underline flex items-center gap-1">
                <PhoneIcon className="h-4 w-4" />
                {student.parentPhone}
              </a>
            ) : '—'}
          </Field>
          <Field label="Email">
            {student.parentEmail ? (
              <a href={`mailto:${student.parentEmail}`} className="text-indigo-600 hover:underline flex items-center gap-1 break-all">
                <EnvelopeIcon className="h-4 w-4 shrink-0" />
                {student.parentEmail}
              </a>
            ) : '—'}
          </Field>
          <Field label="Adăugat" value={`${formatDate(student.createdAt)}${student.createdBy?.name ? ` · ${student.createdBy.name}` : ''}`} />
        </div>

        {student.notes && (
          <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
            {student.notes}
          </p>
        )}
      </div>

      {/* Grupe */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 xs:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
          Grupe
        </h2>

        {student.groupStudents.length === 0 ? (
          <p className="text-sm text-gray-500">Elevul nu e înscris în nicio grupă.</p>
        ) : (
          <div className="space-y-2">
            {student.groupStudents.map((gs) => {
              const status = STATUS_LABELS[gs.status] || STATUS_LABELS.ACTIVE
              const groupPaid = gs.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
              return (
                <div key={gs.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/groups/${gs.groupId}`} className="font-medium text-gray-900 hover:text-indigo-600">
                      {gs.group.name}
                    </Link>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    {gs.group.level && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                        {gs.group.level}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarDaysIcon className="h-3.5 w-3.5" />
                      din {formatDate(gs.enrolledAt)}
                    </span>
                    <span className="ml-auto text-xs text-gray-600">
                      profesor: {gs.group.teacher?.name || '—'}
                    </span>
                  </div>

                  {gs.statusNote && (
                    <p className="text-xs text-gray-500 mt-1">{gs.statusNote}</p>
                  )}

                  <p className="text-xs text-gray-600 mt-1.5">
                    Plătit în această grupă: <b>{groupPaid.toLocaleString('ro-RO')} MDL</b>
                    {` · ${gs.payments.length} ${gs.payments.length === 1 ? 'plată' : 'plăți'}`}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Plăți */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 xs:p-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BanknotesIcon className="h-5 w-5 text-emerald-600" />
          Istoric plăți
        </h2>

        {allPayments.length === 0 ? (
          <p className="text-sm text-gray-500">Nicio plată înregistrată.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grupa</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sumă</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metodă</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Înregistrat de</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allPayments
                  .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-700">{formatDate(p.paymentDate)}</td>
                      <td className="px-3 py-2 text-gray-700">{p.groupName}</td>
                      <td className="px-3 py-2 text-right font-semibold text-emerald-700 whitespace-nowrap">
                        {(p.amount || 0).toLocaleString('ro-RO')} MDL
                      </td>
                      <td className="px-3 py-2 text-gray-600">{p.paymentMethod || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{p.createdBy?.name || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 xs:p-4">
      <p className="text-[10px] xs:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg xs:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function Field({ label, value, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
      <div className="text-gray-800 font-medium break-words">{children ?? value ?? '—'}</div>
    </div>
  )
}
