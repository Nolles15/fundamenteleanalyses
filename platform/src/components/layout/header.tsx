import Link from 'next/link'

export function Header() {
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
            <Link
              href="/analyses"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
            >
              Analyses
            </Link>
            <Link
              href="/methode"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
            >
              Methode
            </Link>
            <Link
              href="/over"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
            >
              Over
            </Link>
            <Link
              href="/prijzen"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors font-sans"
            >
              Prijzen
            </Link>
            <Link
              href="/prijzen"
              className="text-sm btn-cta px-4 py-1.5 rounded-lg font-sans"
            >
              Toegang
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
