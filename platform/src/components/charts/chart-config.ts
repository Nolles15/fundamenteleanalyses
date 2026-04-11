// Gedeelde Recharts configuratie — institutional-grade chart styling

// ── Kleuren ──────────────────────────────────────────────
export const COLORS = {
  navy: '#051125',
  blue: '#4A7AB5',
  green: '#166534',
  gray: '#94a3b8',
} as const

// ── As-stijl ─────────────────────────────────────────────
export const AXIS_TICK = {
  fontSize: 11,
  fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
  fill: '#94a3b8',
} as const

export const AXIS_COMMON = {
  tickLine: false,
  axisLine: false,
  tick: AXIS_TICK,
} as const

// ── Grid ─────────────────────────────────────────────────
export const GRID_PROPS = {
  horizontal: true,
  vertical: false,
  stroke: '#e2e8f0',
  strokeDasharray: '3 3',
  strokeOpacity: 0.6,
} as const

// ── Bars ─────────────────────────────────────────────────
export const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

// ── Marges ───────────────────────────────────────────────
export const CHART_MARGIN = { top: 8, right: 8, bottom: 4, left: 8 } as const
export const CHART_MARGIN_DUAL = { top: 8, right: 12, bottom: 4, left: 8 } as const

// ── Animatie ─────────────────────────────────────────────
export const ANIM = {
  duration: 800,
  easing: 'ease-out' as const,
}

// ── Area gradient stops ──────────────────────────────────
export const AREA_GRADIENT = {
  id: 'fcf-gradient',
  stops: [
    { offset: '0%', color: COLORS.navy, opacity: 0.25 },
    { offset: '100%', color: COLORS.navy, opacity: 0.02 },
  ],
} as const

// ── Formatters (Nederlands) ──────────────────────────────
export function fmtNL(val: number | null | undefined, decimals = 0): string {
  if (val == null) return '—'
  return val.toLocaleString('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtPct(val: number | null | undefined, decimals = 1): string {
  if (val == null) return '—'
  return `${val.toLocaleString('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`
}
