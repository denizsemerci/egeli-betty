import type { Metadata } from 'next'
import './globals.css'
import { Nunito, Playfair_Display } from 'next/font/google'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Egeli Betty - Ege Mutfağı Tarifleri',
  description: 'Sıcacık, ev yapımı Ege mutfağı tarifleri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

