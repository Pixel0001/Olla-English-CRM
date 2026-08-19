import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Routes that require authentication
const protectedRoutes = ['/admin', '/teacher']
// Routes that require specific roles
const adminRoutes = ['/admin']
const teacherRoutes = ['/teacher']

// Singurele rute fără autentificare
const publicRoutes = [
  '/login',
  '/',
]

// Auth routes that should redirect if already logged in
const authRoutes = ['/login', '/admin/login']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/uploads/') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Nu există site public: rădăcina duce direct în ecranul de autentificare.
  // Se face aici (nu doar în app/page.js) ca să fie un 307 real, fără randare intermediară.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get session token from cookies (NextAuth uses different cookie names)
  const cookieStore = await cookies()
  // In production, NextAuth uses __Secure- prefix
  const sessionToken = cookieStore.get('__Secure-next-auth.session-token')?.value 
    || cookieStore.get('next-auth.session-token')?.value // Development fallback
  
  // Check if this is an auth page
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // If logged in and trying to access auth pages, redirect to admin
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  // Note: Full session validation happens in API routes/guards
  // Middleware only checks for token presence for performance
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Prevent caching of protected routes
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
