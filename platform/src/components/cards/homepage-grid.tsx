'use client'

import { useState, useMemo } from 'react'
import type { AnalyseIndex } from '@/lib/types'
import { AnalyseCard } from './analyse-card'
import { useLivePrices } from '@/lib/use-live-prices'

type OordeelFilter = 'Alle' | 'KOOP' | 'HOLD' | 'PASS'
type Sortering = 'upside' | 'score' | 'naam' | 'datum'

interface HomepageGridProps {
  companies: AnalyseIndex[]
}

export function HomepageGrid({ companies }: HomepageGridProps) {
  const [oordeelFilter, setOordeelFilter] = useState<OordeelFilter>('Alle')
  const [sortering, setSortering] = useState<Sortering>('upside')

  const yahooSymbols = useMemo(
    () => companies.map((c) => c.yahoo_symbol).filter(Boolean) as string[],
    [companies]
  )
  const { prices } = useLivePrices(yahooSymbols)

  // Bereken live upside per company
  function getLiveUpside(c: AnalyseIndex): number {
    const livePrice = c.yahoo_symbol ? prices[c.yahoo_symbol]?.price : undefined
    if (livePrice) return ((c.fair_value_basis / livePrice) - 1) * 100
    return c.upside_pct
  }

  const gefilterd = useMemo(() => {
    let lijst = [...companies]

    if (oordeelFilter !== 'Alle') {
      lijst = lijst.filter((c) => c.oordeel === oordeelFilter)
    }

    lijst.sort((a, b) => {
      switch (sortering) {
        case 'upside':
          return getLiveUpside(b) - getLiveUpside(a)
        case 'score':
          return b.scorekaart_totaal / b.scorekaart_max - a.scorekaart_totaal / a.scorekaart_max
        case 'naam':
          return a.naam.localeCompare(b.naam, 'nl')
        case 'datum':
          return new Date(b.peildatum).getTime() - new Date(a.peildatum).getTime()
        default:
          return 0
      }
    })

    return lijst
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, oordeelFilter, sortering, prices])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Oordeel pills */}
        <div className="flex items-center gap-1 bg-bg-muted rounded-lg p-1">
          {(['Alle', 'KOOP', 'HOLD', 'PASS'] as OordeelFilter[]).map((o) => (
            <button
              key={o}
              onClick={() => setOordeelFilter(o)}
              className={`px-3 py-1 rounded-md text-xs font-semibold font-sans transition-colors ${
                oordeelFilter === o
                  ? 'bg-bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Sorteer dropdown */}
        <select
          value={sortering}
          onChange={(e) => setSortering(e.target.value as Sortering)}
          className="text-xs font-sans text-text-secondary bg-bg-muted border-0 rounded-lg px-3 py-2 appearance-none cursor-pointer hover:bg-bg-surface transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="upside">Sorteer: Upside %</option>
          <option value="score">Sorteer: Scorekaart</option>
          <option value="naam">Sorteer: Naam</option>
          <option value="datum">Sorteer: Peildatum</option>
        </select>

        <span className="text-xs text-text-muted font-sans ml-auto">
          {gefilterd.length} {gefilterd.length === 1 ? 'analyse' : 'analyses'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gefilterd.map((company) => (
          <AnalyseCard
            key={company.ticker}
            analyse={company}
            livePrice={company.yahoo_symbol ? prices[company.yahoo_symbol]?.price : undefined}
          />
        ))}
      </div>

      {gefilterd.length === 0 && (
        <p className="text-center text-text-muted font-sans py-12 text-sm">
          Geen analyses gevonden voor dit filter.
        </p>
      )}
    </div>
  )
}
