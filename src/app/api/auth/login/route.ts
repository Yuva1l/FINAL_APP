import { prisma } from '@/lib/db'
import { verifyPassword, signSession } from '@/lib/crypto'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest){
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if(!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await verifyPassword(password, user.password)
  if(!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  if(!process.env.JWT_SECRET) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const token = signSession({ userId: user.id, email: user.email })
  cookies().set('session', token, { httpOnly: true, secure: process.env.NODE_ENV==='production', sameSite: 'lax', path: '/' })
  return NextResponse.json({ ok: true })
}
