import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buildTranzilaFormFields, tranzilaEndpoint } from '@/lib/tranzila'
import { CheckoutSchema } from '@/lib/validation'

// Handle checkout by creating an order and returning an HTML form that
// auto‑submits to the Tranzila payment gateway. The incoming form data
// is validated and quantities are clamped to available inventory.
export async function POST(req: NextRequest) {
  const form = await req.formData()
  // Convert formData into a plain object for validation
  const payload = {
    ticketTypeId: form.get('ticketTypeId') as string,
    qty: form.get('qty') as string,
    email: form.get('email') as string | null,
    buyerName: form.get('buyerName') as string | null
  }
  const parsed = CheckoutSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { ticketTypeId, qty, email, buyerName } = parsed.data
  // Look up ticket type
  const ticket = await prisma.ticketType.findUnique({ where: { id: ticketTypeId } })
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }
  // Ensure event exists
  const event = await prisma.event.findUnique({ where: { id: ticket.eventId } })
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  // Clamp quantity to available inventory
  const available = ticket.quantity - ticket.sold
  const quantity = Math.min(qty, available)
  if (quantity < 1) {
    return NextResponse.json({ error: 'Sold out' }, { status: 400 })
  }
  const totalMinor = ticket.priceMinor * quantity + event.fixedFee + Math.floor((event.commissionBps * ticket.priceMinor * quantity) / 10000)
  const order = await prisma.order.create({
    data: {
      eventId: event.id,
      email: email ?? '',
      buyerName: buyerName ?? '',
      totalMinor,
      currency: event.currency,
      items: {
        create: [
          {
            ticketTypeId: ticket.id,
            quantity,
            lineMinor: ticket.priceMinor * quantity
          }
        ]
      }
    }
  })
  const amount = (totalMinor / 100).toFixed(2)
  const fields = buildTranzilaFormFields({
    Tranmode: 'A',
    currency: 1,
    sum: amount,
    orderid: order.id,
    email: email ?? '',
    contact: buyerName ?? '',
    Z_field: `event:${event.slug}`
  })
  const endpoint = tranzilaEndpoint()
  const body = `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting...</title>
  <style>body{font-family:ui-sans-serif,system-ui;background:#0b1220;color:#e8f2ff;display:flex;align-items:center;justify-content:center;height:100vh}</style>
  </head><body><div class="card"><h1>Redirecting to secure payment...</h1><p>Do not refresh this page.</p></div>
  <form id="pay" method="POST" action="${endpoint}">
    ${Object.entries(fields).map(([k,v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g,'&quot;')}">`).join('\n')}
  </form><script>document.getElementById('pay').submit()</script></body></html>`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/html' } })
}
