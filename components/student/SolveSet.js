'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'

const DIFF = { EASY: { label: '🟢 Ușor', color: 'bg-green-100 text-green-700' },
              MEDIUM: { label: '🟡 Mediu', color: 'bg-yellow-100 text-yellow-700' },
              HARD: { label: '🔴 Greu', color: 'bg-red-100 text-red-700' } }
function seededShuffle(arr, seed) {
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
function fmtTime(seconds) {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function SolveSet({ token }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [feedback, setFeedback] = useState(null) // { isCorrect, explanation, correctAnswer }
  const [timer, setTimer] = useState(0) // secunde elapsed pe problema curentă
  const [orderItems, setOrderItems] = useState([]) // pentru ORDER_IMAGES
  const [fillAnswers, setFillAnswers] = useState([]) // pentru FILL_IN
  const startRef = useRef(Date.now())
  const codeAreaRef = useRef(null)
  const dragRef = useRef(null) // index-ul elementului drag-at curent

  const handleCodeKeyDown = useCallback((e) => {
    const ta = e.target
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const val   = ta.value

    const apply = (newVal, cursorPos, cursorEnd) => {
      e.preventDefault()
      setAnswer(newVal)
      requestAnimationFrame(() => {
        if (!codeAreaRef.current) return
        codeAreaRef.current.setSelectionRange(cursorPos, cursorEnd ?? cursorPos)
      })
    }

    if (e.key === 'Tab') {
      apply(val.slice(0, start) + '    ' + val.slice(end), start + 4)
      return
    }

    if (e.key === 'Enter') {
      const lineStart  = val.lastIndexOf('\n', start - 1) + 1
      const linePrefix = val.slice(lineStart, start)
      const indent     = linePrefix.match(/^([ \t]*)/)[1]
      const trimmed    = linePrefix.trim()
      const deindent   = /^(break|continue|return|pass)(\s.*)?$/.test(trimmed)
      const extraIndent = !deindent && linePrefix.trimEnd().endsWith(':') ? '    ' : ''
      const newIndent  = deindent && indent.length >= 4 ? indent.slice(4) : indent
      apply(val.slice(0, start) + '\n' + newIndent + extraIndent + val.slice(end), start + 1 + newIndent.length + extraIndent.length)
      return
    }

    const PAIRS = { '(': ')', '[': ']', '{': '}', "'": "'", '"': '"' }
    if (PAIRS[e.key]) {
      const close = PAIRS[e.key]
      const selected = val.slice(start, end)
      const newVal = val.slice(0, start) + e.key + selected + close + val.slice(end)
      start !== end ? apply(newVal, start + 1, end + 1) : apply(newVal, start + 1)
      return
    }

    if (e.key === 'Backspace' && start === end) {
      const before = val.slice(0, start)
      if (before.endsWith('    ')) {
        apply(val.slice(0, start - 4) + val.slice(end), start - 4)
        return
      }
    }

    if (['}', ']', ')'].includes(e.key) && start === end && val[start] === e.key) {
      e.preventDefault()
      requestAnimationFrame(() => codeAreaRef.current?.setSelectionRange(start + 1, start + 1))
      return
    }
  }, [setAnswer])

  // Fetch set
  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/public/sets/${token}`, { cache: 'no-store' })
      if (!res.ok) {
        toast.error('Setul nu a fost găsit')
        setData(null)
        return
      }
      const d = await res.json()
      setData(d)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [token])

  // Reset state când schimbăm problema
  useEffect(() => {
    setAnswer('')
    setShowHint(false)
    setShowExplanation(false)
    setFeedback(null)
    setTimer(0)
    startRef.current = Date.now()
    if (data?.problems?.[currentIdx]?.attempt) {
      setAnswer(data.problems[currentIdx].attempt.answer || '')
    }
    // Init ORDER_IMAGES: amestecă imaginile
    const prob = data?.problems?.[currentIdx]
    if (prob?.type === 'ORDER_IMAGES' && prob.options?.length) {
      const seed = prob.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const shuffled = seededShuffle([...prob.options], seed)
      setOrderItems(shuffled)
      setAnswer(JSON.stringify(shuffled))
    } else {
      setOrderItems([])
    }
    // Init FILL_IN
    if (prob?.type === 'FILL_IN' && prob.options?.length) {
      const blanks = new Array(prob.options.length).fill('')
      setFillAnswers(blanks)
      setAnswer('[]')
    } else {
      setFillAnswers([])
    }
  }, [currentIdx, data?.set?.id])

  // Timer per problemă
  useEffect(() => {
    const id = setInterval(() => {
      setTimer(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [currentIdx])

  // Pornește setul automat la prima vizită
  useEffect(() => {
    if (data && !data.set.startedAt) {
      fetch(`/api/public/sets/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      }).catch(() => {})
    }
  }, [data?.set?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Set inexistent</h1>
        <p className="text-gray-600 mt-2">Linkul este invalid sau a fost șters.</p>
      </div>
    )
  }

  const { set, problems, score } = data
  const total = problems.length
  const current = problems[currentIdx]
  const isCompleted = !!set.completedAt
  const policy = set.explanationPolicy

  const submitAnswer = async () => {
    const isAnswerEmpty = () => {
      if (current.type === 'ORDER_IMAGES') return orderItems.length === 0
      if (current.type === 'FILL_IN') return fillAnswers.every(a => !a?.trim())
      return !answer.trim()
    }
    if (isAnswerEmpty()) {
      toast.error('Scrie un răspuns')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/public/sets/${token}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: current.id, answer, timeSpent: timer }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Eroare')
      setFeedback(d)
      if (d.isCorrect) {
        toast.success(`✅ Corect! +${d.pointsAwarded} pct`)
      } else {
        toast.error('❌ Răspuns greșit. Mai încearcă!')
      }
      // Reload pentru a actualiza scor + attempt
      await load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const completeSet = async () => {
    if (!confirm('Ești sigur că vrei să finalizezi setul? Nu vei mai putea trimite răspunsuri.')) return
    try {
      await fetch(`/api/public/sets/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })
      toast.success('Set finalizat! 🎉')
      await load()
    } catch {}
  }

  // Decide dacă afișăm butonul "Vezi explicația"
  const canSeeExplanationNow = (() => {
    if (policy === 'ALWAYS') return true
    if (policy === 'AFTER_ANSWER') return !!current.attempt || !!feedback
    if (policy === 'AFTER_SET') return isCompleted
    return false
  })()

  const explanationText = feedback?.explanation || current.explanation
  const correctAnswerText = feedback?.correctAnswer || current.correctAnswer

  // Progress
  const answeredCount = problems.filter(p => p.attempt).length
  const correctCount = problems.filter(p => p.attempt?.isCorrect).length
  const allAnswered = answeredCount === total

  return (
    <div className="max-w-4xl mx-auto p-3 xs:p-6 space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 xs:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900">{set.title}</h1>
            {set.student && (
              <p className="text-sm text-gray-600 mt-1">👤 {set.student.fullName}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Scor</div>
            <div className="text-xl xs:text-2xl font-bold text-indigo-600">
              {score.earnedPoints} / {score.totalPoints} <span className="text-sm text-gray-500">pct</span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              ✅ {correctCount} corecte • {answeredCount}/{total} răspunse
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progres</span>
            <span>{Math.round((answeredCount / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Problem nav pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {problems.map((p, i) => {
            const cls = i === currentIdx
              ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
              : p.attempt?.isCorrect
                ? 'bg-emerald-100 text-emerald-700'
                : p.attempt
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            return (
              <button key={p.id} onClick={() => setCurrentIdx(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${cls}`}>
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Problem card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 xs:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Problema {currentIdx + 1}/{total}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${DIFF[current.difficulty]?.color}`}>
              {DIFF[current.difficulty]?.label}
            </span>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
              {current.topic}
            </span>
            <span className="text-xs text-gray-500">⏱ {fmtTime(timer)}</span>
          </div>
          <span className="text-sm font-semibold text-indigo-600">{current.points} pct</span>
        </div>

        <h2 className="text-lg font-bold text-gray-900">{current.title}</h2>

        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100">
          {current.description}
        </div>

        {current.starterCode && (
          <details className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden">
            <summary className="px-4 py-2 cursor-pointer text-xs uppercase tracking-wide bg-slate-800">
              Cod de start
            </summary>
            <pre className="p-4 text-xs overflow-x-auto"><code>{current.starterCode}</code></pre>
          </details>
        )}

        {/* Answer area */}
        {!isCompleted && (
          <div className="space-y-3">
            {current.type === 'MULTIPLE_CHOICE' ? (
              <div className="space-y-2">
                {current.options.map((opt, i) => (
                  <label key={i} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    answer === opt ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="opt"
                      value={opt}
                      checked={answer === opt}
                      onChange={e => setAnswer(e.target.value)}
                      disabled={current.attempt?.isCorrect}
                      className="mt-1 w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm text-gray-800 flex-1">{opt}</span>
                  </label>
                ))}
              </div>
            ) : current.type === 'ORDER_IMAGES' ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium">Trage imaginile pentru a le aranja în ordinea corectă 🗐️</p>
                {orderItems.map((url, i) => (
                  <div
                    key={url}
                    draggable={!current.attempt?.isCorrect}
                    onDragStart={() => { dragRef.current = i }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault()
                      const from = dragRef.current
                      if (from === i || from == null) return
                      const arr = [...orderItems]
                      const [item] = arr.splice(from, 1)
                      arr.splice(i, 0, item)
                      dragRef.current = null
                      setOrderItems(arr)
                      setAnswer(JSON.stringify(arr))
                    }}
                    onDragEnd={() => { dragRef.current = null }}
                    className={`flex items-center gap-3 bg-white border-2 rounded-xl p-2 transition select-none
                      ${current.attempt?.isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-indigo-400 cursor-grab active:cursor-grabbing active:border-indigo-500 active:shadow-md active:scale-[1.02]'}`}
                  >
                    {!current.attempt?.isCorrect && (
                      <span className="text-slate-300 text-lg select-none px-1">☰</span>
                    )}
                    <span className="text-sm font-bold text-slate-400 w-6 text-center shrink-0">{i+1}</span>
                    <img src={url} alt={`poz-${i+1}`} className="w-24 h-24 object-cover rounded-xl border border-gray-200 shrink-0 pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : current.type === 'FILL_IN' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">Completează spațiile libere:</p>
                {(current.options || []).map((q, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap bg-slate-50 rounded-xl p-3 border border-gray-200">
                    <span className="text-sm font-semibold text-slate-500 shrink-0">{i+1}.</span>
                    <span className="text-sm text-gray-800">{q}</span>
                    <input
                      value={fillAnswers[i] || ''}
                      onChange={e => {
                        const arr = [...fillAnswers]; arr[i] = e.target.value
                        setFillAnswers(arr)
                        setAnswer(JSON.stringify(arr))
                      }}
                      disabled={current.attempt?.isCorrect}
                      className="border-b-2 border-indigo-400 bg-transparent px-2 py-1 text-sm w-20 focus:outline-none focus:border-indigo-600 text-center font-semibold"
                      placeholder="..."
                    />
                  </div>
                ))}
              </div>
            ) : current.type === 'CODING' ? (
              <textarea
                ref={codeAreaRef}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                disabled={current.attempt?.isCorrect}
                rows={10}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Scrie codul aici..."
                style={{ tabSize: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
              />
            ) : (
              <input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={current.attempt?.isCorrect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Scrie răspunsul..."
              />
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={submitAnswer}
                disabled={submitting || current.attempt?.isCorrect}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Se trimite...' : current.attempt?.isCorrect ? '✅ Corect (rezolvat)' : 'Trimite răspuns'}
              </button>
              {current.hint && !current.attempt?.isCorrect && (
                <button
                  onClick={() => setShowHint(s => !s)}
                  className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200"
                >
                  💡 {showHint ? 'Ascunde hint' : 'Vezi hint'}
                </button>
              )}
              {canSeeExplanationNow && explanationText && (
                <button
                  onClick={() => setShowExplanation(s => !s)}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-medium hover:bg-emerald-200"
                >
                  📖 {showExplanation ? 'Ascunde explicația' : 'Vezi explicația'}
                </button>
              )}
            </div>

            {showHint && current.hint && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                💡 <strong>Hint:</strong> {current.hint}
              </div>
            )}

            {feedback && (
              <div className={`p-3 rounded-lg text-sm border ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {feedback.isCorrect
                  ? `🎉 Felicitări! Răspuns corect. +${feedback.pointsAwarded} puncte.`
                  : '❌ Răspuns greșit. Verifică din nou și mai încearcă o dată.'}
              </div>
            )}
          </div>
        )}

        {/* Explanation block */}
        {showExplanation && canSeeExplanationNow && explanationText && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 xs:p-5 space-y-3">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
              📖 Explicație pas cu pas
            </h3>
            {correctAnswerText && (
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
                <div className="text-xs uppercase tracking-wide text-emerald-700 font-medium mb-1">
                  Răspuns corect
                </div>
                <code className="text-sm text-gray-900 font-mono whitespace-pre-wrap break-words">
                  {correctAnswerText}
                </code>
              </div>
            )}
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 bg-white rounded-lg p-4 border border-emerald-100">
              {explanationText}
            </div>
          </div>
        )}

        {!canSeeExplanationNow && policy === 'AFTER_SET' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            🔒 Explicațiile vor fi disponibile după ce finalizezi întregul set.
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-2">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          ← Anterior
        </button>
        {currentIdx < total - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Următor →
          </button>
        ) : !isCompleted ? (
          <button
            onClick={completeSet}
            disabled={!allAnswered}
            title={!allAnswered ? 'Răspunde la toate problemele întâi' : 'Finalizează'}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            🏁 Finalizează setul
          </button>
        ) : null}
      </div>

      {/* Final summary */}
      {isCompleted && (
        <div className="bg-gradient-to-br from-indigo-600 to-emerald-600 text-white rounded-2xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold">🎉 Set finalizat!</h2>
          <p className="mt-2 text-indigo-100">
            Ai obținut <strong>{score.earnedPoints} / {score.totalPoints}</strong> puncte
            ({Math.round((correctCount / total) * 100)}% corecte)
          </p>
          <p className="text-sm text-indigo-100 mt-2">
            Acum poți vedea explicațiile pentru toate problemele!
          </p>
        </div>
      )}
    </div>
  )
}
