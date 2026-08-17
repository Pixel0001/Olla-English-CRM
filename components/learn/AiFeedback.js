'use client'

import Link from 'next/link'
import MrOllaAvatar from './MrOllaAvatar'
import Markdown from '@/lib/markdown'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaintBrushIcon,
  BoltIcon,
  XMarkIcon,
  ArrowPathIcon,
  ArrowRightCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid'

/**
 * Afișare feedback AI „Mr. Olla" pentru o problemă CODING.
 * Props:
 *   data       : { aiGrade, aiDetect, aiPenaltyApplied, usage }
 *   onClose    : () => void
 *   onRetry    : () => void  — curăță feedbackul pt re-editare (opțional)
 *   onContinue : () => void  — avansează la problema/lecția următoare (opțional)
 *   token      : string
 */
export default function AiFeedback({ data, onClose, onRetry, onContinue, token }) {
  if (!data) return null

  const { aiGrade, aiDetect, aiPenaltyApplied, usage } = data
  const grade = aiGrade?.finalGrade ?? aiGrade?.grade ?? 0
  const passed = grade >= 60

  const gradeBadgeColor =
    grade >= 90 ? 'from-emerald-500 to-green-600'
    : grade >= 75 ? 'from-blue-500 to-cyan-600'
    : grade >= 60 ? 'from-amber-400 to-yellow-500'
    : 'from-red-500 to-rose-600'

  const passedText =
    grade >= 90 ? 'Excelent! Soluție perfectă!'
    : grade >= 75 ? 'Bravo, ai trecut!'
    : grade >= 60 ? 'Corect — poți merge mai departe!'
    : 'Mai ai puțin — analizează feedback-ul!'

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow-md p-0.5 shrink-0">
          <MrOllaAvatar size={36} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm">Mr. Olla</div>
          <div className="text-blue-100 text-xs">Profesorul tău AI · Olla English</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg transition" aria-label="Închide">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── AI detection warning ── */}
      {aiDetect?.isAi && (
        <div className="bg-red-50 border-b-2 border-red-200 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="font-bold text-red-800">Cod generat de AI detectat</div>
              <div className="text-red-700 mt-0.5">{aiDetect.reason || 'Codul tău pare scris de un AI, nu de tine.'}</div>
              <div className="text-red-900 font-semibold mt-1.5">Penalizare: <span className="text-base">−{aiPenaltyApplied} puncte</span></div>
              <div className="text-red-500 text-xs mt-0.5">Scor încredere: {aiDetect.score}/100</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Grade badge + status ── */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-4">
        <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradeBadgeColor} text-white flex flex-col items-center justify-center shadow-md`}>
          <div className="text-2xl sm:text-3xl font-black leading-none">{grade}</div>
          <div className="text-[10px] sm:text-xs opacity-90">/100</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-extrabold text-base flex items-center gap-1.5 ${passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {passed && <CheckSolid className="w-5 h-5 shrink-0" />}
            {passedText}
          </div>
          {aiDetect?.isAi && aiGrade?.grade !== grade && (
            <div className="text-xs text-gray-500 mt-1">Notă inițială: {aiGrade.grade} · Penalizare: −{aiPenaltyApplied}</div>
          )}
        </div>
      </div>

      {/* ── Rubric ── */}
      {aiGrade?.rubric && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <RubricBox label="Corectitudine" value={aiGrade.rubric.correctness} Icon={CheckCircleIcon} />
            <RubricBox label="Stil cod"       value={aiGrade.rubric.style}       Icon={PaintBrushIcon} />
            <RubricBox label="Eficiență"      value={aiGrade.rubric.efficiency}  Icon={BoltIcon} />
          </div>
        </div>
      )}

      {/* ── Feedback principal (Markdown) ── */}
      {aiGrade?.reasoning && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-3.5 text-sm text-gray-800 leading-relaxed">
            <Markdown text={aiGrade.reasoning} compact />
          </div>
        </div>
      )}

      {/* ── Footer: quota + butoane ── */}
      <div className="bg-blue-50 border-t border-blue-100 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            Verificări AI rămase azi:{' '}
            <span className={`font-bold ${(usage?.remaining ?? 1) === 0 ? 'text-red-600' : (usage?.remaining ?? 1) <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
              {usage?.remaining ?? '—'}/{usage?.limit ?? '—'}
            </span>
          </div>
          {token && (
            <Link href={`/learn/${token}/ai-stats`} className="text-[10px] text-indigo-500 hover:text-indigo-700 font-semibold hover:underline">
              Detalii utilizare →
            </Link>
          )}
        </div>
        {(usage?.remaining ?? 1) === 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" /> Limită zilnică atinsă — se reînnoiește mâine
          </div>
        )}
        {(usage?.remaining ?? 1) <= 5 && (usage?.remaining ?? 1) > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" /> Mai ai doar {usage.remaining} verificări rămase azi
          </div>
        )}

      </div>
    </div>
  )
}

function RubricBox({ label, value, Icon }) {
  const v = typeof value === 'number' ? value : 0
  const colorCls = v >= 80
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
    : v >= 50
    ? 'bg-blue-50 border-blue-200 text-blue-700'
    : 'bg-red-50 border-red-200 text-red-700'
  const iconCls = v >= 80 ? 'text-emerald-500' : v >= 50 ? 'text-blue-500' : 'text-red-500'
  return (
    <div className={`rounded-xl border p-2.5 flex flex-col items-center gap-1 ${colorCls}`}>
      <Icon className={`w-5 h-5 ${iconCls}`} />
      <div className="text-lg font-extrabold leading-none">{v}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-75 text-center">{label}</div>
    </div>
  )
}
