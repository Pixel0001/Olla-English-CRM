'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { usePermissions } from '@/hooks/usePermissions'
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

const PLATFORMS = [
  { value: 'messenger', label: 'Messenger', emoji: '💬' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
]

const timeLabel = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return 'acum'
  if (min < 60) return `${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} h`
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', timeZone: 'Europe/Chisinau' })
}

const fullTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('ro-RO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Chisinau',
      })
    : ''

export default function MessagesClient() {
  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()

  const [platform, setPlatform] = useState('messenger')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [thread, setThread] = useState([])
  const [threadLoading, setThreadLoading] = useState(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const canSend = hasPermission('messages.send') || isSuperAdmin

  useEffect(() => {
    if (!hasPermission('messages.view') && !isSuperAdmin) router.push('/admin')
  }, [hasPermission, isSuperAdmin, router])

  const load = useCallback(async (which, { refresh = false } = {}) => {
    refresh ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/messages?platform=${which}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.hint || json.error || 'Eroare la citirea mesajelor')
      setData(json)
      setSelected(null)
      setThread([])
      setDraft('')
      if (refresh) toast.success('Mesajele au fost actualizate')
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load(platform) }, [platform, load])

  const loadMore = async () => {
    if (!data?.next) return
    setLoadingMore(true)
    try {
      const res = await fetch(`/api/admin/messages?platform=${platform}&after=${encodeURIComponent(data.next)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Eroare')
      setData((prev) => ({
        ...prev,
        conversations: [...prev.conversations, ...json.conversations],
        next: json.next,
      }))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const openThread = async (conversation) => {
    setSelected(conversation)
    setThreadLoading(true)
    setThread([])
    try {
      const res = await fetch(`/api/admin/messages?conversation=${encodeURIComponent(conversation.id)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Eroare la citirea conversației')
      setThread(json.messages || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setThreadLoading(false)
    }
  }

  // 24h pentru un răspuns obișnuit, 7 zile cu eticheta de agent uman
  const lastFromPerson = [...thread].reverse().find((m) => !m.fromPage)
  const sinceLast = lastFromPerson
    ? Date.now() - new Date(lastFromPerson.createdTime).getTime()
    : null
  const HOUR = 60 * 60 * 1000
  const asHumanAgent = sinceLast != null && sinceLast > 24 * HOUR && sinceLast <= 7 * 24 * HOUR
  const windowClosed = sinceLast != null
    ? sinceLast > 7 * 24 * HOUR
    : thread.length > 0

  const send = async (e) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || !selected?.person?.id) return

    setSending(true)
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: selected.person.id, text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Mesajul nu a putut fi trimis')

      // Îl punem în fir imediat, ca într-un chat normal
      setThread((prev) => [...prev, {
        id: json.messageId || `local-${Date.now()}`,
        createdTime: json.sentAt,
        text,
        fromPage: true,
        fromName: 'noi',
        humanAgent: json.humanAgent,
      }])
      if (json.humanAgent) toast.success('Trimis ca răspuns de agent uman')
      setDraft('')
      setData((prev) => prev && ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === selected.id ? { ...c, snippet: text, updatedTime: json.sentAt, unreadCount: 0 } : c
        ),
      }))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const conversations = useMemo(() => {
    const list = data?.conversations || []
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter((c) =>
      c.person.name.toLowerCase().includes(q) ||
      (c.person.username || '').toLowerCase().includes(q) ||
      (c.snippet || '').toLowerCase().includes(q)
    )
  }, [data, search])

  return (
    <div className="space-y-4">
      {/* Antet */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Mesaje</h1>
          <p className="text-sm xs:text-base text-gray-600">
            {data?.page?.name
              ? `Conversațiile paginii ${data.page.name}`
              : 'Conversațiile de pe Messenger și Instagram'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(platform, { refresh: true })}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 self-start"
        >
          <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Se actualizează…' : 'Actualizează'}
        </button>
      </div>

      {/* Platforme + căutare */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPlatform(p.value)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                platform === p.value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[12rem] max-w-sm">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Caută după nume sau text…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {data?.stats && (
          <div className="flex flex-wrap gap-2 text-xs ml-auto">
            <Chip label="conversații" value={data.stats.total} />
            {data.stats.unread > 0 && <Chip label="necitite" value={data.stats.unread} tone="amber" />}
            <Chip label="în 24h" value={data.stats.last24h} tone="emerald" />
            <Chip label="în 7 zile" value={data.stats.last7d} />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Nu s-au putut citi mesajele</p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[22rem_1fr] gap-3 items-start">
          {/* Lista de conversații */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {conversations.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">
                {search ? 'Nicio conversație care să se potrivească.' : 'Nicio conversație încă.'}
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => openThread(c)}
                      className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                        selected?.id === c.id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {c.person.name}
                          {c.person.username && (
                            <span className="ml-1 text-xs font-normal text-gray-400">@{c.person.username}</span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeLabel(c.updatedTime)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{c.snippet || '—'}</p>
                      {c.unreadCount > 0 && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium">
                          {c.unreadCount} necitite
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {data?.next && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border-t border-gray-100 disabled:opacity-60"
              >
                {loadingMore ? 'Se încarcă…' : 'Încarcă mai multe'}
              </button>
            )}
          </div>

          {/* Firul de discuție */}
          <div className="bg-white rounded-xl border border-gray-200 min-h-[24rem]">
            {!selected ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 text-gray-500">
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm">Alege o conversație din stânga ca să vezi mesajele.</p>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{selected.person.name}</p>
                    <p className="text-xs text-gray-500">
                      {PLATFORMS.find((p) => p.value === selected.platform)?.label}
                      {selected.messageCount ? ` · ${selected.messageCount} mesaje` : ''}
                      {selected.updatedTime ? ` · ultimul: ${fullTime(selected.updatedTime)}` : ''}
                    </p>
                  </div>
                </div>

                {threadLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                  </div>
                ) : thread.length === 0 ? (
                  <p className="p-6 text-sm text-gray-500 text-center">Conversația nu are mesaje de afișat.</p>
                ) : (
                  <div className="p-4 space-y-2 max-h-[62vh] overflow-y-auto">
                    {thread.map((m) => (
                      <div key={m.id} className={`flex ${m.fromPage ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                            m.fromPage
                              ? 'bg-indigo-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          {m.text ? (
                            <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                          ) : (
                            <p className="text-sm italic opacity-70">(atașament)</p>
                          )}
                          <p className={`text-[10px] mt-0.5 ${m.fromPage ? 'text-indigo-100' : 'text-gray-400'}`}>
                            {m.fromPage ? 'noi' : m.fromName} · {fullTime(m.createdTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {canSend ? (
                  <form onSubmit={send} className="border-t border-gray-100 p-3 space-y-2">
                    {windowClosed ? (
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                        Au trecut peste 7 zile de la ultimul mesaj al persoanei. Meta nu mai permite
                        niciun răspuns — nici ca agent uman. Trebuie să scrie ea din nou.
                      </p>
                    ) : asHumanAgent ? (
                      <p className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1.5">
                        Au trecut peste 24 de ore, deci mesajul pleacă marcat ca răspuns de agent
                        uman — permis până la 7 zile de la ultimul mesaj al persoanei.
                      </p>
                    ) : null}
                    <div className="flex items-end gap-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                        }}
                        rows={2}
                        placeholder="Scrie răspunsul… (Enter trimite, Shift+Enter rând nou)"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                      <button
                        type="submit"
                        disabled={sending || !draft.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                        {sending ? 'Se trimite…' : 'Trimite'}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Mesajul pleacă în numele paginii {data?.page?.name || ''}.
                    </p>
                  </form>
                ) : (
                  <p className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-500">
                    Nu ai permisiunea de a răspunde — cere-i unui superadmin dreptul „Răspunde la mesaje".
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Chip({ label, value, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-gray-100 text-gray-700',
    amber: 'bg-amber-100 text-amber-800',
    emerald: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span className={`px-2 py-1 rounded-lg font-medium ${tones[tone]}`}>
      {value} {label}
    </span>
  )
}
