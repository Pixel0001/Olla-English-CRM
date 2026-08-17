'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// ── Image Upload Button ─────────────────────────────────────────────────────────────────
function ImageUploadButton({ textareaRef, value, onChange, folder = 'problems' }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('folder', folder)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (!d.url) { toast.error(d.error || 'Eroare upload'); return }
      // Insert at cursor position
      const ta = textareaRef?.current
      const mdTag = `![](${d.url})`
      if (ta) {
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const newVal = value.slice(0, start) + mdTag + value.slice(end)
        onChange(newVal)
        // Restore cursor after inserted text
        setTimeout(() => { ta.focus(); ta.setSelectionRange(start + mdTag.length, start + mdTag.length) }, 0)
      } else {
        onChange(value + '\n' + mdTag)
      }
      toast.success('Imagine încărcată!')
    } catch { toast.error('Eroare la upload') } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition border ${
      uploading ? 'opacity-50 pointer-events-none' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
    }`}>
      📷 {uploading ? 'Încarcă...' : 'Upload imagine'}
      <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} disabled={uploading} />
    </label>
  )
}

async function compressImage(file, maxPx = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx }
        else { width = Math.round(width * maxPx / height); height = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        blob => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })),
        'image/webp', quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

function ImageUploadSlot({ onUploaded, folder = 'problems' }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('folder', folder)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (!d.url) { toast.error(d.error || 'Eroare upload'); return }
      onUploaded(d.url)
      toast.success('Imagine încărcată!')
    } catch { toast.error('Eroare la upload') } finally {
      setUploading(false); e.target.value = ''
    }
  }
  return (
    <label className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border shrink-0 ${
      uploading ? 'opacity-50 pointer-events-none bg-slate-50 border-slate-200 text-slate-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
    }`}>
      📷 {uploading ? 'Încărcă...' : 'Upload'}
      <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} disabled={uploading} />
    </label>
  )
}

const DIFF_COLOR = { EASY: 'bg-emerald-100 text-emerald-700', MEDIUM: 'bg-amber-100 text-amber-700', HARD: 'bg-rose-100 text-rose-700' }
const DIFF_LABEL = { EASY: '🟢 Ușor', MEDIUM: '🟡 Mediu', HARD: '🔴 Greu' }

// ── Markdown helpers ──────────────────────────────────────────────────────────
function inlineFmt(s) {
  if (!s) return ''
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="block my-2 aspect-square w-full max-w-[220px] rounded-lg overflow-hidden shadow inline-block"><img src="$2" alt="$1" class="w-full h-full object-cover" /></span>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-indigo-600 underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-indigo-50 rounded text-sm font-mono text-indigo-700 font-medium">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderMd(text) {
  if (!text || !text.trim()) return null
  const lines = text.split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const ln = lines[i]
    if (ln.startsWith('```')) {
      const lang = ln.slice(3).trim()
      const buf = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i++ }
      elements.push(
        <div key={i} className="my-2">
          {lang && <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{lang}</div>}
          <pre className="bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto text-xs font-mono whitespace-pre-wrap">{buf.join('\n')}</pre>
        </div>
      )
      i++; continue
    }
    if (ln.startsWith('> ')) {
      const buf = [ln.slice(2)]
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) { buf.push(lines[++i].slice(2)) }
      elements.push(
        <div key={i} className="my-2 border-l-4 border-amber-400 bg-amber-50 px-3 py-2 rounded-r-lg">
          {buf.map((l, k) => <p key={k} className="text-amber-900 text-sm" dangerouslySetInnerHTML={{ __html: inlineFmt(l) }} />)}
        </div>
      )
      i++; continue
    }
    if (ln.startsWith('### ')) { elements.push(<h3 key={i} className="text-base font-semibold mt-3 mb-1 text-slate-800" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(4)) }} />); i++; continue }
    if (ln.startsWith('## '))  { elements.push(<h2 key={i} className="text-lg font-bold mt-3 mb-1 text-slate-900" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(3)) }} />); i++; continue }
    if (ln.startsWith('# '))   { elements.push(<h1 key={i} className="text-xl font-bold mt-3 mb-2 text-slate-900" dangerouslySetInnerHTML={{ __html: inlineFmt(ln.slice(2)) }} />); i++; continue }
    if (/^[-*]\s/.test(ln) || /^\d+\.\s/.test(ln)) {
      const ordered = /^\d+\.\s/.test(ln)
      const items = []
      while (i < lines.length && (ordered ? /^\d+\.\s/.test(lines[i]) : /^[-*]\s/.test(lines[i]))) {
        items.push(lines[i].replace(/^([-*]|\d+\.)\s+/, '')); i++
      }
      const Tag = ordered ? 'ol' : 'ul'
      elements.push(
        <Tag key={i} className={ordered ? 'list-decimal list-inside my-2 space-y-0.5 text-slate-700 text-sm' : 'list-disc list-inside my-2 space-y-0.5 text-slate-700 text-sm'}>
          {items.map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: inlineFmt(it) }} />)}
        </Tag>
      )
      continue
    }
    if (/^---+$/.test(ln.trim())) { elements.push(<hr key={i} className="my-3 border-slate-200" />); i++; continue }
    if (!ln.trim()) { i++; continue }
    elements.push(<p key={i} className="text-slate-700 text-sm leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: inlineFmt(ln) }} />)
    i++
  }
  return elements
}

