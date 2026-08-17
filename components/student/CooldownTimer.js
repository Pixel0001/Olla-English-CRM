'use client'
import { useState, useEffect } from 'react'

export default function CooldownTimer({ endsAt, compact = false }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, endsAt - Date.now()))

  useEffect(() => {
    const iv = setInterval(() => {
      const ms = Math.max(0, endsAt - Date.now())
      setRemaining(ms)
      if (ms === 0) clearInterval(iv)
    }, 1000)
    return () => clearInterval(iv)
  }, [endsAt])

  const totalSec = Math.ceil(remaining / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center leading-none opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-bold">{h}h</span>
        <span className="text-[9px] font-bold">{m.toString().padStart(2, '0')}m</span>
      </div>
    )
  }

  const fmt = h > 0
    ? `${h}h ${m.toString().padStart(2, '0')}min ${s.toString().padStart(2, '0')}s`
    : m > 0
    ? `${m}min ${s.toString().padStart(2, '0')}s`
    : `${s}s`

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500">
      {fmt}
    </span>
  )
}
