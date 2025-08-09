import Link from 'next/link'
import { prisma } from '@/lib/db'
import EventCard from '@/components/EventCard'
export default async function Home(){
  const events=await prisma.event.findMany({orderBy:{startsAt:'asc'},take:8})
  return(<div className="space-y-8">
    <section className="text-center mt-6">
      <h1 className="text-4xl font-bold tracking-tight">Host beautiful events.<br/>Get paid easily.</h1>
      <p className="text-white/70 mt-3">A lightweight, Zygo-inspired events platform with Tranzila payments.</p>
      <div className="mt-6 flex gap-3 justify-center"><Link href="/admin" className="btn">Create an event</Link></div>
    </section>
    <section><h2 className="text-xl font-semibold mb-4">Upcoming</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {events.length===0 && <div className="text-white/70">No events yet. Create the first one!</div>}
        {events.map(e=><EventCard key={e.id} e={e}/>)}
      </div>
    </section></div>)
}
