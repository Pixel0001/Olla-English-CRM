import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'racustefan34@gmail.com' }
  })
  
  console.log('User data:')
  console.log(JSON.stringify(user, null, 2))
  
  if (user && user.role !== 'SUPERADMIN') {
    console.log('\n⚠️  Rolul nu este SUPERADMIN! Actualizăm...')
    
    const updated = await prisma.user.update({
      where: { email: 'racustefan34@gmail.com' },
      data: { role: 'SUPERADMIN' }
    })
    
    console.log('✅ Rol actualizat:', updated.role)
  } else if (!user) {
    console.log('\n❌ Userul nu există în baza de date!')
  } else {
    console.log('\n✅ Rolul este deja SUPERADMIN')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
