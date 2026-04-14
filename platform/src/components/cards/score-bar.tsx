interface ScoreBarProps {
  score: number
  max: number
  oordeel: 'KOOP' | 'HOLD' | 'PASS'
}

const barKleur: Record<'KOOP' | 'HOLD' | 'PASS', string> = {
  KOOP: 'bg-buy',
  HOLD: 'bg-hold',
  PASS: 'bg-pass',
}

export function ScoreBar({ score, max, oordeel }: ScoreBarProps) {
  const pct = Math.round((score / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted font-sans">Scorekaart</span>
        <span className="text-xs font-medium text-text-secondary font-sans tabular-nums">
          {score}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barKleur[oordeel]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
