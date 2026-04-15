import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getIndex } from '@/lib/data'
import { VergelijkClient } from './vergelijk-client'

export const metadata: Metadata = {
  title: 'Vergelijk Analyses',
  description:
    'Vergelijk twee fundamentele aandelenanalyses naast elkaar. Koers, fair value, scorekaart en risicoprofiel in één overzicht.',
}

export default function VergelijkPage() {
  const { companies } = getIndex()
  const tickers = companies.map((c) => ({ ticker: c.ticker, naam: c.naam }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-sans mb-2">
          Vergelijk
        </h1>
        <p className="text-text-secondary font-sans text-sm max-w-xl">
          Selecteer twee aandelen om ze naast elkaar te vergelijken op basis van onze fundamentele analyse.
        </p>
      </div>

      <Suspense fallback={<p className="text-text-muted font-sans text-sm py-12 text-center">Laden...</p>}>
        <VergelijkClient tickers={tickers} />
      </Suspense>
    </div>
  )
}
