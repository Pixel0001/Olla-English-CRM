'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  BookOpenIcon, PuzzlePieceIcon, ClockIcon, LightBulbIcon,
  PaperAirplaneIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon,
  ChevronLeftIcon, ChevronRightIcon, TrophyIcon, RocketLaunchIcon,
  AcademicCapIcon, SparklesIcon, HomeIcon, Bars3Icon, XMarkIcon, LockClosedIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid, StarIcon } from '@heroicons/react/24/solid'
import dynamic from 'next/dynamic'
import { getMaxAttempts, gradeForAttempt, applyHintPenalty } from '@/lib/problem-scoring'
import { verifyAnswerLocal } from '@/lib/problem-verify'
import Markdown, { inlineFmt, reformatCode } from '@/lib/markdown'
// Heavy sub-components: lazy-loaded so they don't block initial JS parse
const CodeRunner = dynamic(() => import('@/components/learn/CodeRunner'), { ssr: false })
const AiFeedback = dynamic(() => import('@/components/learn/AiFeedback'), { ssr: false })
const AiChat = dynamic(() => import('@/components/learn/AiChat'), { ssr: false })
const AiGradingLoader = dynamic(() => import('@/components/learn/AiGradingLoader'), { ssr: false })

const DIFF_COLOR = {
  EASY: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-rose-100 text-rose-700',
}
function seededShuffle(arr, seed) {
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    const j = s % (i + 1);[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
const DIFF_LABEL = { EASY: 'Usor', MEDIUM: 'Mediu', HARD: 'Greu' }

function CooldownBanner({ until, onExpire }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, until.getTime() - Date.now()))
  useEffect(() => {
    const iv = setInterval(() => {
      const ms = Math.max(0, until.getTime() - Date.now())
      setRemaining(ms)
      if (ms === 0) { clearInterval(iv); onExpire() }
    }, 1000)
    return () => clearInterval(iv)
  }, [until, onExpire])
  const totalSec = Math.ceil(remaining / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const fmt = h > 0
    ? `${h}h ${m.toString().padStart(2, '0')}min ${s.toString().padStart(2, '0')}s`
    : m > 0
    ? `${m}min ${s.toString().padStart(2, '0')}s`
    : `${s}s`
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800 text-sm font-semibold">
      <ClockIcon className="w-5 h-5 shrink-0 text-amber-500" />
      <span>Cooldown activ — poți trimite din nou peste <span className="font-mono text-amber-900">{fmt}</span></span>
    </div>
  )
}

function renderTheory(text) {
  if (!text) return null
  // Normalizează blocurile de cod
  const normalized = text
    // 1. Mută ``` mid-linie pe un rând nou
    .replace(/([^\n`])([ \t]*```)/g, '$1\n$2')
    // 2. Mută textul de după ``` de închidere pe un rând nou
    .replace(/^([ \t]*```)([^`\w\n][^\n]*)/gm, '$1\n$2')
    // 3. Elimină spații la începutul liniilor cu ```
    .replace(/^[ \t]+(```)/gm, '$1')
  const lines = normalized.split('\n')
  const out = []
  let inCode = false; let codeBuf = []; let codeLang = ''
  let listBuf = []; let listOrdered = false

  const flushList = (key) => {
    if (listBuf.length === 0) return
    const Tag = listOrdered ? 'ol' : 'ul'
    const cls = listOrdered
      ? 'list-decimal list-inside space-y-1 my-3 text-slate-700'
      : 'list-disc list-inside space-y-1 my-3 text-slate-700'
    out.push(
      <Tag key={`l${key}`} className={cls}>
        {listBuf.map((item, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: inlineFmt(item) }} />
        ))}
      </Tag>
    )
    listBuf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i]
    if (ln.startsWith('```')) {
      flushList(i)
      if (inCode) {
        const codeText = reformatCode(codeBuf.join('\n'), codeLang)
        out.push(
          <div key={`c${i}`} className="my-4 rounded-xl bg-slate-900 shadow-inner overflow-hidden">
            {codeLang && (
              <div className="px-4 py-1.5 border-b border-slate-700 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{codeLang}</span>
              </div>
            )}
            <pre className="text-slate-100 p-4 overflow-x-auto text-sm font-mono whitespace-pre">{codeText}</pre>
          </div>
        )
        codeBuf = []; codeLang = ''; inCode = false
      } else {
        inCode = true
        const rest = ln.slice(3)
        // Detectează cod inline pe linia de deschidere: ```python cod_aici
        const inlineMatch = rest.match(/^(\w*)\s+(.+)$/)
        codeLang = inlineMatch ? inlineMatch[1] : rest.trim()
        if (inlineMatch) {
          codeBuf.push(inlineMatch[2].trim())
        }
      }
      continue
    }
    if (inCode) { codeBuf.push(ln); continue }

    // YouTube embed: @[youtube](URL_or_ID)
    const yt = ln.match(/^@\[youtube\]\(([^)]+)\)\s*$/i)
    if (yt) {
      flushList(i)
      const raw = yt[1].trim()
      let id = raw
      const m1 = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/)
      if (m1) id = m1[1]
      out.push(
        <div key={i} className="aspect-video my-4 rounded-xl overflow-hidden bg-black shadow">
          <iframe src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen />
        </div>
      )
      continue
    }

    // Image as standalone line: ![alt](url)
    const imgMatch = ln.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (imgMatch) {
      flushList(i)
      out.push(<img key={i} src={imgMatch[2]} alt={imgMatch[1]} className="my-4 rounded-xl max-w-full h-auto shadow" />)
      continue
    }

    // Callout / blockquote: > text  (multi-linie)
    if (ln.startsWith('> ')) {
      flushList(i)
      const buf = [ln.slice(2)]
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) {
        buf.push(lines[++i].slice(2))
      }
      out.push(
        <div key={i} className="my-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 rounded-r-xl">
          {buf.map((b, k) => (
            <p key={k} className="text-amber-900 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFmt(b) }} />
          ))}
        </div>
      )
      continue
    }

    // <details>/<summary> block — spoiler / răspuns ascuns
    if (ln.match(/^<details/i)) {
      flushList(i)
      const buf = [ln]
      while (i + 1 < lines.length && !lines[i].match(/<\/details>/i)) {
        buf.push(lines[++i])
      }
      const block = buf.join('\n')
      const summaryMatch = block.match(/<summary>([\s\S]*?)<\/summary>/i)
      const summaryText = summaryMatch ? summaryMatch[1].trim() : 'Răspuns'
      const inner = block
        .replace(/<details[^>]*>/i, '')
        .replace(/<\/details>/i, '')
        .replace(/<summary>[\s\S]*?<\/summary>/i, '')
        .trim()
      const innerNodes = renderTheory(inner)
      out.push(
        <details key={i} className="my-3 rounded-xl border border-[#30919f]/20 bg-[#0f2127] overflow-hidden group">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer font-semibold text-sm text-[#a0b8bc] hover:bg-[#30919f]/5 transition list-none select-none">
            <span className="w-5 h-5 rounded-full bg-[#30919f]/20 text-[#30919f] flex items-center justify-center text-xs font-black group-open:rotate-90 transition-transform">▶</span>
            <span dangerouslySetInnerHTML={{ __html: inlineFmt(summaryText) }} />
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-[#30919f]/10 space-y-2">
            {innerNodes}
          </div>
        </details>
      )
      continue
    }

    // List items
    const ulMatch = ln.match(/^[-*]\s+(.+)$/)
    const olMatch = ln.match(/^\d+\.\s+(.+)$/)
    if (ulMatch || olMatch) {
      const isOrdered = !!olMatch
      if (listBuf.length > 0 && isOrdered !== listOrdered) flushList(i)
      listOrdered = isOrdered
      listBuf.push((ulMatch || olMatch)[1])
      continue
    } else if (listBuf.length > 0) {
      flushList(i)
    }

    if (ln.startsWith('### ')) out.push(<h3 key={i} className="text-base font-semibold mt-4 mb-1 text-slate-800" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(4)) }} />)
    else if (ln.startsWith('## ')) out.push(<h2 key={i} className="text-xl font-bold mt-5 mb-2 text-slate-900" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(3)) }} />)
    else if (ln.startsWith('# ')) out.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-3 text-slate-900" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(2)) }} />)
    else if (ln.trim() === '') out.push(<div key={i} className="h-2" />)
    else {
      out.push(<p key={i} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFmt(ln) }} />)
    }
  }
  flushList('end')
  return out
}

function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const dash = (seconds % 60) / 60 * 87.9
  return (
    <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1 ring-1 ring-white/30">
      <div className="relative w-6 h-6">
        <svg viewBox="0 0 36 36" className="w-6 h-6 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3"
            strokeDasharray={`${dash} 88`} strokeLinecap="round" />
        </svg>
        <ClockIcon className="absolute inset-0 m-auto w-3 h-3 text-white" />
      </div>
      <span className="font-mono text-xs font-bold tabular-nums">{mins}:{String(secs).padStart(2, '0')}</span>
    </div>
  )
}

