'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

// Spinner component for loading state
function LoadingSpinner({ className = "w-4 h-4" }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Navigation link with instant feedback
export function NavLink({ 
  href, 
  children, 
  className, 
  activeClassName,
  isActive,
  onClick,
  icon: Icon
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = (e) => {
    e.preventDefault()
    
    // Call any additional onClick handler
    if (onClick) onClick()
    
    // Start transition for navigation
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''} ${isPending ? 'opacity-70' : ''}`}
    >
      {isPending ? (
        <LoadingSpinner className="w-5 h-5" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
      {isPending && (
        <span className="ml-auto">
          <LoadingSpinner className="w-4 h-4" />
        </span>
      )}
    </Link>
  )
}

export { LoadingSpinner }
