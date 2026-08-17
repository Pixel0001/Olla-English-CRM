'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  EnvelopeIcon, PhoneIcon, CalendarIcon, ChatBubbleLeftIcon, InboxIcon,
  MagnifyingGlassIcon, PlusIcon, XMarkIcon, BellAlertIcon, UserIcon,
  ArrowsUpDownIcon, AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { LEAD_STATUSES, LEAD_SOURCES, getStatus, getSource } from '@/lib/leads-config'
import { PermissionGate } from '@/hooks/usePermissions'

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
          <Link
            href="/admin/leads/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Lead nou
          </Link>
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
        <div className="space-y-2.5">
          {displayed.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <div className="animate-pulse text-gray-400 text-sm">Se încarcă mai multe...</div>
            </div>
          )}
        </div>
      )}
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

function LeadCard({ lead }) {
  const status = getStatus(lead.status)
  const source = getSource(lead.source)
  const today = startOfToday()
  const followUp = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null
  const overdue = followUp && followUp < today
  const isToday = followUp && !overdue && followUp < new Date(today.getTime() + 86400000)

  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`block bg-white rounded-xl p-3 xs:p-4 border hover:border-indigo-400 hover:shadow-md transition-all ${
        overdue ? 'border-red-300 bg-red-50/30'
          : status.group === 'nou' ? 'border-blue-300 bg-blue-50/30'
          : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 xs:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm xs:text-base truncate">{lead.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${status.color}`}>
              {status.emoji} {status.label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${source.color}`}>
              {source.emoji} {source.label}
            </span>
          </div>

          <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-x-4 text-xs xs:text-sm text-gray-600 mb-1.5">
            {lead.phone && (
              <span className="flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5 flex-shrink-0" />{lead.phone}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-1 min-w-0">
                <EnvelopeIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </span>
            )}
            {lead.studentName && (
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5 flex-shrink-0" />
                {lead.studentName}{lead.studentAge ? `, ${lead.studentAge} ani` : ''}
              </span>
            )}
            {lead.interestedIn && (
              <span className="inline-flex items-center px-1.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium">
                {lead.interestedIn}
              </span>
            )}
          </div>

          {lead.message && (
            <p className="text-xs xs:text-sm text-gray-700 line-clamp-2">
              <ChatBubbleLeftIcon className="h-3.5 w-3.5 inline mr-1 text-gray-400" />
              {lead.message}
            </p>
          )}

          {followUp && (
            <p className={`mt-1.5 text-xs font-medium flex items-center gap-1 ${
              overdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-blue-600'
            }`}>
              <BellAlertIcon className="h-3.5 w-3.5" />
              Follow-up: {followUp.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
              {overdue ? ' (restant)' : isToday ? ' (azi)' : ''}
            </p>
          )}
        </div>

        <div className="text-left sm:text-right text-xs text-gray-400 whitespace-nowrap space-y-0.5">
          <div className="flex sm:justify-end items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            {new Date(lead.createdAt).toLocaleDateString('ro-RO', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </div>
          {lead.notesCount > 0 && <div>📝 {lead.notesCount} notițe</div>}
        </div>
      </div>
    </Link>
  )
}
