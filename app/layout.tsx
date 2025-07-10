import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AccountAI - AI-Powered Accounting Software | Smart Financial Management',
  description: 'Transform your accounting with AccountAI - AI-powered software that automatically categorizes transactions, generates invoices, and provides financial insights. Free trial available.',
  keywords: 'AI accounting software, automated bookkeeping, financial management, invoice generator, expense tracking, business accounting, smart accounting, financial automation, accounting AI, bookkeeping software',
  authors: [{ name: 'AccountAI Team' }],
  openGraph: {
    type: 'website',
    url: 'https://accountai.com',
    title: 'AccountAI - AI-Powered Accounting Software',
    description: 'Revolutionize your accounting with AI. Automatic transaction categorization, invoice generation, and financial insights. Try AccountAI free today!',
    images: ['/assets/account-ai-og.png'],
    siteName: 'AccountAI',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@accountai',
    title: 'AccountAI - Smart Accounting Solution',
    description: 'AI-powered accounting software that saves time and reduces errors. Automatic categorization, invoicing, and financial reports.',
    images: ['/assets/account-ai-og.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://accountai.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AccountAI",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "description": "AI-powered accounting software that automatically categorizes transactions, generates invoices, and provides financial insights for businesses.",
              "url": "https://accountai.com",
              "author": {
                "@type": "Organization",
                "name": "AccountAI Team"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "category": "Free Trial"
              },
              "featureList": [
                "AI Transaction Categorization",
                "Automated Invoice Generation", 
                "Financial Reporting",
                "Expense Tracking",
                "Real-time Analytics"
              ],
              "screenshot": "/assets/account-ai-screenshot.png"
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module" />
      </body>
    </html>
  )
}