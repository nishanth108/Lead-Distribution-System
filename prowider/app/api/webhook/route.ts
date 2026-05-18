import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { eventId, providerId } = await req.json()

  // Try to insert the event ID — if it already exists, skip
  try {
    await prisma.webhookEvent.create({ data: { id: eventId } })
  } catch {
    // eventId already processed → idempotent: do nothing
    return NextResponse.json({ message: 'Already processed' })
  }

  // Reset quota only if this is a fresh event
  await prisma.provider.update({
    where: { id: Number(providerId) },
    data: { monthlyQuota: 10, leadsReceived: 0 }
  })

  return NextResponse.json({ success: true })
}