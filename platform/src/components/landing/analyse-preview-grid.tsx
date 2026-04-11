'use client'

import type { AnalyseIndex } from '@/lib/types'
import { AnalyseCard } from '@/components/cards/analyse-card'
import { useLivePrices } from '@/lib/use-live-prices'

interface Props {
  companies: AnalyseIndex[]
}

export function AnalysePreviewGrid({ companies }: Props) {
  const symbols = companies
    .map((c) => c.yahoo_symbol)
    .filter((s): s is string => !!s)

  const { prices } = useLivePrices(symbols)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {companies.map((c) => (
        <AnalyseCard
          key={c.ticker}
          analyse={c}
          livePrice={c.yahoo_symbol ? prices[c.yahoo_symbol]?.price : undefined}
        />
      ))}
    </div>
  )
}
