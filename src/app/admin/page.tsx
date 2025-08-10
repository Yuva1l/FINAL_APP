import UiButton from '@/components/UiButton'
export default function AdminLanding(){
  return(
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="text-slate-700">Log in to manage events.</p>
      <UiButton href="/admin/login">Login</UiButton>
    </div>
  )
}
