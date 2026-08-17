'use client'

import { useState } from 'react'
import { BoltIcon, ArrowPathIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function GenerateTokenButton({ studentId, initialToken }) {
  const [token, setToken] = useState(initialToken || '')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    const isRegen = !!token
    const ok = isRegen
      ? confirm('Dacă regenerezi tokenul, linkul vechi va deveni invalid și elevul nu va mai putea accesa /learn cu el. Continui?')
      : true
    if (!ok) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/students/${studentId}/generate-token`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare server')
      setToken(data.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!token) return
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    await navigator.clipboard.writeText(`${origin}/learn/${token}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <BoltIcon className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
          Link acces /learn
        </span>
      </div>

      {token ? (
        <div className="mb-2">
          <a
            href={`/learn/${token}`}
            target="_blank"
            className="text-xs font-mono text-indigo-700 break-all hover:underline"
          >
            /learn/{token}
          </a>
          <div className="text-[10px] text-indigo-400 mt-0.5">
            Token: <span className="font-mono">{token}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-indigo-500 mb-2">Niciun token generat încă.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Se generează…' : token ? 'Regenerează token' : 'Generează token'}
        </button>

        {token && (
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
            {copied ? 'Copiat!' : 'Copiază link'}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}