function MarkdownPreview({ text }) {
  const nodes = renderMd(text)
  if (!nodes || nodes.length === 0) return null
  return (
    <div className="mt-2 px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-lg">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preview</div>
      {nodes}
    </div>
  )
}

// ── Student-facing preview ────────────────────────────────────────────────────
function ProblemStudentPreview({ form }) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')

  const validOptions = (form.options || []).filter(o => o.trim())
  const hintPenalty = Math.round((form.points || 10) * 10 / 100)
  const descNodes = renderMd(form.description, { compact: true })
  const explNodes = renderMd(form.explanation, { compact: true })

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold text-white">1</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white truncate">{form.title || <em className="opacity-50">Titlu problemă</em>}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFF_COLOR[form.difficulty] || 'bg-slate-100 text-slate-600'}`}>{DIFF_LABEL[form.difficulty] || 'Dificultate'}</span>
            <span className="text-[10px] text-white/60 font-semibold">⭐ {form.points || 10} pct</span>
            {form.topic && <span className="text-[10px] text-white/50">#{form.topic}</span>}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Description */}
        <div className="text-base text-slate-700 leading-relaxed">
          {descNodes?.length ? descNodes : <span className="text-slate-300 italic">Cerința apare aici...</span>}
        </div>

        {/* Answer area */}
        {form.type === 'MULTIPLE_CHOICE' && validOptions.length > 0 && (
          <div className="space-y-2">
            {validOptions.map((opt, i) => (
              <label key={i} onClick={() => setSelectedOption(i)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                  ${selectedOption === i ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition
                  ${selectedOption === i ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                  {selectedOption === i && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-slate-800">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {form.type === 'MULTIPLE_SELECT' && validOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Grilă multiplă (preview)</p>
            {validOptions.map((opt, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 bg-slate-50 cursor-pointer hover:border-slate-300 transition">
                <input type="checkbox" readOnly className="w-4 h-4 accent-blue-600 rounded" />
                <span className="text-sm text-slate-800">{opt}</span>
              </label>
            ))}
            <p className="text-xs text-slate-400">☑️ Elevii pot selecta mai multe variante</p>
          </div>
        )}

        {(form.type === 'SHORT_ANSWER' || form.type === 'INPUT_OUTPUT') && (
          <input
            value={textAnswer} onChange={e => setTextAnswer(e.target.value)}
            placeholder={form.type === 'INPUT_OUTPUT' ? 'Scrie output-ul așteptat...' : 'Răspunsul tău...'}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-400 outline-none"
          />
        )}

        {form.type === 'CODING' && (
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-400 border border-slate-700">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{form.language || 'python'} — editor cod</div>
            <pre className="text-slate-300">{form.starterCode || '# codul elevului apare aici'}</pre>
          </div>
        )}

        {form.type === 'ORDER_IMAGES' && (() => {
          const imgs = (form.options || []).filter(u => u.trim())
          if (!imgs.length) return <p className="text-sm text-slate-400 italic">Adaugă imagini pentru a vedea preview-ul.</p>
          return (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ordonare imagini — drag &amp; drop (amestecate pentru elev)</p>
              {imgs.map((url, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" disabled className="w-7 h-7 flex items-center justify-center bg-slate-200 rounded text-xs opacity-50">▲</button>
                    <button type="button" disabled className="w-7 h-7 flex items-center justify-center bg-slate-200 rounded text-xs opacity-50">▼</button>
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-5">{i+1}</span>
                  <img src={url} alt={`img-${i}`} className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                </div>
              ))}
            </div>
          )
        })()}

        {form.type === 'FILL_IN' && (() => {
          const questions = (form.options || []).filter(q => q.trim())
          if (!questions.length) return <p className="text-sm text-slate-400 italic">Adaugă întrebări pentru a vedea preview-ul.</p>
          return (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Completează spațiile</p>
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <span className="text-sm font-bold text-slate-500">{i+1}.</span>
                  <span className="text-sm text-slate-700">{q}</span>
                  <input readOnly placeholder="..." className="border-b-2 border-indigo-400 bg-transparent px-2 py-1 text-sm w-20 focus:outline-none text-center" />
                </div>
              ))}
            </div>
          )
        })()}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {form.hint?.trim() && (
            showHint ? (
              <button type="button" onClick={() => setShowHint(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 font-semibold">
                💡 Ascunde indiciu
              </button>
            ) : (
              <button type="button" onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl font-semibold transition animate-pulse">
                💡 Vezi indiciu (−{hintPenalty} XP)
              </button>
            )
          )}
          {!showSolution && (
            <button type="button" onClick={() => setShowSolution(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm border-2 border-indigo-300 text-indigo-700 rounded-xl hover:bg-indigo-50 font-semibold">
              👁️ Vezi rezolvarea (0p)
            </button>
          )}
          <button type="button" disabled title="Disponibil doar pentru elevi în platforma reală"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl font-semibold shadow text-sm opacity-50 cursor-not-allowed">
            ✈️ Trimite răspunsul
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-right">⚠️ Preview admin — butoanele sunt simulate</p>

        {/* Hint box */}
        {showHint && form.hint && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex gap-2">
            <span className="text-lg shrink-0">💡</span>
            <div>{form.hint}</div>
          </div>
        )}

        {/* Solution box */}
        {showSolution && (
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">👁️ Rezolvare</div>
            {form.correctAnswer && (
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-700 mb-1">Răspuns corect</div>
                <code className="block bg-white px-3 py-2 rounded-lg text-sm font-mono text-slate-800 border border-indigo-100">{form.correctAnswer}</code>
              </div>
            )}
            {form.explanation && (
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-700 mb-2">Explicație</div>
                <div className="bg-white rounded-lg p-3 border border-indigo-100 text-sm text-slate-700 space-y-1">
                  {explNodes?.length ? explNodes : <span className="text-slate-400 italic">Explicația apare aici...</span>}
                </div>
              </div>
            )}
            <button onClick={() => setShowSolution(false)} className="text-xs text-indigo-600 hover:underline">Ascunde rezolvarea</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Grilă (o singură variantă corectă)' },
  { value: 'MULTIPLE_SELECT', label: 'Grilă multiplă (mai multe corecte)' },
  { value: 'SHORT_ANSWER', label: 'Răspuns scurt (text)' },
  { value: 'INPUT_OUTPUT', label: 'Input / Output' },
  { value: 'CODING', label: 'Cod (verifică output)' },
  { value: 'ORDER_IMAGES', label: 'Ordonare imagini' },
  { value: 'FILL_IN', label: 'Completează spațiile' },
  { value: 'DRAG_BLOCKS', label: 'Trage blocuri în locuri goale' },
  { value: 'DRAG_INLINE', label: 'Completează blanks inline (ex: 12 ___ + 36 ___ = ___)' },
]

const FMT_HINT = (
  <p className="text-[11px] text-slate-400 mt-1">
    Formatare: <code className="bg-slate-100 px-1 rounded">**bold**</code> ·{' '}
    <code className="bg-slate-100 px-1 rounded">`cod`</code> ·{' '}
    <code className="bg-slate-100 px-1 rounded">```python ... ```</code> ·{' '}
    <code className="bg-slate-100 px-1 rounded">&gt; notă</code> ·{' '}
    <code className="bg-slate-100 px-1 rounded">- listă</code>
  </p>
)

// ── Tab key inserts 2 spaces instead of switching focus ──────────────────────
function handleTab(e, onChange) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const el = e.target
  const start = el.selectionStart
  const end = el.selectionEnd
  const val = el.value
  const next = val.substring(0, start) + '  ' + val.substring(end)
  onChange(next)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function ProblemForm({ problem, apiUrl, backUrl, lessonId = null }) {
  const router = useRouter()
  const descRef = useRef(null)
  const explRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('edit') // 'edit' | 'split' | 'preview'
  const isEdit = !!problem?.id
  const resolvedApiUrl = apiUrl || (isEdit ? `/api/admin/problems/${problem.id}` : '/api/admin/problems')
  const resolvedBackUrl = backUrl || '/admin/problems'

  const [form, setForm] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    difficulty: problem?.difficulty || 'EASY',
    topic: problem?.topic || '',
    subtopic: problem?.subtopic || '',
    type: problem?.type || 'MULTIPLE_CHOICE',
    options: problem?.options?.length ? problem.options : ['', '', '', ''],
    correctAnswer: problem?.correctAnswer || '',
    starterCode: problem?.starterCode || '',
    explanation: problem?.explanation || '',
    hint: problem?.hint || '',
    tags: Array.isArray(problem?.tags) ? problem.tags.join(', ') : '',
    estimatedTime: problem?.estimatedTime || 5,
    points: problem?.points || 10,
    language: problem?.language || 'python',
  })

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const updateOption = (i, v) => setForm(f => {
    const opts = [...f.options]; opts[i] = v
    return { ...f, options: opts }
  })
  const addOption = () => setForm(f => ({ ...f, options: [...f.options, ''] }))
  const removeOption = (i) => setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }))

  // ── DRAG_INLINE: builder vizual cu segmente text + blank ───────────────────
  const initInlineParts = () => {
    if (problem?.type === 'DRAG_INLINE' && problem?.description?.includes('___')) {
      const textParts = problem.description.split('___')
      let correct = []
      try { correct = JSON.parse(problem.correctAnswer || '[]') } catch {}
      // Interleave: text → blank → text → blank → ... → text
      const parts = []
      textParts.forEach((text, i) => {
        parts.push({ text, blank: false, answer: '' })
        if (i < textParts.length - 1) {
          parts.push({ text: '', blank: true, answer: correct[i] || '' })
        }
      })
      return parts
    }
    return [{ text: '', blank: false, answer: '' }]
  }
  const [dragInlineParts, setDragInlineParts] = useState(initInlineParts)

  const syncInlineParts = (parts) => {
    setDragInlineParts(parts)
    const desc = parts.map(p => p.text + (p.blank ? '___' : '')).join('')
    const answers = parts.filter(p => p.blank).map(p => p.answer)
    setForm(f => ({ ...f, description: desc, correctAnswer: JSON.stringify(answers) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const descOk = form.type === 'DRAG_INLINE'
      ? dragInlineParts.filter(p => p.blank).length > 0
      : !!form.description
    if (!form.title || !descOk || !form.topic || !form.explanation) {
      toast.error('Completează titlu, cerință, topic și explicație')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        options: ['MULTIPLE_CHOICE','MULTIPLE_SELECT','ORDER_IMAGES','FILL_IN','DRAG_BLOCKS','DRAG_INLINE'].includes(form.type)
          ? form.options.filter(o => o.trim())
          : [],
        correctAnswer: form.type === 'ORDER_IMAGES'
          ? JSON.stringify(form.options.filter(o => o.trim()).map((_, i) => i))
          : form.correctAnswer,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        lessonId: lessonId || null,
      }
      const res = await fetch(resolvedApiUrl, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Eroare')
      }
      toast.success(isEdit ? 'Salvat!' : 'Problemă creată!')
      router.push(resolvedBackUrl)
      router.refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl">

      {/* ── Tab switcher ── */}
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2">
        {[
          { k: 'edit',    l: '✏️ Editare' },
          { k: 'split',   l: '⚡ Editare + Preview' },
          { k: 'preview', l: '👁️ Preview ca elev' },
        ].map(o => (
          <button key={o.k} type="button" onClick={() => setTab(o.k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${tab === o.k ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
            {o.l}
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div className={tab === 'split' ? 'grid lg:grid-cols-2 gap-6 items-start' : ''}>

        {/* Form columns — hidden in preview-only mode */}
        {tab !== 'preview' && (
          <div className="space-y-6">

            {/* Date generale */}
            <section className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">📋 Date generale</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titlu *</label>
                <input
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: Suma elementelor unui array"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Cerință (descriere) *</label>
                  {form.type !== 'DRAG_INLINE' && <ImageUploadButton textareaRef={descRef} value={form.description} onChange={v => update('description', v)} />}
                </div>
                {form.type === 'DRAG_INLINE' ? (
                  <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 text-sm text-violet-700">
                    ℹ️ Câmpul de cerință este generat automat din <strong>builder-ul de mai jos</strong> (secțiunea „Răspuns corect").
                    {form.description && <span className="ml-1 text-violet-500 font-mono text-xs">→ {form.description}</span>}
                  </div>
                ) : (
                  <>
                    <textarea
                      ref={descRef}
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      onKeyDown={e => handleTab(e, v => update('description', v))}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
                      placeholder={'Descrierea completă a problemei. Suportă markdown / cod.\n\nEx pentru cod pe mai multe rânduri:\n```python\nx = int(input())\nprint(x + 5)\n```'}
                    />
                    <MarkdownPreview text={form.description} />
                    {FMT_HINT}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
                  <input
                    value={form.topic}
                    onChange={e => update('topic', e.target.value.toLowerCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="loops, arrays, functions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtopic</label>
                  <input
                    value={form.subtopic}
                    onChange={e => update('subtopic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="opțional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dificultate</label>
                  <select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="EASY">🟢 Ușor</option>
                    <option value="MEDIUM">🟡 Mediu</option>
                    <option value="HARD">🔴 Greu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                  <select value={form.type} onChange={e => update('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timp (min)</label>
                  <input type="number" min="1" value={form.estimatedTime}
                    onChange={e => update('estimatedTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Punctaj</label>
                  <input type="number" min="1" value={form.points}
                    onChange={e => update('points', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separate cu virgulă)</label>
                <input
                  value={form.tags}
                  onChange={e => update('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="recursivitate, sortare, stringuri"
                />
              </div>
            </section>

            {/* Răspuns */}
            <section className="bg-white rounded-2xl border border-gray-200 p-4 xs:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">✅ Răspuns corect</h2>

              {form.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Opțiuni (bifează corectul)</label>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={form.correctAnswer === opt && opt !== ''}
                        onChange={() => update('correctAnswer', opt)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input
                        value={opt}
                        onChange={e => updateOption(i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder={`Opțiunea ${i + 1}`}
                      />
                      {form.options.length > 2 && (
                        <button type="button" onClick={() => removeOption(i)}
                          className="text-red-600 hover:text-red-700 px-2">×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addOption}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    + Adaugă opțiune
                  </button>
                </div>
              )}

              {form.type === 'MULTIPLE_SELECT' && (() => {
                let msCorrect = []
                try { const parsed = JSON.parse(form.correctAnswer || '[]'); msCorrect = Array.isArray(parsed) ? parsed : [] } catch {}
                const toggleMs = (opt) => {
                  const arr = [...msCorrect]
                  const i = arr.indexOf(opt)
                  if (i >= 0) arr.splice(i, 1); else arr.push(opt)
                  update('correctAnswer', JSON.stringify(arr))
                }
                return (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Opțiuni (bifează toate variantele corecte)</label>
                    <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
                      ✅ Pot fi mai multe răspunsuri corecte. Punctajul se calculează proporțional cu corectitudinea selecției.
                    </p>
                    {form.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={opt !== '' && msCorrect.includes(opt)}
                          onChange={() => opt !== '' && toggleMs(opt)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <input
                          value={opt}
                          onChange={e => {
                            const old = opt
                            updateOption(i, e.target.value)
                            // update correctAnswer if this option was selected
                            if (msCorrect.includes(old)) {
                              const arr = msCorrect.map(v => v === old ? e.target.value : v)
                              update('correctAnswer', JSON.stringify(arr))
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder={`Opțiunea ${i + 1}`}
                        />
                        {form.options.length > 2 && (
                          <button type="button" onClick={() => {
                            if (msCorrect.includes(opt)) {
                              update('correctAnswer', JSON.stringify(msCorrect.filter(v => v !== opt)))
                            }
                            removeOption(i)
                          }} className="text-red-600 hover:text-red-700 px-2">×</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addOption}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      + Adaugă opțiune
                    </button>
                    {msCorrect.length > 0 && (
                      <p className="text-xs text-green-700 font-medium">✅ Corecte selectate: {msCorrect.join(', ')}</p>
                    )}
                  </div>
                )
              })()}

              {(form.type === 'SHORT_ANSWER' || form.type === 'INPUT_OUTPUT') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Răspuns corect (compararea ignoră majuscule/spații)
                  </label>
                  <input
                    value={form.correctAnswer}
                    onChange={e => update('correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                    placeholder={form.type === 'INPUT_OUTPUT' ? 'output exact așteptat' : 'răspunsul așteptat'}
                  />
                </div>
              )}

              {form.type === 'CODING' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limbaj</label>
                    <select value={form.language} onChange={e => update('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cod de start (opțional)</label>
                    <textarea
                      value={form.starterCode}
                      onChange={e => update('starterCode', e.target.value)}
                      onKeyDown={e => handleTab(e, v => update('starterCode', v))}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder={'def solve():\n    pass'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Output așteptat / cuvânt-cheie de verificat
                    </label>
                    <textarea
                      value={form.correctAnswer}
                      onChange={e => update('correctAnswer', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="ex: rezultatul printat de cod"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Verificarea automată compară output-ul / textul submisiei cu acest șir (case-insensitive).
                    </p>
                  </div>
                </>
              )}

              {form.type === 'ORDER_IMAGES' && (() => {
                const moveImg = (from, to) => {
                  const arr = [...form.options]
                  const [item] = arr.splice(from, 1)
                  arr.splice(to, 0, item)
                  update('options', arr)
                }
                return (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                      💡 <strong>Cum funcționează:</strong> Încărcă imaginile și aranjă-le în ordinea corectă cu săgețile.
                      <strong> Ordinea de mai jos = răspunsul corect.</strong> Elevul vede imaginile amestecate aleator.
                    </div>
                    {form.options.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button type="button" disabled={i === 0} onClick={() => moveImg(i, i - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-slate-300 rounded text-xs hover:bg-slate-100 disabled:opacity-30">▲</button>
                          <button type="button" disabled={i === form.options.length - 1} onClick={() => moveImg(i, i + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-slate-300 rounded text-xs hover:bg-slate-100 disabled:opacity-30">▼</button>
                        </div>
                        <span className="text-sm font-bold text-indigo-600 w-7 text-center shrink-0">#{i+1}</span>
                        {url.trim()
                          ? <img src={url} alt={`img-${i}`} className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0" />
                          : <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center shrink-0"><span className="text-slate-400 text-[10px] text-center px-1">Fără imagine</span></div>
                        }
                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                          <input
                            value={url}
                            onChange={e => updateOption(i, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                            placeholder="URL imagine (sau apasă Upload)"
                          />
                          <ImageUploadSlot onUploaded={imgUrl => updateOption(i, imgUrl)} folder="problems" />
                        </div>
                        {form.options.length > 2 && (
                          <button type="button" onClick={() => removeOption(i)}
                            className="text-red-600 hover:text-red-700 px-2 text-lg shrink-0">×</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addOption}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Adaugă imagine</button>
                    {form.options.filter(o => o.trim()).length >= 2 && (
                      <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                        ✅ {form.options.filter(o => o.trim()).length} imagini. Ordinea de mai sus = răspunsul corect.
                      </p>
                    )}
                  </div>
                )
              })()}

              {form.type === 'FILL_IN' && (() => {
                let answers = []
                try { answers = JSON.parse(form.correctAnswer || '[]') } catch {}
                const syncedAnswers = form.options.map((_, i) => answers[i] !== undefined ? answers[i] : '')
                const updateFillAnswer = (i, val) => {
                  const arr = [...syncedAnswers]; arr[i] = val
                  update('correctAnswer', JSON.stringify(arr))
                }
                return (
                  <div className="space-y-3">
                    <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
                      ✏️ Scrie întrebarea la stânga (ex: „2 + 5 + 1 =”) și răspunsul corect la dreapta (verde).
                    </p>
                    {form.options.map((q, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 shrink-0 w-6">{i+1}.</span>
                        <input value={q} onChange={e => updateOption(i, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="ex: 2 + 5 + 1 =" />
                        <span className="text-slate-400 text-sm shrink-0">→</span>
                        <input value={syncedAnswers[i]} onChange={e => updateFillAnswer(i, e.target.value)}
                          className="w-28 px-3 py-2 border border-green-400 bg-green-50 rounded-lg text-sm font-mono text-green-800"
                          placeholder="răspuns" />
                        {form.options.length > 1 && (
                          <button type="button" onClick={() => {
                            removeOption(i)
                            update('correctAnswer', JSON.stringify(syncedAnswers.filter((_, idx) => idx !== i)))
                          }} className="text-red-600 hover:text-red-700 px-2 text-lg">×</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      addOption()
                      update('correctAnswer', JSON.stringify([...syncedAnswers, '']))
                    }} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Adaugă rând</button>
                    {syncedAnswers.filter(a => a.trim()).length > 0 && (
                      <p className="text-xs text-green-700 font-medium">✅ Răspunsuri setate: {syncedAnswers.filter(a => a.trim()).length}/{form.options.length}</p>
                    )}
                  </div>
                )
              })()}

              {form.type === 'DRAG_BLOCKS' && (() => {
                let correct = []
                try { correct = JSON.parse(form.correctAnswer || '[]') } catch {}
                return (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm text-indigo-800">
                      🧩 <strong>Cum funcționează:</strong> Adaugă token-urile disponibile (semne, litere, cuvinte) în „Token-uri”.
                      Apoi specifică <strong>ordinea corectă</strong> — ce token trebuie în fiecare slot. Elevul va trage sau apasa token-urile pentru a le plasa.
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🎴 Token-uri disponibile (ce vede elevul sus)</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {form.options.map((tok, i) => (
                          <div key={i} className="flex items-center gap-1 bg-indigo-100 border border-indigo-300 rounded-xl px-3 py-1.5">
                            <span className="font-bold text-indigo-800 text-sm">{tok || <span className="text-indigo-400 italic">gol</span>}</span>
                            <input
                              value={tok}
                              onChange={e => updateOption(i, e.target.value)}
                              className="w-20 px-2 py-0.5 border border-indigo-300 rounded-lg text-sm font-mono bg-white"
                              placeholder="token"
                            />
                            {form.options.length > 1 && (
                              <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700 text-lg leading-none">×</button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={addOption} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">+ Token</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">✅ Ordinea corectă (sloturi)</label>
                      <p className="text-xs text-gray-500 mb-2">Adaugă slot-urile în ordinea corectă. Fiecare slot = un loc gol pe care elevul trebuie să-l completeze.</p>
                      {correct.map((tok, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                          <select
                            value={tok}
                            onChange={e => {
                              const arr = [...correct]; arr[i] = e.target.value
                              update('correctAnswer', JSON.stringify(arr))
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">— alege token —</option>
                            {form.options.filter(o => o.trim()).map((o, j) => <option key={j} value={o}>{o}</option>)}
                          </select>
                          <button type="button" onClick={() => {
                            const arr = correct.filter((_, idx) => idx !== i)
                            update('correctAnswer', JSON.stringify(arr))
                          }} className="text-red-500 hover:text-red-700 text-lg">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => update('correctAnswer', JSON.stringify([...correct, '']))}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Adaugă slot</button>
                      {correct.filter(t => t.trim()).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-xs text-gray-500">Preview răspuns corect:</span>
                          {correct.map((tok, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-800">
                              <span className="text-emerald-500 text-xs">{i + 1}.</span> {tok}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}

              {form.type === 'DRAG_INLINE' && (() => {
                const blankCount = dragInlineParts.filter(p => p.blank).length
                let blankIdx = -1

                const addSegment = (afterIdx, isBlank) => {
                  const parts = [...dragInlineParts]
                  parts.splice(afterIdx + 1, 0, { text: '', blank: isBlank, answer: '' })
                  syncInlineParts(parts)
                }
                const removePart = (i) => {
                  if (dragInlineParts.length <= 1) return
                  syncInlineParts(dragInlineParts.filter((_, idx) => idx !== i))
                }
                const updateText = (i, val) => {
                  syncInlineParts(dragInlineParts.map((p, idx) => idx === i ? { ...p, text: val } : p))
                }
                const updateAnswer = (i, val) => {
                  syncInlineParts(dragInlineParts.map((p, idx) => idx === i ? { ...p, answer: val } : p))
                }

                return (
                  <div className="space-y-4">
                    <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm text-violet-900">
                      🔗 <strong>Builder vizual</strong> — scrie textul și adaugă blank-uri direct în sarcină.
                      Apasă <strong className="text-violet-700">+T</strong> pentru text și <strong className="text-violet-700">+[ ]</strong> pentru blank după fiecare segment.
                    </div>

                    {/* Visual sentence builder */}
                    <div className="border-2 border-violet-200 rounded-2xl bg-white p-4 space-y-2">
                      <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-3">✏️ Construiește sarcina</p>

                      {dragInlineParts.map((part, i) => {
                        if (part.blank) blankIdx++
                        const bi = part.blank ? blankIdx : -1
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`mt-2.5 shrink-0 text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                              part.blank ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {part.blank ? `blank #${bi + 1}` : 'text'}
                            </span>

                            {part.blank ? (
                              <div className="flex-1 flex items-center gap-2 bg-violet-50 border-2 border-violet-300 rounded-xl px-3 py-2">
                                <span className="text-violet-400 font-black text-lg select-none">[ ]</span>
                                <select
                                  value={part.answer}
                                  onChange={e => updateAnswer(i, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-violet-300 rounded-lg text-sm bg-white"
                                >
                                  <option value="">— răspuns corect —</option>
                                  {form.options.filter(o => o.trim()).map((o, j) => (
                                    <option key={j} value={o}>{o}</option>
                                  ))}
                                </select>
                                {part.answer && (
                                  <span className="px-2 py-1 bg-violet-600 text-white rounded-lg text-xs font-black">{part.answer}</span>
                                )}
                              </div>
                            ) : (
                              <input
                                value={part.text}
                                onChange={e => updateText(i, e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:border-violet-400 focus:outline-none"
                                placeholder={i === 0 ? 'ex: 12  +  36  +  54  =' : 'continuare text...'}
                              />
                            )}

                            <div className="flex gap-1 mt-1.5 shrink-0">
                              <button type="button" onClick={() => addSegment(i, false)}
                                title="Adaugă text după"
                                className="px-2 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-300 transition">
                                +T
                              </button>
                              <button type="button" onClick={() => addSegment(i, true)}
                                title="Adaugă blank [ ] după"
                                className="px-2 py-1 text-[11px] font-bold bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg border border-violet-300 transition">
                                +[ ]
                              </button>
                              {dragInlineParts.length > 1 && (
                                <button type="button" onClick={() => removePart(i)}
                                  className="px-2 py-1 text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-200 transition">
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Preview */}
                    {blankCount > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">👁️ Preview elev</p>
                        <div className="flex flex-wrap items-center gap-1 text-base font-semibold text-slate-800">
                          {(() => { let bi2 = -1; return dragInlineParts.map((p, i) => {
                            if (p.blank) bi2++
                            return (
                              <span key={i} className="flex items-center gap-1">
                                <span>{p.text}</span>
                                {p.blank && (
                                  p.answer
                                    ? <span className="px-3 py-1 bg-violet-100 border-2 border-violet-400 rounded-lg font-black text-violet-800">{p.answer}</span>
                                    : <span className="px-4 py-1 border-2 border-dashed border-violet-300 rounded-lg text-violet-300 font-black">?</span>
                                )}
                              </span>
                            )
                          })})()}
                        </div>
                      </div>
                    )}

                    {/* Token pool config */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🎴 Token-uri disponibile (ce vede elevul în pool)</label>
                      <div className="flex flex-wrap gap-2">
                        {form.options.map((tok, i) => (
                          <div key={i} className="flex items-center gap-1 bg-violet-100 border border-violet-300 rounded-xl px-3 py-1.5">
                            <input
                              value={tok}
                              onChange={e => updateOption(i, e.target.value)}
                              className="w-20 px-2 py-0.5 border border-violet-300 rounded-lg text-sm font-mono bg-white"
                              placeholder="token"
                            />
                            {form.options.length > 1 && (
                              <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700 text-lg leading-none">×</button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={addOption}
                          className="px-3 py-1.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700">+ Token</button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">💡 Adaugă token-uri corecte + distractor-i (răspunsuri greșite) pentru mai multă dificultate.</p>
                    </div>
                  </div>
                )
              })()}
            </section>

            {/* Explicație + hint */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 xs:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">💡 Explicație + hint</h2>
              <p className="text-xs text-amber-700">
                Scrie explicația <strong>pas cu pas</strong>, ca și cum ai fi profesor — clar, simplu, prietenos.
                Aceasta e ce vede elevul când apasă „Vezi explicația".
              </p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Explicație completă *</label>
                  <ImageUploadButton textareaRef={explRef} value={form.explanation} onChange={v => update('explanation', v)} folder="problems" />
                </div>
                <textarea
                  ref={explRef}
                  value={form.explanation}
                  onChange={e => update('explanation', e.target.value)}
                  onKeyDown={e => handleTab(e, v => update('explanation', v))}
                  rows={8}
                  className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg font-mono text-sm leading-relaxed"
                  placeholder={'Pas 1: Înțelegem cerința...\nPas 2: Inițializăm o variabilă...\n\n```python\nfor i in arr:\n    total += i\n```'}
                />
                <MarkdownPreview text={form.explanation} />
                {FMT_HINT}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hint (opțional)</label>
                <textarea
                  value={form.hint}
                  onChange={e => update('hint', e.target.value)}
                  onKeyDown={e => handleTab(e, v => update('hint', v))}
                  rows={3}
                  className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg font-mono text-sm"
                  placeholder={'ex: Gândește-te la o variabilă acumulator inițializată cu 0\n\nSau cod:\n```python\ntotal = 0\n```'}
                />
              </div>
            </section>

          </div>
        )}

        {/* Preview column — shown in split + preview modes */}
        {tab !== 'edit' && (
          <div className={tab === 'split' ? 'lg:sticky lg:top-4 self-start' : ''}>
            <ProblemStudentPreview form={form} />
          </div>
        )}

      </div>

      {/* Save buttons — always visible */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Anulează
        </button>
        <button type="submit" disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Se salvează...' : (isEdit ? 'Salvează modificările' : 'Creează problema')}
        </button>
      </div>

    </form>
  )
}
