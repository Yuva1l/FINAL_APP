import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma=new PrismaClient()
const email='admin@local.test'
const password=process.argv[2]||'ChangeMeNow!42_'
const hash=await bcrypt.hash(password,10)
const user=await prisma.user.upsert({ where:{email}, update:{password:hash,name:'Admin'}, create:{email,password:hash,name:'Admin'} })
console.log('Admin reset:',{email,password}); process.exit(0)
