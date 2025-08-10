import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { redirect } from 'next/navigation'
import UiButton from '@/components/UiButton'
export default async function AdminEvents(){
  const session=await requireAuth(); if(!session) redirect('/admin/login')
  const events=await prisma.event.findMany({ where:{ managerId: session.userId }, orderBy:{ createdAt:'desc' } })
  return(
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your events</h1>
        <UiButton href="/admin/events/new">New event</UiButton>
      </div>
      <div className="grid gap-3">
        {events.length===0 && <div className="text-slate-600">No events yet.</div>}
        {events.map(e=>(
          <div key={e.id} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-slate-600">Share link: {process.env.NEXT_PUBLIC_APP_URL}/events/{e.slug}</div>
            </div>
            <div className="flex gap-2">
              <UiButton href={`/events/${e.slug}`} className="from-vibe-blue to-vibe-blue text-black">View</UiButton>
              <UiButton href={`/admin/events/${e.id}`}>Edit</UiButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
