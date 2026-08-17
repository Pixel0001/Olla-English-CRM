import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(roles) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export async function requireAdmin() {
  return requireRole(['SUPERADMIN', 'ADMIN'])
}

export async function requireTeacher() {
  return requireRole(['SUPERADMIN', 'ADMIN', 'TEACHER'])
}
