'use client'

import { useEffect, useRef, useState } from 'react'
import MrOllaAvatar from './MrOllaAvatar'
import Markdown from '@/lib/markdown'

/**
 * Chat cu Mr. Olla pentru clarificări la o problemă.
 * Props:
 *  - token: string (acces /learn)
 *  - problemId, lessonId?
 *  - getCode: () => string  — pentru a trimite codul curent ca context
 *  - onClose: () => void
 */
export default function AiChat({ token, problemId, lessonId, getCode, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({ used: 0, limit: 5, remaining: 5 })
  const [initialLoading, setInitialLoading] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/public/learn/${token}/ai-chat?problemId=${problemId}`)
      .then(r => r.json())
      .then(d => {
        if (!alive) return
        if (d.messages) setMessages(d.messages)
        setInfo({ used: d.used ?? 0, limit: d.limit ?? 5, remaining: d.remaining ?? 5 })
      })
      .catch(() => {})
      .finally(() => { if (alive) setInitialLoading(false) })
    return () => { alive = false }
  }, [token, problemId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const send = async () => {
    const q = input.trim()
    if (!q || loading || info.remaining <= 0) return
    setInput('')
    setLoading(true)
    // optimistic
    const tmpUser = { id: `tmp-${Date.now()}`, role: 'user', content: q, createdAt: new Date().toISOString() }
    setMessages(m => [...m, tmpUser])
    try {
      const code = typeof getCode === 'function' ? (getCode() || '') : ''
      const r = await fetch(`/api/public/learn/${token}/ai-chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId, lessonId, question: q, code }),
      })
      const d = await r.json()
      if (!r.ok) {
        setMessages(m => m.filter(x => x.id !== tmpUser.id))
        setMessages(m => [...m, {
          id: `err-${Date.now()}`, role: 'assistant',
          content: `❌ ${d.error || 'Eroare'}`, createdAt: new Date().toISOString(),
        }])
        return
      }
      setMessages(m => [
        ...m.filter(x => x.id !== tmpUser.id),
        d.userMessage, d.assistantMessage,
      ])
      setInfo({ used: d.used, limit: d.limit, remaining: d.remaining })
    } catch (e) {
      setMessages(m => m.filter(x => x.id !== tmpUser.id))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-white shadow-lg overflow-hidden flex flex-col h-[70vh] sm:h-[480px] max-h-[640px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/95 flex items-center justify-center shadow p-0.5">
          <MrOllaAvatar size={32} />
        </div>
        <div className="flex-1">
          <div className="text-white font-bold text-sm flex items-center gap-1.5">
            Mr. Olla
            <span className="px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[9px] font-black rounded">AI</span>
          </div>
          <div className="text-indigo-100 text-[11px]">Îți dă indicii — niciodată soluția!</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl px-2" aria-label="Închide">×</button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50">
        {initialLoading ? (
          <div className="text-center text-xs text-slate-400 py-8">Se încarcă...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-8 px-4">
            <div className="flex justify-center mb-2"><MrOllaAvatar size={48} animated /></div>
            <div className="font-semibold text-slate-700">Bună! Eu sunt Mr. Olla.</div>
            <div className="text-xs mt-1">Întreabă-mă orice despre această problemă — îți dau indicii fără să-ți spun direct soluția.</div>
          </div>
        ) : (
          messages.map(m => <Bubble key={m.id} msg={m} />)
        )}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center p-0.5">
              <MrOllaAvatar size={26} animated />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-slate-500">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white p-2">
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <div className="text-[10px] text-slate-500">
            Întrebări rămase: <span className="font-bold text-slate-700">{info.remaining}/{info.limit}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={info.remaining <= 0 ? 'Limită atinsă pentru această problemă' : 'Scrie o întrebare...'}
            disabled={loading || info.remaining <= 0}
            maxLength={500}
            className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none disabled:bg-slate-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading || info.remaining <= 0}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm disabled:opacity-40"
          >
            Trimite
          </button>
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${isUser ? 'bg-blue-100 text-sm' : 'bg-indigo-100 p-0.5'}`}>
        {isUser ? '🧑' : <MrOllaAvatar size={26} />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-sm whitespace-pre-wrap'
          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
      }`}>
        {isUser ? msg.content : <Markdown text={msg.content} compact />}
      </div>
    </div>
  )
}
