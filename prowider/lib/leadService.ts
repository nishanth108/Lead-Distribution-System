import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Mandatory rules: serviceId → [mandatory providerIds]
const MANDATORY: Record<number, number[]> = {
  1: [1],       // Service 1 → Provider 1 always
  2: [5],       // Service 2 → Provider 5 always
  3: [1, 4],    // Service 3 → Provider 1 AND Provider 4 always
}

// Fair pool: serviceId → [candidate providerIds for round-robin]
const FAIR_POOL: Record<number, number[]> = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8],
}

export async function assignLead(leadId: number, serviceId: number) {
  // Use a DB transaction so concurrent requests don't corrupt data
  return await prisma.$transaction(async (tx) => {
    const mandatory = MANDATORY[serviceId] ?? []
    const pool = FAIR_POOL[serviceId] ?? []
    const assigned: number[] = []

    // Step 1: Try to assign mandatory providers
    for (const pid of mandatory) {
      const provider = await tx.provider.findUnique({ where: { id: pid } })
      if (provider && provider.leadsReceived < provider.monthlyQuota) {
        assigned.push(pid)
      }
    }

    // Step 2: Fill remaining slots using round-robin
    const slotsNeeded = 3 - assigned.length

    // Lock the allocation state row so concurrent requests wait their turn
    const state = await tx.$queryRaw<{ nextIndex: number }[]>`
      SELECT "nextIndex" FROM "AllocationState"
      WHERE "serviceId" = ${serviceId}
      FOR UPDATE
    `
    let idx = state[0].nextIndex

    let picked = 0
    let attempts = 0
    while (picked < slotsNeeded && attempts < pool.length * 2) {
      const candidateId = pool[idx % pool.length]
      idx++
      attempts++

      if (assigned.includes(candidateId)) continue

      const provider = await tx.provider.findUnique({ where: { id: candidateId } })
      if (!provider || provider.leadsReceived >= provider.monthlyQuota) continue

      assigned.push(candidateId)
      picked++
    }

    // Step 3: Update round-robin index in DB (persists across restarts)
    await tx.$executeRaw`
      UPDATE "AllocationState" SET "nextIndex" = ${idx}
      WHERE "serviceId" = ${serviceId}
    `

    // Step 4: Create assignments and update quota counts
    for (const pid of assigned) {
      await tx.leadAssignment.create({
        data: { leadId, providerId: pid }
      })
      await tx.provider.update({
        where: { id: pid },
        data: { leadsReceived: { increment: 1 } }
      })
    }

    return assigned
  })
}