import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Configure Prisma Client with production optimizations
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
}

// Prisma singleton pattern - prevents multiple instances in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

// Only cache the client in development to enable hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
