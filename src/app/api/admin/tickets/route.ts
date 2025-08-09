import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'
import { TicketCreateSchema } from '@/lib/validation'

// Create a new ticket type for an event managed by the authenticated user.
// The request body is validated and ownership of the event is enforced.
export async function POST(req: NextRequest) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = TicketCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { eventId, name, priceMinor, quantity } = parsed.data
  // Ensure the event exists and is owned by the current user
  const ev = await prisma.event.findFirst({ where: { id: eventId, managerId: session.userId } })
  if (!ev) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const t = await prisma.ticketType.create({ data: { eventId, name, priceMinor, quantity } })
  return NextResponse.json({ id: t.id })
}
