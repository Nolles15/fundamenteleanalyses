'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoggedIn = status === 'authenticated'
  const naam = session?.user?.name

  // Initiaal voor de avatar-cirkel
  const initiaal = naam?.charAt(0).toUpperCase() ?? 'U'

  return (
    <header className="bg-bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm font-sans">A</span>
            </div>
            <span className="font-semibold text-text-primary text-lg tracking-tight font-sans">
              Aandelenanalyse
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <NavLink href="/analyses" current={pathname}>Analyses</NavLink>
            <NavLink href="/methode" current={pathname}>Methode</NavLink>
            <NavLink href="/leren" current={pathname}>Leren</NavLink>
            <NavLink href="/over" current={pathname}>Over</NavLink>
            <NavLink href="/prijzen" current={pathname}>Prijzen</NavLink>

            {isLoggedIn ? (
              <Link
                href="/account"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm font-sans hover:opacity-90 transition-opacity"
                title="Mijn account"
              >
                {initiaal}
              </Link>
            ) : (
              <Link
                href="/inloggen"
                className="text-sm btn-cta px-4 py-1.5 rounded-lg font-sans"
              >
                Toegang
              </Link>
            )}
          </nav>

          {/* Mobiele nav */}
          <div className="sm:hidden flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/account"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm font-sans"
              >
                {initiaal}
              </Link>
            ) : (
              <Link
                href="/inloggen"
                className="text-sm btn-cta px-4 py-1.5 rounded-lg font-sans"
              >
                Toegang
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
  const isActive = current === href || current.startsWith(href + '/')
  return (
    <Link
      href={href}
      className={`text-sm transition-colors font-sans ${
        isActive
          ? 'text-text-primary font-medium'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </Link>
  )
}
