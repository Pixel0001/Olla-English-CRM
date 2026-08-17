'use client'

import { LockClosedIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function LockedLessonCard({ children, reason }) {
  const handleClick = () => {
    if (reason === 'payment') {
      toast('Vorbește cu profesorul pentru a achita abonamentul 🔒', {
        duration: 4000,
        style: {
          background: '#1e1b4b',
          color: '#fff',
          fontWeight: 600,
          borderRadius: '14px',
          padding: '14px 18px',
        },
        icon: '💳',
      })
    } else {
      toast('Termină lecțiile anterioare pentru a debloca aceasta 🔒', {
        duration: 3500,
        style: {
          background: '#1e293b',
          color: '#fff',
          fontWeight: 600,
          borderRadius: '14px',
          padding: '14px 18px',
        },
        icon: '🔐',
      })
    }
  }

  return (
    <button onClick={handleClick} type="button"
      className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 opacity-60 hover:opacity-80 transition cursor-pointer text-left select-none">
      {children}
    </button>
  )
}
