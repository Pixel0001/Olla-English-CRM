'use client'

import { useState } from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function BonusPointsHistory({ bonusPoints = [] }) {
  const [expanded, setExpanded] = useState(false)

  if (bonusPoints.length === 0) return null

  const recent = bonusPoints.filter(bp => {
    const age = Date.now() - new Date(bp.createdAt).getTime()
    return age < 7 * 24 * 60 * 60 * 1000
  })
  const isNew = recent.length > 0

  const visible = expanded ? bonusPoints : bonusPoints.slice(0, 3)
  const totalBonus = bonusPoints.reduce((s, bp) => s + bp.points, 0)

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${isNew ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm ${isNew ? 'bg-amber-400 text-amber-900' : 'bg-slate-100 text-slate-600'}`}>
          <StarSolid className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm ${isNew ? 'text-amber-900' : 'text-gray-800'}`}>
            Puncte bonus
            {isNew && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 bg-amber-400 text-amber-900 rounded-full uppercase tracking-wider">Nou</span>}
          </div>
          <div className={`text-xs mt-0.5 ${isNew ? 'text-amber-700' : 'text-gray-500'}`}>
            Total bonus: <strong>{totalBonus >= 0 ? '+' : ''}{totalBonus} XP</strong> · {bonusPoints.length} {bonusPoints.length === 1 ? 'intrare' : 'intrări'}
          </div>
        </div>
      </div>

      {/* List */}
      <div className={`divide-y ${isNew ? 'divide-amber-100' : 'divide-gray-50'}`}>
        {visible.map((bp, idx) => {
          const isRecent = Date.now() - new Date(bp.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
          return (
            <div key={bp.id} className={`px-4 py-3 flex items-center gap-3 ${isRecent && idx === 0 ? (bp.points >= 0 ? 'bg-amber-100/60' : 'bg-rose-100/60') : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs ${
                bp.points >= 0 ? 'bg-amber-400 text-amber-900' : 'bg-rose-400 text-white'
              }`}>
                {bp.points >= 0 ? '+' : ''}{bp.points}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{bp.reason}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {bp.addedBy?.name} · {new Date(bp.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              {isRecent && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-full uppercase tracking-wider shrink-0">Nou</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Show more / less */}
      {bonusPoints.length > 3 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className={`w-full px-4 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition ${
            isNew ? 'text-amber-700 hover:bg-amber-100 border-t border-amber-100' : 'text-gray-500 hover:bg-gray-50 border-t border-gray-50'
          }`}
        >
          {expanded
            ? <><ChevronUpIcon className="w-3.5 h-3.5" /> Ascunde</>
            : <><ChevronDownIcon className="w-3.5 h-3.5" /> Vezi tot istoricul ({bonusPoints.length - 3} mai multe)</>
          }
        </button>
      )}
    </div>
  )
}
