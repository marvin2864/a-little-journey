import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Path resolves relative to this file; next/font self-hosts and optimizes it.
const acthirey = localFont({
  src: '../font/Acthirey-Demo-Regular.ttf',
  variable: '--font-acthirey',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'A Little Journey — A Story Worth Remembering',
  description: 'A small journey, an unexpected meeting, and a memory that stayed.',
  openGraph: {
    title: 'A Little Journey',
    description: 'A small journey, an unexpected meeting, and a memory that stayed.',
    images: ['/assets/i/opengraph.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/assets/i/logo.png',
    apple: '/assets/i/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={acthirey.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
