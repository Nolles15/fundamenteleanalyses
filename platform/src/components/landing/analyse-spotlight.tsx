import Link from 'next/link'
import Image from 'next/image'
import type { AnalyseIndex } from '@/lib/types'
import { formatKoers, formatUpside } from '@/lib/utils'
import { OordeelBadge } from '@/components/cards/oordeel-badge'

interface Props {
  analyse: AnalyseIndex
  kernthese: string
  heroImage?: string
}

export function AnalyseSpotlight({ analyse, kernthese, heroImage }: Props) {
  const { ticker, naam, sector, exchange, koers, valuta, fair_value_basis, oordeel } = analyse
  const upside = ((fair_value_basis / koers) - 1) * 100

  return (
    <Link
      href={`/analyse/${ticker.toLowerCase()}`}
      className="group block rounded-2xl overflow-hidden"
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="grid md:grid-cols-2">
        {/* Visuele kant: hero image of gradient */}
        <div className="relative h-52 md:h-auto md:min-h-[300px] bg-gradient-to-br from-[#051125] to-[#1b263b]">
          {heroImage && (
            <Image
              src={heroImage}
              alt={naam}
              fill
              className="object-cover mix-blend-luminosity opacity-40"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051125] via-[#051125]/60 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#051125]/20" />

          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50 font-sans mb-3">
              Uitgelichte analyse
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white font-serif leading-tight mb-1">
              {naam}
            </h3>
            <p className="text-sm text-white/50 font-sans">
              {ticker} &middot; {exchange}
            </p>
          </div>
        </div>

        {/* Content kant */}
        <div className="bg-bg-surface p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <OordeelBadge oordeel={oordeel} size="md" />
            <span className="text-xs text-text-muted font-sans">{sector}</span>
          </div>

          <p className="text-sm text-text-secondary font-serif italic leading-relaxed mb-6 line-clamp-3">
            &ldquo;{kernthese}&rdquo;
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-text-muted font-sans mb-0.5">Koers</p>
              <p className="text-base sm:text-lg font-bold text-text-primary font-sans tabular-nums">
                {formatKoers(koers, valuta)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted font-sans mb-0.5">Fair value</p>
              <p className="text-base sm:text-lg font-bold text-text-primary font-sans tabular-nums">
                {formatKoers(fair_value_basis, valuta)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted font-sans mb-0.5">Upside</p>
              <p className={`text-base sm:text-lg font-bold font-sans tabular-nums ${upside >= 0 ? 'text-buy' : 'text-pass'}`}>
                {formatUpside(upside)}
              </p>
            </div>
          </div>

          <span className="text-sm font-semibold text-accent group-hover:underline font-sans">
            Lees de volledige analyse &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
