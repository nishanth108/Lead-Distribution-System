import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create 3 services
  const s1 = await prisma.service.create({ data: { name: 'Service 1' } })
  const s2 = await prisma.service.create({ data: { name: 'Service 2' } })
  const s3 = await prisma.service.create({ data: { name: 'Service 3' } })

  // Create 8 providers
  for (let i = 1; i <= 8; i++) {
    await prisma.provider.create({ data: { name: `Provider ${i}` } })
  }

  // Initialize round-robin state for each service's fair pool
  await prisma.allocationState.createMany({
    data: [
      { serviceId: s1.id, nextIndex: 0 },
      { serviceId: s2.id, nextIndex: 0 },
      { serviceId: s3.id, nextIndex: 0 },
    ]
  })
}

main().then(() => prisma.$disconnect())