export default function LessonRunner({ token, lesson, problems, initialProgress, advanceGranted, moduleLessons = [], progressByLesson = {}, superStudent = false, grantedLessonIds = [], canUseAi = false, isGuest = false }) {
  // În mod GUEST: zero fetch-uri către server. Toate acțiunile sunt locale.
  // canUseAi forțat fals + token-urile pentru linkurile fraților sunt înlocuite cu prefixul guest.
  if (isGuest) canUseAi = false
  const dashboardHref = isGuest ? '/learn/guest' : `/learn/${token}`
  const lessonHrefBase = isGuest ? '/learn/guest/lesson' : `/learn/${token}/lesson`
  const router = useRouter()
  const searchParams = useSearchParams()
  const grantedLessonSet = new Set(grantedLessonIds)
  const [progress, setProgress] = useState(initialProgress || { theoryCompleted: false, currentProblemIndex: 0 })
  const [step, setStep] = useState(progress.theoryCompleted ? 'problems' : 'theory')
  // Dacă vine ?problemId=... din notificare, pornim direct la problema respectivă
  const initialIdx = (() => {
    const targetPid = searchParams?.get('problemId')
    if (targetPid) {
      const i = problems.findIndex(p => p.id === targetPid)
      if (i >= 0) return i
    }
    return progress.currentProblemIndex || 0
  })()
  const [idx, setIdx] = useState(initialIdx)
  const [submissions, setSubmissions] = useState(problems.map(p => p.submission))
  // Per-problem state, indexed by problem position
  const [attemptsCount, setAttemptsCount] = useState(problems.map(p => p.attemptsCount || 0))
  const [hintsUsed, setHintsUsed] = useState(problems.map(p => !!p.hintUsed))
  const [locks, setLocks] = useState(problems.map(p => !!p.locked))
  const [solutionViewed, setSolutionViewed] = useState(problems.map(p => !!p.solutionViewed))
  const [solutionData, setSolutionData] = useState({}) // { problemId: { correctAnswer, explanation } }
  const [answer, setAnswer] = useState('')
  const [code, setCode] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [solutionLoading, setSolutionLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(null) // Date when cooldown expires
  const [aiFeedback, setAiFeedback] = useState({}) // { problemId: { aiGrade, aiDetect, aiPenaltyApplied, usage } }
  const [savedCodes, setSavedCodes] = useState({}) // { problemId: code } — păstrează codul la schimbarea problemei
  const [lastOutput, setLastOutput] = useState('')
  const [chatOpen, setChatOpen] = useState({}) // { problemId: bool }
  const [time, setTime] = useState(0)
  const [finishing, setFinishing] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [resetKey, setResetKey] = useState(0) // bumped to force re-render when same-idx problem is reset
  const [orderItems, setOrderItems] = useState([]) // pentru ORDER_IMAGES
  const [fillAnswers, setFillAnswers] = useState([]) // pentru FILL_IN
  const [dragBlockSlots, setDragBlockSlots] = useState([]) // pentru DRAG_BLOCKS: sloturi [token|null]
  const [dragBlockPool, setDragBlockPool] = useState([]) // pentru DRAG_BLOCKS: tokens neplasate
  const dragRef = useRef(null)
  const startRef = useRef(Date.now())

  // Dacă a venit ?problemId=... și teoria e gata, sărim direct la lista de probleme
  useEffect(() => {
    const targetPid = searchParams?.get('problemId')
    if (targetPid && progress.theoryCompleted) {
      setStep('problems')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (step !== 'problems') return
    const t = setInterval(() => setTime(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [step, idx])

  useEffect(() => {
    setAnswer('')
    // Restaurează codul salvat pentru problema nouă (sau starterCode dacă nu există)
    const pid = problems[idx]?.id
    setCode(pid && savedCodes[pid] != null ? savedCodes[pid] : (problems[idx]?.starterCode || ''))
    setShowHint(false)
    startRef.current = Date.now(); setTime(0)
    setTransitioning(true)
    const t = setTimeout(() => setTransitioning(false), 120)
    // Init ORDER_IMAGES
    const prob = problems[idx]
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
      setFillAnswers(new Array(prob.options.length).fill(''))
      setAnswer('[]')
    } else {
      setFillAnswers([])
    }
    // Init DRAG_BLOCKS / DRAG_INLINE (aceeași stare)
    if (prob?.type === 'DRAG_BLOCKS' || prob?.type === 'DRAG_INLINE') {
      let correct = []
      try { correct = JSON.parse(prob.correctAnswer || '[]') } catch {}
      setDragBlockSlots(new Array(correct.length).fill(null))
      setDragBlockPool([...( prob.options || [])])
      setAnswer('[]')
    } else {
      setDragBlockSlots([])
      setDragBlockPool([])
    }
    return () => clearTimeout(t)
  }, [idx, problems, resetKey])

  const cur = problems[idx]
  // Salvează codul curent în savedCodes la fiecare modificare
  useEffect(() => {
    if (cur?.id && cur.type === 'CODING') {
      setSavedCodes(prev => ({ ...prev, [cur.id]: code }))
    }
  }, [code, cur?.id])

  const curSub = submissions[idx]
  const curAttempts = attemptsCount[idx] || 0
  const curHintUsed = hintsUsed[idx]
  const curLocked = locks[idx]
  const curSolutionViewed = solutionViewed[idx]
  const curMaxAttempts = cur ? getMaxAttempts(cur) : 3
  // Probleme blocate cu notă mică — derivat din submissions+locks, persistent la reload
  // permanentlyBlocked = indecși unde serverul a refuzat reset (e.g. soluție văzută) → nu pot fi reîncercate
  // permanentlyBlocked = indecși unde serverul a refuzat reset (e.g. soluție văzută) — populat dinamic la runtime
  const [permanentlyBlocked, setPermanentlyBlocked] = useState(new Set)
  const toRevisit = problems.map((_, i) => i).filter(i => locks[i] && (submissions[i]?.grade ?? 0) < 60 && !permanentlyBlocked.has(i))

  // O problemă e „terminată" dacă e rezolvată corect sau blocată cu notă ≥60
  const isProblemDone = (i) => {
    const s = submissions[i]
    if (!s) return false
    if (locks[i] && (s.grade ?? 0) < 60) return false // blocat+eșuat → trebuie reluat
    if (locks[i]) return true
    if (s.status === 'GRADED' && (s.grade ?? 0) >= 60) return true
    return false
  }
  // O problemă „are greșeli nereparate" — submisie există, e GRADED dar incorectă, neblocată
  const needsRetry = (i) => {
    const s = submissions[i]
    if (!s) return false
    if (locks[i]) return false
    if (s.status === 'GRADED' && (s.grade ?? 0) < 60) return true
    return false
  }
  const allDone = problems.every((_, i) => isProblemDone(i))
  const doneCount = problems.filter((_, i) => isProblemDone(i)).length
  const wrongCount = problems.filter((_, i) => needsRetry(i)).length
  const revisionCount = problems.filter((_, i) => submissions[i]?.status === 'NEEDS_REVISION').length
  const lessonPct = problems.length > 0 ? Math.round((doneCount / problems.length) * 100) : 0

  const completeTheory = async () => {
    if (isGuest) {
      setProgress({ ...progress, theoryCompleted: true })
      setStep('problems')
      return
    }
    await fetch(`/api/public/learn/${token}/lesson/${lesson.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theoryCompleted: true }),
    })
    setProgress({ ...progress, theoryCompleted: true })
    setStep('problems')
  }

  const useHint = async () => {
    if (!cur?.hint || curHintUsed || curLocked) return
    if (isGuest) {
      const nh = [...hintsUsed]; nh[idx] = true; setHintsUsed(nh)
      setShowHint(true)
      toast('Hint afișat (mod demo)', { icon: '💡' })
      return
    }
    setHintLoading(true)
    try {
      const r = await fetch(`/api/public/learn/${token}/hint`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: cur.id, lessonId: lesson.id }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      const nh = [...hintsUsed]; nh[idx] = true; setHintsUsed(nh)
      setShowHint(true)
      toast(`Hint folosit — −${Math.round((cur.points ?? 10) * 10 / 100)} XP din scorul final`, { icon: '💡' })
    } catch (e) { toast.error(e.message) } finally { setHintLoading(false) }
  }

  const viewSolution = async () => {
    if (curLocked) {
      // arată soluția fără call API dacă e deja în solutionData
      if (solutionData[cur.id]) return
    }
    if (!confirm('Apăsând „Vezi rezolvarea" pierzi toate punctele pentru această problemă (0p) și nu o mai poți reîncerca decât resetând lecția. Continui?')) return
    if (isGuest) {
      // În mod demo soluția e luată direct din props
      setSolutionData(prev => ({ ...prev, [cur.id]: { correctAnswer: cur.correctAnswer, explanation: cur.explanation } }))
      const nl = [...locks]; nl[idx] = true; setLocks(nl)
      const nv = [...solutionViewed]; nv[idx] = true; setSolutionViewed(nv)
      const next = [...submissions]
      next[idx] = { ...(next[idx] || {}), status: 'GRADED', grade: 0, autoCorrect: false, locked: true, solutionViewed: true }
      setSubmissions(next)
      toast('Rezolvarea e afișată', { icon: '📖' })
      return
    }
    setSolutionLoading(true)
    try {
      const r = await fetch(`/api/public/learn/${token}/solution`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: cur.id, lessonId: lesson.id }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      setSolutionData(prev => ({ ...prev, [cur.id]: { correctAnswer: d.correctAnswer, explanation: d.explanation } }))
      const nl = [...locks]; nl[idx] = true; setLocks(nl)
      const nv = [...solutionViewed]; nv[idx] = true; setSolutionViewed(nv)
      // marchează submission cu status GRADED 0p
      const next = [...submissions]
      next[idx] = { ...(next[idx] || {}), status: 'GRADED', grade: 0, autoCorrect: false, locked: true, solutionViewed: true }
      setSubmissions(next)
      toast('Rezolvarea e afișată', { icon: '📖' })
    } catch (e) { toast.error(e.message) } finally { setSolutionLoading(false) }
  }

  const resetLesson = async () => {
    if (!confirm('Resetezi lecția? Toate răspunsurile, hint-urile și progresul problemelor vor fi șterse. Vei putea reîncepe de la zero pentru punctaj maxim.')) return
    if (isGuest) {
      setSubmissions(problems.map(() => null))
      setAttemptsCount(problems.map(() => 0))
      setHintsUsed(problems.map(() => false))
      setLocks(problems.map(() => false))
      setSolutionViewed(problems.map(() => false))
      setSolutionData({})
      setAnswer(''); setCode(problems[0]?.starterCode || '')
      setIdx(0); setStep('theory')
      setProgress({ theoryCompleted: false, currentProblemIndex: 0 })
      toast.success('Lecția a fost resetată (mod demo)')
      return
    }
    setResetting(true)
    try {
      const r = await fetch(`/api/public/learn/${token}/lesson/${lesson.id}/reset`, { method: 'POST' })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      toast.success('Lecția a fost resetată')
      router.refresh()
    } catch (e) { toast.error(e.message); setResetting(false) }
  }

  const [resettingProblem, setResettingProblem] = useState(false)
  const resetProblem = async (problemId) => {
    if (isGuest) {
      const next = [...submissions]; next[idx] = null; setSubmissions(next)
      const na = [...attemptsCount]; na[idx] = 0; setAttemptsCount(na)
      const nl = [...locks]; nl[idx] = false; setLocks(nl)
      const nv = [...solutionViewed]; nv[idx] = false; setSolutionViewed(nv)
      setAnswer(''); setCode(cur?.starterCode || '')
      setSolutionData(prev => { const c = { ...prev }; delete c[problemId]; return c })
      toast.success('Problema a fost resetată (mod demo)')
      return
    }
    setResettingProblem(true)
    try {
      const r = await fetch(`/api/public/learn/${token}/lesson/${lesson.id}/reset-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      // Reset local state pentru problema curentă
      const next = [...submissions]; next[idx] = null; setSubmissions(next)
      const na = [...attemptsCount]; na[idx] = 0; setAttemptsCount(na)
      const nl = [...locks]; nl[idx] = false; setLocks(nl)
      const nv = [...solutionViewed]; nv[idx] = false; setSolutionViewed(nv)
      setAnswer(''); setCode(cur?.starterCode || '')
      setAiFeedback(prev => { const c = { ...prev }; delete c[problemId]; return c })
      setSolutionData(prev => { const c = { ...prev }; delete c[problemId]; return c })
      toast.success('Problema a fost resetată — poți reîncerca!')
    } catch (e) { toast.error(e.message) } finally { setResettingProblem(false) }
  }

  const submit = async () => {
    if (curLocked) return toast.error('Problemă blocată — apasă „Reîncearcă problema” pentru a încerca din nou')
    if (cur.type === 'CODING' || cur.type === 'INPUT_OUTPUT') {
      if (!code.trim() && !answer.trim()) return toast.error('Introdu un raspuns')
    } else if (cur.type === 'MULTIPLE_SELECT') {
      if (!Array.isArray(answer) || answer.length === 0) return toast.error('Selectează cel puțin o variantă')
    } else if (cur.type === 'ORDER_IMAGES') {
      if (!orderItems.length) return toast.error('Aranjează imaginile')
    } else if (cur.type === 'FILL_IN') {
      if (fillAnswers.every(a => !a?.trim())) return toast.error('Completează cel puțin un câmp')
    } else if (cur.type === 'DRAG_BLOCKS' || cur.type === 'DRAG_INLINE') {
      if (dragBlockSlots.every(s => !s)) return toast.error('Plasează cel puțin un bloc')
    } else if (!answer.trim()) return toast.error('Introdu un raspuns')

    // ===== MOD GUEST: notare 100% client-side, ZERO request către server =====
    if (isGuest) {
      setSubmitting(true)
      const norm = (s) => String(s ?? '').trim().toLowerCase()
      let correct = false
      if (cur.type === 'MULTIPLE_CHOICE' || cur.type === 'SHORT_ANSWER') {
        correct = norm(answer) === norm(cur.correctAnswer)
      } else if (cur.type === 'MULTIPLE_SELECT') {
        let correctOpts = []
        try { correctOpts = JSON.parse(cur.correctAnswer || '[]').map(norm) } catch {}
        const sel = (Array.isArray(answer) ? answer : []).map(norm)
        const hits = sel.filter(s => correctOpts.includes(s)).length
        const wrongs = sel.filter(s => !correctOpts.includes(s)).length
        const pGrade = correctOpts.length > 0 ? Math.max(0, Math.round(((hits - wrongs) / correctOpts.length) * 100)) : 0
        correct = pGrade >= 60
      } else if (cur.type === 'INPUT_OUTPUT') {
        const target = cur.correctAnswer || ''
        correct = norm(answer || lastOutput) === norm(target)
      } else if (cur.type === 'CODING') {
        // Fără AI în mod guest — compară outputul cu correctAnswer dacă există
        if (cur.correctAnswer) {
          correct = norm(lastOutput) === norm(cur.correctAnswer)
        } else {
          // Nu avem cu ce să comparăm — acceptăm dacă codul a rulat fără erori
          correct = !!lastOutput && !/error|traceback|exception/i.test(lastOutput)
        }
      }
      const grade = correct ? 100 : 0
      const newAttempts = (attemptsCount[idx] || 0) + 1
      const exhausted = !correct && newAttempts >= curMaxAttempts
      const fakeSub = {
        problemId: cur.id,
        status: 'GRADED',
        grade,
        autoCorrect: correct,
        locked: correct || exhausted,
        answer: answer || null,
        code: code || null,
      }
      const next = [...submissions]; next[idx] = fakeSub; setSubmissions(next)
      const na = [...attemptsCount]; na[idx] = newAttempts; setAttemptsCount(na)
      if (correct || exhausted) {
        const nl = [...locks]; nl[idx] = true; setLocks(nl)
      }
      if (correct) {
        toast.success(`Corect! +${cur.points ?? 10} XP (mod demo)`)
      } else if (exhausted) {
        toast.error('Greșit — încercări epuizate. Resetează problema pentru a reîncerca.')
      } else {
        toast.error(`Răspuns greșit. Mai ai ${curMaxAttempts - newAttempts} încercări.`)
      }
      setSubmitting(false)
      return
    }
    // ===== END MOD GUEST =====

    // Pentru CODING — trimite la AI grader (Mr. Olla) doar dacă elevul are acces AI
    if (cur.type === 'CODING' && canUseAi) {
      if (!code.trim()) return toast.error('Scrie cod înainte de trimitere')
      setSubmitting(true)
      try {
        const r = await fetch(`/api/public/learn/${token}/ai-grade`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemId: cur.id, lessonId: lesson.id, source: 'lesson', code, output: lastOutput }),
        })
        const d = await r.json()
        if (!r.ok) {
          if (r.status === 429 && d.cooldown) {
            const h = Math.floor(d.remainingMin / 60); const m = d.remainingMin % 60
            toast(`Așteaptă ${h ? h + 'h ' : ''}${m}min până la următoarea problemă`, { duration: 5000, icon: <ClockIcon className="w-5 h-5 text-amber-500" /> })
            setCooldownUntil(new Date(Date.now() + d.remainingMs))
          } else if (r.status === 429) toast.error(d.error || 'Limită AI atinsă')
          else throw new Error(d.error || 'Eroare AI')
          return
        }
        const next = [...submissions]; next[idx] = d.submission; setSubmissions(next)
        const na = [...attemptsCount]; na[idx] = (na[idx] || 0) + 1; setAttemptsCount(na)
        const nl = [...locks]; nl[idx] = !!d.submission.locked; setLocks(nl)
        setAiFeedback(prev => ({ ...prev, [cur.id]: d }))
        const finalGrade = (d.aiGrade?.finalGrade ?? d.aiGrade?.grade ?? 0)
        const passed = finalGrade >= 60
        const earnedXP = Math.round((cur.points ?? 10) * finalGrade / 100)
        const gemsEarned = d.economy?.gems || 0
        if (passed) toast.success(`Olla AI spune: bravo! +${earnedXP} XP${gemsEarned ? ` 💎 +${gemsEarned} gems` : ''} 🌟`)
        // detectare AI dezactivată — nu mai afișăm toast de plagiat
        else if (earnedXP > 0) toast(`Parțial corect: +${earnedXP} XP${gemsEarned ? ` 💎 +${gemsEarned} gems` : ''}. Vezi feedback-ul AI.`, { icon: '✨' })
        else toast('Mr. Olla ți-a lăsat feedback', { icon: '✨' })
        // Dacă problema e acum blocată cu notă mică → adaugă la toRevisit și avansează automat
        if (d.submission.locked && finalGrade < 60) {
          const capturedIdx = idx
          toast('Încercări epuizate — continuăm și revenim la această problemă la final', { icon: '🔁', duration: 4000 })
          const nextUnlocked = problems.findIndex((_, i) => i > capturedIdx && !nl[i])
          if (nextUnlocked !== -1) {
            setTimeout(() => setIdx(nextUnlocked), 3500)
          }
        }
      } catch (e) { toast.error(e.message) } finally { setSubmitting(false) }
      return
    }

    // ─── OPTIMISTIC UI pentru probleme NON-CODING ───────────────────────────
    // Verificăm răspunsul local INSTANT (correctAnswer e deja în memoria clientului),
    // afișăm feedback-ul imediat, și trimitem submisia în fundal pentru persistență.
    // Avantaj: elevul vede „Corect!" / „Greșit" în aceeași milisecundă cu click-ul,
    // fără să aștepte 200-800ms de network + DB writes.
    const isNonCoding = cur.type !== 'CODING'
    let optimisticToastId = null
    if (isNonCoding) {
      const { isCorrect, partialGrade } = verifyAnswerLocal(cur, answer)
      const newAttempts = (attemptsCount[idx] || 0) + 1
      const maxA = getMaxAttempts(cur)
      const exhausted = !isCorrect && newAttempts >= maxA
      const pGrade = cur.type === 'MULTIPLE_SELECT' ? (partialGrade ?? (isCorrect ? 100 : 0)) : (isCorrect ? 100 : 0)
      const optimisticGrade = applyHintPenalty(Math.round(gradeForAttempt(cur, newAttempts) * pGrade / 100), curHintUsed)
      const earnedXP = pGrade > 0 ? Math.round((cur.points ?? 10) * (optimisticGrade / 100)) : 0
      // Optimistic submission object — UI re-renderează cu rezultat instant
      const optimisticSub = {
        problemId: cur.id,
        status: 'GRADED',
        grade: optimisticGrade,
        autoCorrect: isCorrect,
        locked: isCorrect || exhausted,
        answer: answer || null,
        code: code || null,
        attemptNumber: newAttempts,
        _optimistic: true,
      }
      const next = [...submissions]; next[idx] = optimisticSub; setSubmissions(next)
      const na = [...attemptsCount]; na[idx] = newAttempts; setAttemptsCount(na)
      if (isCorrect || exhausted) {
        const nl = [...locks]; nl[idx] = true; setLocks(nl)
      }
      // Toast instant — actualizat după ce serverul răspunde (cu gems reale, etc.)
      if (isCorrect) {
        optimisticToastId = toast.success(`Corect! +${earnedXP} XP`)
      } else if (cur.type === 'MULTIPLE_SELECT' && pGrade > 0 && !exhausted) {
        optimisticToastId = toast(`Parțial corect: +${earnedXP} XP (${pGrade}%)`, { icon: '✨' })
      } else if (cur.type === 'MULTIPLE_SELECT' && pGrade > 0 && exhausted) {
        optimisticToastId = toast(`Parțial corect: +${earnedXP} XP (${pGrade}%) — încercări epuizate.`, { icon: '✨' })
      } else if (exhausted) {
        optimisticToastId = toast.error('Greșit — încercări epuizate. 0 XP.')
      } else {
        const nextGrade = applyHintPenalty(gradeForAttempt(cur, newAttempts + 1), curHintUsed)
        const nextXP = Math.round((cur.points ?? 10) * (nextGrade / 100))
        optimisticToastId = toast.error(`Greșit. Următoarea încercare valorează maxim ${nextXP} XP.`)
      }
    }

    // ── Captează state-ul curent pentru rollback (înainte să-l modificăm optimist) ──
    const prevSubmissions = [...submissions]
    const prevAttemptsCount = [...attemptsCount]
    const prevLocks = [...locks]

    // ── Fetch în fundal (non-coding) sau blocat cu await (CODING) ──
    const doFetch = async () => {
      const r = await fetch(`/api/public/learn/${token}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: cur.id, lessonId: lesson.id, source: 'lesson', answer: cur.type === 'MULTIPLE_SELECT' ? JSON.stringify(Array.isArray(answer) ? answer : []) : cur.type === 'ORDER_IMAGES' ? JSON.stringify(orderItems) : cur.type === 'FILL_IN' ? JSON.stringify(fillAnswers) : (cur.type === 'DRAG_BLOCKS' || cur.type === 'DRAG_INLINE') ? JSON.stringify(dragBlockSlots) : (answer || null), code: code || null, timeSpent: time }),
      })
      const d = await r.json()
      if (!r.ok) {
        // Server a refuzat — rollback optimistic update și arată eroarea reală
        if (isNonCoding) {
          setSubmissions(prevSubmissions)
          setAttemptsCount(prevAttemptsCount)
          setLocks(prevLocks)
          if (optimisticToastId) toast.dismiss(optimisticToastId)
        }
        if (r.status === 429 && d.cooldown) {
          const h = Math.floor(d.remainingMin / 60); const m = d.remainingMin % 60
          toast(`Așteaptă ${h ? h + 'h ' : ''}${m}min până la următoarea problemă`, { duration: 5000, icon: <ClockIcon className="w-5 h-5 text-amber-500" /> })
          setCooldownUntil(new Date(Date.now() + d.remainingMs))
          return
        }
        throw new Error(d.error || 'Eroare')
      }
      // Reconciliere cu răspunsul real al serverului — actualizează ID-ul real,
      // economy (gems, coins reale), XP capped daily, etc.
      setSubmissions(prev => { const n = [...prev]; n[idx] = d.submission; return n })
      if (d.locked) {
        setLocks(prev => { const n = [...prev]; n[idx] = true; return n })
      }
      // Pentru CODING (fără AI) — afișează toast acum (non-coding l-a afișat deja)
      if (!isNonCoding) {
        if (d.autoCorrect === true) {
          const earnedXP = Math.round((cur.points ?? 10) * (d.submission.grade / 100))
          const gemsEarned = d.economy?.gems || 0
          toast.success(`Corect! +${earnedXP} XP${gemsEarned ? ` 💎 +${gemsEarned} gems` : ''}`)
        } else if (d.locked) {
          toast.error(`Greșit — încercări epuizate. 0 XP.`)
          const capturedIdx = idx
          toast('Încercări epuizate — continuăm și revenim la această problemă la final', { icon: '🔁', duration: 4000 })
          const nextUnlocked = problems.findIndex((_, i) => i > capturedIdx && !d.locked)
          if (nextUnlocked !== -1) setTimeout(() => setIdx(nextUnlocked), 3500)
        } else {
          const nextGrade = applyHintPenalty(gradeForAttempt(cur, d.attemptNumber + 1), curHintUsed || d.hintUsed)
          const nextXP = Math.round((cur.points ?? 10) * (nextGrade / 100))
          toast.error(`Greșit. Următoarea încercare valorează maxim ${nextXP} XP.`)
        }
      } else {
        // NON-CODING: toast deja afișat. Adaugă gems dacă există.
        const gemsEarned = d.economy?.gems || 0
        if (d.autoCorrect === true && gemsEarned > 0) {
          toast.success(`💎 +${gemsEarned} gems`, { duration: 2500 })
        }
        if (d.locked && (d.submission.grade ?? 0) < 60) {
          const capturedIdx = idx
          toast('Încercări epuizate — continuăm și revenim la această problemă la final', { icon: '🔁', duration: 4000 })
          const locksSnap = [...locks]; locksSnap[capturedIdx] = true
          const nextUnlocked = problems.findIndex((_, i) => i > capturedIdx && !locksSnap[i])
          if (nextUnlocked !== -1) setTimeout(() => setIdx(nextUnlocked), 3500)
        }
      }
    }

    if (isNonCoding) {
      // Butonul e liber imediat — fetch rulează complet în fundal
      setSubmitting(false)
      doFetch().catch(e => toast.error(e.message))
    } else {
      // CODING: așteptăm serverul (AI grader) — butonul rămâne blocat
      setSubmitting(true)
      try { await doFetch() } catch (e) { toast.error(e.message) } finally { setSubmitting(false) }
    }
  }

  // Deblochează și navighează la o problemă din toRevisit — apelabilă de oriunde
  const goToNextRevisit = async (skipSet = new Set()) => {
    // Preferă o problemă diferită de cea curentă; cade pe curentă dacă e singura opțiune
    let nextRevisit = toRevisit.find(i => i !== idx && !skipSet.has(i))
    if (nextRevisit === undefined) nextRevisit = toRevisit.find(i => !skipSet.has(i))
    if (nextRevisit === undefined) {
      if (skipSet.size > 0) toast('Toate problemele blocate au soluția văzută — nu pot fi reîncercate.', { icon: 'ℹ️', id: 'all-blocked', duration: 5000 })
      return
    }
    const nl = [...locks]; nl[nextRevisit] = false; setLocks(nl)
    const ns = [...submissions]; ns[nextRevisit] = null; setSubmissions(ns)
    const na = [...attemptsCount]; na[nextRevisit] = 0; setAttemptsCount(na)
    const nv = [...solutionViewed]; nv[nextRevisit] = false; setSolutionViewed(nv)
    setSolutionData(prev => { const c = { ...prev }; delete c[problems[nextRevisit]?.id]; return c })
    setAiFeedback(prev => { const c = { ...prev }; delete c[problems[nextRevisit]?.id]; return c })
    // Reset input fields if we're staying on this problem
    if (nextRevisit === idx) {
      setAnswer('')
      setCode(problems[nextRevisit]?.starterCode || '')
      setResetKey(k => k + 1) // force re-render & trigger transitioning effect
    }
    setIdx(nextRevisit)
    const remaining = toRevisit.filter(i => !skipSet.has(i)).length - 1
    toast(`Revenim la problema ${nextRevisit + 1}${remaining > 0 ? ` — mai ai ${remaining} de revizuit după` : ' — ultima de revizuit!'}`, { id: 'revisit-nav', icon: '🔁', duration: 4000 })
    if (!isGuest) {
      try {
        const res = await fetch(`/api/public/learn/${token}/lesson/${lesson.id}/reset-problem`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemId: problems[nextRevisit]?.id }),
        })
        if (!res.ok) {
          // Reset refused (e.g. student viewed solution) — mark permanently blocked and skip
          const rl = [...locks]; rl[nextRevisit] = true; setLocks(rl)
          const data = await res.json().catch(() => ({}))
          toast(data.error || 'Problema nu poate fi resetată — sari peste ea', { id: 'reset-blocked', icon: '⚠️', duration: 4000 })
          const newSkip = new Set([...skipSet, nextRevisit])
          setPermanentlyBlocked(prev => new Set([...prev, nextRevisit]))
          // Move to next revisit, passing the accumulated skip set
          const nextAfter = toRevisit.find(i => !newSkip.has(i))
          if (nextAfter !== undefined) {
            setTimeout(() => goToNextRevisit(newSkip), 300)
          } else {
            toast('Toate problemele blocate au soluția văzută — nu pot fi reîncercate.', { icon: 'ℹ️', id: 'all-blocked', duration: 5000 })
          }
          return
        }
      } catch {
        // Network error — re-lock to stay consistent with server state
        const rl = [...locks]; rl[nextRevisit] = true; setLocks(rl)
        toast.error('Eroare la resetarea problemei. Încearcă din nou.')
        return
      }
      fetch(`/api/public/learn/${token}/lesson/${lesson.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentProblemIndex: nextRevisit }),
      }).catch(() => {})
    }
  }

  const nextProblem = () => {
    const ni = idx + 1
    if (ni < problems.length) {
      setIdx(ni)
      if (isGuest) return
      fetch(`/api/public/learn/${token}/lesson/${lesson.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentProblemIndex: ni }),
      }).catch(() => {})
      return
    }
    // Suntem la ultima — întâi verifică toRevisit
    if (toRevisit.length > 0) {
      goToNextRevisit()
      return
    }
    // Apoi verifică needsRetry (greșite neblocate)
    const firstWrong = problems.findIndex((_, i) => needsRetry(i))
    if (firstWrong !== -1) {
      setIdx(firstWrong)
      toast(`Reia problemele greșite (${wrongCount} ${wrongCount === 1 ? 'rămasă' : 'rămase'})`, { icon: '🔁' })
      if (isGuest) return
      fetch(`/api/public/learn/${token}/lesson/${lesson.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentProblemIndex: firstWrong }),
      }).catch(() => {})
    }
  }

  const finishLesson = () => {
    setFinishing(true)
    if (isGuest) {
      toast.success('Bravo! Ai terminat lecția (mod demo). Intră în cont ca să salvezi progresul!')
      setTimeout(() => router.push('/learn/guest'), 900)
      return
    }
    // OPTIMISTIC: arată toast-ul și navighează instant, fără să așteptăm serverul
    toast.success('Lecție finalizată! Bravo! 🎉')
    router.push(`/learn/${token}`)
    // Trimite PATCH în fundal pentru persistență — nu mai blocăm navigarea
    fetch(`/api/public/learn/${token}/lesson/${lesson.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    }).catch(() => {
      // Eroare silențioasă — progresul se va resincroniza la reîncărcare
    })
  }

  // ── SIDEBAR CONTENT (shared between desktop + mobile overlay) ──
  const SidebarContent = () => (
    <div className="flex flex-col min-h-full">
      {/* Back link */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <Link href={dashboardHref}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition">
          <ChevronLeftIcon className="w-4 h-4" /> Inapoi la module
        </Link>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {/* Module badge */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">{lesson.module.title}</div>

        {/* Lesson title */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {progress.theoryCompleted
              ? <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckSolid className="w-4 h-4 text-white" /></div>
              : <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"><BookOpenIcon className="w-4 h-4 text-white" /></div>
            }
            <h2 className="text-base font-extrabold text-white leading-tight">{lesson.title}</h2>
          </div>
        </div>

        {/* Step tabs */}
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => { setStep('theory'); setMobileSidebarOpen(false) }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${step === 'theory' ? 'bg-white text-[#136976] shadow' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            <BookOpenIcon className="w-3.5 h-3.5" /> Teorie
            {progress.theoryCompleted && <CheckSolid className="w-3 h-3 text-emerald-500" />}
          </button>
          <button onClick={() => { if (progress.theoryCompleted) { setStep('problems'); setMobileSidebarOpen(false) } }}
            disabled={!progress.theoryCompleted}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${step === 'problems' ? 'bg-white text-[#136976] shadow' : progress.theoryCompleted ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>
            <PuzzlePieceIcon className="w-3.5 h-3.5" /> Probleme
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-white/50 mb-1 font-semibold uppercase tracking-wider">
            <span>Progres</span><span>{doneCount}/{problems.length}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${lessonPct}%` }} />
          </div>
        </div>

        {/* Problems list — only when on problems tab */}
        {step === 'problems' && problems.length > 0 && (
          <div className="space-y-1 pt-1">
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Probleme</p>
            {problems.map((p, i) => {
              const s = submissions[i]
              const isOk = s?.status === 'GRADED' && (s.grade ?? 0) >= 60
              const isLocked = locks[i] && !isOk
              const isInRevisit = toRevisit.includes(i)
              const isWrong = !isOk && !isLocked && needsRetry(i)
              const isRev = s?.status === 'NEEDS_REVISION'
              const isPending = s && !isOk && !isRev && !isLocked && !isWrong && s.status === 'PENDING'
              const isActive = i === idx
              return (
                <button key={p.id} onClick={() => { setIdx(i); setMobileSidebarOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition ${isActive ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isActive ? 'bg-white text-[#136976]'
                    : isOk ? 'bg-emerald-500 text-white'
                    : isLocked ? 'bg-rose-600 text-white'
                    : isWrong ? 'bg-rose-500 text-white'
                    : isRev ? 'bg-rose-500 text-white'
                    : isPending ? 'bg-amber-500 text-white'
                    : 'bg-white/15 text-white/70'
                  }`}>
                    {isOk ? <CheckSolid className="w-3.5 h-3.5" /> : isLocked ? <LockClosedIcon className="w-3.5 h-3.5" /> : isWrong ? <ExclamationTriangleIcon className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/80 truncate font-medium">{p.title}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block ${DIFF_COLOR[p.difficulty]}`}>{DIFF_LABEL[p.difficulty]}</div>
                      {isInRevisit && <span className="text-[9px] text-amber-300 font-bold">🔁 revizuit</span>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Module lessons list */}
        {moduleLessons.length > 0 && (
          <div className="space-y-0.5 pt-1">
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Lectii in modul</p>
            {moduleLessons.map((l, i) => {
              const lp = progressByLesson[l.id]
              const done = !!lp?.completedAt
              const started = !!lp?.theoryCompleted && !done
              const isCurrent = l.id === lesson.id
              const prevLesson = moduleLessons[i - 1]
              const prevDone = i === 0 || !!progressByLesson[prevLesson?.id]?.completedAt
              const locked = !superStudent && !isCurrent && !done && !prevDone && !grantedLessonSet.has(l.id) && !l.isFree
              const inner = (
                <>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isCurrent ? 'bg-white text-[#136976]'
                    : done ? 'bg-emerald-500 text-white'
                    : locked ? 'bg-white/5 text-white/20'
                    : started ? 'bg-[#30919f] text-white'
                    : 'bg-white/15 text-white/60'
                  }`}>
                    {done && !isCurrent
                      ? <CheckSolid className="w-3.5 h-3.5" />
                      : locked
                        ? <LockClosedIcon className="w-3.5 h-3.5" />
                        : i + 1
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs truncate font-medium ${
                      isCurrent ? 'text-white font-bold'
                      : done ? 'text-white/70'
                      : locked ? 'text-white/20'
                      : 'text-white/50'
                    }`}>{l.title}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">
                      {l._count.problems} {l._count.problems === 1 ? 'problema' : 'probleme'}
                    </div>
                  </div>
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />}
                  {locked && !isCurrent && <LockClosedIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />}
                </>
              )
              return locked ? (
                <div key={l.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-not-allowed opacity-60">
                  {inner}
                </div>
              ) : (
                <Link
                  key={l.id}
                  href={`${lessonHrefBase}/${l.id}`}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    isCurrent ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'
                  }`}>
                  {inner}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Finish button */}
      {step === 'problems' && allDone && (
        <div className="p-4 border-t border-white/10 space-y-2">
          {revisionCount > 0 && (
            <button onClick={() => { const i = problems.findIndex((_, i) => submissions[i]?.status === 'NEEDS_REVISION'); if (i !== -1) setIdx(i) }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-xl font-bold text-sm shadow transition">
              <ExclamationTriangleIcon className="w-4 h-4" />
              Refă problema ({revisionCount} de refăcut)
            </button>
          )}
          <button onClick={finishLesson} disabled={finishing}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1a1d] rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition disabled:opacity-60">
            <TrophyIcon className="w-5 h-5" />
            {finishing ? 'Se salveaza...' : revisionCount > 0 ? 'Finalizează oricum' : 'Finalizeaza lectia'}
          </button>
        </div>
      )}
      {/* Reset lecție — mereu vizibil jos în sidebar */}
      {step === 'problems' && !isGuest && (
        <div className="p-3 border-t border-white/10">
          <button onClick={resetLesson} disabled={resetting}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-white/40 hover:text-rose-300 hover:bg-white/5 rounded-lg transition">
            <ArrowPathIcon className="w-3.5 h-3.5" />
            {resetting ? 'Se resetează...' : 'Resetează lecția (0 de la capăt)'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex bg-[#f0fafb] overflow-hidden" style={{ height: '100vh', marginTop: 'calc(-1 * env(safe-area-inset-top))' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 text-white overflow-y-auto" style={{ background: 'linear-gradient(to bottom, #0c1a1d, #0f2127, #136976)' }}>
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 text-white flex flex-col overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top)', background: 'linear-gradient(to bottom, #0c1a1d, #0f2127, #136976)' }}>
            <div className="flex items-center justify-between px-4 pt-4 shrink-0">
              <span className="text-sm font-bold text-white/70">Navigare</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 bg-white/10 rounded-lg">
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 px-4 sm:px-6 pb-3 flex items-center gap-3 text-white shadow-sm" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', background: 'linear-gradient(to right, #0c1a1d, #136976)' }}>
          {/* Mobile menu btn */}
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-1.5 bg-white/15 rounded-lg">
            <Bars3Icon className="w-5 h-5 text-white" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/60 truncate">{lesson.module.title}</div>
            <div className="font-bold text-sm truncate">{lesson.title}</div>
          </div>

          {step === 'problems' && cur && (
            <div className="flex items-center gap-2 shrink-0">
              <Timer seconds={time} />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFF_COLOR[cur.difficulty]}`}>
                {DIFF_LABEL[cur.difficulty]}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/15 rounded-full text-xs font-bold">
                <StarIcon className="w-3 h-3 text-yellow-300" /> {cur.points}
              </span>
            </div>
          )}
          {step === 'theory' && (
            <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full">
              <BookOpenIcon className="w-3.5 h-3.5" /> Teorie
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#c8eaee] shrink-0">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500" style={{ width: `${lessonPct}%` }} />
        </div>

        {/* Guest banner */}
        {isGuest && (
          <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <SparklesIcon className="w-4 h-4 shrink-0" />
              <span><strong>Mod demo</strong> — progresul nu se salvează, AI și submisiile sunt dezactivate.</span>
            </div>
            <Link href="/learn/login" className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shrink-0">
              Intră în cont <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">

            {/* THEORY */}
            {step === 'theory' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-teal-100">
                <div className="px-6 py-4 border-b border-teal-100 flex items-center gap-3" style={{ background: 'linear-gradient(to right, #136976, #30919f)' }}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow">
                    <AcademicCapIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold">Teorie</div>
                    <h1 className="text-lg font-extrabold text-white">{lesson.title}</h1>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  {lesson.videoUrl && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-black shadow">
                      <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen />
                    </div>
                  )}
                  <article className="space-y-1.5 text-sm leading-relaxed">{renderTheory(lesson.theory)}</article>
                  <div className="mt-8 pt-5 border-t border-teal-100 flex justify-end">
                    <button onClick={completeTheory}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition shadow">
                      <CheckCircleIcon className="w-5 h-5" />
                      Am inteles — treci la probleme
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NO PROBLEMS */}
            {step === 'problems' && problems.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-400 border border-teal-100">
                Nicio problema in aceasta lectie.
              </div>
            )}

            {/* PROBLEM */}
            {step === 'problems' && cur && transitioning && (
              <div className="space-y-3 animate-pulse">
                <div className="bg-white rounded-xl shadow-sm h-12 border border-teal-100" />
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-teal-100">
                  <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-full" />
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
                  <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                  <div className="mt-4 h-28 bg-slate-100 rounded-xl" />
                  <div className="h-10 bg-slate-200 rounded-xl w-1/3 ml-auto" />
                </div>
              </div>
            )}

            {step === 'problems' && cur && !transitioning && (
              <div className="space-y-3">
                {/* Problem nav pills (mobile-friendly horizontal scroll) */}
                <div className="bg-white rounded-xl shadow-sm p-2 flex gap-1.5 overflow-x-auto border border-teal-100">
                  {problems.map((p, i) => {
                    const s = submissions[i]
                    const isOk = s?.status === 'GRADED' && (s.grade ?? 0) >= 60
                    const isLocked = locks[i] && (s?.grade ?? 0) === 0
                    const isWrong = !isOk && !isLocked && needsRetry(i)
                    const isRev = s?.status === 'NEEDS_REVISION'
                    const isPending = s && !isOk && !isRev && !isLocked && !isWrong && s.status === 'PENDING'
                    const isRevisit = toRevisit.includes(i)
                    const cls = i === idx
                      ? 'bg-[#30919f] text-white ring-2 ring-[#30919f]/50'
                      : isOk ? 'bg-emerald-100 text-emerald-700'
                      : isLocked ? 'bg-rose-200 text-rose-800'
                      : isRevisit ? 'bg-rose-200 text-rose-800'
                      : isWrong ? 'bg-rose-100 text-rose-700'
                      : isRev ? 'bg-rose-100 text-rose-700'
                      : isPending ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-[#136976]'
                    return (
                      <button key={p.id} onClick={() => setIdx(i)}
                        className={`min-w-[38px] h-9 rounded-lg text-sm font-bold transition flex items-center justify-center ${cls}`}>
                        {isOk ? <CheckSolid className="w-4 h-4" /> : isLocked ? <LockClosedIcon className="w-3.5 h-3.5" /> : isRevisit ? <ArrowPathIcon className="w-3.5 h-3.5" /> : isWrong ? <ExclamationTriangleIcon className="w-3.5 h-3.5" /> : i + 1}
                      </button>
                    )
                  })}
                </div>

                {/* Problem card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-teal-100">
                  <div className="px-5 py-4 border-b border-teal-100 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Problema {idx + 1} din {problems.length}</div>
                      <h2 className="text-lg font-extrabold text-[#0f2127] mt-0.5">{cur.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${DIFF_COLOR[cur.difficulty]}`}>{DIFF_LABEL[cur.difficulty]}</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                        <StarIcon className="w-3 h-3 text-amber-400" /> {cur.points} pct
                      </span>
                      {!curLocked && curAttempts > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                          Încercare {curAttempts + 1}/{curMaxAttempts}
                        </span>
                      )}
                      {curHintUsed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                          <LightBulbIcon className="w-3 h-3" /> Hint −{Math.round((cur.points ?? 10) * 10 / 100)} XP
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    {cur.type !== 'DRAG_INLINE' && (
                      <Markdown text={cur.description} className="text-base text-slate-700 leading-relaxed" />
                    )}

                    {/* Soluția — afișată dacă elevul a apăsat „Vezi rezolvarea" */}
                    {curSolutionViewed && solutionData[cur.id] && (
                      <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-[#136976] font-bold">
                          <EyeIcon className="w-5 h-5" /> Rezolvare
                        </div>
                        {solutionData[cur.id].correctAnswer && (
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#136976] mb-1">Răspuns corect</div>
                            <code className="block bg-white px-3 py-2 rounded-lg text-sm font-mono text-slate-800 border border-teal-100">{solutionData[cur.id].correctAnswer}</code>
                          </div>
                        )}
                        {solutionData[cur.id].explanation && (
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#136976] mb-1">Explicație</div>
                            <Markdown text={solutionData[cur.id].explanation} compact className="text-sm text-slate-700" />
                          </div>
                        )}
                      </div>
                    )}

                    {curSub && curLocked ? (
                      <div className="space-y-3">
                        {/* Dacă avem feedback AI proaspăt → card Mr. Olla, altfel cardul clasic */}
                        {canUseAi && aiFeedback[cur.id] ? (
                          <AiFeedback
                            key={`${cur.id}-${curAttempts}`}
                            data={aiFeedback[cur.id]}
                            token={token}
                            onClose={() => setAiFeedback(prev => { const c = { ...prev }; delete c[cur.id]; return c })}
                          />
                        ) : (
                          <div className={`rounded-xl p-4 border-2 ${curSub.status === 'GRADED' && (curSub.grade ?? 0) >= 60 ? 'bg-emerald-50 border-emerald-200' : (curSub.grade ?? 0) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
                            <div className="flex items-center gap-2 font-bold flex-wrap">
                              {curSub.status === 'GRADED' && (curSub.grade ?? 0) >= 60 ? (
                                <><CheckCircleIcon className="w-5 h-5 text-emerald-600" /><span className="text-emerald-800">Rezolvat — bravo!</span></>
                              ) : curSolutionViewed ? (
                                <><EyeIcon className="w-5 h-5 text-rose-600" /><span className="text-rose-800">Rezolvare văzută — 0p</span></>
                              ) : (curSub.grade ?? 0) > 0 ? (
                                <><ExclamationTriangleIcon className="w-5 h-5 text-amber-600" /><span className="text-amber-800">Parțial corect — {Math.round((cur.points ?? 10) * (curSub.grade ?? 0) / 100)}p</span></>
                              ) : (
                                <><LockClosedIcon className="w-5 h-5 text-rose-600" /><span className="text-rose-800">Încercări epuizate — 0p</span></>
                              )}
                              {typeof curSub.grade === 'number' && (
                                <span className="ml-auto text-sm text-slate-700">Nota: <strong className="text-lg text-slate-900">{Math.round((cur.points ?? 10) * (curSub.grade ?? 0) / 100)}/{cur.points ?? 10}</strong> <span className="text-slate-500 text-xs">({curSub.grade}%)</span></span>
                              )}
                            </div>
                            {curSub.feedback && (
                              <div className="mt-3 p-3 bg-white/60 rounded-lg text-sm text-slate-800">
                                <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Feedback profesor</div>
                                <Markdown text={curSub.feedback} compact />
                              </div>
                            )}
                            {curSub.answer && (
                              <div className="mt-2 text-xs text-slate-500">
                                Răspunsul tău: <code className="bg-white px-1.5 py-0.5 rounded font-mono">{curSub.answer || (curSub.code ? '(cod)' : '(gol)')}</code>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Butoane acțiuni — în afara cardului AI/feedback */}
                        {(curSub.grade ?? 0) < 100 && (() => {
                          const nextUnlockedIdx = problems.findIndex((_, i) => i > idx && !locks[i] && !isProblemDone(i))
                          const nextRevisitIdx = toRevisit.find(i => i !== idx)
                          const nextToGo = nextUnlockedIdx !== -1 ? nextUnlockedIdx : -1
                          return (
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {/* Finalizează lecția dacă totul e gata */}
                                {allDone && (
                                  <button onClick={finishLesson} disabled={finishing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1a1d] rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-50 shadow transition active:scale-95">
                                    <TrophyIcon className="w-4 h-4" /> {finishing ? 'Se salveaza...' : 'Finalizează lecția'}
                                  </button>
                                )}
                                {/* Mergi la urm problemă deblocată sau la urm din revisit */}
                                {!allDone && nextToGo !== -1 && (
                                  <button onClick={() => setIdx(nextToGo)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition active:scale-95">
                                    Continuă <ChevronRightIcon className="w-4 h-4" />
                                  </button>
                                )}
                                {/* Dacă nu mai sunt probleme deblocate dar sunt revisit-uri */}
                                {!allDone && nextToGo === -1 && nextRevisitIdx !== undefined && (
                                  <button onClick={() => goToNextRevisit()}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition active:scale-95">
                                    <ArrowPathIcon className="w-4 h-4" /> Reia blocată ({toRevisit.length})
                                  </button>
                                )}
                                {/* Revin la final — badge informativ */}
                                {toRevisit.includes(idx) && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold">
                                    <ArrowPathIcon className="w-3.5 h-3.5 shrink-0" /> Programată pentru revizuit
                                  </span>
                                )}
                                {/* Vezi rezolvarea */}
                                {!curSolutionViewed && (curSub.grade ?? 0) < 60 && (
                                  <button onClick={viewSolution} disabled={solutionLoading}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-slate-200 text-slate-500 hover:border-teal-300 hover:text-[#136976] rounded-xl text-sm font-semibold disabled:opacity-60 transition">
                                    <EyeIcon className="w-4 h-4" /> {solutionLoading ? 'Se încarcă...' : 'Vezi rezolvarea (0p)'}
                                  </button>
                                )}
                              </div>
                              <div className="pt-1 flex items-center gap-3 flex-wrap">
                                <button onClick={resetLesson} disabled={resetting}
                                  className="text-xs text-slate-400 hover:text-rose-600 underline underline-offset-2 transition">
                                  {resetting ? 'Se resetează...' : 'Resetează lecția de la 0'}
                                </button>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ) : curSub && curSub.status === 'PENDING' ? (
                      <div className="rounded-xl p-4 border-2 bg-amber-50 border-amber-200">
                        <div className="flex items-center gap-2 font-bold text-amber-800">
                          <ClockIcon className="w-5 h-5" /> În așteptarea profesorului
                        </div>
                        {curSub.code && (
                          <div className="mt-2 text-xs text-slate-600">
                            Cod trimis. Profesorul va nota lucrarea.
                          </div>
                        )}
                      </div>
                    ) : curSub && curSub.status === 'NEEDS_REVISION' ? (
                      <div className="rounded-xl p-4 border-2 bg-rose-50 border-rose-200">
                        <div className="flex items-center gap-2 font-bold text-rose-800 mb-2">
                          <ExclamationTriangleIcon className="w-5 h-5" /> Profesorul cere refacere
                        </div>
                        {curSub.feedback && (
                          <div className="mt-2 p-3 bg-white/60 rounded-lg text-sm text-slate-800">
                            <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Feedback profesor</div>
                            <Markdown text={curSub.feedback} compact />
                          </div>
                        )}
                        <button onClick={() => { const next = [...submissions]; next[idx] = null; setSubmissions(next) }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700">
                          <ArrowPathIcon className="w-4 h-4" /> Refă problema
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Feedback de la încercarea anterioară greșită */}
                        {curAttempts > 0 && curSub && curSub.status === 'GRADED' && curSub.autoCorrect === false && !curLocked && (
                          <div className="rounded-xl p-3 bg-rose-50 border-2 border-rose-200 text-sm">
                            <div className="font-bold text-rose-800 flex items-center gap-2">
                              <ExclamationTriangleIcon className="w-4 h-4" /> Răspuns greșit la încercarea {curAttempts}
                            </div>
                            <div className="text-xs text-rose-700 mt-1">
                              Mai ai {curMaxAttempts - curAttempts} {curMaxAttempts - curAttempts === 1 ? 'încercare' : 'încercări'}. Următoarea valorează maxim {Math.round((cur.points ?? 10) * applyHintPenalty(gradeForAttempt(cur, curAttempts + 1), curHintUsed) / 100)} XP.
                            </div>
                          </div>
                        )}

                        {cur.type === 'MULTIPLE_CHOICE' && (
                          <div className="space-y-2">
                            {cur.options?.map((opt, i) => (
                              <label key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${answer === opt ? 'border-[#30919f] bg-teal-50 shadow-sm' : 'border-slate-200 hover:border-teal-200 hover:bg-teal-50/50'}`}>
                                <input type="radio" name="opt" checked={answer === opt} onChange={() => setAnswer(opt)} className="w-4 h-4 accent-[#30919f]" />
                                <span className="text-sm text-slate-800">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {cur.type === 'MULTIPLE_SELECT' && (
                          <div className="space-y-2">
                            {cur.options?.map((opt, i) => {
                              const arr = Array.isArray(answer) ? answer : []
                              const checked = arr.includes(opt)
                              return (
                                <label key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${checked ? 'border-[#30919f] bg-teal-50 shadow-sm' : 'border-slate-200 hover:border-teal-200 hover:bg-teal-50/50'}`}>
                                  <input type="checkbox" checked={checked}
                                    onChange={() => setAnswer(checked ? arr.filter(v => v !== opt) : [...arr, opt])}
                                    className="w-4 h-4 accent-[#30919f] rounded" />
                                  <span className="text-sm text-slate-800">{opt}</span>
                                </label>
                              )
                            })}
                            <p className="text-xs text-[#a0b8bc] pt-1">☑️ Selectează toate variantele corecte</p>
                          </div>
                        )}
                        {cur.type === 'SHORT_ANSWER' && (
                          <input value={answer} onChange={e => setAnswer(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-800 rounded-xl text-sm focus:border-[#30919f] focus:ring-2 focus:ring-teal-100 outline-none transition"
                            placeholder="Scrie raspunsul tau..." />
                        )}
                        {cur.type === 'INPUT_OUTPUT' && (
                          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4}
                              className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-800 rounded-xl font-mono text-sm focus:border-[#30919f] outline-none"
                            placeholder="Output asteptat..." />
                        )}
                        {cur.type === 'CODING' && (
                          <div className="space-y-3">
                            <CodeRunner
                              code={code}
                              setCode={setCode}
                              language={cur.language || 'python'}
                              starter={cur.starterCode || ''}
                              rows={12}
                              onOutput={setLastOutput}
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs text-slate-400 flex-1 min-w-[180px]">💡 Apasă „Rulează" ca să testezi codul. Apoi apasă „Trimite"{canUseAi ? ' — Olla AI te va nota cu AI.' : '.'}</p>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                                💎 până la {Math.max(1, Math.round((cur.points || 10) / 5))} gems
                              </span>
                              {canUseAi && !chatOpen[cur.id] && (
                                <button
                                  type="button"
                                  onClick={() => setChatOpen(s => ({ ...s, [cur.id]: true }))}
                                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#30919f] to-[#136976] hover:from-[#136976] hover:to-[#0f2127] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95"
                                >
                                  <SparklesIcon className="w-5 h-5" />
                                  <span>Cere ajutor de la AI</span>
                                  <span className="px-1.5 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded shadow-sm">AI</span>
                                  <span className="absolute inset-0 rounded-xl ring-2 ring-[#30919f] ring-opacity-0 group-hover:ring-opacity-50 transition" />
                                </button>
                              )}
                            </div>
                            {!canUseAi && (
                              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-3 flex items-start gap-2.5 text-xs sm:text-sm">
                                <SparklesIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  {isGuest ? (
                                    <>
                                      <div className="font-bold text-amber-900">Mr. Olla (AI) — disponibil doar pentru elevi înscriși</div>
                                      <div className="text-amber-800 mt-0.5">
                                        În modul demo nu ai acces la corectarea AI. Codul tău se rulează local în browser și se compară cu rezultatul așteptat. <Link href="/learn/login" className="underline font-bold">Intră în contul tău</Link> pentru notare instant cu AI.
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="font-bold text-amber-900">Olla AI e disponibil cu abonament</div>
                                      <div className="text-amber-800 mt-0.5">Cere profesorului să-ți activeze abonamentul pentru notare instant cu AI și ajutor cu indicii. Codul tău va fi trimis profesorului spre evaluare.</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                            {canUseAi && chatOpen[cur.id] && (
                              <AiChat
                                token={token}
                                problemId={cur.id}
                                lessonId={lesson.id}
                                getCode={() => code}
                                onClose={() => setChatOpen(s => ({ ...s, [cur.id]: false }))}
                              />
                            )}
                            {canUseAi && submitting && cur.type === 'CODING' && !aiFeedback[cur.id] && (
                              <AiGradingLoader />
                            )}
                            {canUseAi && aiFeedback[cur.id] && (
                              <>
                                <AiFeedback
                                  key={`${cur.id}-${curAttempts}`}
                                  data={aiFeedback[cur.id]}
                                  token={token}
                                  onClose={() => setAiFeedback(prev => { const c = { ...prev }; delete c[cur.id]; return c })}
                                />
                                <button
                                  onClick={() => setAiFeedback(prev => { const c = { ...prev }; delete c[cur.id]; return c })}
                                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 border-2 border-teal-200 hover:border-[#30919f] text-[#136976] hover:text-[#0f2127] rounded-xl font-semibold text-sm transition active:scale-95"
                                >
                                  <ArrowPathIcon className="w-4 h-4" /> Întoarce-te la cod
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {cur.type === 'ORDER_IMAGES' && (
                          <div className="space-y-3">
                            <div className="bg-[#e8f7f9] border border-[#30919f]/30 rounded-xl px-4 py-3 text-sm text-[#136976] font-medium">
                              🖼️ <strong>Aranjează imaginile</strong> în ordinea corectă — folosește săgețile sau trage (drag &amp; drop).
                            </div>
                            {orderItems.map((url, i) => (
                              <div key={`${url}-${i}`} className="flex justify-center">
                                <div
                                  draggable
                                  onDragStart={e => {
                                    e.dataTransfer.effectAllowed = 'move'
                                    e.dataTransfer.setData('text/plain', String(i))
                                    dragRef.current = i
                                  }}
                                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
                                  onDrop={e => {
                                    e.preventDefault()
                                    const from = dragRef.current ?? Number(e.dataTransfer.getData('text/plain'))
                                    if (from === i) return
                                    const arr = [...orderItems]
                                    const [item] = arr.splice(from, 1)
                                    arr.splice(i, 0, item)
                                    setOrderItems(arr)
                                    setAnswer(JSON.stringify(arr))
                                    dragRef.current = null
                                  }}
                                  onDragEnd={() => { dragRef.current = null }}
                                  className="flex items-stretch bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#30919f]/60 hover:shadow-md transition cursor-grab active:cursor-grabbing active:border-[#30919f] active:scale-[1.02] active:shadow-lg"
                                  style={{ width: '50%' }}
                                >
                                  {/* Nr. ordine */}
                                  <div className="w-12 bg-gradient-to-b from-[#30919f] to-[#136976] flex items-center justify-center shrink-0 pointer-events-none">
                                    <span className="text-white font-black text-xl">{i + 1}</span>
                                  </div>
                                  {/* Imagine 16:9 */}
                                  <div className="flex-1 relative pointer-events-none" style={{ aspectRatio: '16/9' }}>
                                    <img
                                      src={url}
                                      alt={`Imagine ${i + 1}`}
                                      className="absolute inset-0 w-full h-full object-cover"
                                      draggable={false}
                                    />
                                  </div>
                                  {/* Butoane sus/jos */}
                                  <div className="flex flex-col shrink-0 border-l-2 border-slate-100">
                                    <button
                                      type="button"
                                      disabled={i === 0}
                                      onClick={e => {
                                        e.stopPropagation()
                                        const arr = [...orderItems];[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
                                        setOrderItems(arr); setAnswer(JSON.stringify(arr))
                                      }}
                                      className="flex-1 w-12 flex items-center justify-center bg-[#30919f] hover:bg-[#136976] disabled:bg-slate-100 transition"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i === 0 ? 'text-slate-300' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                      </svg>
                                    </button>
                                    <div className="h-px bg-slate-100" />
                                    <button
                                      type="button"
                                      disabled={i === orderItems.length - 1}
                                      onClick={e => {
                                        e.stopPropagation()
                                        const arr = [...orderItems];[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                                        setOrderItems(arr); setAnswer(JSON.stringify(arr))
                                      }}
                                      className="flex-1 w-12 flex items-center justify-center bg-[#30919f] hover:bg-[#136976] disabled:bg-slate-100 transition"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i === orderItems.length - 1 ? 'text-slate-300' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {cur.type === 'FILL_IN' && (
                          <div className="space-y-3">
                            <div className="bg-[#e8f7f9] border border-[#30919f]/30 rounded-xl px-4 py-3 text-sm text-[#136976] font-medium">
                              ✏️ Completează spațiile libere cu răspunsul corect.
                            </div>
                            {cur.options?.map((label, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 flex-wrap">
                                <span className="w-7 h-7 rounded-full bg-[#30919f] text-white font-black text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                                <span className="text-base text-slate-800 font-medium flex-1 min-w-[120px]">{label}</span>
                                <input
                                  value={fillAnswers[i] || ''}
                                  onChange={e => {
                                    const arr = [...fillAnswers]; arr[i] = e.target.value
                                    setFillAnswers(arr)
                                    setAnswer(JSON.stringify(arr))
                                  }}
                                  className="w-40 px-4 py-2.5 border-2 border-[#30919f] bg-teal-50 rounded-xl text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300 transition placeholder-slate-400"
                                  placeholder="răspuns..."
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {cur.type === 'DRAG_BLOCKS' && (() => {
                          // dragRef.current = { from: 'pool'|'slot', pi?: number, si?: number, token: string }
                          const COLORS = [
                            ['bg-violet-100 border-violet-400 text-violet-900', 'bg-violet-200'],
                            ['bg-amber-100 border-amber-400 text-amber-900', 'bg-amber-200'],
                            ['bg-rose-100 border-rose-400 text-rose-900', 'bg-rose-200'],
                            ['bg-emerald-100 border-emerald-400 text-emerald-900', 'bg-emerald-200'],
                            ['bg-blue-100 border-blue-400 text-blue-900', 'bg-blue-200'],
                            ['bg-pink-100 border-pink-400 text-pink-900', 'bg-pink-200'],
                          ]
                          const allTokens = cur.options || []
                          const tokenColorIdx = {}
                          allTokens.forEach((t, i) => { if (tokenColorIdx[t] === undefined) tokenColorIdx[t] = i % COLORS.length })
                          const tc = (t) => COLORS[tokenColorIdx[t] ?? 0][0]

                          const applyDrop = (target) => {
                            // target = { to: 'pool' } | { to: 'slot', si: number }
                            const drag = dragRef.current
                            if (!drag) return
                            dragRef.current = null

                            // Folosim valorile curente din closure (render-time)
                            const slots = [...dragBlockSlots]
                            const pool = [...dragBlockPool]

                            let token
                            if (drag.from === 'pool') {
                              token = pool.splice(drag.pi, 1)[0]
                            } else {
                              token = slots[drag.si]
                              slots[drag.si] = null
                            }

                            if (target.to === 'slot') {
                              const displaced = slots[target.si]
                              slots[target.si] = token
                              if (displaced) {
                                if (drag.from === 'slot') slots[drag.si] = displaced
                                else pool.push(displaced)
                              }
                            } else {
                              pool.push(token)
                            }

                            setDragBlockPool(pool)
                            setDragBlockSlots(slots)
                            setAnswer(JSON.stringify(slots))
                          }

                          const placeToken = (token, pi) => {
                            const slotIdx = dragBlockSlots.findIndex(s => s === null)
                            if (slotIdx === -1) return
                            const newSlots = [...dragBlockSlots]; newSlots[slotIdx] = token
                            const newPool = [...dragBlockPool]; newPool.splice(pi, 1)
                            setDragBlockSlots(newSlots); setDragBlockPool(newPool)
                            setAnswer(JSON.stringify(newSlots))
                          }

                          const removeFromSlot = (si) => {
                            const token = dragBlockSlots[si]
                            if (!token) return
                            const newSlots = [...dragBlockSlots]; newSlots[si] = null
                            setDragBlockSlots(newSlots)
                            setDragBlockPool(prev => [...prev, token])
                            setAnswer(JSON.stringify(newSlots))
                          }

                          const onDrop = (e, target) => {
                            e.preventDefault(); e.stopPropagation()
                            applyDrop(target)
                          }

                          return (
                            <div className="space-y-4">
                              {/* Token pool */}
                              <div
                                className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4"
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => onDrop(e, { to: 'pool' })}
                              >
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                  🎴 Token-uri — <span className="text-[#30919f]">apasă</span> sau <span className="text-[#30919f]">trage</span>
                                </p>
                                <div className="flex flex-wrap gap-2 min-h-[52px]">
                                  {dragBlockPool.length === 0 && (
                                    <span className="text-sm text-slate-400 italic self-center">Toate token-urile au fost plasate ✓</span>
                                  )}
                                  {dragBlockPool.map((token, pi) => (
                                    <div
                                      key={`pool-${token}-${pi}`}
                                      draggable
                                      onDragStart={e => {
                                        e.stopPropagation()
                                        dragRef.current = { from: 'pool', pi, token }
                                        e.dataTransfer.effectAllowed = 'move'
                                        e.dataTransfer.setData('text/plain', 'drag')
                                      }}
                                      onDragEnd={() => { dragRef.current = null }}
                                      onClick={() => placeToken(token, pi)}
                                      className={`px-5 py-3 rounded-xl border-2 font-black text-xl cursor-grab active:cursor-grabbing select-none transition active:scale-95 shadow-sm ${tc(token)}`}
                                    >
                                      {token}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Sloturi */}
                              <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">📥 Sloturi — trage sau apasă un token, apoi apasă slotul</p>
                                <div className="flex flex-wrap gap-4">
                                  {dragBlockSlots.map((slotToken, si) => (
                                    <div
                                      key={si}
                                      onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
                                      onDrop={e => onDrop(e, { to: 'slot', si })}
                                      className="flex flex-col items-center gap-1"
                                    >
                                      <span className="text-xs font-black text-slate-400">{si + 1}</span>
                                      {slotToken ? (
                                        <div
                                          draggable
                                          onDragStart={e => {
                                            e.stopPropagation()
                                            dragRef.current = { from: 'slot', si, token: slotToken }
                                            e.dataTransfer.effectAllowed = 'move'
                                            e.dataTransfer.setData('text/plain', 'drag')
                                          }}
                                          onDragEnd={() => { dragRef.current = null }}
                                          onClick={() => removeFromSlot(si)}
                                          title="Click = înapoi în pool"
                                          className={`w-16 h-16 rounded-2xl border-2 font-black text-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow transition active:scale-95 ${tc(slotToken)}`}
                                        >
                                          {slotToken}
                                        </div>
                                      ) : (
                                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#30919f]/40 bg-teal-50 flex items-center justify-center text-[#30919f]/30 text-3xl select-none">
                                          ?
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })()}

                        {cur.type === 'DRAG_INLINE' && (() => {
                          // Aceleași COLORS + tc helper ca la DRAG_BLOCKS
                          const COLORS = [
                            ['bg-violet-100 border-violet-400 text-violet-900', 'bg-violet-200'],
                            ['bg-amber-100 border-amber-400 text-amber-900', 'bg-amber-200'],
                            ['bg-rose-100 border-rose-400 text-rose-900', 'bg-rose-200'],
                            ['bg-emerald-100 border-emerald-400 text-emerald-900', 'bg-emerald-200'],
                            ['bg-blue-100 border-blue-400 text-blue-900', 'bg-blue-200'],
                            ['bg-pink-100 border-pink-400 text-pink-900', 'bg-pink-200'],
                          ]
                          const allTokens = cur.options || []
                          const tokenColorIdx = {}
                          allTokens.forEach((t, i) => { if (tokenColorIdx[t] === undefined) tokenColorIdx[t] = i % COLORS.length })
                          const tc = (t) => COLORS[tokenColorIdx[t] ?? 0][0]

                          // Split description by ___ to get text segments
                          const parts = cur.description.split('___')
                          const blankCount = parts.length - 1

                          const applyDropInline = (target) => {
                            const drag = dragRef.current
                            if (!drag) return
                            dragRef.current = null
                            const slots = [...dragBlockSlots]
                            const pool = [...dragBlockPool]
                            let token
                            if (drag.from === 'pool') {
                              token = pool.splice(drag.pi, 1)[0]
                            } else {
                              token = slots[drag.si]
                              slots[drag.si] = null
                            }
                            if (target.to === 'slot') {
                              const displaced = slots[target.si]
                              slots[target.si] = token
                              if (displaced) {
                                if (drag.from === 'slot') slots[drag.si] = displaced
                                else pool.push(displaced)
                              }
                            } else {
                              pool.push(token)
                            }
                            setDragBlockPool(pool)
                            setDragBlockSlots(slots)
                            setAnswer(JSON.stringify(slots))
                          }

                          const placeToken = (token, pi) => {
                            const si = dragBlockSlots.findIndex(s => s === null)
                            if (si === -1) return
                            const slots = [...dragBlockSlots]; slots[si] = token
                            const pool = [...dragBlockPool]; pool.splice(pi, 1)
                            setDragBlockSlots(slots); setDragBlockPool(pool)
                            setAnswer(JSON.stringify(slots))
                          }

                          const removeFromSlotInline = (si) => {
                            const token = dragBlockSlots[si]
                            if (!token) return
                            const slots = [...dragBlockSlots]; slots[si] = null
                            setDragBlockSlots(slots)
                            setDragBlockPool(prev => [...prev, token])
                            setAnswer(JSON.stringify(slots))
                          }

                          return (
                            <div className="space-y-5">
                              {/* Inline text with blanks */}
                              <div className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-lg font-semibold text-slate-800 leading-loose">
                                {parts.map((part, i) => (
                                  <span key={i}>
                                    {/* Text segment — render with line breaks */}
                                    {part.split('\n').map((line, li) => (
                                      <span key={li}>{li > 0 && <br />}{line}</span>
                                    ))}
                                    {/* Blank slot after each part except last */}
                                    {i < blankCount && (
                                      <span
                                        onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
                                        onDrop={e => {
                                          e.preventDefault(); e.stopPropagation()
                                          applyDropInline({ to: 'slot', si: i })
                                        }}
                                        className="inline-flex items-center mx-1 align-middle"
                                      >
                                        {dragBlockSlots[i] ? (
                                          <span
                                            draggable
                                            onDragStart={e => {
                                              e.stopPropagation()
                                              dragRef.current = { from: 'slot', si: i, token: dragBlockSlots[i] }
                                              e.dataTransfer.effectAllowed = 'move'
                                              e.dataTransfer.setData('text/plain', 'drag')
                                            }}
                                            onDragEnd={() => { dragRef.current = null }}
                                            onClick={() => removeFromSlotInline(i)}
                                            title="Click = înapoi în pool"
                                            className={`inline-flex items-center px-3 py-1 rounded-xl border-2 font-black text-base cursor-grab active:cursor-grabbing select-none shadow-sm transition active:scale-95 ${tc(dragBlockSlots[i])}`}
                                          >
                                            {dragBlockSlots[i]}
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center justify-center px-4 py-1 rounded-xl border-2 border-dashed border-[#30919f]/50 bg-teal-50 text-[#30919f]/40 font-black text-base min-w-[52px] select-none">
                                            ?
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>

                              {/* Token pool */}
                              <div
                                className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4"
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                  e.preventDefault()
                                  applyDropInline({ to: 'pool' })
                                }}
                              >
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                  🎴 Token-uri — <span className="text-[#30919f]">apasă</span> sau <span className="text-[#30919f]">trage</span> în blank
                                </p>
                                <div className="flex flex-wrap gap-2 min-h-[48px]">
                                  {dragBlockPool.length === 0 && (
                                    <span className="text-sm text-slate-400 italic self-center">Toate token-urile au fost plasate ✓</span>
                                  )}
                                  {dragBlockPool.map((token, pi) => (
                                    <div
                                      key={`pool-${token}-${pi}`}
                                      draggable
                                      onDragStart={e => {
                                        e.stopPropagation()
                                        dragRef.current = { from: 'pool', pi, token }
                                        e.dataTransfer.effectAllowed = 'move'
                                        e.dataTransfer.setData('text/plain', 'drag')
                                      }}
                                      onDragEnd={() => { dragRef.current = null }}
                                      onClick={() => placeToken(token, pi)}
                                      className={`px-5 py-3 rounded-xl border-2 font-black text-xl cursor-grab active:cursor-grabbing select-none transition active:scale-95 shadow-sm ${tc(token)}`}
                                    >
                                      {token}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })()}

                        {/* Cooldown timer banner */}
                        {cooldownUntil && Date.now() < cooldownUntil.getTime() && (
                          <CooldownBanner until={cooldownUntil} onExpire={() => setCooldownUntil(null)} />
                        )}


                        <div className="flex flex-wrap gap-2 pt-1">
                          {cur.hint && curAttempts >= 1 && !curHintUsed && (
                            <button onClick={useHint} disabled={hintLoading}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-amber-400 text-amber-800 bg-amber-50 rounded-xl hover:bg-amber-100 font-semibold disabled:opacity-60 animate-pulse">
                              <LightBulbIcon className="w-4 h-4" /> {hintLoading ? '...' : `💡 Vezi indiciu (−${Math.round((cur.points ?? 10) * 10 / 100)} XP)`}
                            </button>
                          )}
                          {cur.hint && curHintUsed && (
                            <button onClick={() => setShowHint(!showHint)}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 font-semibold">
                              <LightBulbIcon className="w-4 h-4" /> {showHint ? 'Ascunde hint' : 'Afișează hint'}
                            </button>
                          )}
                          {curAttempts >= 2 && cur.type !== 'CODING' && (
                            <button onClick={viewSolution} disabled={solutionLoading}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-slate-200 text-slate-500 rounded-xl hover:bg-teal-50 hover:border-teal-300 hover:text-[#136976] font-semibold disabled:opacity-60">
                              <EyeIcon className="w-4 h-4" /> {solutionLoading ? '...' : 'Vezi rezolvarea (0p)'}
                            </button>
                          )}
                          <button onClick={submit} disabled={submitting || solutionLoading}
                            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#30919f] to-[#136976] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition disabled:opacity-50 shadow text-sm">
                            <PaperAirplaneIcon className="w-4 h-4" />
                            {submitting ? 'Se trimite...' : solutionLoading ? 'Se încarcă...' : 'Trimite raspunsul'}
                          </button>
                        </div>
                        {showHint && cur.hint && curHintUsed && (
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex gap-2">
                            <LightBulbIcon className="w-5 h-5 shrink-0 mt-0.5" />
                            <Markdown text={cur.hint} compact className="flex-1" />
                          </div>
                        )}
                      </>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-slate-200 text-slate-600 rounded-xl disabled:opacity-30 hover:bg-slate-50 font-semibold">
                        <ChevronLeftIcon className="w-4 h-4" /> Anterior
                      </button>
                      {allDone ? (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {revisionCount > 0 && (
                            <button onClick={() => { const i = problems.findIndex((_, i) => submissions[i]?.status === 'NEEDS_REVISION'); if (i !== -1) setIdx(i) }}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-xl text-sm font-bold shadow transition active:scale-95">
                              <ExclamationTriangleIcon className="w-4 h-4" /> Refă problema ({revisionCount})
                            </button>
                          )}
                          <button onClick={finishLesson} disabled={finishing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1a1d] rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-50 shadow">
                            <TrophyIcon className="w-5 h-5" />
                            {finishing ? 'Se salveaza...' : revisionCount > 0 ? 'Finalizează oricum' : 'Finalizeaza lectia'}
                          </button>
                        </div>
                      ) : idx < problems.length - 1 ? (
                        <button onClick={nextProblem}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                          Urmatoarea <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      ) : wrongCount > 0 ? (
                        <button onClick={nextProblem}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">
                          Reia greșite ({wrongCount}) <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      ) : toRevisit.length > 0 ? (
                        <button onClick={() => goToNextRevisit()}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700">
                          <ArrowPathIcon className="w-4 h-4" /> Reia blocate ({toRevisit.length})
                        </button>
                      ) : revisionCount > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button onClick={() => { const i = problems.findIndex((_, i) => submissions[i]?.status === 'NEEDS_REVISION'); if (i !== -1) setIdx(i) }}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-900 rounded-xl text-sm font-bold shadow transition active:scale-95">
                            <ExclamationTriangleIcon className="w-4 h-4" /> Refă problema ({revisionCount})
                          </button>
                          <button onClick={finishLesson} disabled={finishing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0c1a1d] rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-50 shadow">
                            <TrophyIcon className="w-5 h-5" />
                            {finishing ? 'Se salveaza...' : 'Finalizează oricum'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Advance / finish panel */}
                {idx === problems.length - 1 && allDone && (
                  <div className={`p-4 rounded-2xl border-2 ${advanceGranted ? 'bg-purple-50 border-purple-200' : 'bg-amber-50 border-amber-200'}`}>
                    {advanceGranted ? (
                      <div className="flex gap-3">
                        <RocketLaunchIcon className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-purple-900">
                          <div className="font-bold mb-0.5">Profesorul ti-a acordat advance!</div>
                          <Link href={dashboardHref} className="underline font-semibold">Inapoi la module</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <SparklesIcon className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900">
                          <div className="font-bold mb-0.5">Bravo ca ai terminat!</div>
                          Pentru modulul urmator ai nevoie de aprobarea profesorului. Pana atunci incearca{' '}
                          {isGuest ? (
                            <Link href="/learn/login" className="underline font-semibold">intră în cont ca să salvezi progresul</Link>
                          ) : (
                            <Link href={`/learn/${token}/random`} className="underline font-semibold">probleme aleatorii</Link>
                          )}.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
