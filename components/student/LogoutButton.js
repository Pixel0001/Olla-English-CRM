'use client'

import { useRouter } from 'next/navigation'

// Buton client care șterge tokenul salvat în localStorage înainte de a naviga la /learn,
// ca să nu mai fie redirectat automat înapoi pe /learn/[token].
export default function LogoutButton({ className, children }) {
  const router = useRouter()
  const handleLogout = (e) => {
    e.preventDefault()
    try {
      localStorage.removeItem('learnToken')
    } catch {}
    // navigate cu flag explicit ca redirect-ul PWA să nu se reaplice
    router.push('/learn?logout=1')
  }
  return (
    <button onClick={handleLogout} className={className} type="button">
      {children}
    </button>
  )
}
