import type { Metadata } from 'next'
import { getIndex } from '@/lib/data'
import { formatDatum } from '@/lib/utils'
import { HomepageGrid } from '@/components/cards/homepage-grid'

export const metadata: Metadata = {
  title: 'Alle Analyses — Fundamentele aandelenanalyses',
  description:
    'Overzicht van alle fundamentele aandelenanalyses. Filter op oordeel, sorteer op upside of score. RA-geverifieerd proces.',
}

export default function AnalysesPage() {
  const { companies, laatste_update } = getIndex()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-sans mb-2">
          Alle Analyses
        </h1>
        <p className="text-text-secondary font-sans text-sm sm:text-base max-w-2xl">
          {companies.length} fundamentele analyses. Filter op oordeel, sorteer op upside of score.
        </p>
      </div>

      <HomepageGrid companies={companies} />

      <p className="mt-10 text-xs text-text-muted font-sans">
        {companies.length} analyses &middot; Laatste update: {formatDatum(laatste_update)}
      </p>
    </div>
  )
}
