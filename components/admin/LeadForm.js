'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LEAD_STATUSES, LEAD_SOURCES, getSource } from '@/lib/leads-config'
import LevelSelect from '@/components/LevelSelect'
import { LESSON_TYPES, LOCATION_TYPES } from '@/lib/lesson-preferences'
import FollowUpPicker from '@/components/admin/FollowUpPicker'
import DuplicateLeadWarning from '@/components/admin/DuplicateLeadWarning'

const input =
  'w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
const label = 'block text-xs font-medium text-gray-600 mb-0.5'

// Recontactările se verifică din 10 în 10 minute, deci ora se aliniază
const roundToStep = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  d.setMinutes(Math.round(d.getMinutes() / 10) * 10, 0, 0)
  return toLocalInput(d.toISOString())
}

// datetime-local lucrează în ora locală, nu în UTC
const toLocalInput = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Formular pentru lead: creare (fără `lead`) sau editare (cu `lead`).
 */
export default function LeadForm({ lead = null, onSaved = null, onCancel = null, staff = [] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: lead?.name || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    source: lead?.source || 'INSTAGRAM',
    sourceDetail: lead?.sourceDetail || '',
    studentName: lead?.studentName || '',
    studentAge: lead?.studentAge ?? '',
    isAdult: lead?.isAdult ?? false,
    interestedIn: lead?.interestedIn || '',
    lessonType: lead?.lessonType || '',
    locationType: lead?.locationType || '',
    status: lead?.status || 'LEAD',
    assignedToId: lead?.assignedToId || '',
    nextFollowUpAt: lead?.nextFollowUpAt || null,
    message: lead?.message || '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const sourceCfg = getSource(form.source)

  const submit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) return toast.error('Numele este obligatoriu')
    if (!form.phone.trim() && !form.email.trim()) {
      return toast.error('Adaugă cel puțin un telefon sau un email')
    }

    setSaving(true)
    try {
      const res = await fetch(lead ? `/api/admin/leads/${lead.id}` : '/api/admin/leads', {
        method: lead ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la salvare')

      toast.success(lead ? 'Lead actualizat' : 'Lead adăugat')
      if (data.conversion?.created) toast.success('Elevul a fost adăugat în lista de elevi')
      if (onSaved) onSaved(data)
      else router.push(`/admin/leads/${data.id}`)
      router.refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Persoana de contact */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-900">Persoana de contact</h2>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className={label}>Nume *</label>
            <input
              className={input} value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="ex: Maria Popescu" required
            />
          </div>
          <div>
            <label className={label}>Telefon</label>
            <input
              className={input} value={form.phone} onChange={(e) => set('phone', e.target.value)}
              placeholder="+373 60 000 000" inputMode="tel"
            />
          </div>
          <div>
            <label className={label}>Email</label>
            <input
              className={input} type="email" value={form.email}
              onChange={(e) => set('email', e.target.value)} placeholder="opțional"
            />
          </div>
        </div>
        <p className="text-[11px] text-gray-500">Cel puțin telefon sau email trebuie completat.</p>

        <DuplicateLeadWarning name={form.name} phone={form.phone} excludeId={lead?.id || null} />
      </section>

      {/* Sursa */}
      <section className="space-y-2 pt-3 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">De unde a venit</h2>
        <div className="flex flex-wrap gap-1.5">
          {LEAD_SOURCES.map((s) => (
            <button
              key={s.value} type="button" onClick={() => set('source', s.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                form.source === s.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <div>
          <label className={label}>{sourceCfg.detailLabel}</label>
          <input
            className={input} value={form.sourceDetail}
            onChange={(e) => set('sourceDetail', e.target.value)} placeholder="opțional"
          />
        </div>
      </section>

      {/* Cine învață */}
      <section className="space-y-2 pt-3 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Cine învață</h2>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className={label}>Nume elev</label>
            <input
              className={input} value={form.studentName}
              onChange={(e) => set('studentName', e.target.value)}
              placeholder="dacă diferă de persoana de contact"
            />
          </div>
          <div>
            <label className={label}>Vârstă</label>
            {form.isAdult ? (
              <div className={`${input} bg-gray-50 text-gray-500 flex items-center`}>Adult</div>
            ) : (
              <input
                className={input} type="number" min="1" max="99" value={form.studentAge}
                onChange={(e) => set('studentAge', e.target.value)} placeholder="ex: 12"
              />
            )}
            <label className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAdult}
                onChange={(e) => {
                  set('isAdult', e.target.checked)
                  if (e.target.checked) set('studentAge', '')
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Adult (fără vârstă exactă)
            </label>
          </div>
          <div>
            <label className={label}>Cum vrea lecțiile</label>
            <select className={input} value={form.lessonType} onChange={(e) => set('lessonType', e.target.value)}>
              <option value="">Nespecificat</option>
              {LESSON_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Unde</label>
            <select className={input} value={form.locationType} onChange={(e) => set('locationType', e.target.value)}>
              <option value="">Nespecificat</option>
              {LOCATION_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Nivel actual</label>
            <LevelSelect
              className={input}
              value={form.interestedIn}
              onChange={(e) => set('interestedIn', e.target.value)}
              emptyLabel="Nespecificat"
            />
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="space-y-2 pt-3 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Stadiu</h2>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className={label}>Status</label>
            <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Responsabil</label>
            <select
              className={input} value={form.assignedToId}
              onChange={(e) => set('assignedToId', e.target.value)}
            >
              <option value="">Nimeni</option>
              {staff.map((u) => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Primește notificarea de recontactare pe Telegram
            </p>
          </div>
          <div>
            <label className={label}>Recontactează pe</label>
            <FollowUpPicker
              value={form.nextFollowUpAt}
              onChange={(iso) => set('nextFollowUpAt', iso)}
              className="pt-1"
            />
          </div>
        </div>
        <div>
          <label className={label}>Mesaj / context</label>
          <textarea
            className={`${input} resize-none`} rows={3} value={form.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Ce a scris sau ce ați discutat…"
          />
        </div>
      </section>

      <div className="flex gap-2 pt-1">
        <button
          type="submit" disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Se salvează…' : lead ? 'Salvează modificările' : 'Adaugă lead'}
        </button>
        <button
          type="button" onClick={() => (onCancel ? onCancel() : router.back())}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Anulează
        </button>
      </div>
    </form>
  )
}
