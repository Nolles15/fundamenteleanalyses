'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/analyses', label: 'Analyses' },
  { href: '/vergelijk', label: 'Vergelijk' },
  { href: '/methode', label: 'Methode' },
  { href: '/leren', label: 'Leren' },
  { href: '/over', label: 'Over' },
  { href: '/prijzen', label: 'Prijzen' },
]

export function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoggedIn = status === 'authenticated'
  const naam = session?.user?.name
  const initiaal = naam?.charAt(0).toUpperCase() ?? 'U'

  const [menuOpen, setMenuOpen] = useState(false)

  // Sluit menu bij navigatie
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Voorkom scrollen als menu open is
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} current={pathname}>
                {item.label}
              </NavLink>
            ))}

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

          {/* Mobiel: hamburger + login */}
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
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center text-text-primary"
              aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="5" x2="17" y2="5" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="15" x2="17" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobiel menu overlay */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-50 bg-bg-surface">
          <nav className="flex flex-col px-6 py-6 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-sans py-3 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-text-primary font-semibold bg-bg-muted'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
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
