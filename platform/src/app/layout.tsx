import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: {
    default: 'Fundamentele aandelenanalyses — RA-geverifieerd | Aandelenanalyse.nl',
    template: '%s | Aandelenanalyse',
  },
  description:
    'Diepgaande fundamentele analyses van Europese aandelen. DCF-waardering, scorekaarten en investeringsoordelen. RA-geverifieerd proces. Gratis toegankelijk.',
  metadataBase: new URL('https://aandelenanalyse.nl'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
