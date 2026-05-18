import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const providers = await prisma.provider.findMany({
    include: {
      leadAssignments: {
        include: { lead: { include: { service: true } } }
      }
    }
  })
  return NextResponse.json(providers)
}