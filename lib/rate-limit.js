// Simple in-memory rate limiter
// For production with multiple instances, consider using Redis

const rateLimit = new Map()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.windowStart > 60000) {
      rateLimit.delete(key)
    }
  }
}, 300000)

/**
 * Check if a request should be rate limited
 * @param {string} identifier - Unique identifier (IP address or other)
 * @param {number} limit - Maximum requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ success: boolean, remaining: number, resetIn: number }}
 */
export function checkRateLimit(identifier, limit = 2, windowMs = 60000) {
  const now = Date.now()
  const key = identifier

  if (!rateLimit.has(key)) {
    rateLimit.set(key, {
      count: 1,
      windowStart: now
    })
    return { success: true, remaining: limit - 1, resetIn: windowMs }
  }

  const data = rateLimit.get(key)

  // Check if window has expired
  if (now - data.windowStart > windowMs) {
    rateLimit.set(key, {
      count: 1,
      windowStart: now
    })
    return { success: true, remaining: limit - 1, resetIn: windowMs }
  }

  // Window still active
  if (data.count >= limit) {
    const resetIn = windowMs - (now - data.windowStart)
    return { success: false, remaining: 0, resetIn }
  }

  // Increment count
  data.count++
  rateLimit.set(key, data)
  
  return { 
    success: true, 
    remaining: limit - data.count, 
    resetIn: windowMs - (now - data.windowStart) 
  }
}

/**
 * Get client IP from request headers
 * @param {Request} request - Next.js request object
 * @returns {string} - Client IP address
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}
