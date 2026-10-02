'use client'

import { useSiteForm } from './SiteShell'

/** Buton care deschide formularul, cu alegerile deja bifate (preset). */
export default function FormButton({ className, children, preset }) {
  const openForm = useSiteForm()
  return (
    <button type="button" onClick={() => openForm(preset || {})} className={className}>
      {children}
    </button>
  )
}
