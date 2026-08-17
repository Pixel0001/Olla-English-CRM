import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch active branches for teachers
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const branches = await prisma.branch.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true
      }
    })
    
    return NextResponse.json({ branches })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
