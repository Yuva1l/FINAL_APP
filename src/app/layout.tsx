import './globals.css'
import Header from '@/components/Header'
export const metadata={title:'Zygience Events SaaS',description:'Create events, share, and sell tickets with Tranzila payments.'}
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="en"><body><Header/><main className="mx-auto max-w-5xl px-4 py-6">{children}</main></body></html>)
}
