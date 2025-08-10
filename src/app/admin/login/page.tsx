'use client'
import { useState } from 'react'
import UiButton from '@/components/UiButton'
export default function LoginPage(){
  const [email,setEmail]=useState('admin@local.test')
  const [password,setPassword]=useState('admin123')
  const [err,setErr]=useState<string|null>(null)
  async function onSubmit(e:React.FormEvent){e.preventDefault();setErr(null)
    const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
    if(res.ok) window.location.href='/admin/events'; else { const j=await res.json().catch(()=>({})); setErr(j.error||'Login failed') } }
  return(
    <div className="max-w-sm mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <UiButton type="submit" className="w-full">Login</UiButton>
      </form>
    </div>
  )
}
