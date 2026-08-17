import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function seedSuperAdmins() {
  try {
    // Read super admins from environment variable
    const superAdminsJson = process.env.SUPER_ADMINS
    
    if (!superAdminsJson) {
      console.log('⚠️  No SUPER_ADMINS defined in .env file')
      return
    }
    
    const superAdmins = JSON.parse(superAdminsJson)
    
    if (!Array.isArray(superAdmins) || superAdmins.length === 0) {
      console.log('⚠️  SUPER_ADMINS is not a valid array')
      return
    }
    
    console.log(`🔄 Processing ${superAdmins.length} super admin(s)...\n`)
    
    for (const admin of superAdmins) {
      const { email, password, name } = admin
      
      if (!email || !password) {
        console.log(`❌ Skipping invalid admin entry (missing email or password)`)
        continue
      }
      
      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (user) {
        // Update existing user to SUPERADMIN
        user = await prisma.user.update({
          where: { email },
          data: { role: 'SUPERADMIN' }
        })
        console.log(`✅ Updated to SUPERADMIN: ${user.email}`)
      } else {
        // Create new super admin
        const hashedPassword = await argon2.hash(password)
        user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'SUPERADMIN',
            active: true,
            name: name || 'Super Admin'
          }
        })
        console.log(`✅ Created SUPERADMIN: ${user.email}`)
      }
    }
    
    console.log('\n✨ Super admins seeding completed!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seedSuperAdmins()
