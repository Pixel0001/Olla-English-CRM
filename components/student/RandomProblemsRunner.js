'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ChevronLeftIcon, FireIcon, AdjustmentsHorizontalIcon, ArrowPathIcon,
  PaperAirplaneIcon, CheckCircleIcon, ClockIcon, LightBulbIcon,
  PuzzlePieceIcon, SparklesIcon, BoltIcon, ChevronUpIcon, ChevronDownIcon,
  XMarkIcon, ExclamationTriangleIcon, CodeBracketIcon, GlobeAltIcon,
  SwatchIcon, Squares2X2Icon, CubeTransparentIcon, EyeIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid, StarIcon } from '@heroicons/react/24/solid'
import { getMaxAttempts, gradeForAttempt, applyHintPenalty } from '@/lib/problem-scoring'
import CodeRunner from '@/components/learn/CodeRunner'
import AiFeedback from '@/components/learn/AiFeedback'
import Markdown from '@/lib/markdown'
import AiChat from '@/components/learn/AiChat'
import AiGradingLoader from '@/components/learn/AiGradingLoader'

const DIFF_CONFIG = {
  EASY:   { label: 'Ușor',    bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', active: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' },
  MEDIUM: { label: 'Mediu',   bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700',    active: 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' },
  HARD:   { label: 'Greu',    bar: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-700',      active: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' },
  RANDOM: { label: 'Aleator', bar: 'bg-violet-400',  badge: 'bg-violet-100 text-violet-700',  active: 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' },
}

const LANG_ICONS = {
  python:     { Icon: CodeBracketIcon,  color: 'from-yellow-400 to-amber-500' },
  javascript: { Icon: BoltIcon,         color: 'from-yellow-300 to-yellow-500' },
  html:       { Icon: GlobeAltIcon,     color: 'from-orange-400 to-red-500' },
  css:        { Icon: SwatchIcon,       color: 'from-blue-400 to-indigo-500' },
}

function CountPicker({ value, onChange }) {
  const min = 1, max = 10
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const compute = (clientX) => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r) return value
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width))
    return Math.round(pct * (max - min) + min)
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => onChange(compute(e.clientX))
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-white/40 font-bold">{min}</span>
        <span className="text-2xl font-extrabold text-white tabular-nums">{value}</span>
        <span className="text-[10px] text-white/40 font-bold">{max}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-8 flex items-center cursor-pointer select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { e.preventDefault(); setDragging(true); onChange(compute(e.clientX)) }}
      >
        <div className="absolute inset-x-0 h-2 rounded-full bg-white/15" />
        <div
          className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute w-5 h-5 rounded-full bg-white shadow-lg border-2 border-amber-400 pointer-events-none"
          style={{ left: `${pct}%`, transform: `translateX(-${pct}%)` }}
        />
      </div>
    </div>
  )
}

