'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  PhoneIcon, ChatBubbleLeftIcon, InboxIcon, MagnifyingGlassIcon,
  PlusIcon, XMarkIcon, BellAlertIcon, ChevronDownIcon, PencilSquareIcon,
  ArrowTopRightOnSquareIcon, TrashIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { LEAD_STATUSES, LEAD_SOURCES, getStatus, getSource } from '@/lib/leads-config'
import { PermissionGate } from '@/hooks/usePermissions'
import LeadForm from '@/components/admin/LeadForm'
import { whatsAppLink } from '@/lib/phone'

const ITEMS_PER_PAGE = 30


const PERIODS = [
  { value: '', label: 'Oricând' },
  { value: 'today', label: 'Azi' },
  { value: '7', label: '7 zile' },
  { value: '30', label: '30 zile' },
  { value: '90', label: '3 luni' },
]

const FOLLOWUPS = [
  { value: '', label: 'Follow-up: toate' },
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

const selectClass =
  'px-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Recontactările se verifică din 10 în 10 minute, deci ora se aliniază la
// sferturi de acest fel: 16:00, 16:10, 16:20…
const STEP_MINUTES = 10

const roundToStep = (value) => {
  if (!value) return value
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  d.setMinutes(Math.round(d.getMinutes() / STEP_MINUTES) * STEP_MINUTES, 0, 0)
  return d
}

// Follow-up-ul are și oră; input-ul datetime-local vrea ora locală, nu UTC
const toDateInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function LeadsClient({ leads, staff = [] }) {
  const router = useRouter()
  const [items, setItems] = useState(leads)
  const [showNewModal, setShowNewModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [period, setPeriod] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [sort, setSort] = useState('newest')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef(null)

  useEffect(() => { setItems(leads) }, [leads])

  const resetPaging = () => setDisplayCount(ITEMS_PER_PAGE)

  const resetAll = () => {
    setSearch(''); setStatus(''); setSource('')
    setPeriod(''); setFollowUp(''); setSort('newest'); resetPaging()
  }

  const activeFilterCount =
    (search ? 1 : 0) + (status ? 1 : 0) +
    (source ? 1 : 0) + (period ? 1 : 0) + (followUp ? 1 : 0)

  // Actualizează un lead în listă după o modificare din rândul extins
  const patchLead = useCallback((id, patch) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }, [])

  // Cine se ocupă de lead — poate fi schimbat direct din listă
  const assignLead = useCallback(async (lead, userId) => {
    const previous = lead.assignedToId
    setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, assignedToId: userId || null } : l)))
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: userId || null }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Eroare la atribuire")
      }
      toast.success(userId ? "Responsabil setat" : "Responsabil eliminat")
    } catch (err) {
      toast.error(err.message)
      setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, assignedToId: previous } : l)))
    }
  }, [])

  // Schimbarea statusului direct din listă, fără a deschide formularul
  const changeStatus = useCallback(async (lead, newStatus) => {
    const previous = lead.status
    setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l)))
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Eroare la schimbarea statusului")
      if (data.conversion?.created) toast.success("Elevul a fost adăugat în lista de elevi")
    } catch (err) {
      toast.error(err.message)
      setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: previous } : l)))
    }
  }, [])

  const deleteLead = useCallback(async (lead) => {
    if (!confirm(`Ștergi lead-ul „${lead.name}"? Notițele lui se pierd definitiv.`)) return
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Eroare la ștergere")
      }
      setItems((prev) => prev.filter((l) => l.id !== lead.id))
      toast.success("Lead șters")
    } catch (err) {
      toast.error(err.message)
    }
  }, [])

  // ── Statistici (pe toate lead-urile, nu pe cele filtrate) ───────────────
  const stats = useMemo(() => {
    const today = startOfToday()

    // Numărăm pe statusuri reale, nu pe grupuri inventate
    const byStatus = {}
    for (const l of items) byStatus[l.status] = (byStatus[l.status] || 0) + 1

    const overdue = items.filter(
      (l) => l.nextFollowUpAt && new Date(l.nextFollowUpAt) < today &&
        !["castigat", "pierdut"].includes(getStatus(l.status).group)
    ).length

    return { total: items.length, byStatus, overdue }
  }, [items])

  // ── Filtrare + sortare ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let r = items

    if (status) r = r.filter((l) => l.status === status)
    if (source) r = r.filter((l) => l.source === source)

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
  }, [items, search, status, source, period, followUp, sort])

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
    <div className="space-y-2.5">
      {/* Header + statistici pe același rând */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-gray-900">Leads</h1>
        <div className="flex flex-wrap items-center gap-1.5">
          <StatChip label="Total" value={stats.total} />
          <StatChip label="🔵 New lead" value={stats.byStatus.LEAD || 0} color="text-blue-600" />
          <StatChip label="📋 Waitlist" value={stats.byStatus.WAITLIST || 0} color="text-teal-700" />
          <StatChip label="💰 A plătit" value={stats.byStatus.PLATIT || 0} color="text-emerald-600" />
          <StatChip label="🟣 Studiază" value={stats.byStatus.STUDIAZA || 0} color="text-purple-600" />
          <StatChip label="🔴 Restante" value={stats.overdue} color="text-red-600" />
          <PermissionGate permission="leads.create">
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Lead nou
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Bară unică: preset-uri + căutare îngustă + filtre */}
      <div className="bg-white rounded-lg border border-gray-200 px-2 py-2 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => { setStatus(""); resetPaging() }}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            status === ""
              ? "bg-indigo-600 text-white"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-indigo-400"
          }`}
        >
          Toate
        </button>
        {LEAD_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); resetPaging() }}
            title={s.label}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              status === s.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-indigo-400"
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}

        <div className="relative w-44">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Caută…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPaging() }}
            className="w-full pl-7 pr-2 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select value={source} onChange={(e) => { setSource(e.target.value); resetPaging() }} className={selectClass} aria-label="Sursă">
          <option value="">Sursă: toate</option>
          {LEAD_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
        </select>

        <select value={followUp} onChange={(e) => { setFollowUp(e.target.value); resetPaging() }} className={selectClass} aria-label="Follow-up">
          {FOLLOWUPS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <select value={period} onChange={(e) => { setPeriod(e.target.value); resetPaging() }} className={selectClass} aria-label="Perioadă">
          {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass} aria-label="Sortare">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <span className="ml-auto flex items-center gap-2 text-[11px] text-gray-500">
          {filtered.length === items.length
            ? `${items.length} lead-uri`
            : `${filtered.length}/${items.length}`}
          {activeFilterCount > 0 && (
            <button onClick={resetAll} className="inline-flex items-center gap-0.5 text-indigo-600 hover:text-indigo-800 font-medium">
              <XMarkIcon className="h-3 w-3" />
              Resetează
            </button>
          )}
        </span>
      </div>

      {/* Listă */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <InboxIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {activeFilterCount > 0
              ? 'Niciun lead nu corespunde filtrelor'
              : 'Niciun lead încă — adaugă primul cu butonul „Lead nou"'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {displayed.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              expanded={expandedId === lead.id}
              onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              onPatch={patchLead}
              onEdit={() => setEditingLead(lead)}
              onDelete={() => deleteLead(lead)}
              onStatusChange={(newStatus) => changeStatus(lead, newStatus)}
              staff={staff}
              onAssign={(userId) => assignLead(lead, userId)}
            />
          ))}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-3">
              <div className="animate-pulse text-gray-400 text-xs">Se încarcă…</div>
            </div>
          )}
        </div>
      )}

      {showNewModal && (
        <NewLeadModal
          staff={staff}
          onClose={() => setShowNewModal(false)}
          onSaved={() => { setShowNewModal(false); router.refresh() }}
        />
      )}

      {editingLead && (
        <NewLeadModal
          lead={editingLead}
          staff={staff}
          onClose={() => setEditingLead(null)}
          onSaved={() => { setEditingLead(null); router.refresh() }}
        />
      )}
    </div>
  )
}

function StatChip({ label, value, color = 'text-gray-900' }) {
  return (
    <span className="inline-flex items-baseline gap-1 px-2 py-1 rounded-lg bg-white border border-gray-200">
      <span className="text-[10px] text-gray-500">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </span>
  )
}

function NewLeadModal({ onClose, onSaved, lead = null, staff = [] }) {
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
          aria-label={lead ? "Editează lead" : "Lead nou"}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl my-2 xs:my-4"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 xs:px-6 py-3 flex items-start justify-between gap-3 rounded-t-2xl">
            <div>
              <h2 className="text-base xs:text-lg font-semibold text-gray-900">{lead ? `Editează: ${lead.name}` : "Lead nou"}</h2>
              <p className="text-xs text-gray-500">
                {lead ? "Modifică datele, statusul sau follow-up-ul" : "Instagram, WhatsApp, Messenger, telefon sau recomandare"}
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
            <LeadForm lead={lead} staff={staff} onSaved={onSaved} onCancel={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeadRow({ lead, expanded, onToggle, onPatch, onEdit, onDelete, onStatusChange, staff, onAssign }) {
  const status = getStatus(lead.status)
  const source = getSource(lead.source)
  const today = startOfToday()
  const followUp = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null
  const overdue = followUp && followUp < today
  const isToday = followUp && !overdue && followUp < new Date(today.getTime() + 86400000)

  return (
    <div
      className={`bg-white rounded-lg border transition-colors ${
        expanded ? 'border-indigo-400 shadow-sm'
          : overdue ? 'border-red-300 hover:border-indigo-300'
          : status.group === 'nou' ? 'border-blue-300 hover:border-indigo-300'
          : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Rând compact */}
      <div className="flex items-stretch">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex-1 text-left px-2 py-1 flex items-center gap-1.5 min-w-0 text-[13px]"
      >
        <span title={status.label} className="leading-none shrink-0">{status.emoji}</span>

        <span className="font-medium text-gray-900 truncate min-w-0 max-w-[42%] sm:max-w-none">
          {lead.name}
        </span>
        <span className={`hidden md:inline shrink-0 px-1.5 rounded text-[10px] font-medium ${source.color}`}>
          {source.emoji} {source.label}
        </span>

        {lead.phone && (
          <span className="hidden lg:flex shrink-0 items-center gap-0.5 text-xs text-gray-500">
            <PhoneIcon className="h-3 w-3" />{lead.phone}
          </span>
        )}
        {lead.interestedIn && (
          <span className="hidden xl:inline shrink-0 px-1 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
            {lead.interestedIn}
          </span>
        )}

        <span className="ml-auto flex items-center gap-1.5 shrink-0 text-[11px] text-gray-400 whitespace-nowrap">
          {followUp && (
            <span
              title={`Follow-up: ${followUp.toLocaleDateString('ro-RO')}`}
              className={`flex items-center gap-0.5 ${
                overdue ? 'text-red-600 font-semibold'
                  : isToday ? 'text-orange-600 font-semibold'
                  : 'text-blue-600'
              }`}
            >
              <BellAlertIcon className="h-3 w-3" />
              {followUp.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {lead.notesCount > 0 && <span title={`${lead.notesCount} notițe`}>📝{lead.notesCount}</span>}
          <span className="hidden xs:inline">
            {new Date(lead.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
          </span>
          <span className="p-0.5 rounded hover:bg-gray-100">
            <ChevronDownIcon className={`h-3.5 w-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </span>
        </span>
      </button>

        {/* Status editabil direct din listă */}
        <PermissionGate permission="leads.edit">
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            title="Schimbă statusul"
            className={`shrink-0 max-w-[8.5rem] px-1 py-0.5 my-1 rounded border text-[10px] font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 ${status.color}`}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
            ))}
          </select>
        </PermissionGate>

        <div className="flex items-center gap-0.5 pr-1.5 shrink-0">

          <PermissionGate permission="leads.edit">
            <button
              type="button"
              onClick={onEdit}
              title="Editează"
              aria-label="Editează lead-ul"
              className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <PencilSquareIcon className="h-3.5 w-3.5" />
            </button>
          </PermissionGate>
          <PermissionGate permission="leads.delete">
            <button
              type="button"
              onClick={onDelete}
              title="Șterge"
              aria-label="Șterge lead-ul"
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </PermissionGate>
        </div>
      </div>

      {expanded && <LeadDetails lead={lead} onPatch={onPatch} staff={staff} onAssign={onAssign} />}
    </div>
  )
}

function LeadDetails({ lead, onPatch, staff = [], onAssign }) {
  const status = getStatus(lead.status)
  const source = getSource(lead.source)
  const chatLink = source.link ? source.link(lead) : null
  const waLink = whatsAppLink(lead.phone)

  const [notes, setNotes] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [followUpDate, setFollowUpDate] = useState(toDateInput(lead.nextFollowUpAt))
  const [savingFollowUp, setSavingFollowUp] = useState(false)
  const [converting, setConverting] = useState(false)

  // Trecerea lead-ului în lista de elevi, fără a-i schimba statusul
  const convertToStudent = async () => {
    if (!confirm(`Creezi elevul din lead-ul „${lead.name}"?`)) return
    setConverting(true)
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/convert`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la conversie')
      toast.success(data.created ? 'Elev creat din lead' : 'Lead-ul avea deja un elev asociat')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setConverting(false)
    }
  }

  // Notițele se încarcă abia la deschiderea rândului
  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/lead-notes?leadId=${lead.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (!cancelled) setNotes(Array.isArray(d) ? d : d?.notes || []) })
      .catch(() => { if (!cancelled) setNotes([]) })
    return () => { cancelled = true }
  }, [lead.id])

  const addNote = async () => {
    if (!noteText.trim()) return
    setSavingNote(true)
    try {
      const res = await fetch('/api/admin/lead-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, content: noteText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la salvarea notiței')
      setNotes((prev) => [data, ...(prev || [])])
      setNoteText('')
      onPatch(lead.id, { notesCount: (lead.notesCount || 0) + 1 })
      toast.success('Notiță adăugată')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingNote(false)
    }
  }

  const deleteNote = async (noteId) => {
    try {
      const res = await fetch(`/api/admin/lead-notes/${noteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Eroare la ștergere')
      }
      setNotes((prev) => (prev || []).filter((n) => n.id !== noteId))
      onPatch(lead.id, { notesCount: Math.max((lead.notesCount || 1) - 1, 0) })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const saveFollowUp = async (rawValue) => {
    // Orice minut ales manual se aliniază la pasul de 10 minute
    const rounded = rawValue ? roundToStep(rawValue) : null
    const value = rounded ? toDateInput(rounded.toISOString()) : ''

    setSavingFollowUp(true)
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextFollowUpAt: value || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la salvare')
      setFollowUpDate(value || '')
      onPatch(lead.id, { nextFollowUpAt: value ? new Date(value).toISOString() : null })
      toast.success(value ? 'Follow-up salvat' : 'Follow-up eliminat')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingFollowUp(false)
    }
  }

  return (
    <div className="px-2 pb-2.5 pt-1.5 border-t border-gray-100 space-y-2.5 text-xs">
      {/* Chips vizibile doar pe ecran mic, unde sunt ascunse în rând */}
      <div className="flex flex-wrap gap-1 sm:hidden">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
          {status.emoji} {status.label}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${source.color}`}>
          {source.emoji} {source.label}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-1.5">
        {lead.phone && (
          <Detail label="Telefon">
            <a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">{lead.phone}</a>
          </Detail>
        )}
        {lead.email && (
          <Detail label="Email">
            <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline break-all">{lead.email}</a>
          </Detail>
        )}
        {lead.studentName && (
          <Detail label="Elev">
            {lead.studentName}{lead.studentAge ? `, ${lead.studentAge} ani` : ''}
          </Detail>
        )}
        {lead.interestedIn && <Detail label="Nivel actual">{lead.interestedIn}</Detail>}
        {lead.sourceDetail && <Detail label={source.detailLabel}>{lead.sourceDetail}</Detail>}
        <Detail label="Adăugat">
          {new Date(lead.createdAt).toLocaleDateString('ro-RO', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
          {lead.createdByName ? ` — ${lead.createdByName}` : ''}
        </Detail>
      </div>

      {lead.message && (
        <p className="bg-gray-50 rounded-lg p-2 text-gray-700 whitespace-pre-wrap">
          <ChatBubbleLeftIcon className="h-3.5 w-3.5 inline mr-1 text-gray-400" />
          {lead.message}
        </p>
      )}

      {/* Responsabil */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wide text-gray-400">Responsabil</span>
        <select
          value={lead.assignedToId || ""}
          onChange={(e) => onAssign?.(e.target.value)}
          className="px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Nimeni</option>
          {staff.map((u) => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </select>
        <span className="text-[10px] text-gray-400">
          primește notificarea de recontactare pe Telegram
        </span>
      </div>

      {/* Follow-up */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wide text-gray-400">Recontactare</span>
        <input
          type="datetime-local"
          step={STEP_MINUTES * 60}
          value={followUpDate}
          disabled={savingFollowUp}
          onChange={(e) => saveFollowUp(e.target.value)}
          className="px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        />
        {followUpDate && (
          <button
            type="button"
            onClick={() => saveFollowUp('')}
            disabled={savingFollowUp}
            className="text-[11px] text-gray-500 hover:text-red-600 disabled:opacity-50"
          >
            elimină
          </button>
        )}
        {[1, 3, 7].map((d) => (
          <button
            key={d}
            type="button"
            disabled={savingFollowUp}
            onClick={() => {
              const t = new Date()
              t.setDate(t.getDate() + d)
              t.setHours(10, 0, 0, 0) // ora 10:00, ora locală
              saveFollowUp(toDateInput(t.toISOString()))
            }}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-[11px] text-gray-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
          >
            +{d}z
          </button>
        ))}
      </div>

      {/* Notițe */}
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote() } }}
            placeholder="Notiță rapidă… (Enter pentru salvare)"
            className="flex-1 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={addNote}
            disabled={savingNote || !noteText.trim()}
            className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {savingNote ? '…' : 'Adaugă'}
          </button>
        </div>

        {notes === null ? (
          <p className="text-[11px] text-gray-400">Se încarcă notițele…</p>
        ) : notes.length > 0 && (
          <ul className="space-y-1">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                <span className="flex-1 text-gray-700 whitespace-pre-wrap">{n.content}</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                  {n.authorName ? ` · ${n.authorName}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => deleteNote(n.id)}
                  className="text-gray-300 hover:text-red-600"
                  aria-label="Șterge notița"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Acțiuni rapide */}
      <div className="flex flex-wrap gap-1.5">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700 transition-colors">
            <PhoneIcon className="h-3 w-3" /> Sună
          </a>
        )}
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-600 text-white text-[11px] font-medium hover:bg-green-700 transition-colors">
            🟢 WhatsApp
          </a>
        )}
        {chatLink && !chatLink.startsWith('tel:') && (
          <a href={chatLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-300 text-gray-700 text-[11px] font-medium hover:bg-gray-50 transition-colors">
            {source.emoji} {source.label}
          </a>
        )}
        <button
          type="button"
          onClick={convertToStudent}
          disabled={converting}
          title="Creează elevul din acest lead"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-600 text-white text-[11px] font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          <AcademicCapIcon className="h-3 w-3" />
          {converting ? "…" : "→ elev"}
        </button>
        <Link href={`/admin/leads/${lead.id}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-300 text-indigo-700 text-[11px] font-medium hover:bg-indigo-50 transition-colors">
          <ArrowTopRightOnSquareIcon className="h-3 w-3" />
          Fișa completă
        </Link>
      </div>
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
