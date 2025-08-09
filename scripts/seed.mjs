import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma=new PrismaClient()
const pw=await bcrypt.hash('admin123',10)
const user=await prisma.user.upsert({ where:{email:'admin@local.test'}, update:{}, create:{email:'admin@local.test',password:pw,name:'Admin'} })
let event=await prisma.event.findFirst({ where:{ managerId:user.id } })
if(!event){ event=await prisma.event.create({ data:{
  managerId:user.id, title:'Zygience Launch Night', slug:'zygience-launch-night', description:'Celebrate the launch with DJs and drinks.',
  location:'Tel Aviv', startsAt:new Date(Date.now()+1000*60*60*24*14), endsAt:new Date(Date.now()+1000*60*60*24*14+1000*60*60*4),
  tickets:{ create:[{ name:'General Admission', priceMinor:12000, quantity:200 }] }
}})}
console.log('Seeded:',{user:user.email,event:event.slug}); process.exit(0)
