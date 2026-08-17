'use client'

/**
 * CodeRunner — playground pentru rularea codului în browser.
 *  - Python  → Pyodide în Web Worker izolat (timeout 10s — ciclu infinit = oprit safe)
 *  - JavaScript → Web Worker izolat (timeout 5s)
 *  - HTML/CSS → iframe sandbox cu preview live
 *
 * Cost server: $0 (totul rulează în browser-ul elevului).
 * Mobile-friendly (Chrome Android, Safari iOS 14+).
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { PlayIcon, ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline'

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

// ── Pyodide Web Worker ────────────────────────────────────────────────────────
// Rulăm Pyodide într-un Worker separat — dacă apare un ciclu infinit,
// terminate() îl omoară fără să blocheze / crasheze tab-ul principal.
//
// input() INTERACTIV: folosim SharedArrayBuffer + Atomics.wait. Când Python
// apelează input(), worker-ul trimite postMessage('needsInput') și BLOCHEAZĂ
// pe Atomics.wait. UI-ul afișează un câmp inline; când utilizatorul apasă
// Enter, scriem string-ul în SAB + Atomics.notify → worker se trezește.
// Necesită COOP/COEP headers (configurat în next.config.mjs pentru /learn/*).
const PYODIDE_WORKER_SRC = `
importScripts('https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js')

let py = null

async function initPy() {
  if (py) return py
  py = await loadPyodide({ indexURL: '${PYODIDE_CDN}' })
  return py
}

self.onmessage = async (e) => {
  const { code, sab } = e.data
  const logs = []

  // SAB layout: [0]=status (0=waiting,1=ready), [1]=length, bytes 8.. = utf-8
  const header = sab ? new Int32Array(sab, 0, 2) : null
  const dataView = sab ? new Uint8Array(sab, 8) : null
  const decoder = new TextDecoder()

  try {
    const pyodide = await initPy()

    pyodide.setStdout({ batched: (s) => {
      logs.push(s)
      self.postMessage({ type: 'stdout', line: s })
    }})
    pyodide.setStderr({ batched: (s) => {
      logs.push(s)
      self.postMessage({ type: 'stdout', line: s })
    }})

    // input() — INTERACTIV via SAB+Atomics, sau fallback dacă SAB lipsește
    pyodide.globals.set('input', (msg) => {
      const promptMsg = msg ? String(msg) : ''
      // Afișează prompt-ul în output ca un terminal real
      if (promptMsg) {
        logs.push(promptMsg)
        self.postMessage({ type: 'stdout', line: promptMsg })
      }
      if (!header) {
        throw new Error('input() interactiv indisponibil (SharedArrayBuffer lipsește). Reîncarcă pagina.')
      }
      // Cere UI-ului o valoare
      Atomics.store(header, 0, 0)
      self.postMessage({ type: 'needsInput', prompt: promptMsg })
      // Blochează aici până când UI scrie valoarea și face Atomics.notify
      Atomics.wait(header, 0, 0)
      const len = Atomics.load(header, 1)
      // TextDecoder nu poate decoda direct din SAB — copiem în buffer normal
      const copy = new Uint8Array(new ArrayBuffer(len))
      for (let i = 0; i < len; i++) copy[i] = dataView[i]
      const value = decoder.decode(copy)
      // Afișează valoarea introdusă (echo) ca într-un terminal
      logs.push(value + '\\n')
      self.postMessage({ type: 'stdout', line: value + '\\n' })
      return value
    })

    await pyodide.runPythonAsync(code || '')
    self.postMessage({ type: 'done', ok: true, output: logs.join('') })
  } catch (err) {
    self.postMessage({ type: 'done', ok: false, output: logs.join(''), error: String(err?.message || err) })
  }
}
`

let pyWorkerUrl = null
function getPyWorkerUrl() {
  if (pyWorkerUrl) return pyWorkerUrl
  const blob = new Blob([PYODIDE_WORKER_SRC], { type: 'application/javascript' })
  pyWorkerUrl = URL.createObjectURL(blob)
  return pyWorkerUrl
}

// ── JS Web Worker ─────────────────────────────────────────────────────────────
// Abordare async: prompt() → await __prompt__() via mesaje între worker și UI.
// Nu necesită SAB/COOP/COEP — funcționează oriunde.
const JS_WORKER_SRC = `
let __pendingResolve = null

self.onmessage = async (e) => {
  // Răspuns la prompt din UI → deblocăm promisiunea
  if (e.data && e.data.type === 'inputReply') {
    if (__pendingResolve) { __pendingResolve(e.data.value ?? ''); __pendingResolve = null }
    return
  }

  const { code } = e.data
  const logs = []
  const _push = (...args) => {
    const line = args.map(a => {
      if (a === null) return 'null'
      if (a === undefined) return 'undefined'
      if (typeof a === 'object') { try { return JSON.stringify(a) } catch { return String(a) } }
      return String(a)
    }).join(' ')
    logs.push(line)
    self.postMessage({ type: 'stdout', line })
  }
  const _console = { log: _push, error: _push, warn: _push, info: _push }

  const __prompt__ = (msg) => {
    const promptMsg = msg != null ? String(msg) : ''
    if (promptMsg) {
      logs.push(promptMsg)
      self.postMessage({ type: 'stdout', line: promptMsg })
    }
    return new Promise(resolve => {
      __pendingResolve = resolve
      self.postMessage({ type: 'needsInput', prompt: promptMsg })
    })
  }
  const _alert = (msg) => _push('[alert: ' + (msg||'') + ']')

  try {
    // Transformăm prompt( → await __prompt__( pentru a suporta input sincron aparent
    const transformed = (code || '').replace(/\\bprompt\\s*\\(/g, 'await __prompt__(')
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
    const fn = new AsyncFunction('console', '__prompt__', 'alert', '"use strict";\\n' + transformed)
    await fn(_console, __prompt__, _alert)
    self.postMessage({ type: 'done', ok: true, output: logs.join('\\n') })
  } catch (err) {
    self.postMessage({ type: 'done', ok: false, output: logs.join('\\n'), error: String(err?.message || err) })
  }
}
`

let jsWorkerUrl = null
function getJsWorkerUrl() {
  // Nu cache-uim URL-ul — orice schimbare în worker trebuie să fie reflectată imediat
  if (jsWorkerUrl) { URL.revokeObjectURL(jsWorkerUrl); jsWorkerUrl = null }
  const blob = new Blob([JS_WORKER_SRC], { type: 'application/javascript' })
  jsWorkerUrl = URL.createObjectURL(blob)
  return jsWorkerUrl
}

export default function CodeRunner({
  code,
  setCode,
  language = 'python',
  starter = '',
  rows = 12,
  readOnly = false,
  onOutput, // (output, ok) => void  — opțional, pentru a injecta output în submit
}) {
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  // Input interactiv: când worker-ul cere input, afișăm un câmp și-l populăm cu fonctus
  const [waitingInput, setWaitingInput] = useState(false)
  const [inputPrompt, setInputPrompt] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [stdinValue, setStdinValue] = useState('')
  const sabRef = useRef(null) // SharedArrayBuffer reutilizabil
  const inputFieldRef = useRef(null)
  const workerRef = useRef(null)
  const outputRef = useRef('')  // acumulator sync pentru onOutput
  const lang = (language || 'python').toLowerCase()

  // Detectăm dacă SharedArrayBuffer e disponibil (necesită COOP/COEP headers)
  const sabSupported = typeof SharedArrayBuffer !== 'undefined' && typeof Atomics !== 'undefined' && (typeof crossOriginIsolated === 'undefined' || crossOriginIsolated)

  // cleanup worker
  useEffect(() => () => { if (workerRef.current) workerRef.current.terminate() }, [])

  // Focus pe inputul interactiv când apare
  useEffect(() => {
    if (waitingInput && inputFieldRef.current) {
      inputFieldRef.current.focus()
    }
  }, [waitingInput])

  // Trimite valoarea introdusă către worker:
  // - Python → SAB + Atomics.notify (blocking worker)
  // - JS → postMessage inputReply (async worker)
  const submitInteractiveInput = useCallback(() => {
    if (!waitingInput) return
    const isJs = lang === 'javascript' || lang === 'js'
    if (isJs) {
      // JS worker: trimitem mesaj direct
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'inputReply', value: inputValue })
      }
      setWaitingInput(false)
      setInputValue('')
      setInputPrompt('')
      return
    }
    // Python: SAB + Atomics
    if (!sabRef.current) return
    const sab = sabRef.current
    const header = new Int32Array(sab, 0, 2)
    const dataView = new Uint8Array(sab, 8)
    const bytes = new TextEncoder().encode(inputValue)
    if (bytes.length > dataView.byteLength) {
      dataView.set(bytes.subarray(0, dataView.byteLength))
      Atomics.store(header, 1, dataView.byteLength)
    } else {
      dataView.set(bytes)
      Atomics.store(header, 1, bytes.length)
    }
    Atomics.store(header, 0, 1)
    Atomics.notify(header, 0)
    setWaitingInput(false)
    setInputValue('')
    setInputPrompt('')
  }, [waitingInput, inputValue, lang])

  const runPython = useCallback(() => {
    if (!sabSupported) {
      setOutput('❌ Browser-ul nu permite input() interactiv (SharedArrayBuffer indisponibil). Reîncarcă pagina sau folosește Chrome/Edge/Firefox actualizat.')
      return
    }
    setRunning(true)
    setOutput('⏳ Se încarcă Python (~10MB prima dată, apoi e cache-uit)...')
    outputRef.current = ''
    setWaitingInput(false)
    setInputValue('')
    setInputPrompt('')

    if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null }

    // Creăm un nou SAB pentru fiecare rulare (16KB pentru valoare input — destul pt orice)
    const sab = new SharedArrayBuffer(8 + 16384)
    sabRef.current = sab

    let timedOut = false
    const TIMEOUT_MS = 60000 // 60s — interactiv, lăsăm timp pt input uman

    const timeout = setTimeout(() => {
      timedOut = true
      if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null }
      const out = outputRef.current + '\n⏱ Timp depășit (>60s). Codul a fost oprit.'
      setOutput(out)
      if (onOutput) onOutput(out, false)
      setRunning(false)
      setWaitingInput(false)
    }, TIMEOUT_MS)

    try {
      const w = new Worker(getPyWorkerUrl())
      workerRef.current = w

      w.onmessage = (ev) => {
        if (timedOut) return
        const { type, line, ok, output: finalOut, error, prompt } = ev.data

        if (type === 'stdout') {
          // output în timp real
          outputRef.current += line
          setOutput(outputRef.current || '⏳ Rulez...')
          return
        }

        if (type === 'needsInput') {
          // Worker așteaptă input — afișăm câmpul interactiv
          setInputPrompt(prompt || '')
          setInputValue('')
          setWaitingInput(true)
          return
        }

        if (type === 'done') {
          clearTimeout(timeout)
          let text = finalOut || outputRef.current || ''
          if (error) text += (text ? '\n' : '') + '❌ ' + error
          if (!text) text = '(fără output)'
          setOutput(text)
          if (onOutput) onOutput(text, ok)
          setRunning(false)
          setWaitingInput(false)
          w.terminate(); workerRef.current = null
        }
      }

      w.onerror = (err) => {
        if (timedOut) return
        clearTimeout(timeout)
        const msg = '❌ ' + (err.message || 'Eroare worker Python')
        setOutput(msg)
        if (onOutput) onOutput(msg, false)
        setRunning(false)
        setWaitingInput(false)
        workerRef.current = null
      }

      w.postMessage({ code: code || '', sab })
    } catch (e) {
      clearTimeout(timeout)
      setOutput('❌ ' + (e?.message || e))
      setRunning(false)
      setWaitingInput(false)
    }
  }, [code, onOutput, sabSupported])

  const runJs = useCallback(() => {
    setRunning(true)
    setOutput('')
    outputRef.current = ''
    setWaitingInput(false)
    setInputPrompt('')
    setInputValue('')
    if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null }
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null }
      setOutput(o => o + '\n⏱ Cod prea lent (>30s) — posibil buclă infinită. Oprit.')
      setRunning(false); setWaitingInput(false)
    }, 30000)
    try {
      const w = new Worker(getJsWorkerUrl())
      workerRef.current = w
      w.onmessage = (ev) => {
        if (timedOut) return
        const msg = ev.data
        if (msg.type === 'stdout') {
          outputRef.current += msg.line + '\n'
          setOutput(outputRef.current)
          return
        }
        if (msg.type === 'needsInput') {
          setInputPrompt(msg.prompt || '')
          setWaitingInput(true)
          return
        }
        // type === 'done'
        clearTimeout(timeout)
        const { ok, error } = msg
        let text = outputRef.current
        if (error) text += '\n❌ ' + error
        if (!text) text = '(fără output)'
        setOutput(text)
        if (onOutput) onOutput(text, ok)
        setRunning(false); setWaitingInput(false)
        w.terminate(); workerRef.current = null
      }
      w.onerror = (err) => {
        if (timedOut) return
        clearTimeout(timeout)
        setOutput('❌ ' + (err.message || 'Eroare necunoscută'))
        setRunning(false); setWaitingInput(false)
      }
      w.postMessage({ code: code || '' })
    } catch (e) {
      clearTimeout(timeout)
      setOutput('❌ ' + (e?.message || e))
      setRunning(false)
    }
  }, [code, onOutput])

  const runServerSide = useCallback(async () => {
    setRunning(true); setOutput('⏳ Compilare și rulare pe server...')
    try {
      const r = await fetch('/api/public/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code: code || '', stdin: stdinValue || '' }),
      })
      const d = await r.json()
      if (!r.ok) {
        const msg = '❌ ' + (d.error || 'Eroare server')
        setOutput(msg)
        if (onOutput) onOutput(msg, false)
        return
      }
      const compileErr = d.compile?.stderr?.trim()
      const runOut = d.run?.stdout?.trim() || ''
      const runErr = d.run?.stderr?.trim() || ''
      const exitCode = d.run?.code ?? null

      let out = ''
      if (compileErr) out += '🔨 Erori compilare:\n' + compileErr + '\n'
      if (runOut) out += runOut
      if (runErr) out += (out ? '\n' : '') + '⚠️ Stderr:\n' + runErr
      if (!out) out = exitCode === 0 ? '(fără output)' : `❌ Program terminat cu codul ${exitCode}`

      setOutput(out)
      if (onOutput) onOutput(out, !compileErr && exitCode === 0)
    } catch (e) {
      const msg = '❌ ' + (e?.message || 'Eroare rețea')
      setOutput(msg)
      if (onOutput) onOutput(msg, false)
    } finally {
      setRunning(false)
    }
  }, [code, lang, onOutput, stdinValue])

  const run = () => {
    if (lang === 'python') return runPython()
    if (lang === 'javascript' || lang === 'js') return runJs()
    if (lang === 'c' || lang === 'cpp' || lang === 'c++' || lang === 'csharp' || lang === 'c#' || lang === 'cs') return runServerSide()
    if (lang === 'html' || lang === 'css') {
      // pentru HTML/CSS doar refresh la preview
      setPreviewKey(k => k + 1)
    }
  }

  const reset = () => { setCode(starter || ''); setOutput('') }

  const taRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (readOnly) return
    const ta = e.target
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const val   = ta.value

    // helper: aplică modificarea și setează cursorul după re-render React
    const apply = (newVal, cursorPos, cursorEnd) => {
      e.preventDefault()
      setCode(newVal)
      requestAnimationFrame(() => {
        if (!taRef.current) return
        taRef.current.setSelectionRange(cursorPos, cursorEnd ?? cursorPos)
      })
    }

    // Tab → 4 spații
    if (e.key === 'Tab') {
      if (start !== end) {
        // indent linii selectate
        const lineStart = val.lastIndexOf('\n', start - 1) + 1
        const lineEnd   = val.indexOf('\n', end)
        const block = val.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
        const indented = block.replace(/^/gm, '    ')
        const newVal = val.slice(0, lineStart) + indented + (lineEnd === -1 ? '' : val.slice(lineEnd))
        apply(newVal, start + 4, end + indented.split('\n').length * 4)
      } else {
        apply(val.slice(0, start) + '    ' + val.slice(end), start + 4)
      }
      return
    }

    // Enter → păstrează indentarea curentă + adaugă extra după ':' / scade după break/continue/return/pass
    // + dacă suntem între { } sau [ ] → inserează rând indentat + acolada/paranteza pe rând nou
    if (e.key === 'Enter') {
      const lineStart  = val.lastIndexOf('\n', start - 1) + 1
      const linePrefix = val.slice(lineStart, start)
      const indent     = linePrefix.match(/^([ \t]*)/)[1]
      const trimmed    = linePrefix.trim()

      // Detectează perechi bracket în jurul cursorului (fără selecție)
      const BRACKET_PAIRS = { '{': '}', '[': ']' }
      const charBefore = start > 0 ? val[start - 1] : ''
      const charAfter  = val[start] || ''
      if (start === end && BRACKET_PAIRS[charBefore] === charAfter) {
        const innerIndent = indent + '    '
        const newVal = val.slice(0, start) + '\n' + innerIndent + '\n' + indent + val.slice(end)
        apply(newVal, start + 1 + innerIndent.length)
        return
      }

      const deindent   = /^(break|continue|return|pass)(\s.*)?$/.test(trimmed)
      const extraIndent = !deindent && linePrefix.trimEnd().endsWith(':') ? '    ' : ''
      const newIndent  = deindent && indent.length >= 4 ? indent.slice(4) : indent
      apply(val.slice(0, start) + '\n' + newIndent + extraIndent + val.slice(end), start + 1 + newIndent.length + extraIndent.length)
      return
    }

    // Auto-close perechi
    const PAIRS = { '(': ')', '[': ']', '{': '}', "'": "'", '"': '"' }
    if (PAIRS[e.key]) {
      const close = PAIRS[e.key]
      const selected = val.slice(start, end)
      const newVal = val.slice(0, start) + e.key + selected + close + val.slice(end)
      // dacă e selecție → înconjoară, cursor după selecție
      if (start !== end) {
        apply(newVal, start + 1, end + 1)
      } else {
        apply(newVal, start + 1)
      }
      return
    }

    // Backspace — dacă înainte de cursor sunt exact 4 spații (fără selecție), le șterge pe toate
    if (e.key === 'Backspace' && start === end) {
      const before = val.slice(0, start)
      if (before.endsWith('    ')) {
        apply(val.slice(0, start - 4) + val.slice(end), start - 4)
        return
      }
    }

    // Skip peste closing bracket dacă urmează exact acel caracter
    if (['}', ']', ')'].includes(e.key) && start === end && val[start] === e.key) {
      e.preventDefault()
      requestAnimationFrame(() => taRef.current?.setSelectionRange(start + 1, start + 1))
      return
    }
  }, [readOnly, setCode])

  // Pentru HTML/CSS preview-ul e un iframe sandbox
  const isPreview = lang === 'html' || lang === 'css'
  const previewSrc = (() => {
    if (lang === 'html') return code || ''
    if (lang === 'css') return `<!doctype html><html><head><style>${code || ''}</style></head><body><div class="demo"><h1>Titlu</h1><p>Paragraf de test pentru CSS-ul tău.</p><button>Buton</button></div></body></html>`
    return ''
  })()

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          ref={taRef}
          value={code ?? ''}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          className="w-full px-4 py-3 border-2 border-slate-700 rounded-xl font-mono text-sm bg-slate-900 text-slate-100 focus:border-blue-500 outline-none resize-y"
          placeholder={starter || `// scrie cod ${lang}`}
          style={{ tabSize: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
        />
        <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{lang}</div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button type="button" onClick={run} disabled={running}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition">
          {isPreview ? <EyeIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          {running ? 'Rulez...' : (isPreview ? 'Preview' : 'Rulează')}
        </button>
        <button type="button" onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 border-2 border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
          <ArrowPathIcon className="w-4 h-4" /> Reset
        </button>
        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
          {lang === 'python' && '🐍 Python în Worker izolat (timeout 10s)'}
          {(lang === 'javascript' || lang === 'js') && '⚡ JS în Web Worker izolat'}
          {(lang === 'c' || lang === 'cpp' || lang === 'c++' || lang === 'csharp' || lang === 'c#' || lang === 'cs') && '⚙️ Cod compilat pe server (Wandbox)'}
          {isPreview && '🖼 Preview live (iframe sandbox)'}
        </span>
      </div>

      {/* Stdin pentru C/C++/C# — date de intrare trimise la compilare */}
      {(lang === 'c' || lang === 'cpp' || lang === 'c++' || lang === 'csharp' || lang === 'c#' || lang === 'cs') && (
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            ⌨️ Date de intrare (stdin) — <span className="font-normal normal-case">ce ar tasta utilizatorul, câte un rând</span>
          </label>
          <textarea
            value={stdinValue}
            onChange={e => setStdinValue(e.target.value)}
            rows={3}
            placeholder={`ex:\n5\n1 2 3 4 5`}
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl font-mono text-xs bg-white text-slate-800 focus:border-blue-400 outline-none resize-y placeholder:text-slate-400"
          />
        </div>
      )}

      {/* Stdin pre-populat (fallback dacă SAB indisponibil) */}
      {lang === 'python' && !sabSupported && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 text-xs text-rose-900">
          ⚠️ Browser-ul nu suportă input() interactiv. Reîncarcă pagina sau folosește Chrome/Edge/Firefox actualizat.
        </div>
      )}

      {/* Input interactiv inline — apare când programul cere input() */}
      {waitingInput && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3 space-y-2 animate-pulse-once" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            ⌨️ Programul așteaptă input
          </label>
          {inputPrompt && (
            <div className="font-mono text-sm text-slate-700 bg-white border border-amber-300 rounded-lg px-3 py-2">
              {inputPrompt}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); submitInteractiveInput() }} className="flex gap-2">
            <input
              ref={inputFieldRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Scrie valoarea și apasă Enter..."
              className="flex-1 px-3 py-2 border-2 border-amber-400 rounded-lg font-mono text-sm bg-white text-slate-900 focus:border-amber-600 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition shadow"
            >
              Trimite
            </button>
          </form>
        </div>
      )}

      {/* Output / Preview */}
      {isPreview ? (
        <iframe
          key={previewKey}
          title="preview"
          sandbox="allow-scripts"
          srcDoc={previewSrc}
          className="w-full h-72 border-2 border-slate-200 rounded-xl bg-white"
        />
      ) : (output || running) && (
        <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap min-h-[60px] max-h-72 overflow-auto">
          {output || '⏳ Rulez...'}
        </div>
      )}
    </div>
  )
}
