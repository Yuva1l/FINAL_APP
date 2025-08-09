import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
const SALT_ROUNDS=10
export async function hashPassword(pw:string){return bcrypt.hash(pw,SALT_ROUNDS)}
export async function verifyPassword(pw:string,hash:string){return bcrypt.compare(pw,hash)}
export function signSession(payload:object){const s=process.env.JWT_SECRET!;return jwt.sign(payload,s,{expiresIn:'7d'})}
export function verifySession(token:string){const s=process.env.JWT_SECRET!;return jwt.verify(token,s) as any}
export async function requireAuth(){const store=await cookies();const t=store.get('session')?.value;if(!t)return null;try{return verifySession(t)}catch{return null}}
