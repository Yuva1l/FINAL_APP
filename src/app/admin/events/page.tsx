import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { redirect } from 'next/navigation'
export default async function AdminEvents(){
  const session=await requireAuth(); if(!session) redirect('/admin/login')
  const events=await prisma.event.findMany({ where:{ managerId: session.userId }, orderBy:{ createdAt:'desc' } })
  return(<div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Your events</h1>
      <Link href="/admin/events/new" className="btn">New event</Link></div>
    <div className="grid gap-3">
      {events.length===0 && <div className="text-white/70">No events yet.</div>}
      {events.map(e=>(<div key={e.id} className="card flex items-center justify-between">
        <div><div className="font-semibold">{e.title}</div>
        <div className="text-sm text-white/60">Share link: {process.env.NEXT_PUBLIC_APP_URL}/events/{e.slug}</div></div>
        <div className="flex gap-2"><Link href={`/events/${e.slug}`} className="btn bg-white/10 hover:bg-white/20">View</Link>
        <Link href={`/admin/events/${e.id}`} className="btn">Edit</Link></div></div>))}
    </div></div>)
}
