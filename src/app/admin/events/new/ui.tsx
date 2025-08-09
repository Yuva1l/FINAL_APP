'use client'
import { useState } from 'react'
export default function NewForm(){
  const [title,setTitle]=useState('My Party')
  const [slug,setSlug]=useState('my-party')
  const [description,setDescription]=useState('The best party in town.')
  const [venue,setVenue]=useState('Tel Aviv')
  const [startsAt,setStartsAt]=useState('2025-09-01T20:00')
  const [endsAt,setEndsAt]=useState('2025-09-02T00:00')
  const [err,setErr]=useState<string|null>(null)
  async function onSubmit(e:React.FormEvent){e.preventDefault();setErr(null)
    const res=await fetch('/api/admin/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,slug,description,location:venue,startsAt,endsAt})})
    if(res.ok){const {id}=await res.json(); window.location.href=`/admin/events/${id}`}
    else if(res.status===409){const j=await res.json().catch(()=>({})); setErr(j.error||'Slug already in use.')}
    else setErr('Failed to create') }
  return(<form onSubmit={onSubmit} className="card max-w-xl space-y-3">
    <h1 className="text-xl font-semibold">New event</h1>
    {err && <div className="text-red-400 text-sm">{err}</div>}
    <input className="w-full p-3 rounded-xl bg-black/30 border border-white/10" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
    <input className="w-full p-3 rounded-xl bg-black/30 border border-white/10" placeholder="Slug (unique)" value={slug} onChange={e=>setSlug(e.target.value)}/>
    <textarea className="w-full p-3 rounded-xl bg-black/30 border border-white/10" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}/>
    <input className="w-full p-3 rounded-xl bg-black/30 border border-white/10" placeholder="Location" value={venue} onChange={e=>setVenue(e.target.value)}/>
    <div className="grid grid-cols-2 gap-3"><div><label className="text-sm text-white/70">Starts</label>
      <input type="datetime-local" className="w-full p-3 rounded-xl bg-black/30 border border-white/10" value={startsAt} onChange={e=>setStartsAt(e.target.value)}/></div>
      <div><label className="text-sm text-white/70">Ends</label>
      <input type="datetime-local" className="w-full p-3 rounded-xl bg-black/30 border border-white/10" value={endsAt} onChange={e=>setEndsAt(e.target.value)}/></div></div>
    <button className="btn">Create</button></form>)
}
