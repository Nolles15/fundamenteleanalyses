'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {
  type: 'premium_maand' | 'premium_jaar' | 'analyse'
  ticker?: string
  highlighted?: boolean
  children: React.ReactNode
}

export function CheckoutButton({ type, ticker, highlighted, children }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!session) {
      router.push('/inloggen?redirect=/prijzen')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ticker }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`block w-full text-center text-sm font-semibold py-3 rounded-lg font-sans transition-colors disabled:opacity-50 ${
        highlighted
          ? 'bg-white text-accent hover:bg-white/90'
          : 'border border-white/30 text-white/80 hover:text-white hover:border-white/50'
      }`}
    >
      {loading ? 'Laden...' : children}
    </button>
  )
}
