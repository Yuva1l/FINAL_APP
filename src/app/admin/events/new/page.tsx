import { requireAuth } from '@/lib/crypto'
import { redirect } from 'next/navigation'
import NewForm from './ui'
export default async function NewEventPage(){ const s=await requireAuth(); if(!s) redirect('/admin/login'); return <NewForm/> }
