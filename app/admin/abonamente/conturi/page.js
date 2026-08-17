export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline'

function subStatus(latest) {
  if (!latest) return 'none'
  const now = new Date()
  if (new Date(latest.expiresAt) < now) return 'expired'
  return 'active'
}

function statusBadge(status) {
  if (status === 'active')  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300"><CheckCircleIcon className="w-3 h-3" /> Activ</span>
  if (status === 'expired') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300"><XCircleIcon className="w-3 h-3" /> Expirat</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-300"><ClockIcon className="w-3 h-3" /> Niciodată</span>
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function ConturiPage({ searchParams }) {
  await requireAdmin()
  const canView = await checkPermission('students.view')
  if (!canView.allowed) notFound()

  const sp = await searchParams
  const filter = sp?.filter || 'all'  // 'all' | 'active' | 'expired' | 'none'
  const search = sp?.search || ''

  // Fetch all students with their latest learning payment
  const students = await prisma.student.findMany({
    where: search ? {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { parentName: { contains: search, mode: 'insensitive' } },
        { parentPhone: { contains: search, mode: 'insensitive' } },
        { parentEmail: { contains: search, mode: 'insensitive' } },
      ]
    } : {},
    orderBy: { fullName: 'asc' },
    select: {
      id: true,
      fullName: true,
      parentName: true,
      parentPhone: true,
      parentEmail: true,
      active: true,
      learningPayments: {
        orderBy: { expiresAt: 'desc' },
        take: 1,
        select: {
          id: true,
          amount: true,
          currency: true,
          paymentDate: true,
          expiresAt: true,
          validDays: true,
          notes: true,
        },
      },
    },
  })

  // Attach status
  const enriched = students.map(s => ({
    ...s,
    latestPayment: s.learningPayments[0] ?? null,
    status: subStatus(s.learningPayments[0] ?? null),
  }))

  // Apply filter
  const filtered = filter === 'all' ? enriched : enriched.filter(s => s.status === filter)

  const counts = {
    all: enriched.length,
    active: enriched.filter(s => s.status === 'active').length,
    expired: enriched.filter(s => s.status === 'expired').length,
    none: enriched.filter(s => s.status === 'none').length,
  }

  const tabs = [
    { key: 'all',     label: 'Toți',         count: counts.all },
    { key: 'active',  label: 'Abonament activ', count: counts.active },
    { key: 'expired', label: 'Expirat',       count: counts.expired },
    { key: 'none',    label: 'Fără abonament', count: counts.none },
  ]

  function tabHref(key) {
    const params = new URLSearchParams()
    params.set('filter', key)
    if (search) params.set('search', search)
    return `/admin/abonamente/conturi?${params.toString()}`
  }

  function searchHref(q) {
    const params = new URLSearchParams()
    params.set('filter', filter)
    if (q) params.set('search', q)
    return `/admin/abonamente/conturi?${params.toString()}`
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <Link href="/admin/abonamente" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-1">
            <ArrowLeftIcon className="w-4 h-4" /> Abonamente
          </Link>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BanknotesIcon className="w-6 h-6 text-indigo-500" />
            Conturi & Abonamente
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Statusul abonamentului /learn pentru fiecare elev</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" action="/admin/abonamente/conturi">
        <input type="hidden" name="filter" value={filter} />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Caută după nume, telefon, email..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 bg-white shadow-sm text-gray-900 placeholder-gray-400"
        />
      </form>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={tabHref(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === t.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-700'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              filter === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>{t.count}</span>
          </Link>
        ))}
      </div>

      {/* Table — desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Elev</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cont /learn</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Ultima plată</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Expiră</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sumă</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                  Niciun cont găsit
                </td>
              </tr>
            ) : filtered.map(s => {
              const p = s.latestPayment
              const expired = p && new Date(p.expiresAt) < new Date()
              const daysLeft = p ? Math.ceil((new Date(p.expiresAt) - new Date()) / 86400000) : null
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 text-sm">{s.fullName}</div>
                    {s.parentName && <div className="text-xs text-gray-500">{s.parentName}</div>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-xs text-gray-500">{s.parentPhone || '—'}</div>
                    <div className="text-xs text-gray-400">{s.parentEmail || ''}</div>
                  </td>
                  <td className="px-5 py-3">
                    {statusBadge(s.status)}
                    {p && daysLeft !== null && !expired && (
                      <div className="text-[10px] text-gray-400 mt-0.5">{daysLeft} {daysLeft === 1 ? 'zi' : 'zile'} rămase</div>
                    )}
                    {p && expired && (
                      <div className="text-[10px] text-red-400 mt-0.5">Expirat de {Math.abs(daysLeft)} zile</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{fmt(p?.paymentDate)}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{fmt(p?.expiresAt)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">
                    {p ? `${p.amount} ${p.currency}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/students/${s.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Detalii
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            Niciun cont găsit
          </div>
        ) : filtered.map(s => {
          const p = s.latestPayment
          const expired = p && new Date(p.expiresAt) < new Date()
          const daysLeft = p ? Math.ceil((new Date(p.expiresAt) - new Date()) / 86400000) : null
          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{s.fullName}</div>
                  {s.parentName && <div className="text-xs text-gray-500">{s.parentName}</div>}
                  {s.parentPhone && <div className="text-xs text-gray-400">{s.parentPhone}</div>}
                </div>
                {statusBadge(s.status)}
              </div>
              {p && (
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><span className="text-gray-400">Plată: </span>{fmt(p.paymentDate)}</div>
                  <div><span className="text-gray-400">Expiră: </span>{fmt(p.expiresAt)}</div>
                  <div><span className="text-gray-400">Sumă: </span>{p.amount} {p.currency}</div>
                  <div>
                    {!expired && daysLeft !== null && <span className="text-emerald-600 font-medium">{daysLeft} zile rămase</span>}
                    {expired && <span className="text-red-500 font-medium">Expirat de {Math.abs(daysLeft)} zile</span>}
                  </div>
                </div>
              )}
              <Link href={`/admin/students/${s.id}`} className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline">
                Vezi fișa elevului →
              </Link>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total elevi', value: counts.all, color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Abonament activ', value: counts.active, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          { label: 'Expirat', value: counts.expired, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Fără abonament', value: counts.none, color: 'bg-amber-50 border-amber-200 text-amber-700' },
        ].map(c => (
          <div key={c.label} className={`rounded-xl p-4 border ${c.color}`}>
            <div className="text-2xl font-extrabold">{c.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
