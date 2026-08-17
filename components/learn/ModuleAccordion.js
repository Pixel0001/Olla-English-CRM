'use client'
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function ModuleAccordion({ defaultOpen, header, progressBar, children, moduleId, accentFrom, accentTo }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div id={`module-${moduleId}`}>
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left focus:outline-none"
        aria-expanded={open}
      >
        {header}

        {/* Chevron toggle row */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-t border-slate-100 group">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-500 transition">
            {open ? 'Ascunde lecțiile' : 'Arată lecțiile'}
          </span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
            open ? 'bg-slate-200 text-slate-600' : 'bg-slate-200 text-slate-600'
          }`}>
            <span>{open ? 'Închide' : 'Deschide'}</span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {/* Progress bar — always visible */}
      {progressBar}

      {/* Lessons — smooth collapsible */}
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
