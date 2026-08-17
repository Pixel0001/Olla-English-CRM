'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDownIcon, ChevronRightIcon, LockClosedIcon,
  PuzzlePieceIcon, CheckCircleIcon, CodeBracketIcon,
} from '@heroicons/react/24/outline'

export default function GuestModuleAccordion({ module: m, moduleIndex: mi, theme, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const freeCount = m.lessons.filter(l => l.isFree).length

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden ring-1 ${theme.ring}`}>
      {/* Header — clickable */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left focus:outline-none"
        aria-expanded={open}
      >
        {/* Accent bar */}
        <div className={`h-2 bg-gradient-to-r ${theme.from} ${theme.to}`} />

        {/* Header body */}
        <div className="px-5 py-5 flex items-center gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center shadow-lg shrink-0`}>
            <CodeBracketIcon className="w-7 h-7 text-white drop-shadow" />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-sm`}>
                Modul {mi + 1}
              </span>
              {m.language && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-slate-900 text-white rounded-full">
                  {m.language}
                </span>
              )}
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">
                {freeCount} gratuite
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{m.title}</h2>
            {m.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{m.description}</p>
            )}
          </div>

          {/* Count badge */}
          <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <div className={`text-2xl font-black bg-gradient-to-br ${theme.from} ${theme.to} bg-clip-text text-transparent leading-none`}>
                {m.lessons.length}
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">lecții</div>
            </div>
          </div>
        </div>

        {/* Chevron toggle row */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {open ? 'Ascunde lecțiile' : 'Arată lecțiile'}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
            <span>{open ? 'Închide' : 'Deschide'}</span>
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Lessons — smooth collapsible */}
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-3">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {m.lessons.map((l, li) => {
                if (l.isFree) {
                  return (
                    <Link
                      key={l.id}
                      href={`/learn/guest/lesson/${l.id}`}
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0`}>
                        {li + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-slate-900 block truncate leading-snug">{l.title}</span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">Gratis</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <PuzzlePieceIcon className="w-3 h-3" />
                            {l._count.problems} prob.
                          </span>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0 transition" />
                    </Link>
                  )
                }
                return (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 opacity-60 cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                      <LockClosedIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-slate-500 block truncate leading-snug">{l.title}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-slate-400">Doar cu abonament</span>
                      </div>
                    </div>
                    <LockClosedIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                )
              })}
              {m.lessons.length === 0 && (
                <p className="sm:col-span-2 xl:col-span-3 text-sm text-slate-400 text-center py-6">
                  Nicio lecție în acest modul.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
