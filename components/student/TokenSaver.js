'use client'
import { useEffect } from 'react'

// Salvează token-ul în localStorage când elevul vizitează /learn/[token]
// Astfel, când deschide PWA din Home Screen (care pornește de la /learn),
// va fi redirecționat automat la URL-ul său personal
export default function TokenSaver({ token }) {
  useEffect(() => {
    if (token) {
      localStorage.setItem('learnToken', token)
    }
  }, [token])
  return null
}
