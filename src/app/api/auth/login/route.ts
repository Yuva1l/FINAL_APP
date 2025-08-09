import { prisma } from '@/lib/db'
import { verifyPassword, signSession } from '@/lib/crypto'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { LoginSchema } from '@/lib/validation'

// Handle user login. The payload is validated using Zod to ensure a valid
// email and sufficiently long password are supplied. Incorrect credentials
// result in a 401 while invalid payloads return 400.
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const ok = await verifyPassword(password, user.password)
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const token = signSession({ userId: user.id, email: user.email })
  // Store session token as an HTTP only cookie. Use secure cookies in production.
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
  return NextResponse.json({ ok: true })
}
