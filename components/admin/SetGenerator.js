'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const DIFF_LABEL = { EASY: '🟢', MEDIUM: '🟡', HARD: '🔴' }

export default function SetGenerator({ students = [], problems = [], topics = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('random') // 'random' | 'manual'

  // Setări comune
  const [title, setTitle] = useState('')
  const [studentId, setStudentId] = useState('')
  const [explanationPolicy, setExplanationPolicy] = useState('AFTER_ANSWER')
  const [timeLimit, setTimeLimit] = useState('')

  // Random
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [count, setCount] = useState(5)
  const [useMix, setUseMix] = useState(false)
  const [mixEasy, setMixEasy] = useState(2)
  const [mixMedium, setMixMedium] = useState(2)
  const [mixHard, setMixHard] = useState(1)
  const [avoidRecent, setAvoidRecent] = useState(true)

  // Manual
  const [search, setSearch] = useState('')
  const [filterTopic, setFilterTopic] = useState('')
  const [selected, setSelected] = useState(new Set())

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      if (filterTopic && p.topic !== filterTopic) return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.topic.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [problems, filterTopic, search])

  const toggleSelect = (id) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  // Estimare: câte probleme vor fi din random
  const randomMatchCount = useMemo(() => {
    return problems.filter(p =>
      (!topic || p.topic === topic) &&
      (!difficulty || useMix || p.difficulty === difficulty)
    ).length
  }, [problems, topic, difficulty, useMix])

  const submit = async () => {
    if (!title.trim()) {
      toast.error('Adaugă un titlu')
      return
    }
    if (mode === 'manual' && selected.size === 0) {
      toast.error('Selectează cel puțin o problemă')
      return
    }
    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        studentId: studentId || undefined,
        explanationPolicy,
        timeLimit: timeLimit ? Number(timeLimit) : null,
        mode,
        problemIds: mode === 'manual' ? [...selected] : [],
        random: mode === 'random' ? {
          topic: topic || undefined,
          difficulty: useMix ? undefined : (difficulty || undefined),
          count: Number(count) || 5,
          mix: useMix ? { EASY: Number(mixEasy)||0, MEDIUM: Number(mixMedium)||0, HARD: Number(mixHard)||0 } : undefined,
          avoidRecent,
        } : {},
      }
      const res = await fetch('/api/admin/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Eroare')
      toast.success('Set creat!')
      router.push(`/admin/problems/sets/${data.id}`)
      router.refresh()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Setări comune */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">⚙️ Setări set</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titlu set *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="ex: Test loops & condiții"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Elev (opțional)</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">— Niciun elev anume —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Politică explicații <span className="text-amber-600">🔐</span>
            </label>
            <select value={explanationPolicy} onChange={e => setExplanationPolicy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="AFTER_ANSWER">⏸ După ce răspunde la fiecare</option>
              <option value="AFTER_SET">🏁 Doar după ce termină setul</option>
              <option value="ALWAYS">✅ Vezi oricând</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limită timp (min, opțional)</label>
            <input type="number" min="1" value={timeLimit} onChange={e => setTimeLimit(e.target.value)}
              placeholder="ex: 30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Mode switch */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setMode('random')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'random' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}>
          🎲 Random Smart
        </button>
        <button onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}>
          ✋ Selecție manuală
        </button>
      </div>

      {mode === 'random' && (
        <section className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">🎲 Generator automat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Toate</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificultate</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                disabled={useMix}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100">
                <option value="">Toate</option>
                <option value="EASY">🟢 Ușor</option>
                <option value="MEDIUM">🟡 Mediu</option>
                <option value="HARD">🔴 Greu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Număr probleme</label>
              <input type="number" min="1" max="50" value={count}
                disabled={useMix}
                onChange={e => setCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100" />
            </div>
          </div>

          <div className="border-t pt-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={useMix} onChange={e => setUseMix(e.target.checked)}
                className="w-4 h-4 text-indigo-600" />
              Mix dificultăți (override numărul de probleme)
            </label>
            {useMix && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">🟢 Ușor</label>
                  <input type="number" min="0" value={mixEasy} onChange={e => setMixEasy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">🟡 Mediu</label>
                  <input type="number" min="0" value={mixMedium} onChange={e => setMixMedium(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">🔴 Greu</label>
                  <input type="number" min="0" value={mixHard} onChange={e => setMixHard(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={avoidRecent} onChange={e => setAvoidRecent(e.target.checked)}
              className="w-4 h-4 text-indigo-600" />
            Evită problemele rezolvate de elev în ultimele 30 zile
          </label>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800">
            💡 Sunt <strong>{randomMatchCount}</strong> probleme care se potrivesc filtrului. Vor fi alese random {useMix ? `${(Number(mixEasy)||0)+(Number(mixMedium)||0)+(Number(mixHard)||0)}` : count}.
          </div>
        </section>
      )}

      {mode === 'manual' && (
        <section className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">✋ Selecție manuală</h2>
          <div className="flex flex-wrap gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută..."
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Toate topicurile</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <span className="px-3 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
              {selected.size} selectate
            </span>
          </div>
          <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto divide-y divide-gray-100">
            {filteredProblems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Nicio problemă găsită</div>
            ) : filteredProblems.map(p => (
              <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                  className="w-4 h-4 text-indigo-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{p.title}</div>
                  <div className="text-xs text-gray-500">
                    {DIFF_LABEL[p.difficulty]} {p.topic} • {p.points} pct
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Anulează
        </button>
        <button type="button" onClick={submit} disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
          {loading ? 'Se generează...' : '✨ Generează set'}
        </button>
      </div>
    </div>
  )
}
