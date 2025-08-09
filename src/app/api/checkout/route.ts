import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buildTranzilaFormFields, tranzilaEndpoint } from '@/lib/tranzila'
export async function POST(req: NextRequest){
  const form=await req.formData()
  const ticketTypeId=String(form.get('ticketTypeId')||'')
  const qty=Number(form.get('qty')||'1')
  const email=String(form.get('email')||'')
  const buyerName=String(form.get('buyerName')||'')
  const ticket=await prisma.ticketType.findUnique({ where:{ id: ticketTypeId } })
  if(!ticket) return NextResponse.json({ error:'Ticket not found' }, { status:404 })
  const event=await prisma.event.findUnique({ where:{ id: ticket.eventId } })
  if(!event) return NextResponse.json({ error:'Event not found' }, { status:404 })
  const totalMinor=ticket.priceMinor*qty + event.fixedFee + Math.floor((event.commissionBps*ticket.priceMinor*qty)/10000)
  const order=await prisma.order.create({ data:{
    eventId:event.id,email,buyerName,totalMinor,currency:event.currency,
    items:{ create:[{ ticketTypeId:ticket.id, quantity:qty, lineMinor:ticket.priceMinor*qty }] }
  }})
  const amount=(totalMinor/100).toFixed(2)
  const fields=buildTranzilaFormFields({ Tranmode:'A', currency:1, sum:amount, orderid:order.id, email, contact:buyerName, Z_field:`event:${event.slug}` })
  const endpoint=tranzilaEndpoint()
  const body = `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting...</title>
  <style>body{font-family:ui-sans-serif,system-ui;background:#0b1220;color:#e8f2ff;display:flex;align-items:center;justify-content:center;height:100vh}</style>
  </head><body><div class="card"><h1>Redirecting to secure payment...</h1><p>Do not refresh this page.</p></div>
  <form id="pay" method="POST" action="${endpoint}">
    ${Object.entries(fields).map(([k,v])=>`<input type="hidden" name="${k}" value="${String(v).replace(/"/g,'&quot;')}">`).join('\n')}
  </form><script>document.getElementById('pay').submit()</script></body></html>`
  return new NextResponse(body,{ headers:{ 'Content-Type':'text/html' } })
}
