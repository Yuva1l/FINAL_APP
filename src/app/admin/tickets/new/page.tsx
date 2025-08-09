import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/crypto'
import { redirect } from 'next/navigation'
import NewTicketForm from './ui'
export default async function NewTicket({searchParams}:{searchParams:{event?:string}}){
  const s=await requireAuth(); if(!s) redirect('/admin/login')
  const event=searchParams.event?await prisma.event.findFirst({ where:{ id:searchParams.event, managerId:s.userId } }):null
  if(!event) redirect('/admin/events')
  return <NewTicketForm eventId={event.id}/>
}
