import type { Waardering } from '@/lib/types'
import { SectionHeading } from '@/components/ui/section-heading'
import { fmtNL, fmtPct } from '@/components/charts/chart-config'

interface Props {
  data: Waardering
}

const MULTIPLES: { label: string; key: keyof Waardering; format: 'multiple' | 'pct' }[] = [
  { label: 'P/E', key: 'pe', format: 'multiple' },
  { label: 'P/E (forward)', key: 'pe_forward', format: 'multiple' },
  { label: 'P/E gem. 10j', key: 'pe_historisch_gem_10j', format: 'multiple' },
  { label: 'EV/EBITDA', key: 'ev_ebitda', format: 'multiple' },
  { label: 'EV/EBITDA gem. 10j', key: 'ev_ebitda_historisch_gem_10j', format: 'multiple' },
  { label: 'P/FCF', key: 'p_fcf', format: 'multiple' },
  { label: 'P/FCF na SBC', key: 'p_fcf_na_sbc', format: 'multiple' },
  { label: 'FCF Yield', key: 'fcf_yield_pct', format: 'pct' },
  { label: 'P/B', key: 'p_b', format: 'multiple' },
  { label: 'EV/Omzet', key: 'ev_omzet', format: 'multiple' },
  { label: 'Div. rendement', key: 'dividendrendement_pct', format: 'pct' },
  { label: 'PEG', key: 'peg', format: 'multiple' },
]

export function WaarderingMultiples({ data }: Props) {
  // Filter op velden die daadwerkelijk een waarde hebben
  const visible = MULTIPLES.filter((m) => {
    const raw = data[m.key]
    return typeof raw === 'number' && raw !== 0
  })

  // Dividendrendement 0% is valide — toon het niet als er geen dividend is
  const visibleWithZeroPct = MULTIPLES.filter((m) => {
    const raw = data[m.key]
    if (m.key === 'dividendrendement_pct') return typeof raw === 'number' && raw > 0
    return typeof raw === 'number'
  })

  return (
    <div className="space-y-4">
      <SectionHeading title="Waardering" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visibleWithZeroPct.map((m) => {
          const raw = data[m.key]
          const val = typeof raw === 'number' ? raw : null

          return (
            <div
              key={m.key}
              className="bg-bg-surface rounded-xl border border-border p-4"
            >
              <p className="text-xs text-text-muted font-sans uppercase tracking-wide mb-1">
                {m.label}
              </p>
              <p className="text-xl font-bold text-text-primary font-sans tabular-nums">
                {m.format === 'pct'
                  ? fmtPct(val, 1)
                  : val != null
                    ? `${fmtNL(val, 1)}×`
                    : '—'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
