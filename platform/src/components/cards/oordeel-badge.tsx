type Oordeel = 'KOOP' | 'HOLD' | 'PASS'

interface OordeelBadgeProps {
  oordeel: Oordeel
  size?: 'sm' | 'md'
}

const styles: Record<Oordeel, string> = {
  KOOP: 'bg-buy-bg text-buy border border-buy-border',
  HOLD: 'bg-hold-bg text-hold border border-hold-border',
  PASS: 'bg-pass-bg text-pass border border-pass-border',
}

export function OordeelBadge({ oordeel, size = 'md' }: OordeelBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center rounded-full font-semibold font-sans tracking-wide ${sizeClass} ${styles[oordeel]}`}>
      {oordeel}
    </span>
  )
}
