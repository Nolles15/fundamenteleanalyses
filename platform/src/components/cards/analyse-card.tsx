'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { AnalyseIndex } from '@/lib/types'
import { formatKoers, formatUpside, formatDatum } from '@/lib/utils'
import { OordeelBadge } from './oordeel-badge'
import { ScoreBar } from './score-bar'

interface AnalyseCardProps {
  analyse: AnalyseIndex
  livePrice?: number
}

export function AnalyseCard({ analyse, livePrice }: AnalyseCardProps) {
  const {
    ticker,
    naam,
    sector,
    exchange,
    valuta,
    fair_value_basis,
    oordeel,
    scorekaart_totaal,
    scorekaart_max,
    peildatum,
    domein,
  } = analyse

  // Live koers als beschikbaar, anders analyse-koers
  const koers = livePrice ?? analyse.koers
  const upside = ((fair_value_basis / koers) - 1) * 100
  const upsidePositief = upside >= 0
  const isLive = livePrice !== undefined

  return (
    <Link
      href={`/analyse/${ticker.toLowerCase()}`}
      className="block bg-bg-surface rounded-xl border border-border hover:border-accent/30 transition-all duration-200 p-5 group"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Header: logo + naam + badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <CompanyLogo ticker={ticker} domein={domein} />
          <div className="min-w-0">
            <p className="font-semibold text-text-primary font-sans text-sm leading-tight truncate">
              {ticker}
            </p>
            <p className="text-xs text-text-secondary font-sans truncate mt-0.5">{naam}</p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <OordeelBadge oordeel={oordeel} size="sm" />
        </div>
      </div>

      {/* Sector + beurs */}
      <p className="text-xs text-text-muted font-sans mb-4 truncate">{sector} · {exchange}</p>

      {/* Koers / fair value / upside */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <p className="text-xs text-text-muted font-sans mb-0.5">Koers</p>
          <p className="text-sm font-semibold text-text-primary font-sans tabular-nums">
            {formatKoers(koers, valuta)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted font-sans mb-0.5">Fair value</p>
          <p className="text-sm font-semibold text-text-primary font-sans tabular-nums">
            {formatKoers(fair_value_basis, valuta)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted font-sans mb-0.5">Upside</p>
          <p className={`text-sm font-semibold font-sans tabular-nums ${upsidePositief ? 'text-buy' : 'text-pass'}`}>
            {formatUpside(upside)}
          </p>
        </div>
      </div>

      {/* Scorekaart balk */}
      <ScoreBar score={scorekaart_totaal} max={scorekaart_max} oordeel={oordeel} />

      {/* Peildatum */}
      <p className="text-xs text-text-muted font-sans mt-3">
        {isLive ? 'Live koers' : `Peildatum: ${formatDatum(peildatum)}`}
      </p>
    </Link>
  )
}

function CompanyLogo({ ticker, domein }: { ticker: string; domein?: string }) {
  if (!domein) return <TickerInitiaal ticker={ticker} />

  return <LogoMetFallback ticker={ticker} domein={domein} />
}

function LogoMetFallback({ ticker, domein }: { ticker: string; domein: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <TickerInitiaal ticker={ticker} />

  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-bg-muted shrink-0 flex items-center justify-center">
      <Image
        src={`https://logo.clearbit.com/${domein}`}
        alt={ticker}
        width={40}
        height={40}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function TickerInitiaal({ ticker }: { ticker: string }) {
  const letter = ticker.charAt(0).toUpperCase()
  const hue = ticker.charCodeAt(0) % 360
  return (
    <div
      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-sm font-sans"
      style={{ backgroundColor: `hsl(${hue}, 45%, 40%)` }}
    >
      {letter}
    </div>
  )
}
