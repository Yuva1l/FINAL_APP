'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ComponentProps, ReactNode } from 'react'

// Reusable button that wobbles slightly on hover
export default function UiButton(
  { href, children, className='', ...rest }:
  { href?: string; children: ReactNode; className?: string } & ComponentProps<'button'>
){
  const wobble={ rotate:[-3,3,-3], transition:{ duration:0.4, repeat:Infinity, repeatType:'reverse' } }
  if(href){
    const MotionLink=motion(Link as any)
    return(<MotionLink href={href} className={`btn ${className}`} whileHover={wobble} {...rest}>{children}</MotionLink>)
  }
  return(<motion.button className={`btn ${className}`} whileHover={wobble} {...rest}>{children}</motion.button>)
}
