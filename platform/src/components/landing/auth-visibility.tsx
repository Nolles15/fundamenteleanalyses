'use client'

import { useSession } from 'next-auth/react'

/** Rendert children alleen als de gebruiker NIET is ingelogd */
export function ShowWhenLoggedOut({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  if (status === 'authenticated') return null
  return <>{children}</>
}

/** Rendert children alleen als de gebruiker IS ingelogd */
export function ShowWhenLoggedIn({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  if (status !== 'authenticated') return null
  return <>{children}</>
}
