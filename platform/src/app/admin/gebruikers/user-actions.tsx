'use client'

import { useState, useTransition } from 'react'
import { wijzigPlan, grantAnalyse } from './actions'
import type { Plan } from '@prisma/client'

const planOpties: { value: Plan; label: string }[] = [
  { value: 'GRATIS', label: 'Gratis' },
  { value: 'PREMIUM_MAAND', label: 'Premium (mnd)' },
  { value: 'PREMIUM_JAAR', label: 'Premium (jaar)' },
]

interface Props {
  userId: string
  currentPlan: Plan
}

export function UserActions({ userId, currentPlan }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showGrant, setShowGrant] = useState(false)
  const [ticker, setTicker] = useState('')

  function handlePlanChange(newPlan: Plan) {
    if (newPlan === currentPlan) return
    startTransition(() => wijzigPlan(userId, newPlan))
  }

  function handleGrant() {
    if (!ticker.trim()) return
    startTransition(() => {
      grantAnalyse(userId, ticker)
      setTicker('')
      setShowGrant(false)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentPlan}
        onChange={(e) => handlePlanChange(e.target.value as Plan)}
        disabled={isPending}
        className="text-xs bg-bg-muted border border-border rounded px-2 py-1 font-sans text-text-primary disabled:opacity-50"
      >
        {planOpties.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {showGrant ? (
        <form
          onSubmit={(e) => { e.preventDefault(); handleGrant() }}
          className="flex items-center gap-1"
        >
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="TICKER"
            className="text-xs bg-bg-muted border border-border rounded px-2 py-1 w-20 font-sans text-text-primary uppercase placeholder:text-text-muted placeholder:normal-case"
            autoFocus
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !ticker.trim()}
            className="text-xs text-accent hover:underline font-sans disabled:opacity-50"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => { setShowGrant(false); setTicker('') }}
            className="text-xs text-text-muted hover:text-text-secondary font-sans"
          >
            &times;
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowGrant(true)}
          className="text-xs text-text-muted hover:text-accent font-sans"
          title="Analyse toekennen"
        >
          + analyse
        </button>
      )}

      {isPending && (
        <span className="text-[10px] text-text-muted font-sans">opslaan...</span>
      )}
    </div>
  )
}
