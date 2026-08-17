'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CopySetLinkButton({ token }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    const url = `${window.location.origin}/solve/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copiat!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Nu s-a putut copia')
    }
  }
  return (
    <button onClick={handle} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
      {copied ? '✅ Copiat' : '🔗 Link'}
    </button>
  )
}
