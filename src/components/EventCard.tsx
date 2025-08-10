import Link from 'next/link'
export default function EventCard({ e }: { e: any }){
  return(
    <Link href={`/events/${e.slug}`} className="card block hover:shadow-glow transition">
      <div className="flex gap-4">
        <img src={e.coverUrl || '/placeholder.svg'} alt={e.title} className="w-28 h-28 object-cover rounded-3xl"/>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{e.title}</h3>
          <p className="text-slate-600 line-clamp-2">{e.description}</p>
          <div className="mt-2 text-sm text-slate-600">{new Date(e.startsAt).toLocaleString()} • {e.location}</div>
        </div>
      </div>
    </Link>
  )
}
