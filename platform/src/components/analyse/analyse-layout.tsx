'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lock } from 'lucide-react'
import type { TabDefinition } from '@/lib/access'

interface AnalyseLayoutProps {
  tabs: TabDefinition[]
  children: React.ReactNode
}

export function AnalyseLayout({ tabs, children }: AnalyseLayoutProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && tabs.some((t) => t.id === hash)) {
      setActiveId(hash)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const id = visible[0].target.id
          setActiveId(id)
          history.replaceState(null, '', `#${id}`)
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    )

    tabs.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [tabs])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 96
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile / tablet: sticky horizontale sectie-balk */}
      <nav
        className="lg:hidden sticky top-14 z-20 bg-bg-surface border-b border-border -mx-4 sm:-mx-6 px-4 sm:px-6"
        aria-label="Secties"
      >
        <div className="flex gap-0.5 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors font-sans
                ${
                  activeId === tab.id
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
                }`}
            >
              {tab.label}
              {tab.access !== 'free' && (
                <Lock size={9} className="opacity-60 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Layout: sidebar desktop + content */}
      <div className="lg:flex lg:gap-10 pt-8 lg:pt-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 shrink-0" aria-label="Secties">
          <nav className="sticky top-24">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3 font-sans">
              Inhoud
            </p>
            <ul className="space-y-0.5">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => scrollTo(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors font-sans text-left
                      ${
                        activeId === tab.id
                          ? 'bg-accent text-white font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
                      }`}
                  >
                    <span>{tab.label}</span>
                    {tab.access !== 'free' && (
                      <Lock
                        size={11}
                        className={
                          activeId === tab.id ? 'opacity-60' : 'opacity-35'
                        }
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Hoofd-content */}
        <main className="flex-1 min-w-0 pb-24">
          {children}
        </main>
      </div>
    </div>
  )
}
