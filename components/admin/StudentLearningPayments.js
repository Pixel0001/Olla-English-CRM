'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  BanknotesIcon, PlusIcon, TrashIcon, CalendarDaysIcon,
  CheckCircleIcon, ExclamationTriangleIcon, ClockIcon,
} from '@heroicons/react/24/outline'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysLeft(expiresAt) {
  if (!expiresAt) return null
  const ms = new Date(expiresAt).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export default function StudentLearningPayments({ studentId, initialPayments }) {
  const router = useRouter()
  const [payments, setPayments] = useState(initialPayments)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ amount: '', validDays: 30, currency: 'MDL', paymentDate: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const latest = payments[0]
  const dLeft = latest ? daysLeft(latest.expiresAt) : null
  const isExpired = dLeft !== null && dLeft < 0
  const isExpiringSoon = dLeft !== null && dLeft >= 0 && dLeft <= 3

  const submit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Suma invalidă')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/students/${studentId}/learning-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(form.amount),
          validDays: Number(form.validDays) || 30,
          currency: form.currency,
          paymentDate: form.paymentDate || undefined,
          notes: form.notes || undefined,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      const created = await res.json()
      setPayments(p => [created, ...p])
      setForm({ amount: '', validDays: 30, currency: 'MDL', paymentDate: '', notes: '' })
      setShowForm(false)
      toast.success('Plată înregistrată')
      router.refresh()
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!confirm('Ștergi această plată?')) return
    try {
      const res = await fetch(`/api/admin/students/${studentId}/learning-payments?paymentId=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      setPayments(p => p.filter(x => x.id !== id))
      toast.success('Plată ștearsă')
      router.refresh()
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center gap-2">
        <BanknotesIcon className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">Plăți aplicație /learn</h3>
        <button onClick={() => setShowForm(s => !s)}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700">
          <PlusIcon className="w-3.5 h-3.5" /> {showForm ? 'Anulează' : 'Adaugă plată'}
        </button>
      </div>

      {/* Status banner */}
      {latest && (
        <div className={`px-4 py-3 border-b border-gray-100 ${
          isExpired ? 'bg-rose-50' : isExpiringSoon ? 'bg-amber-50' : 'bg-emerald-50'
        }`}>
          <div className="flex items-center gap-3 flex-wrap">
            {isExpired
              ? <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />
              : isExpiringSoon
                ? <ClockIcon className="w-5 h-5 text-amber-600" />
                : <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            }
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${
                isExpired ? 'text-rose-900' : isExpiringSoon ? 'text-amber-900' : 'text-emerald-900'
              }`}>
                {isExpired
                  ? `Abonament EXPIRAT (cu ${Math.abs(dLeft)} ${Math.abs(dLeft) === 1 ? 'zi' : 'zile'} în urmă)`
                  : isExpiringSoon
                    ? `Expiră în ${dLeft} ${dLeft === 1 ? 'zi' : 'zile'}`
                    : `Activ — mai sunt ${dLeft} zile`
                }
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Ultima plată: {latest.amount} {latest.currency} pe {formatDate(latest.paymentDate)} • Expiră: {formatDate(latest.expiresAt)}
              </div>
            </div>
          </div>
        </div>
      )}
      {!latest && (
        <div className="px-4 py-3 border-b border-gray-100 bg-slate-50 text-sm text-slate-600 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-slate-400" />
          Niciun abonament înregistrat.
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <form onSubmit={submit} className="px-4 py-4 border-b border-gray-100 bg-gray-50 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Suma *</label>
              <input type="number" step="0.01" required value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Monedă</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg">
                <option>MDL</option><option>EUR</option><option>USD</option><option>RON</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Valabil zile</label>
              <input type="number" min="1" value={form.validDays}
                onChange={e => setForm({ ...form, validDays: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Data plății</label>
              <input type="date" value={form.paymentDate}
                onChange={e => setForm({ ...form, paymentDate: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Notițe</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg" placeholder="opțional" />
          </div>
          <button type="submit" disabled={saving}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 disabled:opacity-50">
            {saving ? 'Se salvează...' : 'Înregistrează plata'}
          </button>
        </form>
      )}

      {/* History */}
      <div className="divide-y divide-gray-100">
        {payments.length === 0
          ? <div className="px-4 py-8 text-center text-gray-400 text-sm">Niciun istoric.</div>
          : payments.map(p => {
            const dl = daysLeft(p.expiresAt)
            const expired = dl < 0
            return (
              <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  expired ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <BanknotesIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">
                    {p.amount} {p.currency}
                    <span className="text-xs text-gray-400 font-normal ml-2">({p.validDays} zile)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span><CalendarDaysIcon className="inline w-3 h-3 mr-0.5" />{formatDate(p.paymentDate)}</span>
                    <span className="text-gray-300">→</span>
                    <span className={expired ? 'text-rose-600 font-semibold' : ''}>
                      {formatDate(p.expiresAt)}
                    </span>
                    {p.notes && <span className="text-gray-400">• {p.notes}</span>}
                  </div>
                </div>
                <button onClick={() => del(p.id)}
                  className="p-1.5 text-gray-400 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}
