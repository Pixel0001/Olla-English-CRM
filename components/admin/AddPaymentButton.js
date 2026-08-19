'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { BanknotesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { monthOptions } from '@/lib/payments'
import { PermissionGate } from '@/hooks/usePermissions'

const currentPeriod = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}`
}

/**
 * Înregistrarea unei plăți pentru un elev, din orice pagină.
 *
 * Plata se leagă de o grupă (acolo se știe câte lecții acoperă luna), așa că
 * dacă elevul e în mai multe grupe, se alege grupa. Luna acoperită e
 * separată de data încasării — se poate plăti în avans sau cu întârziere.
 *
 * @param groups [{ groupStudentId, groupName }]
 */
export default function AddPaymentButton({
  studentName, groups = [], variant = 'button', onSaved,
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [groupStudentId, setGroupStudentId] = useState(groups[0]?.groupStudentId || '')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState(currentPeriod())
  const [method, setMethod] = useState('cash')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!groupStudentId && groups.length > 0) setGroupStudentId(groups[0].groupStudentId)
  }, [groups, groupStudentId])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const submit = async (e) => {
    e.preventDefault()
    if (!groupStudentId) return toast.error('Elevul nu e înscris în nicio grupă')

    const value = parseFloat(amount)
    if (!Number.isFinite(value) || value <= 0) return toast.error('Introdu o sumă validă')

    setSaving(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupStudentId,
          amount: value,
          paymentDate: new Date(date).toISOString(),
          paymentMethod: method,
          notes: notes.trim() || null,
          forYear: parseInt(period.split('-')[0], 10),
          forMonth: parseInt(period.split('-')[1], 10),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la salvarea plății')

      toast.success('Plată înregistrată')
      setOpen(false)
      setAmount(''); setNotes('')
      onSaved ? onSaved(data) : router.refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const disabled = groups.length === 0

  return (
    <PermissionGate permission="groups.students.payments.create">
      {variant === 'link' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          title={disabled ? 'Elevul nu e în nicio grupă' : 'Adaugă plată'}
          className="text-emerald-700 hover:text-emerald-900 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Plată
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          title={disabled ? 'Elevul nu e în nicio grupă' : 'Adaugă plată'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          <BanknotesIcon className="h-4 w-4" />
          Adaugă plată
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <form
            onSubmit={submit}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Plată nouă</h2>
                {studentName && <p className="text-xs text-gray-500">{studentName}</p>}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                aria-label="Închide"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {groups.length > 1 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Grupa *</label>
                <select
                  value={groupStudentId}
                  onChange={(e) => setGroupStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {groups.map((g) => (
                    <option key={g.groupStudentId} value={g.groupStudentId}>{g.groupName}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sumă (MDL) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Plată pentru luna *</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {monthOptions().map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}{o.isCurrent ? ' (curentă)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Metodă</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data încasării</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notiță (opțional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />

            <p className="text-[11px] text-gray-500">
              Plata acoperă lecțiile lunii alese. Data încasării e separată — poți înregistra
              o plată în avans sau cu întârziere.
            </p>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Se salvează…' : 'Înregistrează plata'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}
    </PermissionGate>
  )
}
