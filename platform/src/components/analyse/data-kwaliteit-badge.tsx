'use client'

import { useState } from 'react'
import type { DataKwaliteit } from '@/lib/types'

const STIJLEN: Record<DataKwaliteit['label'], { badge: string; icon: string }> = {
  'Volledige data': {
    badge: 'bg-buy-bg text-buy border-buy-border',
    icon: '✓',
  },
  'Gedeeltelijke data': {
    badge: 'bg-hold-bg text-hold border-hold-border',
    icon: '⚠',
  },
  'Beperkte data': {
    badge: 'bg-pass-bg text-pass border-pass-border',
    icon: '✗',
  },
}

interface Props {
  kwaliteit: DataKwaliteit
}

export function DataKwaliteitBadge({ kwaliteit }: Props) {
  const [open, setOpen] = useState(false)
  const stijl = STIJLEN[kwaliteit.label]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold font-sans transition-opacity hover:opacity-80 ${stijl.badge}`}
      >
        <span>{stijl.icon}</span>
        <span>{kwaliteit.label}</span>
        <span className="text-[10px] opacity-70">({kwaliteit.dekking_pct}%)</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-20 w-72 bg-bg-surface border border-border rounded-lg shadow-lg p-4 text-xs font-sans">
          <p className="font-semibold text-text-primary mb-2">
            Datadekking: {kwaliteit.dekking_pct}%
          </p>

          {kwaliteit.jaren_volledig.length > 0 && (
            <div className="mb-1.5">
              <span className="text-buy font-medium">Volledig: </span>
              <span className="text-text-secondary">{kwaliteit.jaren_volledig.join(', ')}</span>
            </div>
          )}
          {kwaliteit.jaren_gedeeltelijk.length > 0 && (
            <div className="mb-1.5">
              <span className="text-hold font-medium">Gedeeltelijk: </span>
              <span className="text-text-secondary">{kwaliteit.jaren_gedeeltelijk.join(', ')}</span>
            </div>
          )}
          {kwaliteit.jaren_ontbrekend.length > 0 && (
            <div className="mb-1.5">
              <span className="text-pass font-medium">Ontbrekend: </span>
              <span className="text-text-secondary">{kwaliteit.jaren_ontbrekend.join(', ')}</span>
            </div>
          )}

          {kwaliteit.toelichting && (
            <p className="text-text-muted mt-2 pt-2 border-t border-border leading-relaxed">
              {kwaliteit.toelichting}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
