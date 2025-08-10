import { prisma } from '@/lib/db'
import UiButton from '@/components/UiButton'
export default async function EventPage({params}:{params:{slug:string}}){
  const event=await prisma.event.findUnique({ where:{ slug: params.slug }, include:{ tickets:true } })
  if(!event) return <div className="card">Event not found.</div>
  return(
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <img src={event.coverUrl || '/placeholder.svg'} alt={event.title} className="w-full h-72 object-cover rounded-3xl"/>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-slate-700">{event.description}</p>
      </div>
      <aside className="space-y-3">
        <div className="card"><h2 className="font-semibold mb-2">Tickets</h2>
          <div className="space-y-2">
            {event.tickets.filter(t=>t.isActive).map(t=>(
              <form key={t.id} action="/checkout" method="GET" className="flex items-center justify-between bg-vibe-blue/10 p-3 rounded-3xl">
                <div><div className="font-medium">{t.name}</div><div className="text-sm text-slate-600">₪{(t.priceMinor/100).toFixed(2)}</div></div>
                <div className="flex items-center gap-2">
                  <input type="hidden" name="ticketTypeId" value={t.id}/>
                  <input type="number" min="1" max={t.quantity - t.sold} defaultValue="1" name="qty" className="w-16 text-center"/>
                  <UiButton type="submit">Buy</UiButton>
                </div>
              </form>
            ))}
            {event.tickets.length===0 && <div className="text-slate-600">No tickets available.</div>}
          </div></div>
        <div className="card"><h2 className="font-semibold mb-2">Share</h2>
          <div className="flex gap-2">
            <UiButton href={`https://wa.me/?text=${encodeURIComponent('Check this event: '+(process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000')+'/events/'+event.slug)}`} target="_blank" className="from-vibe-green to-vibe-green text-black">WhatsApp</UiButton>
            <UiButton href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000')+'/events/'+event.slug)}`} target="_blank" className="from-vibe-blue to-vibe-blue text-black">Facebook</UiButton>
          </div></div>
      </aside>
    </div>
  )
}
