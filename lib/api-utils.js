import { NextResponse } from 'next/server'

/**
 * Standard API response helper
 */
export function apiResponse(data, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Error response helper
 */
export function apiError(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Server error response (hides details in production)
 */
export function serverError(error, customMessage = 'A apărut o eroare') {
  console.error('API Error:', error)
  
  const message = process.env.NODE_ENV === 'development' 
    ? error.message 
    : customMessage
    
  return apiError(message, 500)
}

/**
 * Validate required fields
 */
export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field])
  
  if (missing.length > 0) {
    return `Câmpuri obligatorii lipsă: ${missing.join(', ')}`
  }
  
  return null
}

/**
 * Sanitize string input
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return str.trim()
}

/**
 * Parse pagination params
 */
export function getPagination(searchParams, defaultLimit = 20) {
  const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || defaultLimit))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

/**
 * Build pagination response
 */
export function paginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  }
}
