'use client'

import { fmtNL, fmtPct } from './chart-config'

export interface TooltipField {
  key: string
  label: string
  color: string
  format?: 'number' | 'pct'
  decimals?: number
}

interface Props {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[]
  label?: string | number
  fields: TooltipField[]
  labelSuffix?: string
}

export function ChartTooltip({ active, payload, label, fields, labelSuffix }: Props) {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload as Record<string, unknown> | undefined
  if (!data) return null

  return (
    <div className="bg-white rounded-lg border border-border px-3 py-2.5" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p className="text-xs font-semibold text-text-primary mb-1.5 font-sans">
        {label}{labelSuffix ? ` ${labelSuffix}` : ''}
      </p>
      <div className="space-y-1">
        {fields.map((field) => {
          const raw = data[field.key]
          const val = typeof raw === 'number' ? raw : null

          return (
            <div key={field.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: field.color }}
                />
                <span className="text-xs text-text-muted font-sans">{field.label}</span>
              </div>
              <span className="text-xs font-semibold text-text-primary tabular-nums font-sans">
                {field.format === 'pct'
                  ? fmtPct(val, field.decimals ?? 1)
                  : fmtNL(val, field.decimals ?? 0)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Herbruikbare custom legend
export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mt-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-text-muted font-sans">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
