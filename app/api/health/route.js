import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Health check endpoint for monitoring and load balancers
 * GET /api/health
 */
export async function GET() {
  const startTime = Date.now()
  
  try {
    // Check database connection
    await prisma.$runCommandRaw({ ping: 1 })
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        database: 'connected',
        api: 'running'
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable',
      services: {
        database: 'disconnected',
        api: 'running'
      }
    }, { status: 503 })
  }
}
