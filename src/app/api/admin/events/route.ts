import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
export async function POST(req: NextRequest){
  const s = await requireAuth(); if(!s) return NextResponse.json({ error:'Unauthorized'},{status:401})
  const { title, slug, description, location, startsAt, endsAt } = await req.json()
  try{
    const ev = await prisma.event.create({ data:{ managerId:s.userId, title, slug, description, location, startsAt:new Date(startsAt), endsAt:new Date(endsAt) } })
    return NextResponse.json({ id: ev.id })
  }catch(err:any){
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code==='P2002')
      return NextResponse.json({ error:'Slug already in use. Choose a different slug.' }, { status:409 })
    console.error(err); return NextResponse.json({ error:'Failed to create event' }, { status:500 })
  }
}
