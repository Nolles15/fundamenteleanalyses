import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import type { Analyse } from '@/lib/types'
import { formatKoers, formatUpside, formatDatum } from '@/lib/utils'
import { OordeelBadge } from '@/components/cards/oordeel-badge'

interface AnalyseHeaderProps {
  analyse: Analyse
}

export function AnalyseHeader({ analyse }: AnalyseHeaderProps) {
  const { meta, executive_summary: es } = analyse
  const upsidePositief = es.upside_pct >= 0

  return (
    <div className="bg-bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Terug */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors font-sans mb-5"
        >
          <ArrowLeft size={14} />
          Alle analyses
        </Link>

        {/* Bedrijf header */}
        <div className="flex items-start gap-4">
          <CompanyLogo ticker={meta.ticker} domein={meta.domein} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-sans">
                {meta.naam}
              </h1>
              <OordeelBadge oordeel={es.oordeel} />
            </div>
            <p className="text-sm text-text-secondary font-sans">
              {meta.ticker} · {meta.exchange}
              {meta.sector && ` · ${meta.sector}`}
              {meta.industrie && ` · ${meta.industrie}`}
            </p>
          </div>
        </div>

        {/* Koers / fair value / upside */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5">Koers</p>
            <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
              {formatKoers(meta.koers, meta.valuta)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5">Fair value (basis)</p>
            <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
              {formatKoers(es.fair_value_basis, es.valuta)}
            </p>
          </div>
          {es.fair_value_kansgewogen && (
            <div>
              <p className="text-xs text-text-muted font-sans mb-0.5">Fair value (kansgewogen)</p>
              <p className="text-lg font-bold text-text-primary font-sans tabular-nums">
                {formatKoers(es.fair_value_kansgewogen, es.valuta)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5">Upside</p>
            <p className={`text-lg font-bold font-sans tabular-nums ${upsidePositief ? 'text-buy' : 'text-pass'}`}>
              {formatUpside(es.upside_pct)}
            </p>
          </div>
        </div>

        {/* Peildatum + marktkapitalisatie */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-muted font-sans">
          <span>Peildatum: {formatDatum(meta.peildatum)}</span>
          {meta.marktkapitalisatie && <span>Marktkapitalisatie: {meta.marktkapitalisatie}</span>}
          {meta.free_float_pct != null && <span>Free float: {meta.free_float_pct}%</span>}
          {meta.index_lidmaatschap && <span>{meta.index_lidmaatschap}</span>}
        </div>
      </div>
    </div>
  )
}

function CompanyLogo({ ticker, domein }: { ticker: string; domein?: string }) {
  if (domein) {
    return (
      <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-bg-muted shrink-0 flex items-center justify-center">
        <Image
          src={`https://logo.clearbit.com/${domein}`}
          alt={ticker}
          width={56}
          height={56}
          className="w-full h-full object-contain"
          unoptimized
        />
      </div>
    )
  }

  const letter = ticker.charAt(0).toUpperCase()
  const hue = ticker.charCodeAt(0) % 360
  return (
    <div
      className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-lg font-sans"
      style={{ backgroundColor: `hsl(${hue}, 45%, 40%)` }}
    >
      {letter}
    </div>
  )
}
