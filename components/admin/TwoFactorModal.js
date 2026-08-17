'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { ShieldCheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function TwoFactorModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  title = 'Verificare 2FA',
  description = 'Introdu codul din aplicația de autentificare pentru a continua.'
}) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attemptsLeft, setAttemptsLeft] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setCode('')
      setError('')
      setAttemptsLeft(null)
      // Focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only digits, max 6
    setCode(value)
    setError('')

    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleSubmit(value)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    setCode(pastedData)
    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleSubmit(code)
    }
  }

  const handleSubmit = async (fullCode) => {
    if (fullCode.length !== 6) {
      setError('Codul trebuie să aibă 6 cifre')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/security/2fa/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: fullCode })
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        onVerify(data.token) // Pass verification token to callback
        // Nu mai apelăm onClose() aici - componenta părinte decide ce face
      } else {
        // Check if forced logout is required
        if (data.forceLogout) {
          setError(data.error || 'Sesiune închisă din motive de securitate')
          // Wait a moment for user to see the error, then logout
          setTimeout(() => {
            signOut({ callbackUrl: '/login?reason=2fa_failed' })
          }, 2000)
          return
        }
        
        setError(data.error || 'Cod invalid')
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft)
        }
        setCode('')
        inputRef.current?.focus()
      }
    } catch (err) {
      setError('Eroare la verificare')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-center text-gray-900 mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-center text-gray-600 mb-4 sm:mb-6 px-2">
            {description}
          </p>

          {/* Code input - single input for easy paste */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={loading}
              placeholder="000000"
              autoComplete="one-time-code"
              className={`w-full max-w-[200px] h-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold tracking-[0.3em] border-2 rounded-xl transition-colors
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-indigo-500'}
                ${loading ? 'bg-gray-100' : 'bg-white'}
                text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-300 placeholder:tracking-[0.3em]`}
            />
          </div>

          {/* Error */}
          {error && (
            <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg ${attemptsLeft !== null && attemptsLeft <= 2 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <p className="text-xs sm:text-sm text-center text-red-600">
                {error}
              </p>
              {attemptsLeft !== null && attemptsLeft <= 2 && attemptsLeft > 0 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-red-700">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium">
                    Sesiunea va fi închisă după {attemptsLeft} {attemptsLeft === 1 ? 'încercare' : 'încercări'}!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-indigo-600">
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs sm:text-sm">Se verifică...</span>
              </div>
            </div>
          )}

          {/* Cancel button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Anulează
          </button>
        </div>
      </div>
    </div>
  )
}
