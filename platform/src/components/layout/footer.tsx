import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-bg-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-text-primary font-sans">Aandelenanalyse</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Fundamentele Europese aandelenanalyses via een RA-geverifieerd proces.
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-10 text-sm font-sans">
            <div className="flex flex-col gap-2">
              <span className="text-text-secondary font-medium text-xs uppercase tracking-wide">
                Platform
              </span>
              <Link href="/analyses" className="text-text-muted hover:text-text-primary transition-colors">
                Analyses
              </Link>
              <Link href="/methode" className="text-text-muted hover:text-text-primary transition-colors">
                Methode
              </Link>
              <Link href="/prijzen" className="text-text-muted hover:text-text-primary transition-colors">
                Prijzen
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-text-secondary font-medium text-xs uppercase tracking-wide">
                Info
              </span>
              <Link href="/over" className="text-text-muted hover:text-text-primary transition-colors">
                Over
              </Link>
              <Link href="/disclaimer" className="text-text-muted hover:text-text-primary transition-colors">
                Disclaimer
              </Link>
              <Link href="/privacy" className="text-text-muted hover:text-text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-text-muted font-sans">
            Geen beleggingsadvies. Oordelen zijn gebaseerd op vaste analyseframeworks en vormen geen persoonlijke aanbeveling.{' '}
            <Link href="/disclaimer" className="underline hover:text-text-secondary transition-colors">
              Lees onze volledige disclaimer
            </Link>.
          </p>
          <p className="text-xs text-text-muted font-sans mt-2">
            &copy; {new Date().getFullYear()} Aandelenanalyse.nl &mdash; Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
}
