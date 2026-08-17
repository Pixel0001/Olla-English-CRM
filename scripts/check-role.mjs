import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'racustefan34@gmail.com' }
  })
  
  if (user) {
    console.log('User found:')
    console.log('  Email:', user.email)
    console.log('  Name:', user.name)
    console.log('  Role:', user.role)
  } else {
    console.log('User not found!')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
