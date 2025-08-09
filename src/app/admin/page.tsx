import Link from 'next/link'
export default function AdminLanding(){
  return(<div className="space-y-4"><h1 className="text-2xl font-semibold">Admin</h1><p className="text-white/70">Log in to manage events.</p><Link className="btn" href="/admin/login">Login</Link></div>)
}
