import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function GET(req: NextRequest){
  const url=new URL(req.url)
  const orderId=url.searchParams.get('orderid')||url.searchParams.get('Order')||''
  const response=url.searchParams.get('Response')||url.searchParams.get('response')||url.searchParams.get('result')
  const tranId=url.searchParams.get('TranID')||url.searchParams.get('tranid')||url.searchParams.get('uid')||undefined
  const success = response==='000'||response==='0'||response?.toLowerCase()==='approved'
  if(orderId){ await prisma.order.update({ where:{ id:orderId }, data:{ status: success?'PAID':'FAILED', tranzilaRef:tranId } }).catch(()=>{}) }
  const redirectTo = success ? (process.env.TRANZILA_SUCCESS_URL||'/checkout/success') : (process.env.TRANZILA_FAILURE_URL||'/checkout/failure')
  return NextResponse.redirect(redirectTo)
}
export async function POST(req: NextRequest){
  const form=await req.formData()
  const orderId=String(form.get('orderid')||form.get('Order')||'')
  const response=String(form.get('Response')||form.get('response')||form.get('result')||'')
  const tranId=String(form.get('TranID')||form.get('tranid')||form.get('uid')||'')
  const success=['000','0','approved','APPROVED'].includes(response)
  if(orderId){ await prisma.order.update({ where:{ id:orderId }, data:{ status: success?'PAID':'FAILED', tranzilaRef:tranId||null } }).catch(()=>{}) }
  const redirectTo = success ? (process.env.TRANZILA_SUCCESS_URL||'/checkout/success') : (process.env.TRANZILA_FAILURE_URL||'/checkout/failure')
  return NextResponse.redirect(redirectTo)
}
