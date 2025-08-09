import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const buckets = new Map<string, { hits: number; ts: number }>()
function allowed(ip: string, limit = 60, windowMs = 60_000) {
  const now = Date.now()
  const b = buckets.get(ip) ?? { hits: 0, ts: now }
  if (now - b.ts > windowMs) { b.hits = 0; b.ts = now }
  b.hits++
  buckets.set(ip, b)
  return b.hits <= limit
}
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown'
    if (!allowed(String(ip))) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  return NextResponse.next()
}
export const config = { matcher: ['/api/:path*'] }
