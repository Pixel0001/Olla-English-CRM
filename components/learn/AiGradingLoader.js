'use client'

import { useEffect, useState } from 'react'
import MrOllaAvatar from './MrOllaAvatar'

const PHRASES = [
  'Citesc codul tău...',
  'Verific dacă funcționează...',
  'Compar cu soluția corectă...',
  'Pregătesc feedback prietenos...',
  'Aproape gata!',
]

/**
 * Loader vizual afișat în timp ce Mr. Olla evaluează codul.
 */
export default function AiGradingLoader() {
  const [phraseIdx, setPhraseIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % PHRASES.length), 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-lg overflow-hidden">
      <div className="p-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <MrOllaAvatar size={56} animated />
          {/* halou pulsator */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-indigo-400 ring-opacity-50 animate-ping" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-indigo-900 text-sm flex items-center gap-2">
            Mr. Olla se gândește
            <span className="inline-flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
          <div className="text-xs text-indigo-700 mt-1 transition-opacity duration-300" key={phraseIdx}>
            {PHRASES[phraseIdx]}
          </div>
          {/* progress bar continuă */}
          <div className="mt-2 h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}
