import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import UiButton from '@/components/UiButton'
export default async function Checkout({searchParams}:{searchParams:{ticketTypeId?:string,qty?:string}}){
  const t=await prisma.ticketType.findUnique({ where:{ id: searchParams.ticketTypeId } })
  if(!t) return redirect('/')
  const event=await prisma.event.findUnique({ where:{ id: t.eventId } })
  if(!event) return redirect('/')
  const qty=Math.min(Math.max(parseInt(searchParams.qty||'1'),1),(t.quantity-t.sold))
  const totalMinor=t.priceMinor*qty + event.fixedFee + Math.floor((event.commissionBps*t.priceMinor*qty)/10000)
  return(
    <form className="max-w-lg mx-auto card space-y-3" method="POST" action="/api/checkout">
      <h1 className="text-xl font-semibold">Checkout</h1>
      <input type="hidden" name="ticketTypeId" value={t.id}/>
      <input type="hidden" name="qty" value={qty}/>
      <div className="grid grid-cols-2 gap-3">
        <input required name="buyerName" placeholder="Full name"/>
        <input required type="email" name="email" placeholder="Email"/>
      </div>
      <div className="text-sm text-slate-600">Total: ₪{(totalMinor/100).toFixed(2)}</div>
      <UiButton type="submit">Continue to payment</UiButton>
    </form>
  )
}