export default function RandomProblemsRunner({ token, student, modules = [] }) {
  const [difficulty, setDifficulty] = useState('RANDOM')
  const [moduleId, setModuleId]     = useState('')
  const [count, setCount]           = useState(5)
  const [onlyCompleted, setOnlyCompleted] = useState(true)
  const [problems, setProblems]     = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [emptyReason, setEmptyReason] = useState(null)
  const [loading, setLoading]       = useState(false)
  // submissions[pid] = ultima submisie (pentru afișare)
  const [submissions, setSubmissions] = useState({})
  // attemptsCount[pid] = câte încercări trimise
  const [attemptsCount, setAttemptsCount] = useState({})
  // hintUsed[pid] = bool
  const [hintUsed, setHintUsed] = useState({})
  // locked[pid] = bool (corect, sau a văzut soluția, sau atinse max attempts)
  const [locked, setLocked] = useState({})
  // solutions[pid] = { correctAnswer, explanation }
  const [solutions, setSolutions] = useState({})
  const [answers, setAnswers]       = useState({})
  const [expanded, setExpanded]     = useState({})
  const [submitting, setSubmitting] = useState({})
  const [aiFeedback, setAiFeedback] = useState({}) // { problemId: AI grade payload }
  const [lastOutput, setLastOutput] = useState({}) // { problemId: stdout }
  const [chatOpen, setChatOpen] = useState({})
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const fetchProblems = async () => {
    setLoading(true)
    setMobileSidebarOpen(false)
    try {
      const p = new URLSearchParams({ difficulty, count: String(count) })
      if (moduleId) p.set('moduleId', moduleId)
      if (!onlyCompleted) p.set('onlyCompleted', 'false')
      const r = await fetch(`/api/public/learn/${token}/random?${p}`)
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      setProblems(d.problems || [])
      setSuggestion(d.suggestion || null)
      setEmptyReason(d.empty ? d.emptyReason || 'EMPTY' : null)
      setSubmissions({})
      setAttemptsCount({})
      setHintUsed({})
      setLocked({})
      setSolutions({})
      setAnswers({})
      setExpanded(Object.fromEntries((d.problems || []).map(p => [p.id, true])))
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  const submit = async (p) => {
    if (locked[p.id]) return
    if (submitting[p.id]) return
    const ans = (answers[p.id] ?? '').trim()
    if (!ans && p.type !== 'CODING') return toast.error('Introdu un răspuns')

    // CODING → AI grader (Mr. Olla)
    if (p.type === 'CODING') {
      const code = answers[p.id] ?? ''
      if (!code.trim()) return toast.error('Scrie cod înainte de trimitere')
      setSubmitting(s => ({ ...s, [p.id]: true }))
      try {
        const r = await fetch(`/api/public/learn/${token}/ai-grade`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemId: p.id, source: 'random', code, output: lastOutput[p.id] || '' }),
        })
        const d = await r.json()
        if (!r.ok) {
          if (r.status === 429 && d.cooldown) {
            const h = Math.floor(d.remainingMin / 60); const m = d.remainingMin % 60
            toast.error(`⏳ Așteaptă ${h ? h + 'h ' : ''}${m}min până la următoarea problemă`, { duration: 5000 })
          } else if (r.status === 429) toast.error(d.error || 'Limită AI atinsă')
          else throw new Error(d.error || 'Eroare AI')
          return
        }
        setSubmissions(s => ({ ...s, [p.id]: d.submission }))
        setAttemptsCount(a => ({ ...a, [p.id]: (a[p.id] || 0) + 1 }))
        setLocked(l => ({ ...l, [p.id]: !!d.submission.locked }))
        setAiFeedback(prev => ({ ...prev, [p.id]: d }))
        const finalGrade = (d.aiGrade?.finalGrade ?? d.aiGrade?.grade ?? 0)
        const passed = finalGrade >= 60
        const earnedXP = Math.round((p.points ?? 10) * finalGrade / 100)
        if (passed) toast.success(`Olla AI spune: bravo! +${earnedXP} pct 🌟`)
        // detectare AI dezactivată — nu mai afișăm toast de plagiat
        else if (earnedXP > 0) toast(`Parțial corect: +${earnedXP} pct. Vezi feedback.`, { icon: '✨' })
        else toast('Mr. Olla ți-a lăsat feedback', { icon: '✨' })
      } catch (e) { toast.error(e.message) } finally {
        setSubmitting(s => ({ ...s, [p.id]: false }))
      }
      return
    }

    setSubmitting(s => ({ ...s, [p.id]: true }))
    try {
      const r = await fetch(`/api/public/learn/${token}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: p.id, source: 'random',
          answer: p.type !== 'CODING' ? ans : null,
          code: p.type === 'CODING' ? (answers[p.id] ?? '') : null,
          hintUsed: !!hintUsed[p.id],
        }),
      })
      const d = await r.json()
      if (!r.ok) {
        if (r.status === 429 && d.cooldown) {
          const h = Math.floor(d.remainingMin / 60); const m = d.remainingMin % 60
          toast.error(`⏳ Așteaptă ${h ? h + 'h ' : ''}${m}min până la următoarea problemă`, { duration: 5000 })
          setSubmitting(s => ({ ...s, [p.id]: false }))
          return
        }
        throw new Error(d.error || 'Eroare')
      }
      setSubmissions(s => ({ ...s, [p.id]: d.submission }))
      setAttemptsCount(a => ({ ...a, [p.id]: d.attemptNumber || (a[p.id] || 0) + 1 }))
      if (d.locked) setLocked(l => ({ ...l, [p.id]: true }))
      if (d.autoCorrect === true) {
        const pct = d.submission?.grade ?? 0
        const earned = Math.round((p.points ?? 10) * pct / 100)
        toast.success(`Corect! +${earned} pct (${pct}%)`)
      } else {
        const max = d.maxAttempts ?? getMaxAttempts(p)
        const next = d.attemptNumber ?? 0
        if (d.locked || next >= max) {
          toast.error('Greșit — încercări epuizate (0 pct)')
        } else {
          const nextPct = applyHintPenalty(gradeForAttempt(p, next + 1), !!hintUsed[p.id])
          const nextEarned = Math.round((p.points ?? 10) * nextPct / 100)
          toast.error(`Greșit — încercarea următoare valorează ${nextEarned} pct`)
        }
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(s => ({ ...s, [p.id]: false }))
    }
  }

  const useHintFor = (p) => {
    if (hintUsed[p.id] || locked[p.id]) return
    setHintUsed(h => ({ ...h, [p.id]: true }))
    toast('Indiciu activat — −10 pct la nota finală', { icon: '💡' })
  }

  const viewSolution = async (p) => {
    if (solutions[p.id]) return
    const wasLocked = !!locked[p.id]
    // Dacă nu e blocată încă, cere confirmare (vede soluția → 0 pct)
    if (!wasLocked) {
      if (!confirm('Vezi rezolvarea? Vei primi 0 puncte și problema se închide.')) return
    }
    try {
      const r = await fetch(`/api/public/learn/${token}/solution`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: p.id, source: 'random' }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      setSolutions(s => ({ ...s, [p.id]: { correctAnswer: d.correctAnswer, explanation: d.explanation } }))
      setLocked(l => ({ ...l, [p.id]: true }))
      // marchează ca submisie 0p doar dacă nu era deja înnregistrată una
      if (!wasLocked) {
        setSubmissions(s => ({ ...s, [p.id]: { ...(s[p.id] || {}), status: 'GRADED', grade: 0, autoCorrect: false, solutionViewed: true } }))
      }
    } catch (e) { toast.error(e.message) }
  }

  // "done" = corect SAU blocat (epuizat / soluție văzută / coding trimis)
  const isDone = (p) => {
    const sub = submissions[p.id]
    if (locked[p.id]) return true
    if (sub?.status === 'GRADED' && (sub.grade ?? 0) >= 60) return true
    return false
  }
  const doneCount = problems.filter(isDone).length
  const allDone = problems.length > 0 && doneCount === problems.length
  const selectedModule = modules.find(m => m.id === moduleId)
  const langCfg = selectedModule ? LANG_ICONS[selectedModule.language?.toLowerCase()] : null

  const FilterPanel = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <Link href={`/learn/${token}`}
          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition shrink-0">
          <ChevronLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/15 rounded-full text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <FireIcon className="w-3 h-3 text-yellow-300" /> Antrenament
          </div>
          <h1 className="text-base font-extrabold text-white leading-none">Probleme aleatorii</h1>
        </div>
        <button className="ml-auto lg:hidden w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition"
          onClick={() => setMobileSidebarOpen(false)}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* AI suggestion */}
        {suggestion && suggestion.next !== suggestion.currentDifficulty && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
            <div className="flex items-start gap-2">
              <SparklesIcon className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 mb-0.5">Sugestie AI</div>
                <div className="text-xs text-white/80">{suggestion.reason}</div>
              </div>
            </div>
          </div>
        )}

        {/* Module picker */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Modul
          </label>
          {/* All modules pill */}
          <button onClick={() => setModuleId('')}
            className={`w-full mb-2 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              !moduleId ? 'bg-white text-slate-800 shadow-md' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}>
            <Squares2X2Icon className="w-4 h-4" />
            <span>Toate modulele</span>
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            {modules.map(m => {
              const lang = m.language?.toLowerCase()
              const cfg = LANG_ICONS[lang] || { Icon: CubeTransparentIcon, color: 'from-slate-400 to-slate-500' }
              const active = moduleId === m.id
              return (
                <button key={m.id} onClick={() => setModuleId(active ? '' : m.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    active
                      ? `bg-gradient-to-br ${cfg.color} text-white shadow-lg`
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}>
                  <cfg.Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{m.title.replace(' Fundamentals', '').replace(' Basics', '')}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Dificultate
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {['RANDOM', 'EASY', 'MEDIUM', 'HARD'].map(d => {
              const cfg = DIFF_CONFIG[d]
              const active = difficulty === d
              return (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    active ? cfg.active : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.bar}`} />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Source filter — sub dificultate */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Sursă probleme
          </label>
          <button onClick={() => setOnlyCompleted(v => !v)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              onlyCompleted ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/40' : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'
            }`}>
            <AcademicCapIcon className="w-4 h-4 shrink-0" />
            <span className="text-left flex-1">
              {onlyCompleted ? 'Doar din lecțiile făcute' : 'Din toate lecțiile'}
            </span>
            <span className={`w-8 h-4 rounded-full relative flex-shrink-0 transition-colors ${onlyCompleted ? 'bg-emerald-400' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${onlyCompleted ? 'left-4' : 'left-0.5'}`} />
            </span>
          </button>
        </div>

        {/* Count — modern buttons, no broken range */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Număr probleme
          </label>
          <CountPicker value={count} onChange={setCount} />
        </div>

        {/* Generate */}
        <button onClick={fetchProblems} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-900 rounded-2xl font-extrabold text-sm transition disabled:opacity-60 shadow-xl shadow-amber-500/30 active:scale-95">
          {loading
            ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Se încarcă...</>
            : <><BoltIcon className="w-4 h-4" /> Generează {count} probleme</>
          }
        </button>

        {/* Progress */}
        {problems.length > 0 && (
          <div className="bg-white/10 rounded-2xl p-3">
            <div className="flex justify-between text-[10px] text-white/50 mb-2 font-bold uppercase tracking-wider">
              <span>Progres sesiune</span>
              <span className="text-white font-extrabold">{doneCount}/{problems.length}</span>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.round(doneCount / problems.length * 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>0%</span>
              <span>{Math.round(doneCount / problems.length * 100)}%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Problem nav */}
        {problems.length > 0 && (
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Probleme</p>
            <div className="space-y-1">
              {problems.map((p, i) => {
                const sub = submissions[p.id]
                const isOk = sub?.status === 'GRADED' && (sub.grade ?? 0) >= 60 && sub.autoCorrect !== false
                const isLockedItem = !!locked[p.id]
                const isPending = sub && !isOk && !isLockedItem
                const cfg = DIFF_CONFIG[p.difficulty] || DIFF_CONFIG.EASY
                return (
                  <a key={p.id} href={`#problem-${p.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      isOk ? 'bg-emerald-500 text-white'
                      : isLockedItem ? 'bg-rose-500 text-white'
                      : isPending ? 'bg-amber-500 text-white'
                      : 'bg-white/15 text-white/70'
                    }`}>
                      {isOk ? <CheckSolid className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white/70 truncate">{p.title}</div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex bg-slate-100 overflow-hidden" style={{ height: '100vh', marginTop: 'calc(-1 * env(safe-area-inset-top))' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <FilterPanel />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <FilterPanel />
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 px-4 sm:px-6 pb-3 flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-sm" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-1.5 bg-white/15 hover:bg-white/25 rounded-xl transition">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center hidden lg:flex shrink-0">
            {langCfg
              ? <langCfg.Icon className="w-4 h-4 text-white" />
              : <FireIcon className="w-4 h-4 text-yellow-300" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">
              {selectedModule
                ? selectedModule.title
                : 'Probleme aleatorii'
              }
            </div>
            {problems.length > 0 && (
              <div className="text-white/50 text-xs flex items-center gap-1.5 flex-wrap">
                <span>{doneCount}/{problems.length} rezolvate · {DIFF_CONFIG[difficulty]?.label}</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${onlyCompleted ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-white/70'}`}>
                  <AcademicCapIcon className="w-3 h-3" />
                  {onlyCompleted ? 'doar lecții făcute' : 'toate lecțiile'}
                </span>
              </div>
            )}
          </div>
          {problems.length > 0 && (
            <button onClick={fetchProblems} disabled={loading}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold transition active:scale-95 border border-white/10">
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Regenerează</span>
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 shrink-0">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700"
            style={{ width: `${problems.length > 0 ? Math.round(doneCount / problems.length * 100) : 0}%` }} />
        </div>

        {/* ── SOURCE FILTER BAR — mereu vizibil ── */}
        <div className="shrink-0 px-4 sm:px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:block">Probleme din:</span>
          <button
            onClick={() => setOnlyCompleted(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              onlyCompleted
                ? 'bg-emerald-500 text-white shadow'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            <AcademicCapIcon className="w-3.5 h-3.5" />
            Lecțiile mele făcute
          </button>
          <button
            onClick={() => setOnlyCompleted(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              !onlyCompleted
                ? 'bg-blue-800 text-white shadow'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            <Squares2X2Icon className="w-3.5 h-3.5" />
            Toate lecțiile
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${emptyReason === 'NO_COMPLETED_LESSONS' ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'}`}>
                {emptyReason === 'NO_COMPLETED_LESSONS'
                  ? <AcademicCapIcon className="w-12 h-12 text-white" />
                  : <FireIcon className="w-12 h-12 text-white" />
                }
              </div>
              {emptyReason === 'NO_COMPLETED_LESSONS' ? (
                <>
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Încă n-ai terminat nicio lecție</h2>
                  <p className="text-slate-500 text-base max-w-sm mb-6">
                    Antrenamentul aleatoriu îți generează doar probleme din lecțiile pe care le-ai parcurs. Începe cu o lecție și revino aici!
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <Link href={`/learn/${token}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl font-extrabold shadow-xl shadow-blue-900/30 hover:-translate-y-0.5 transition active:scale-95">
                      <ChevronLeftIcon className="w-5 h-5" /> La lecții
                    </Link>
                    <button onClick={() => { setOnlyCompleted(false); setEmptyReason(null) }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-amber-300 transition">
                      Vreau totuși din toate
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Gata de antrenament?</h2>
                  <p className="text-slate-500 text-base max-w-sm mb-8">
                    Alege modulul și dificultatea, sau lasă-le aleatoriu și apasă Generate.
                  </p>

                  {/* Quick module chips on empty state */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    <button onClick={() => setModuleId('')}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition inline-flex items-center gap-2 ${!moduleId ? 'bg-blue-800 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                      <Squares2X2Icon className="w-4 h-4" /> Toate
                    </button>
                    {modules.map(m => {
                      const cfg = LANG_ICONS[m.language?.toLowerCase()] || { Icon: CubeTransparentIcon }
                      const active = moduleId === m.id
                      return (
                        <button key={m.id} onClick={() => setModuleId(active ? '' : m.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition inline-flex items-center gap-2 ${active ? 'bg-blue-800 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                          <cfg.Icon className="w-4 h-4" /> {m.title.replace(' Fundamentals', '').replace(' Basics', '')}
                        </button>
                      )
                    })}
                  </div>

                  {/* Sursă: doar lecții făcute / din toate */}
                  <div className="mb-6 inline-flex bg-slate-100 rounded-2xl p-1 border border-slate-200">
                    <button onClick={() => setOnlyCompleted(true)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition inline-flex items-center gap-2 ${onlyCompleted ? 'bg-emerald-500 text-white shadow' : 'text-slate-600 hover:text-slate-800'}`}>
                      <AcademicCapIcon className="w-4 h-4" /> Doar din lecțiile făcute
                    </button>
                    <button onClick={() => setOnlyCompleted(false)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition inline-flex items-center gap-2 ${!onlyCompleted ? 'bg-blue-800 text-white shadow' : 'text-slate-600 hover:text-slate-800'}`}>
                      <Squares2X2Icon className="w-4 h-4" /> Din toate
                    </button>
                  </div>

                  <button onClick={fetchProblems} disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-blue-900/30 hover:-translate-y-0.5 hover:shadow-2xl transition disabled:opacity-60 active:scale-95">
                    <BoltIcon className="w-6 h-6" />
                    {loading ? 'Se încarcă...' : `Generează ${count} probleme`}
                  </button>
                  <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition">
                    <AdjustmentsHorizontalIcon className="w-4 h-4" /> Mai multe filtre
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
              {problems.map((p, i) => {
                const sub = submissions[p.id]
                const isOk = sub?.status === 'GRADED' && (sub.grade ?? 0) >= 60 && sub.autoCorrect !== false
                const isLocked = !!locked[p.id]
                const isPending = sub && p.type === 'CODING' && !isLocked
                const cfg = DIFF_CONFIG[p.difficulty] || DIFF_CONFIG.EASY
                const isExpanded = expanded[p.id] !== false
                const attempts = attemptsCount[p.id] || 0
                const max = getMaxAttempts(p)
                const usedHint = !!hintUsed[p.id]
                const sol = solutions[p.id]
                const canSubmit = !isLocked && p.type !== 'CODING' || (p.type === 'CODING' && !isLocked && !sub)
                const nextGrade = applyHintPenalty(gradeForAttempt(p, attempts + 1), usedHint)
                const lastWrong = sub && sub.autoCorrect === false && !isLocked
                const cardRing = isOk
                  ? 'ring-emerald-200'
                  : isLocked && !isOk
                    ? 'ring-rose-200'
                    : lastWrong
                      ? 'ring-amber-200'
                      : isPending
                        ? 'ring-amber-200'
                        : 'ring-slate-200'

                return (
                  <div key={p.id} id={`problem-${p.id}`}
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden ring-1 ${cardRing}`}>

                    <div className={`h-1.5 bg-gradient-to-r ${isOk ? 'from-emerald-400 to-teal-400' : isLocked ? 'from-rose-400 to-rose-500' : 'from-blue-700 to-blue-500'}`} />
                    <div className="px-5 py-4 flex items-center gap-3 cursor-pointer select-none"
                      onClick={() => setExpanded(e => ({ ...e, [p.id]: !isExpanded }))}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                        isOk ? 'bg-emerald-500 text-white'
                        : isLocked ? 'bg-rose-500 text-white'
                        : isPending ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isOk ? <CheckSolid className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900">{p.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                          {usedHint && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 inline-flex items-center gap-1">
                              <LightBulbIcon className="w-3 h-3" /> Indiciu
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                          <StarIcon className="w-3 h-3 text-amber-400" /> {p.points} pct
                          {attempts > 0 && !isOk && (
                            <span className="text-slate-500">· Încercarea {Math.min(attempts, max)}/{max}</span>
                          )}
                          {isOk && <span className="text-emerald-600 font-semibold">· {Math.round((p.points ?? 10) * (sub?.grade ?? 0) / 100)}/{p.points} pct ✓</span>}
                          {isPending && <span className="text-amber-600 font-semibold">· La profesor</span>}
                          {isLocked && !isOk && (
                            <span className="text-rose-600 font-semibold">
                              · {sol ? 'Soluție văzută' : 'Epuizate'} — 0 pct
                            </span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400 shrink-0" />}
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                        <Markdown text={p.description} compact className="text-slate-700 leading-relaxed" />

                        {/* Status banner pentru ultima submisie */}
                        {sub && (
                          <div className={`rounded-2xl p-4 border-2 ${isOk ? 'bg-emerald-50 border-emerald-200' : isLocked ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center gap-2 font-bold text-sm flex-wrap">
                              {isOk ? (
                                <><CheckCircleIcon className="w-5 h-5 text-emerald-600" /><span className="text-emerald-800">Răspuns corect — bravo!</span></>
                              ) : isPending ? (
                                <><ClockIcon className="w-5 h-5 text-amber-600" /><span className="text-amber-800">Trimis profesorului</span></>
                              ) : isLocked ? (
                                sol ? (
                                  <><ExclamationTriangleIcon className="w-5 h-5 text-rose-600" /><span className="text-rose-800">Soluție afișată — 0 puncte</span></>
                                ) : (sub.grade ?? 0) > 0 ? (
                                  <><ExclamationTriangleIcon className="w-5 h-5 text-amber-600" /><span className="text-amber-800">Parțial corect — {Math.round((p.points ?? 10) * (sub.grade ?? 0) / 100)} pct</span></>
                                ) : (
                                  <><ExclamationTriangleIcon className="w-5 h-5 text-rose-600" /><span className="text-rose-800">Încercări epuizate — 0 puncte</span></>
                                )
                              ) : (
                                <><ExclamationTriangleIcon className="w-5 h-5 text-amber-600" /><span className="text-amber-800">Răspuns greșit — mai poți încerca</span></>
                              )}
                              {typeof sub.grade === 'number' && (isOk || isLocked) && (
                                <span className="ml-auto text-slate-700">Nota: <strong>{Math.round((p.points ?? 10) * sub.grade / 100)}/{p.points} pct</strong> <span className="text-slate-400 text-xs">({sub.grade}%)</span></span>
                              )}
                            </div>
                            {!isOk && !isLocked && !isPending && attempts < max && (
                              <div className="mt-2 text-xs text-amber-900">
                                Următoarea încercare valorează <strong>{Math.round((p.points ?? 10) * nextGrade / 100)} pct</strong>
                                {usedHint ? ' (cu penalizare indiciu)' : ''}.
                              </div>
                            )}
                            {sol && (
                              <div className="mt-3 space-y-2 text-sm">
                                <div className="bg-white/70 rounded-lg p-2">
                                  <div className="text-[10px] font-bold uppercase text-rose-700 mb-1">Răspuns corect</div>
                                  <div className="font-mono text-rose-900 break-words">{String(sol.correctAnswer ?? '—')}</div>
                                </div>
                                {sol.explanation && (
                                  <div className="bg-white/70 rounded-lg p-2">
                                    <div className="text-[10px] font-bold uppercase text-rose-700 mb-1">Explicație</div>
                                    <Markdown text={sol.explanation} compact className="text-rose-900" />
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Buton "Vezi rezolvarea" când e blocată din încercări epuizate, fără soluție afișată încă */}
                            {isLocked && !isOk && !sol && p.type !== 'CODING' && (
                              <div className="mt-3">
                                <button type="button" onClick={() => viewSolution(p)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-300 rounded-lg transition">
                                  <EyeIcon className="w-4 h-4" /> Vezi rezolvarea
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Inputs (vizibile cât timp nu e blocată și nu e CODING trimis) */}
                        {!isLocked && !(p.type === 'CODING' && sub) && (
                          <>
                            {p.type === 'MULTIPLE_CHOICE' && (
                              <div className="space-y-2">
                                {p.options?.map((opt, oi) => (
                                  <label key={oi}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${answers[p.id] === opt ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}`}>
                                    <input type="radio" name={`opt-${p.id}`} checked={answers[p.id] === opt}
                                      onChange={() => setAnswers(a => ({ ...a, [p.id]: opt }))}
                                      className="w-4 h-4 accent-indigo-500" />
                                    <span className="text-sm text-slate-800">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {p.type === 'CODING' && (
                              <div className="space-y-3">
                                <CodeRunner
                                  code={answers[p.id] ?? p.starterCode ?? ''}
                                  setCode={(v) => setAnswers(a => ({ ...a, [p.id]: typeof v === 'function' ? v(a[p.id]) : v }))}
                                  language={p.language || 'python'}
                                  starter={p.starterCode || ''}
                                  rows={10}
                                  onOutput={(out) => setLastOutput(o => ({ ...o, [p.id]: out }))}
                                />
                                {!chatOpen[p.id] && (
                                  <button
                                    type="button"
                                    onClick={() => setChatOpen(s => ({ ...s, [p.id]: true }))}
                                    className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95 self-start"
                                  >
                                    <SparklesIcon className="w-5 h-5" />
                                    <span>Cere ajutor de la AI</span>
                                    <span className="px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded shadow-sm">AI</span>
                                  </button>
                                )}
                                {chatOpen[p.id] && (
                                  <AiChat
                                    token={token}
                                    problemId={p.id}
                                    getCode={() => answers[p.id] || ''}
                                    onClose={() => setChatOpen(s => ({ ...s, [p.id]: false }))}
                                  />
                                )}
                                {submitting[p.id] && !aiFeedback[p.id] && (
                                  <AiGradingLoader />
                                )}
                                {aiFeedback[p.id] && (
                                  <AiFeedback
                                    key={`${p.id}-${attemptsCount[p.id] || 0}`}
                                    data={aiFeedback[p.id]}
                                    token={token}
                                    onClose={() => setAiFeedback(prev => { const c = { ...prev }; delete c[p.id]; return c })}
                                    onRetry={() => setAiFeedback(prev => { const c = { ...prev }; delete c[p.id]; return c })}
                                  />
                                )}
                              </div>
                            )}
                            {(p.type === 'SHORT_ANSWER' || p.type === 'INPUT_OUTPUT') && (
                              <input value={answers[p.id] || ''}
                                onChange={e => setAnswers(a => ({ ...a, [p.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && submit(p)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                placeholder="Răspunsul tău..." />
                            )}

                            {/* Indiciu */}
                            {p.hint && (
                              <div>
                                {usedHint ? (
                                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                                    <LightBulbIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="flex-1"><strong>Indiciu:</strong> <Markdown text={p.hint} compact className="inline-block" /></div>
                                  </div>
                                ) : (
                                  <button type="button" onClick={() => useHintFor(p)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition">
                                    <LightBulbIcon className="w-4 h-4" /> Vezi indiciu (−10 pct)
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Acțiuni */}
                            <div className="flex flex-wrap items-center gap-2">
                              <button onClick={() => submit(p)} disabled={!!submitting[p.id]}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl font-bold text-sm shadow hover:shadow-md active:scale-95 transition disabled:opacity-60">
                                <PaperAirplaneIcon className="w-4 h-4" />
                                {submitting[p.id] ? 'Se trimite...' : (lastWrong ? `Reîncearcă (${Math.round((p.points ?? 10) * nextGrade / 100)} pct)` : 'Trimite răspunsul')}
                              </button>
                              {p.type !== 'CODING' && attempts >= 2 && (
                                <button type="button" onClick={() => viewSolution(p)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition">
                                  <EyeIcon className="w-4 h-4" /> Vezi rezolvarea (0 pct)
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {allDone && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 text-center">
                  <CheckSolid className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-xl font-extrabold text-emerald-900 mb-1">Sesiune completă!</h3>
                  <p className="text-emerald-700 text-sm mb-4">
                    Ai parcurs toate {problems.length} problemele. Vrei o serie nouă?
                  </p>
                  <button onClick={fetchProblems} disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-60">
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Se generează...' : 'Regenerează probleme'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
