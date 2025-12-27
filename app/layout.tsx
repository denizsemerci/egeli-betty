import type { Metadata } from 'next'
import './globals.css'
import { Nunito, Playfair_Display } from 'next/font/google'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { GoogleAnalytics } from '@/lib/analytics'
import { generateWebsiteStructuredData } from '@/lib/seo'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr'),
  title: {
    default: 'Egeli Betty - Ege Mutfağı Tarifleri | Ev Yapımı Lezzetler',
    template: '%s | Egeli Betty',
  },
  description:
    'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi. Zeytinyağlılar, hamur işi, tatlılar ve daha fazlası.',
  keywords: [
    'Ege mutfağı',
    'tarif',
    'yemek tarifi',
    'ev yapımı',
    'zeytinyağlılar',
    'hamur işi',
    'tatlı',
    'Türk mutfağı',
    'geleneksel yemek',
  ],
  authors: [{ name: 'Betül' }],
  creator: 'Egeli Betty',
  publisher: 'Egeli Betty',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://egelibetty.com.tr',
    siteName: 'Egeli Betty',
    title: 'Egeli Betty - Ege Mutfağı Tarifleri',
    description:
      'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Egeli Betty - Ege Mutfağı Tarifleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Egeli Betty - Ege Mutfağı Tarifleri',
    description:
      'Ege mutfağının sıcacık tarifleri burada. Ev yapımı lezzetler, annenin elinden çıkmış gibi.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteStructuredData = generateWebsiteStructuredData()

  return (
    <html lang="tr" className={`${nunito.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

