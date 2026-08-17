'use client'

export default function TopBar() {
  return (
    <div className="w-full bg-blue-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-0">
        {/* Phone */}
        <a
          href="tel:+37368113314"
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>068 113 314</span>
        </a>

        {/* Email */}
        <a
          href="mailto:olla.it.academy@gmail.com"
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span>olla.it.academy@gmail.com</span>
        </a>
      </div>
    </div>
  )
}
