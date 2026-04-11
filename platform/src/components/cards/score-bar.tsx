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
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barKleur[oordeel]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-text-muted font-sans tabular-nums shrink-0">
        {score}/{max}
      </span>
    </div>
  )
}
