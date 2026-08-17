import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const groups = await prisma.group.findMany({
    where: { active: true },
    select: {
      name: true,
      scheduleDays: true,
      scheduleTime: true,
      locationType: true,
      locationDetails: true,
      branchId: true
    }
  })

  console.log(JSON.stringify(groups, null, 2))

  await prisma.$disconnect()
}

main().catch(console.error)
