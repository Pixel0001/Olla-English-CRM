import { NextResponse } from 'next/server'

// Proxy către Wandbox (https://wandbox.org) — gratuit, fără API key, suportă C/C++/C#
// API docs: https://github.com/melpon/wandbox/blob/master/kennel2/API.rst

const WANDBOX_URL = 'https://wandbox.org/api/compile.json'

// Mapare limbaj intern → { compiler, compilerOptionRaw }
const LANGUAGE_MAP = {
  c:      { compiler: 'gcc-head',        compilerOptionRaw: '-x\nc\n-std=c11\n-O2' },
  cpp:    { compiler: 'gcc-head',        compilerOptionRaw: '-std=c++17\n-O2' },
  'c++':  { compiler: 'gcc-head',        compilerOptionRaw: '-std=c++17\n-O2' },
  csharp: { compiler: 'mono-6.12.0.122', compilerOptionRaw: '' },
  'c#':   { compiler: 'mono-6.12.0.122', compilerOptionRaw: '' },
  cs:     { compiler: 'mono-6.12.0.122', compilerOptionRaw: '' },
}

// Rate limit simplu per IP: 10 rulări/minut
const ipCounts = new Map()
setInterval(() => ipCounts.clear(), 60_000)

export async function POST(req) {
  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const count = (ipCounts.get(ip) || 0) + 1
  ipCounts.set(ip, count)
  if (count > 10) {
    return NextResponse.json({ error: 'Prea multe rulări — mai încearcă în 1 minut.' }, { status: 429 })
  }

  let body = {}
  try { body = await req.json() } catch {}
  const { language, code, stdin } = body

  const langEntry = LANGUAGE_MAP[String(language).toLowerCase()]
  if (!langEntry) {
    return NextResponse.json({ error: `Limbajul "${language}" nu e suportat pentru rulare server-side.` }, { status: 400 })
  }
  if (!code || !String(code).trim()) {
    return NextResponse.json({ error: 'Codul este gol.' }, { status: 400 })
  }
  if (String(code).length > 50_000) {
    return NextResponse.json({ error: 'Codul este prea lung (max 50 000 caractere).' }, { status: 400 })
  }

  const { compiler, compilerOptionRaw } = langEntry

  try {
    const res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler,
        code,
        stdin: stdin || '',
        'compiler-option-raw': compilerOptionRaw,
        'runtime-option-raw': '',
        save: false,
      }),
      signal: AbortSignal.timeout(25_000),
    })

    if (!res.ok) {
      const t = await res.text().catch(() => '')
      return NextResponse.json({ error: `Wandbox error ${res.status}: ${t.slice(0, 300)}` }, { status: 502 })
    }

    const data = await res.json()
    // data.status — exit code ca string ("0" = success)
    // data.program_output — stdout
    // data.program_error  — stderr runtime
    // data.compiler_error — erori de compilare
    const compileErr = (data.compiler_error || '').trim()
    const runOut     = (data.program_output || '').trim()
    const runErr     = (data.program_error || '').trim()
    const exitCode   = parseInt(data.status ?? '0', 10)

    if (compileErr && exitCode !== 0 && !runOut) {
      return NextResponse.json({
        ok: true,
        compile: { stderr: compileErr },
        run: { stdout: '', stderr: '', code: 1 },
        status: 'Compilation Error',
      })
    }

    return NextResponse.json({
      ok: true,
      compile: { stderr: compileErr },
      run: { stdout: runOut, stderr: runErr, code: exitCode },
      status: exitCode === 0 ? 'Accepted' : 'Runtime Error',
    })
  } catch (e) {
    if (e?.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Timeout — serverul de rulare a durat prea mult (>25s).' }, { status: 504 })
    }
    return NextResponse.json({ error: e?.message || 'Eroare necunoscută' }, { status: 500 })
  }
}
