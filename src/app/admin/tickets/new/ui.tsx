'use client'
import { useState } from 'react'
import UiButton from '@/components/UiButton'
export default function NewTicketForm({ eventId }:{ eventId:string }){
  const [name,setName]=useState('General Admission')
  const [priceMinor,setPriceMinor]=useState(12000)
  const [quantity,setQuantity]=useState(100)
  async function onSubmit(e:React.FormEvent){e.preventDefault()
    const res=await fetch('/api/admin/tickets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({eventId,name,priceMinor,quantity})})
    if(res.ok) history.back(); else alert('Failed') }
  return(
    <form onSubmit={onSubmit} className="card max-w-md space-y-3">
      <h1 className="text-xl font-semibold">New ticket</h1>
      <input className="w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input type="number" className="w-full" placeholder="Price (agorot)" value={priceMinor} onChange={e=>setPriceMinor(parseInt(e.target.value||'0'))}/>
      <input type="number" className="w-full" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(parseInt(e.target.value||'0'))}/>
      <UiButton type="submit">Create</UiButton>
    </form>
  )
}
