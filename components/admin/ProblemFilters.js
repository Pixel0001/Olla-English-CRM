'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ProblemFilters({ topics = [], initial = {} }) {
  const router = useRouter()
  const sp = useSearchParams()
  const [topic, setTopic] = useState(initial.topic || '')
  const [difficulty, setDifficulty] = useState(initial.difficulty || '')
  const [type, setType] = useState(initial.type || '')
  const [q, setQ] = useState(initial.q || '')

  const apply = (e) => {
    e?.preventDefault?.()
    const params = new URLSearchParams()
    if (topic) params.set('topic', topic)
    if (difficulty) params.set('difficulty', difficulty)
    if (type) params.set('type', type)
    if (q) params.set('q', q)
    router.push('/admin/problems' + (params.toString() ? `?${params}` : ''))
  }

  const reset = () => {
    setTopic(''); setDifficulty(''); setType(''); setQ('')
    router.push('/admin/problems')
  }

  return (
    <form onSubmit={apply} className="bg-white rounded-xl border border-gray-200 p-3 xs:p-4 flex flex-wrap gap-2 xs:gap-3 items-end [&_label]:text-gray-700">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">Caută</label>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="titlu / cerință..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
        <select value={topic} onChange={e => setTopic(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white">  
          <option value="">Toate</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="min-w-[120px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">Dificultate</label>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white">
          <option value="">Toate</option>
          <option value="EASY">Ușor</option>
          <option value="MEDIUM">Mediu</option>
          <option value="HARD">Greu</option>
        </select>
      </div>
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">Tip</label>
        <select value={type} onChange={e => setType(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white">
          <option value="">Toate</option>
          <option value="MULTIPLE_CHOICE">Grilă</option>
          <option value="SHORT_ANSWER">Răspuns scurt</option>
          <option value="CODING">Cod</option>
          <option value="INPUT_OUTPUT">Input/Output</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          Filtrează
        </button>
        <button type="button" onClick={reset} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
          Reset
        </button>
      </div>
    </form>
  )
}
