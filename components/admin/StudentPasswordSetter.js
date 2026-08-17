'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { KeyIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function StudentPasswordSetter({ studentId, hasPassword: initialHasPassword }) {
  const [pwd, setPwd] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasPassword, setHasPassword] = useState(initialHasPassword)

  const save = async () => {
    if (pwd.length < 4) return toast.error('Minim 4 caractere')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      toast.success('Parola a fost setată')
      setPwd('')
      setHasPassword(true)
    } catch (e) { toast.error(e.message) } finally { setSaving(false) }
  }

  const clear = async () => {
    if (!confirm('Ștergi parola?')) return
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: null }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Eroare')
      toast.success('Parola a fost ștearsă')
      setHasPassword(false)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-5">
      <div className="flex items-center gap-2 mb-3">
        <KeyIcon className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Parolă acces</h3>
        {hasPassword && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Setată</span>}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            autoComplete="new-password"
            placeholder={hasPassword ? 'Schimbă parola...' : 'Setează parola...'}
            className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
            {show ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
        <button onClick={save} disabled={saving || !pwd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
          {saving ? '...' : 'Salvează'}
        </button>
        {hasPassword && (
          <button onClick={clear} title="Șterge parola"
            className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition">
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">Minim 4 caractere. Parola se folosește pentru login alternativ (token-ul rămâne principal).</p>
    </div>
  )
}
