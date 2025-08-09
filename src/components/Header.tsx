'use client'
import Link from 'next/link'
export default function Header(){
  return(<header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
    <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
      <Link href="/" className="font-semibold tracking-wide">🎟️ Zygience</Link>
      <nav className="flex items-center gap-4 text-sm"><Link href="/admin" className="hover:underline">Admin</Link></nav>
    </div></header>)
}
