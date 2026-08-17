'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  ChatBubbleLeftIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const statusConfig = {
  LEAD: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  FARA_RASPUNS: { label: '🔘 Fără Răspuns', color: 'bg-gray-100 text-gray-700' },
  CONTACTAT: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  PROGRAMAT: { label: '🟠 Programat', color: 'bg-orange-100 text-orange-800' },
  PRIMA_LECTIE: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  FINALIZAT_LECTIA: { label: '⚫ Finalizat Lecția', color: 'bg-slate-200 text-slate-800' },
  SE_GANDESTE: { label: '🔘 Se Gândește', color: 'bg-gray-100 text-gray-600' },
  ASTEPTAM_PLATA: { label: '💵 Așteptăm Plata', color: 'bg-amber-100 text-amber-800' },
  PLATIT: { label: '💰 Plătit', color: 'bg-emerald-100 text-emerald-800' },
  STUDIAZA: { label: '🟣 Studiază', color: 'bg-purple-100 text-purple-800' },
  PLECAT: { label: '🔴 Plecat', color: 'bg-red-100 text-red-800' },
  LOST_LEAD: { label: '❌ Lost Lead', color: 'bg-red-200 text-red-900' },
  TEST: { label: '🧪 Test', color: 'bg-cyan-100 text-cyan-800' },
  NOU: { label: '🔵 Lead', color: 'bg-blue-100 text-blue-800' },
  CITIT: { label: '🟡 Contactat', color: 'bg-yellow-100 text-yellow-800' },
  RASPUNS: { label: '🟢 Prima Lecție', color: 'bg-green-100 text-green-800' },
  ARHIVAT: { label: '⚫ Finalizat Lecția', color: 'bg-slate-200 text-slate-800' }
}

const allStatuses = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'FARA_RASPUNS', label: 'Fără Răspuns' },
  { value: 'CONTACTAT', label: 'Contactat' },
  { value: 'PROGRAMAT', label: 'Programat' },
  { value: 'PRIMA_LECTIE', label: 'Prima Lecție' },
  { value: 'FINALIZAT_LECTIA', label: 'Finalizat Lecția' },
  { value: 'SE_GANDESTE', label: 'Se Gândește' },
  { value: 'ASTEPTAM_PLATA', label: 'Așteptăm Plata' },
  { value: 'PLATIT', label: 'Plătit' },
  { value: 'STUDIAZA', label: 'Studiază' },
  { value: 'PLECAT', label: 'Plecat' },
  { value: 'LOST_LEAD', label: 'Lost Lead' },
  { value: 'TEST', label: 'Test' },
]

const statusMappings = {
  'NOU': ['NOU', 'LEAD'],
  'LEAD': ['NOU', 'LEAD'],
  'CITIT': ['CITIT', 'CONTACTAT'],
  'CONTACTAT': ['CITIT', 'CONTACTAT'],
  'RASPUNS': ['RASPUNS', 'PRIMA_LECTIE'],
  'PRIMA_LECTIE': ['RASPUNS', 'PRIMA_LECTIE'],
  'ARHIVAT': ['ARHIVAT', 'FINALIZAT_LECTIA'],
  'FINALIZAT_LECTIA': ['ARHIVAT', 'FINALIZAT_LECTIA'],
}

const ITEMS_PER_PAGE = 10

export default function ContactClient({ messages, stats }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef(null)

  // Filter messages based on search and status
  const filteredMessages = useMemo(() => {
    let result = messages

    // Filter by status
    if (statusFilter) {
      const statusesToMatch = statusMappings[statusFilter] || [statusFilter]
      result = result.filter(m => statusesToMatch.includes(m.status))
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      result = result.filter(m => 
        m.name?.toLowerCase().includes(searchLower) ||
        m.phone?.toLowerCase().includes(searchLower) ||
        m.email?.toLowerCase().includes(searchLower) ||
        m.message?.toLowerCase().includes(searchLower)
      )
    }

    return result
  }, [messages, search, statusFilter])

  // Get displayed messages (infinite scroll)
  const displayedMessages = filteredMessages.slice(0, displayCount)
  const hasMore = displayCount < filteredMessages.length

  // Reset display count when filters change
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setDisplayCount(ITEMS_PER_PAGE)
  }

  // Load more function
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE)
    }
  }, [hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadMore])

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Mesaje Contact</h1>
        <p className="text-sm xs:text-base text-gray-600">Mesajele primite din formularul de contact</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">Total</p>
          <p className="text-xl xs:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🔵 Lead</p>
          <p className="text-xl xs:text-2xl font-bold text-blue-600">{stats.lead}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🟡 Contactat</p>
          <p className="text-xl xs:text-2xl font-bold text-yellow-600">{stats.contactat}</p>
        </div>
        <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
          <p className="text-xs xs:text-sm text-gray-500">🟠 Programat</p>
          <p className="text-xl xs:text-2xl font-bold text-orange-600">{stats.programat}</p>
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-3 xs:p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Caută după nume, telefon, email, mesaj..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f]"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="block w-full sm:w-auto px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#30919f] focus:border-[#30919f]"
            >
              <option value="">Toate statusurile</option>
              {allStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-2 text-xs text-gray-500">
          {filteredMessages.length === messages.length 
            ? `${messages.length} mesaje total`
            : `${filteredMessages.length} din ${messages.length} mesaje`
          }
        </div>
      </div>

      {/* Lista mesaje */}
      {displayedMessages.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <InboxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {search || statusFilter 
              ? 'Nu s-au găsit mesaje cu aceste criterii' 
              : 'Nu există mesaje încă'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedMessages.map((message) => {
            const status = statusConfig[message.status] || statusConfig.NOU
            
            return (
              <Link
                key={message.id}
                href={`/admin/contact/${message.id}`}
                className={`block bg-white rounded-xl p-3 xs:p-4 border hover:border-[#30919f] hover:shadow-md transition-all ${
                  message.status === 'NOU' || message.status === 'LEAD' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 xs:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm xs:text-base truncate max-w-[150px] xs:max-w-none">{message.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex flex-col xs:flex-row xs:flex-wrap gap-1 xs:gap-x-4 xs:gap-y-1 text-xs xs:text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1 min-w-0">
                        <EnvelopeIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                        <span className="truncate">{message.email}</span>
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3 xs:h-4 xs:w-4 flex-shrink-0" />
                          {message.phone}
                        </span>
                      )}
                    </div>

                    <p className="text-xs xs:text-sm text-gray-700 line-clamp-2">
                      <ChatBubbleLeftIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1 text-gray-400" />
                      {message.message}
                    </p>
                  </div>

                  <div className="text-left xs:text-right text-xs text-gray-400 whitespace-nowrap">
                    <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 inline mr-1" />
                    {new Date(message.createdAt).toLocaleDateString('ro-RO', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </Link>
            )
          })}
          
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div 
              ref={loadMoreRef} 
              className="flex justify-center py-4"
            >
              <div className="animate-pulse text-gray-400 text-sm">
                Se încarcă mai multe...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
