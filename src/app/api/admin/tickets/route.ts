import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest){
  const s=await requireAuth(); if(!s) return NextResponse.json({ error:'Unauthorized'},{status:401})
  const { eventId, name, priceMinor, quantity } = await req.json()
  const ev=await prisma.event.findFirst({ where:{ id:eventId, managerId:s.userId } })
  if(!ev) return NextResponse.json({ error:'Not found' }, { status:404 })
  const t=await prisma.ticketType.create({ data:{ eventId, name, priceMinor:Number(priceMinor), quantity:Number(quantity) } })
  return NextResponse.json({ id: t.id })
}
