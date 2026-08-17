'use client'
import { useEffect } from 'react'

/**
 * Blochează copy / cut / paste / right-click / drag pe paginile /learn.
 * Excepție: input-uri, textarea, contenteditable, editor Monaco —
 *   acolo se permite tastarea normală, dar NU paste din clipboard.
 */
export default function NoCopyPaste() {
  useEffect(() => {
    const isAllowedTyping = (target) => {
      if (!target) return false
      // permitem TASTAREA în input-uri & textarea, dar nu paste
      const tag = (target.tagName || '').toLowerCase()
      return tag === 'input' || tag === 'textarea' || target.isContentEditable
    }

    const blockAlways = (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const blockClipboard = (e) => {
      // copy/cut/paste blocate ORICE — chiar și în textarea
      e.preventDefault()
      e.stopPropagation()
      try { e.clipboardData?.setData('text/plain', '') } catch {}
      return false
    }

    const blockContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Capture-phase ca să prindem înainte de Monaco etc.
    document.addEventListener('cut', blockClipboard, true)
    document.addEventListener('paste', blockClipboard, true)
    document.addEventListener('contextmenu', blockContextMenu, true)
    document.addEventListener('dragstart', blockAlways, true)

    // Blocăm Ctrl+V / Ctrl+X / Ctrl+A / Ctrl+S / Ctrl+P — Ctrl+C permis
    const blockKeys = (e) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return
      const k = (e.key || '').toLowerCase()
      if (k === 'v' || k === 'x' || k === 'a' || k === 's' || k === 'p') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    document.addEventListener('keydown', blockKeys, true)

    return () => {
      document.removeEventListener('cut', blockClipboard, true)
      document.removeEventListener('paste', blockClipboard, true)
      document.removeEventListener('contextmenu', blockContextMenu, true)
      document.removeEventListener('dragstart', blockAlways, true)
      document.removeEventListener('keydown', blockKeys, true)
    }
  }, [])

  return (
    <style jsx global>{`
      /* Dezactivăm selecția pe tot ce e în /learn */
      body { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-touch-callout: none; }
      /* Permitem tastarea în input-uri / textarea (chiar dacă selecția vizuală e oprită) */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `}</style>
  )
}
