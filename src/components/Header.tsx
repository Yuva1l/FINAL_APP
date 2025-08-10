'use client'
import Link from 'next/link'
export default function Header(){
  return(
    <header className="sticky top-0 z-50 backdrop-blur bg-vibe-purple/10 border-b border-vibe-purple/30">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl text-vibe-pink animate-float">🎟️ Zygience</Link>
        <nav className="flex items-center gap-4 text-sm text-vibe-purple">
          <Link href="/admin" className="hover:text-vibe-pink transition-colors">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
