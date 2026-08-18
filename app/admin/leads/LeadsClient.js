'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PhoneIcon, ChatBubbleLeftIcon, InboxIcon, MagnifyingGlassIcon,
  PlusIcon, XMarkIcon, BellAlertIcon, AdjustmentsHorizontalIcon,
  ChevronDownIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { LEAD_STATUSES, LEAD_SOURCES, getStatus, getSource } from '@/lib/leads-config'
import { PermissionGate } from '@/hooks/usePermissions'
import LeadForm from '@/components/admin/LeadForm'

const ITEMS_PER_PAGE = 20

const PRESETS = [
  { value: 'all', label: 'Toate' },
  { value: 'nou', label: 'Noi' },
  { value: 'lucru', label: 'În lucru' },
  { value: 'castigat', label: 'Câștigate' },
  { value: 'pierdut', label: 'Pierdute' },
]

const PERIODS = [
  { value: '', label: 'Oricând' },
  { value: 'today', label: 'Azi' },
  { value: '7', label: 'Ultimele 7 zile' },
  { value: '30', label: 'Ultimele 30 zile' },
  { value: '90', label: 'Ultimele 3 luni' },
]

const FOLLOWUPS = [
  { value: '', label: 'Toate' },
  { value: 'overdue', label: '🔴 Restante' },
  { value: 'today', label: '🟠 Azi' },
  { value: 'upcoming', label: '🔵 Urmează' },
  { value: 'none', label: '⚪ Fără follow-up' },
]

