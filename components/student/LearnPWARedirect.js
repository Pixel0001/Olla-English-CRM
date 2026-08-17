'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Dacă PWA e deschisă de pe Home Screen (display-mode: standalone), pornește direct la /learn/[token]
// Pentru utilizatorii web normali nu redirectăm — ca butonul "Deconectează-te" să funcționeze.
export default function LearnPWARedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    // Dacă userul tocmai s-a delogat, NU mai redirectăm
    if (searchParams.get('logout') === '1') return

    // Doar în PWA standalone (instalată pe Home Screen) redirectăm automat
    let isStandalone = false
    try {
      isStandalone =
        window.matchMedia?.('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    } catch {}
    if (!isStandalone) return

    const token = localStorage.getItem('learnToken')
    if (token) {
      router.replace(`/learn/${token}`)
    }
  }, [router, searchParams])
  return null
}
