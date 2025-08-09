import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { EventCreateSchema } from '@/lib/validation'

// Create a new event owned by the authenticated manager. Incoming data is
// validated with Zod; duplicate slugs return 409 and validation failures
// return 400. A missing or invalid session yields 401.
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
  const parsed = EventCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { title, slug, description, location, startsAt, endsAt, coverUrl } = parsed.data
  try {
    const ev = await prisma.event.create({
      data: {
        managerId: session.userId,
        title,
        slug,
        description,
        location,
        startsAt,
        endsAt,
        // Only set coverUrl if provided; Prisma will ignore undefined values
        coverUrl
      }
    })
    return NextResponse.json({ id: ev.id })
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // Unique constraint violation on slug
      return NextResponse.json({ error: 'Slug already in use. Choose a different slug.' }, { status: 409 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
