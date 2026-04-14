'use client'

import { Component, type ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

/**
 * Vangt crashes in session-gerelateerde componenten op.
 * Als een corrupt token de pagina laat crashen, toont het
 * de pagina gewoon als uitgelogde gebruiker.
 */
class SessionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Verwijder auth cookies zodat de volgende pageload schoon is
    document.cookie = 'authjs.session-token=; max-age=0; path=/'
    document.cookie = '__Secure-authjs.session-token=; max-age=0; path=/'
  }

  render() {
    if (this.state.hasError) {
      // Render children zonder session context — pagina laadt als uitgelogd
      return this.props.children
    }
    return this.props.children
  }
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionErrorBoundary>
      <SessionProvider>{children}</SessionProvider>
    </SessionErrorBoundary>
  )
}
