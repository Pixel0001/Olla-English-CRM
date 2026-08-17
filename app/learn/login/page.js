'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AcademicCapIcon, EyeIcon, EyeSlashIcon,
  ArrowRightIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

export default function LearnLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/public/learn/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Eroare')
        return
      }
      // Redirecționează către dashboard-ul elevului
      router.push(`/learn/${data.token}`)
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <Link href="/learn"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition">
            {'←'} Înapoi la platformă
          </Link>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <AcademicCapIcon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Bun venit înapoi!</h1>
          <p className="text-white/50 text-sm mt-1">Intră în contul tău Olla English</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={submit} className="space-y-4">
            {/* Identifier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                Email / Telefon / Nume
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                placeholder="ex: ion.popescu@gmail.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1.5">
                Parolă
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Parola ta"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition">
                  {showPwd
                    ? <EyeSlashIcon className="w-5 h-5" />
                    : <EyeIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-400/40 text-rose-200 text-sm px-4 py-3 rounded-xl">
                <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-amber-900 font-extrabold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-amber-900/40 border-t-amber-900 rounded-full animate-spin" />
              ) : (
                <>Intră în cont <ArrowRightIcon className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            Nu ai cont? Contactează profesorul pentru a primi acces.
          </p>

          {/* Divider + Guest CTA */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">sau</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <Link
            href="/learn/guest"
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-sm transition"
          >
            Încearcă în mod demo (fără cont)
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Token fallback hint */}
        <p className="text-center text-white/20 text-xs mt-4">
          Ai un link personal? Folosește-l direct — nu ai nevoie de parolă.
        </p>
      </div>
    </div>
  )
}
