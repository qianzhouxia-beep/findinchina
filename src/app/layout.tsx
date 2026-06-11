import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FindInChina — Verified Chinese Suppliers & Sellers for Global Buyers',
  description: 'Skip the middleman. Discover hand-picked Chinese brands, dealers, and factories with real contact info and transparent pricing. From EVs to design brands.',
  keywords: ['Chinese suppliers', 'China sourcing', 'Chinese brands', 'Chinese EVs', 'cross-border sourcing', 'verified suppliers'],
  authors: [{ name: 'FindInChina' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/favicon-64.png',
  },
  openGraph: {
    title: 'FindInChina — Verified Chinese Suppliers & Sellers',
    description: 'Skip the middleman. Discover hand-picked Chinese brands with real contact info and transparent pricing.',
    type: 'website',
    locale: 'en_US',
    images: ['/findinchina-transparent.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindInChina — Verified Chinese Suppliers & Sellers',
    description: 'Skip the middleman. Discover hand-picked Chinese brands with real contact info.',
    images: ['/findinchina-transparent.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}