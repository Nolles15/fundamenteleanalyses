'use client'

import { Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { AccessLevel } from '@/lib/access'
import { hasAccess } from '@/lib/access'

interface PaywallGateProps {
  children: React.ReactNode
  access: AccessLevel
  ticker: string
  label?: string
  description?: string
}

const DEV_UNLOCK = process.env.NEXT_PUBLIC_UNLOCK === '1'

export function PaywallGate({
  children,
  access,
  ticker,
  label,
  description,
}: PaywallGateProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (access === 'free' || DEV_UNLOCK) return <>{children}</>

  const user = session?.user
  if (hasAccess(user ?? null, ticker, access)) return <>{children}</>

  const isLoggedIn = !!user
  const loginUrl = `/inloggen?callbackUrl=${encodeURIComponent(pathname)}`

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Wazig inhoud-preview */}
      <div
        className="select-none pointer-events-none blur-sm opacity-50 max-h-72 overflow-hidden"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Gradient + CTA */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-6"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(250,250,249,0.5) 35%, rgba(250,250,249,0.92) 60%, rgba(250,250,249,1) 100%)',
        }}
      >
        <div className="bg-white border border-border rounded-xl px-6 py-5 shadow-md max-w-xs w-full mx-4 text-center">
          <div className="w-9 h-9 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={16} className="text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary font-sans mb-1">
            {label ?? 'Premium analyse'}
          </h3>
          <p className="text-xs text-text-secondary font-sans mb-4 leading-relaxed">
            {description ??
              'Financiële data, DCF-modellen, moat-analyse en meer — beschikbaar met een abonnement of losse aankoop.'}
          </p>
          {isLoggedIn ? (
            <Link
              href="/prijzen"
              className="block w-full bg-accent text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity font-sans text-center"
            >
              Bekijk prijzen
            </Link>
          ) : (
            <Link
              href={loginUrl}
              className="block w-full bg-accent text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity font-sans text-center"
            >
              Inloggen voor toegang
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
