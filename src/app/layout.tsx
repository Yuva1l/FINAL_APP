import './globals.css'
import Header from '@/components/Header'
// Load friendly fonts and expose them as CSS variables
import { Fredoka, Nunito } from 'next/font/google'

export const metadata={title:'Zygience Events SaaS',description:'Create events, share, and sell tickets with Tranzila payments.'}

const heading=Fredoka({subsets:['latin'],weight:['400','600','700'],variable:'--font-heading'})
const body=Nunito({subsets:['latin'],weight:['400','600'],variable:'--font-body'})

export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body relative overflow-x-hidden">
        <Header/>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
