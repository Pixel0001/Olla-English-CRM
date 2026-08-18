import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

/**
 * Istoricul complet al unei grupe: elevi, sesiuni cu prezențe, plăți,
 * lecții lunare și lecții de probă.
 *
 * ?format=csv → fișier .csv cu secțiuni
 * ?format=pdf → pagină pregătită de tipar, care deschide singură dialogul de
 *               print (Salvează ca PDF) — fără dependințe suplimentare
 */

const MONTH_NAMES = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
]

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('ro-RO', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : ''

const STUDENT_STATUS = {
  ACTIVE: 'Activ', PAUSED: 'Pauză', LEFT: 'A plecat',
  COMPLETED: 'Finalizat', TRANSFERRED: 'Transferat',
}

const TRIAL_STATUS = {
  PROGRAMAT: 'Programată', PREZENT: 'A venit', ABSENT: 'Nu a venit', ANULAT: 'Anulată',
}

// ── CSV ──────────────────────────────────────────────────────────────────
const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const csvRow = (cells) => cells.map(csvCell).join(',')

function buildCsv(data) {
  const { group, students, sessions, payments, months, trials, totals } = data
  const out = []

  out.push('GRUPA')
  out.push(csvRow(['Nume', group.name]))
  out.push(csvRow(['Nivel', group.level || '—']))
  out.push(csvRow(['Profesor', group.teacher?.name || '—']))
  out.push(csvRow(['Filială', group.branch?.name || '—']))
  out.push(csvRow(['Program', `${(group.scheduleDays || []).join(', ')} ${group.scheduleTime || ''}`.trim()]))
  out.push(csvRow(['Început', fmtDate(group.startDate || group.createdAt)]))
  out.push(csvRow(['Lecții pe lună', group.monthlyLessons ?? 8]))
  out.push(csvRow(['Status', group.active ? 'Activă' : 'Inactivă']))
  out.push(csvRow(['Total lecții ținute', sessions.length]))
  out.push(csvRow(['Total încasat (lei)', totals.paid]))
  out.push('')

  out.push('ELEVI')
  out.push(csvRow(['Nume', 'Status', 'Înscris la', 'Lecții rămase', 'Prezențe', 'Absențe', 'Total plătit (lei)', 'Părinte', 'Telefon']))
  for (const s of students) {
    out.push(csvRow([
      s.name, STUDENT_STATUS[s.status] || s.status, fmtDate(s.enrolledAt),
      s.lessonsRemaining, s.present, s.absent, s.paid, s.parentName || '', s.parentPhone || '',
    ]))
  }
  out.push('')

  out.push('SESIUNI ȘI PREZENȚE')
  out.push(csvRow(['Data', 'Lecții scăzute', 'Prezenți', 'Absenți', ...students.map((s) => s.name)]))
  for (const ses of sessions) {
    out.push(csvRow([
      fmtDateTime(ses.date),
      ses.lessonsDeducted ? 'da' : 'nu',
      ses.presentCount,
      ses.absentCount,
      ...students.map((s) => {
        const st = ses.byStudent[s.studentId]
        return st === 'PRESENT' ? 'P' : st === 'ABSENT' ? 'A' : '—'
      }),
    ]))
  }
  out.push('')

  out.push('PLĂȚI')
  out.push(csvRow(['Data', 'Elev', 'Sumă (lei)', 'Metodă', 'Lecții adăugate', 'Înregistrat de', 'Notițe']))
  for (const p of payments) {
    out.push(csvRow([
      fmtDate(p.paymentDate), p.studentName, p.amount, p.paymentMethod || '',
      p.lessonsAdded ?? '', p.createdByName || '', p.notes || '',
    ]))
  }
  out.push('')

  out.push('SITUAȚIE LUNARĂ')
  out.push(csvRow(['Luna', 'Lecții de achitat', 'Lecții ținute', 'Rămase', 'Încasat (lei)']))
  for (const m of months) {
    out.push(csvRow([`${MONTH_NAMES[m.month - 1]} ${m.year}`, m.total, m.held, m.remaining, m.paid]))
  }

  if (trials.length > 0) {
    out.push('')
    out.push('LECȚII DE PROBĂ')
    out.push(csvRow(['Data', 'Participant', 'Telefon', 'Status', 'Notițe']))
    for (const t of trials) {
      out.push(csvRow([
        fmtDateTime(t.scheduledAt), t.name, t.phone || '',
        TRIAL_STATUS[t.status] || t.status, t.notes || '',
      ]))
    }
  }

  return out.join('\n')
}

// ── HTML pentru tipar / PDF ──────────────────────────────────────────────
const esc = (v) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function buildHtml(data) {
  const { group, students, sessions, payments, months, trials, totals } = data

  const table = (headers, rows) => `
    <table>
      <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`

  return `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<title>${esc(group.name)} — istoric</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #111827; margin: 24px; font-size: 12px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #e5e7eb; }
  .meta { color: #6b7280; font-size: 11px; margin-bottom: 12px; }
  .cards { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
  .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 10px; }
  .card span { display: block; color: #6b7280; font-size: 10px; text-transform: uppercase; }
  .card b { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  th, td { border: 1px solid #e5e7eb; padding: 4px 6px; text-align: left; }
  th { background: #f9fafb; font-size: 10px; text-transform: uppercase; color: #6b7280; }
  tbody tr:nth-child(even) { background: #fafafa; }
  @media print { body { margin: 10mm; } h2 { page-break-after: avoid; } tr { page-break-inside: avoid; } }
</style>
</head>
<body onload="window.print()">
  <h1>${esc(group.name)}</h1>
  <div class="meta">
    ${esc(group.level || 'fără nivel')} ·
    profesor ${esc(group.teacher?.name || '—')} ·
    ${esc(group.branch?.name || 'fără filială')} ·
    ${esc((group.scheduleDays || []).join(', '))} ${esc(group.scheduleTime || '')} ·
    din ${esc(fmtDate(group.startDate || group.createdAt))} ·
    generat ${esc(fmtDateTime(new Date()))}
  </div>

  <div class="cards">
    <div class="card"><span>Elevi</span><b>${students.length}</b></div>
    <div class="card"><span>Lecții ținute</span><b>${sessions.length}</b></div>
    <div class="card"><span>Lecții pe lună</span><b>${group.monthlyLessons ?? 8}</b></div>
    <div class="card"><span>Total încasat</span><b>${totals.paid} lei</b></div>
    <div class="card"><span>Probe</span><b>${trials.length}</b></div>
  </div>

  <h2>Elevi</h2>
  ${table(
    ['Nume', 'Status', 'Înscris', 'Lecții rămase', 'Prezențe', 'Absențe', 'Plătit (lei)', 'Contact'],
    students.map((s) => [
      s.name, STUDENT_STATUS[s.status] || s.status, fmtDate(s.enrolledAt),
      s.lessonsRemaining, s.present, s.absent, s.paid,
      [s.parentName, s.parentPhone].filter(Boolean).join(' · '),
    ])
  )}

  <h2>Situație lunară</h2>
  ${table(
    ['Luna', 'De achitat', 'Ținute', 'Rămase', 'Încasat (lei)'],
    months.map((m) => [`${MONTH_NAMES[m.month - 1]} ${m.year}`, m.total, m.held, m.remaining, m.paid])
  )}

  <h2>Sesiuni și prezențe</h2>
  ${table(
    ['Data', 'Prezenți', 'Absenți', ...students.map((s) => s.name)],
    sessions.map((ses) => [
      fmtDateTime(ses.date), ses.presentCount, ses.absentCount,
      ...students.map((s) => {
        const st = ses.byStudent[s.studentId]
        return st === 'PRESENT' ? 'P' : st === 'ABSENT' ? 'A' : '—'
      }),
    ])
  )}

  <h2>Plăți</h2>
  ${table(
    ['Data', 'Elev', 'Sumă (lei)', 'Metodă', 'Lecții adăugate', 'Înregistrat de'],
    payments.map((p) => [
      fmtDate(p.paymentDate), p.studentName, p.amount, p.paymentMethod || '',
      p.lessonsAdded ?? '', p.createdByName || '',
    ])
  )}

  ${trials.length > 0 ? `<h2>Lecții de probă</h2>${table(
    ['Data', 'Participant', 'Telefon', 'Status', 'Notițe'],
    trials.map((t) => [
      fmtDateTime(t.scheduledAt), t.name, t.phone || '',
      TRIAL_STATUS[t.status] || t.status, t.notes || '',
    ])
  )}` : ''}
</body>
</html>`
}

export async function GET(request, { params }) {
  const perm = await checkPermission('groups.view')
  if (!perm.allowed) {
    return NextResponse.json({ error: 'Nu ai permisiunea să vezi grupele' }, { status: 403 })
  }

  try {
    const { id } = await params
    const format = new URL(request.url).searchParams.get('format') || 'csv'

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        teacher: { select: { name: true } },
        branch: { select: { name: true } },
        groupStudents: {
          include: {
            student: { select: { id: true, fullName: true, parentName: true, parentPhone: true } },
            payments: {
              include: { createdBy: { select: { name: true } } },
              orderBy: { paymentDate: 'desc' },
            },
          },
          orderBy: { enrolledAt: 'asc' },
        },
        lessonSessions: {
          include: { attendances: { select: { studentId: true, status: true } } },
          orderBy: { date: 'asc' },
        },
        lessonPackages: true,
        trialLessons: {
          include: { lead: { select: { name: true, studentName: true, phone: true } } },
          orderBy: { scheduledAt: 'asc' },
        },
      },
    })

    if (!group) return NextResponse.json({ error: 'Grupa nu există' }, { status: 404 })

    // ── Prezențe și plăți per elev ──────────────────────────────────────
    const attendanceByStudent = {}
    for (const s of group.lessonSessions) {
      for (const a of s.attendances) {
        const acc = (attendanceByStudent[a.studentId] ||= { present: 0, absent: 0 })
        if (a.status === 'PRESENT') acc.present++
        else acc.absent++
      }
    }

    const students = group.groupStudents.map((gs) => ({
      studentId: gs.studentId,
      name: gs.student.fullName,
      parentName: gs.student.parentName,
      parentPhone: gs.student.parentPhone,
      status: gs.status,
      enrolledAt: gs.enrolledAt,
      lessonsRemaining: gs.lessonsRemaining,
      present: attendanceByStudent[gs.studentId]?.present || 0,
      absent: attendanceByStudent[gs.studentId]?.absent || 0,
      paid: gs.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    }))

    const sessions = group.lessonSessions.map((s) => {
      const byStudent = {}
      let presentCount = 0
      let absentCount = 0
      for (const a of s.attendances) {
        byStudent[a.studentId] = a.status
        if (a.status === 'PRESENT') presentCount++
        else absentCount++
      }
      return { date: s.date, lessonsDeducted: s.lessonsDeducted, byStudent, presentCount, absentCount }
    })

    const payments = group.groupStudents.flatMap((gs) =>
      gs.payments.map((p) => ({
        paymentDate: p.paymentDate,
        studentName: gs.student.fullName,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        lessonsAdded: p.lessonsAdded,
        createdByName: p.createdBy?.name || null,
        notes: p.notes,
      }))
    ).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))

    // ── Situație lunară, din luna de start până acum ─────────────────────
    const defaultLessons = group.monthlyLessons ?? 8
    const overrideMap = new Map(group.lessonPackages.map((p) => [`${p.year}-${p.month}`, p.totalLessons]))
    const heldByMonth = new Map()
    for (const s of group.lessonSessions) {
      const key = `${s.date.getFullYear()}-${s.date.getMonth() + 1}`
      heldByMonth.set(key, (heldByMonth.get(key) || 0) + 1)
    }
    const paidByMonth = new Map()
    for (const p of payments) {
      const d = new Date(p.paymentDate)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      paidByMonth.set(key, (paidByMonth.get(key) || 0) + (p.amount || 0))
    }

    const first = group.startDate || group.createdAt
    const cursor = new Date(first.getFullYear(), first.getMonth(), 1)
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth(), 1)
    const months = []
    while (cursor <= last) {
      const y = cursor.getFullYear()
      const m = cursor.getMonth() + 1
      const key = `${y}-${m}`
      const total = overrideMap.get(key) ?? defaultLessons
      const held = heldByMonth.get(key) || 0
      months.push({
        year: y, month: m, total, held,
        remaining: Math.max(total - held, 0),
        paid: paidByMonth.get(key) || 0,
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }

    const trials = group.trialLessons.map((t) => ({
      scheduledAt: t.scheduledAt,
      name: t.lead?.studentName || t.lead?.name || 'Necunoscut',
      phone: t.lead?.phone || null,
      status: t.status,
      notes: t.notes,
    }))

    const data = {
      group,
      students,
      sessions,
      payments,
      months,
      trials,
      totals: { paid: payments.reduce((s, p) => s + (p.amount || 0), 0) },
    }

    const safeName = group.name.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
    const stamp = new Date().toISOString().slice(0, 10)

    if (format === 'pdf') {
      return new NextResponse(buildHtml(data), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    // BOM, ca Excel să recunoască diacriticele
    return new NextResponse('﻿' + buildCsv(data), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}-${stamp}.csv"`,
      },
    })
  } catch (e) {
    console.error('Group export error:', e)
    return NextResponse.json({ error: 'Eroare la generarea exportului' }, { status: 500 })
  }
}
