import Link from 'next/link'
import Image from 'next/image'
import type { AnalyseIndex } from '@/lib/types'
import { formatKoers, formatUpside } from '@/lib/utils'
import { OordeelBadge } from '@/components/cards/oordeel-badge'

interface Props {
  analyse: AnalyseIndex
  heroImage?: string
}

export function FeaturedAnalyse({ analyse, heroImage }: Props) {
  const {
    ticker,
    naam,
    koers,
    valuta,
    fair_value_basis,
    oordeel,
    sector,
    exchange,
  } = analyse

  const upside = ((fair_value_basis / koers) - 1) * 100

  return (
    <Link
      href={`/analyse/${ticker.toLowerCase()}`}
      className="block bg-bg-surface rounded-2xl overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      {/* Hero image */}
      {heroImage && (
        <div className="relative h-36 sm:h-48 w-full">
          <Image
            src={heroImage}
            alt={naam}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="absolute top-3 right-3 text-[10px] font-semibold font-sans tracking-widest uppercase bg-white/90 backdrop-blur-sm text-text-primary px-3 py-1 rounded">
            Rapport van de week
          </span>
        </div>
      )}

      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-bold text-text-primary font-sans truncate">{naam}</p>
            <p className="text-xs text-text-muted font-sans mt-1">
              {sector}{exchange ? ` | ${exchange}` : ''}
            </p>
          </div>
          <OordeelBadge oordeel={oordeel} size="md" />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-5 sm:mt-6">
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5 sm:mb-1">Koers</p>
            <p className="text-base sm:text-lg font-bold text-text-primary font-sans tabular-nums">
              {formatKoers(koers, valuta)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5 sm:mb-1">Fair value</p>
            <p className="text-base sm:text-lg font-bold text-text-primary font-sans tabular-nums">
              {formatKoers(fair_value_basis, valuta)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted font-sans mb-0.5 sm:mb-1">Upside</p>
            <p className={`text-base sm:text-lg font-bold font-sans tabular-nums ${upside >= 0 ? 'text-buy' : 'text-pass'}`}>
              {formatUpside(upside)}
            </p>
          </div>
        </div>

        <p className="text-xs text-accent font-sans font-medium mt-5 sm:mt-6">
          Lees volledig rapport &rarr;
        </p>
      </div>
    </Link>
  )
}
