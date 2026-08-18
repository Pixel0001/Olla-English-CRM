'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PlayCircleIcon } from '@heroicons/react/24/outline'

const toLocalInput = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Pornirea unei lecții din panoul de admin, la orice dată — fără restricțiile
 * de orar ale profesorului.
 *
 * Se notează cine a ținut-o de fapt: profesorul (lecția s-a ținut, dar nu a
 * fost pornită la timp) sau administrația. Nota rămâne pe sesiune, ca să se
 * știe mai târziu de ce apare acolo.
 */
export default function AdminStartSessionButton({ groupId, teacherName }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [when, setWhen] = useState(() => toLocalInput(new Date()))
  const [heldBy, setHeldBy] = useState('teacher')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const start = async (e) => {
    e.preventDefault()
    const date = new Date(when)
    if (isNaN(date.getTime())) return toast.error('Dată invalidă')
    if (date.getTime() > Date.now()) {
      return toast.error('O lecție nu poate fi înregistrată cu dată în viitor')
    }

    const label =
      heldBy === 'teacher'
        ? `Lecție ținută de profesor${teacherName ? ` (${teacherName})` : ''}, înregistrată din admin`
        : 'Lecție ținută de administrație'

    setSaving(true)
    try {
      const res = await fetch('/api/teacher/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          customDate: date.toISOString(),
          notes: note.trim() ? `${label} — ${note.trim()}` : label,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare la pornirea lecției')

      toast.success('Lecție înregistrată — marchează prezențele')
      router.push(`/teacher/groups/${groupId}/session/${data.id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <PlayCircleIcon className="h-4 w-4" />
        Pornește lecția
      </button>
    )
  }

  return (
    <form
      onSubmit={start}
      className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-3 space-y-3 w-full"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Data și ora lecției</label>
          <input
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Cine a ținut lecția</label>
          <select
            value={heldBy}
            onChange={(e) => setHeldBy(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="teacher">
              Profesorul{teacherName ? ` (${teacherName})` : ''} — doar nu a pornit-o
            </option>
            <option value="admin">Administrația — am ținut-o noi</option>
          </select>
        </div>
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notiță (opțional): de ce se înregistrează din admin"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <p className="text-[11px] text-gray-500">
        Lecția se creează la data aleasă, fără restricțiile de orar. Urmează ecranul de prezențe,
        iar lecțiile se scad din pachetele elevilor abia când confirmi acolo.
      </p>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Se creează…' : 'Pornește și marchează prezențele'}
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
  )
}
