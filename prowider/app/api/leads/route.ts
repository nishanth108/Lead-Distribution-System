import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { assignLead } from '@/lib/leadService'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { name, phone, city, serviceId, description } = await req.json()

  try {
    const lead = await prisma.lead.create({
      data: { name, phone, city, serviceId: Number(serviceId), description }
    })
    // Trigger assignment after creating lead
    await assignLead(lead.id, lead.serviceId)
    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (e: unknown) {
    // Prisma throws P2002 on unique constraint violation = duplicate phone+service
    if (e instanceof Error && 'code' in e && e.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate lead for this service' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}