const SORTS = [
  { value: 'newest', label: 'Cele mai noi' },
  { value: 'oldest', label: 'Cele mai vechi' },
  { value: 'followup', label: 'Follow-up apropiat' },
  { value: 'name', label: 'Nume (A–Z)' },
]

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function LeadsClient({ leads }) {
  const router = useRouter()
  const [showNewModal, setShowNewModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [preset, setPreset] = useState('all')
  const [statuses, setStatuses] = useState([])
  const [sources, setSources] = useState([])
  const [period, setPeriod] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef(null)

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
    setDisplayCount(ITEMS_PER_PAGE)
  }

  const resetAll = () => {
    setSearch(''); setPreset('all'); setStatuses([]); setSources([])
    setPeriod(''); setFollowUp(''); setSort('newest'); setDisplayCount(ITEMS_PER_PAGE)
  }

  const activeFilterCount =
    (search ? 1 : 0) + (preset !== 'all' ? 1 : 0) + statuses.length + sources.length +
    (period ? 1 : 0) + (followUp ? 1 : 0)

  // ── Statistici (pe toate lead-urile, nu pe cele filtrate) ───────────────
  const stats = useMemo(() => {
    const byGroup = (g) => leads.filter((l) => getStatus(l.status).group === g).length
    const today = startOfToday()
    const overdue = leads.filter(
      (l) => l.nextFollowUpAt && new Date(l.nextFollowUpAt) < today &&
        !['castigat', 'pierdut'].includes(getStatus(l.status).group)
    ).length
    const castigate = byGroup('castigat')
    const inchise = castigate + byGroup('pierdut')
    return {
      total: leads.length,
      noi: byGroup('nou'),
      lucru: byGroup('lucru'),
      castigate,
      pierdute: byGroup('pierdut'),
      overdue,
      conversie: inchise > 0 ? Math.round((castigate / inchise) * 100) : null,
    }
  }, [leads])

  // ── Filtrare + sortare ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = leads

    if (preset !== 'all') r = r.filter((l) => getStatus(l.status).group === preset)
    if (statuses.length) r = r.filter((l) => statuses.includes(l.status))
    if (sources.length) r = r.filter((l) => sources.includes(l.source))

    if (period) {
      const limit = startOfToday()
      if (period !== 'today') limit.setDate(limit.getDate() - parseInt(period))
      r = r.filter((l) => new Date(l.createdAt) >= limit)
    }

    if (followUp) {
      const today = startOfToday()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      r = r.filter((l) => {
        if (followUp === 'none') return !l.nextFollowUpAt
        if (!l.nextFollowUpAt) return false
        const d = new Date(l.nextFollowUpAt)
        if (followUp === 'overdue') return d < today
        if (followUp === 'today') return d >= today && d < tomorrow
        if (followUp === 'upcoming') return d >= tomorrow
        return true
      })
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      r = r.filter((l) =>
        [l.name, l.phone, l.email, l.message, l.studentName, l.sourceDetail, l.interestedIn]
          .some((v) => v?.toLowerCase().includes(q))
      )
    }

    const sorted = [...r]
    if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ro'))
    else if (sort === 'followup') {
      sorted.sort((a, b) => {
        if (!a.nextFollowUpAt) return 1
        if (!b.nextFollowUpAt) return -1
        return new Date(a.nextFollowUpAt) - new Date(b.nextFollowUpAt)
      })
    } else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return sorted
  }, [leads, search, preset, statuses, sources, period, followUp, sort])

  const displayed = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  const loadMore = useCallback(() => {
    if (hasMore) setDisplayCount((p) => p + ITEMS_PER_PAGE)
  }, [hasMore])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => { if (e[0].isIntersecting && hasMore) loadMore() },
      { threshold: 0.1 }
    )
    if (loadMoreRef.current) obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="space-y-4 xs:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm xs:text-base text-gray-600">
            Toate cererile: Instagram, WhatsApp, Messenger, telefon, recomandări
          </p>
        </div>
        <PermissionGate permission="leads.create">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Lead nou
          </button>
        </PermissionGate>
      </div>

      {/* Statistici */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 xs:gap-3">
        <StatTile label="Total" value={stats.total} color="text-gray-900" />
        <StatTile label="🔵 Noi" value={stats.noi} color="text-blue-600" />
        <StatTile label="🟡 În lucru" value={stats.lucru} color="text-amber-600" />
        <StatTile label="💰 Câștigate" value={stats.castigate} color="text-emerald-600" />
        <StatTile label="❌ Pierdute" value={stats.pierdute} color="text-red-600" />
        <StatTile
          label={stats.overdue > 0 ? '🔴 Follow-up restant' : '📈 Conversie'}
          value={stats.overdue > 0 ? stats.overdue : stats.conversie === null ? '—' : `${stats.conversie}%`}
          color={stats.overdue > 0 ? 'text-red-600' : 'text-indigo-600'}
        />
      </div>

      {/* Preset-uri rapide */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => { setPreset(p.value); setDisplayCount(ITEMS_PER_PAGE) }}
            className={`px-3 py-1.5 rounded-full text-xs xs:text-sm font-medium transition-colors ${
              preset === p.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Căutare + filtre */}
      <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Caută după nume, telefon, email, elev, @user, mesaj..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDisplayCount(ITEMS_PER_PAGE) }}
              className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
            aria-label="Sortare"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filtre
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="pt-3 border-t border-gray-100 space-y-4">
            <FilterChips
              title="Sursă"
              options={LEAD_SOURCES.map((s) => ({ value: s.value, label: `${s.emoji} ${s.label}` }))}
              selected={sources}
              onToggle={(v) => toggle(sources, setSources, v)}
            />
            <FilterChips
              title="Status"
              options={LEAD_STATUSES.map((s) => ({ value: s.value, label: `${s.emoji} ${s.label}` }))}
              selected={statuses}
              onToggle={(v) => toggle(statuses, setStatuses, v)}
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Perioadă (adăugat)
                </p>
                <select
                  value={period}
                  onChange={(e) => { setPeriod(e.target.value); setDisplayCount(ITEMS_PER_PAGE) }}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Follow-up
                </p>
                <select
                  value={followUp}
                  onChange={(e) => { setFollowUp(e.target.value); setDisplayCount(ITEMS_PER_PAGE) }}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {FOLLOWUPS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {filtered.length === leads.length
              ? `${leads.length} lead-uri`
              : `${filtered.length} din ${leads.length} lead-uri`}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Resetează filtrele
            </button>
          )}
        </div>
      </div>

      {/* Listă */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <InboxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {activeFilterCount > 0
              ? 'Niciun lead nu corespunde filtrelor'
              : 'Niciun lead încă — adaugă primul cu butonul „Lead nou"'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {displayed.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              expanded={expandedId === lead.id}
              onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
            />
          ))}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <div className="animate-pulse text-gray-400 text-sm">Se încarcă mai multe...</div>
            </div>
          )}
        </div>
      )}

      {/* Modal „Lead nou" */}
      {showNewModal && (
        <NewLeadModal
          onClose={() => setShowNewModal(false)}
          onSaved={() => { setShowNewModal(false); router.refresh() }}
        />
      )}
    </div>
  )
}

function NewLeadModal({ onClose, onSaved }) {
  // Escape închide modalul; body-ul nu mai derulează în spate
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-3 xs:p-6">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lead nou"
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl my-2 xs:my-4"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 xs:px-6 py-3 flex items-start justify-between gap-3 rounded-t-2xl">
            <div>
              <h2 className="text-base xs:text-lg font-semibold text-gray-900">Lead nou</h2>
              <p className="text-xs text-gray-500">
                Instagram, WhatsApp, Messenger, telefon sau recomandare
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Închide"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 xs:p-6">
            <LeadForm onSaved={onSaved} onCancel={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatTile({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-2.5 xs:p-3 border border-gray-200">
      <p className="text-[10px] xs:text-xs text-gray-500 truncate">{label}</p>
      <p className={`text-lg xs:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function FilterChips({ title, options, selected, onToggle }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onToggle(o.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selected.includes(o.value)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function LeadRow({ lead, expanded, onToggle }) {
  const status = getStatus(lead.status)
  const source = getSource(lead.source)
  const today = startOfToday()
  const followUp = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null
  const overdue = followUp && followUp < today
  const isToday = followUp && !overdue && followUp < new Date(today.getTime() + 86400000)
  const chatLink = source.link ? source.link(lead) : null
  const waNumber = (lead.phone || '').replace(/[^\d]/g, '')

  return (
    <div
      className={`bg-white rounded-lg border transition-colors ${
        expanded ? 'border-indigo-400 shadow-sm'
          : overdue ? 'border-red-300 hover:border-indigo-300'
          : status.group === 'nou' ? 'border-blue-300 hover:border-indigo-300'
          : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Rând compact — click pentru detalii */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full text-left px-2.5 xs:px-3 py-2 flex items-center gap-2 min-w-0"
      >
        <span title={status.label} className="text-sm leading-none shrink-0">{status.emoji}</span>

        <span className="font-medium text-gray-900 text-sm truncate min-w-0 max-w-[45%] sm:max-w-none">
          {lead.name}
        </span>

        <span className={`hidden sm:inline shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
          {status.label}
        </span>
        <span className={`hidden md:inline shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${source.color}`}>
          {source.emoji} {source.label}
        </span>

        {lead.phone && (
          <span className="hidden lg:flex shrink-0 items-center gap-1 text-xs text-gray-500">
            <PhoneIcon className="h-3 w-3" />{lead.phone}
          </span>
        )}
        {lead.interestedIn && (
          <span className="hidden xl:inline shrink-0 px-1.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
            {lead.interestedIn}
          </span>
        )}

        <span className="ml-auto flex items-center gap-2 shrink-0 text-[11px] text-gray-400 whitespace-nowrap">
          {followUp && (
            <span
              title={`Follow-up: ${followUp.toLocaleDateString('ro-RO')}`}
              className={`flex items-center gap-0.5 ${
                overdue ? 'text-red-600 font-semibold'
                  : isToday ? 'text-orange-600 font-semibold'
                  : 'text-blue-600'
              }`}
            >
              <BellAlertIcon className="h-3.5 w-3.5" />
              {followUp.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {lead.notesCount > 0 && <span title={`${lead.notesCount} notițe`}>📝 {lead.notesCount}</span>}
          <span className="hidden xs:inline">
            {new Date(lead.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Detalii extinse */}
      {expanded && (
        <div className="px-2.5 xs:px-3 pb-3 pt-1 border-t border-gray-100 space-y-3">
          <div className="flex flex-wrap gap-1.5 pt-2 sm:hidden">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
              {status.emoji} {status.label}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${source.color}`}>
              {source.emoji} {source.label}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            {lead.phone && (
              <Detail label="Telefon">
                <a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">{lead.phone}</a>
              </Detail>
            )}
            {lead.email && (
              <Detail label="Email">
                <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline break-all">
                  {lead.email}
                </a>
              </Detail>
            )}
            {lead.studentName && (
              <Detail label="Elev">
                {lead.studentName}{lead.studentAge ? `, ${lead.studentAge} ani` : ''}
              </Detail>
            )}
            {lead.interestedIn && <Detail label="Nivel actual">{lead.interestedIn}</Detail>}
            {lead.sourceDetail && <Detail label={source.detailLabel}>{lead.sourceDetail}</Detail>}
            {followUp && (
              <Detail label="Recontactare">
                <span className={overdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-blue-600'}>
                  {followUp.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {overdue ? ' (restant)' : isToday ? ' (azi)' : ''}
                </span>
              </Detail>
            )}
            <Detail label="Adăugat">
              {new Date(lead.createdAt).toLocaleDateString('ro-RO', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
              })}
              {lead.createdByName ? ` — ${lead.createdByName}` : ''}
            </Detail>
          </div>

          {lead.message && (
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-xs text-gray-700 whitespace-pre-wrap">
                <ChatBubbleLeftIcon className="h-3.5 w-3.5 inline mr-1 text-gray-400" />
                {lead.message}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                <PhoneIcon className="h-3.5 w-3.5" /> Sună
              </a>
            )}
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
              >
                🟢 WhatsApp
              </a>
            )}
            {chatLink && !chatLink.startsWith('tel:') && (
              <a
                href={chatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                {source.emoji} Deschide {source.label}
              </a>
            )}
            <Link
              href={`/admin/leads/${lead.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-300 text-indigo-700 text-xs font-medium hover:bg-indigo-50 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              Fișa completă{lead.notesCount > 0 ? ` (${lead.notesCount} notițe)` : ''}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-gray-800 font-medium break-words">{children}</p>
    </div>
  )
}
