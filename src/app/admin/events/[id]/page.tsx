import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { redirect } from 'next/navigation'
import Link from 'next/link'
export default async function EditEvent({params}:{params:{id:string}}){
  const s=await requireAuth(); if(!s) redirect('/admin/login')
  const event=await prisma.event.findFirst({ where:{ id:params.id, managerId:s.userId }, include:{ tickets:true } })
  if(!event) redirect('/admin/events')
  return(<div className="space-y-6">
    <div className="card"><h1 className="text-xl font-semibold">{event.title}</h1>
      <div className="text-white/70 text-sm">Share link: {process.env.NEXT_PUBLIC_APP_URL}/events/{event.slug}</div></div>
    <div className="card space-y-3"><div className="flex items-center justify-between">
      <h2 className="font-semibold">Tickets</h2><Link href={`/admin/tickets/new?event=${event.id}`} className="btn">Add ticket type</Link></div>
      <div className="space-y-2">{event.tickets.map(t=>(<div key={t.id} className="flex items-center justify-between bg-black/20 rounded-xl p-3">
        <div><div className="font-medium">{t.name}</div><div className="text-sm text-white/70">₪{(t.priceMinor/100).toFixed(2)} • {t.sold}/{t.quantity} sold</div></div>
      </div>))}{event.tickets.length===0 && <div className="text-white/70">No tickets yet.</div>}</div></div></div>)
}
