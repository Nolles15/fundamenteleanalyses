import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getIndex } from '@/lib/data'
import { CATEGORIES, getCategory, getCategoryCompanies } from '@/lib/categories'
import { HomepageGrid } from '@/components/cards/homepage-grid'

interface Props {
  params: Promise<{ categorie: string }>
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ categorie: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params
  const cat = getCategory(categorie)

  if (!cat) return { title: 'Categorie niet gevonden' }

  return {
    title: `${cat.naam} — Fundamentele Analyses`,
    description: cat.beschrijving,
  }
}

export default async function MarktPage({ params }: Props) {
  const { categorie } = await params
  const cat = getCategory(categorie)
  if (!cat) notFound()

  const { companies } = getIndex()
  const filtered = getCategoryCompanies(cat, companies)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aandelenanalyse.nl' },
      { '@type': 'ListItem', position: 2, name: cat.naam, item: `https://aandelenanalyse.nl/markt/${cat.slug}` },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mb-10">
        <nav className="text-xs text-text-muted font-sans mb-4">
          <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
          {' / '}
          <span className="text-text-secondary">{cat.naam}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-serif mb-2">
          {cat.naam}
        </h1>
        <p className="text-text-secondary font-sans text-sm sm:text-base max-w-2xl">
          {cat.beschrijving}
        </p>
      </div>

      {filtered.length > 0 ? (
        <HomepageGrid companies={filtered} />
      ) : (
        <p className="text-text-muted font-sans text-sm py-8">
          Er zijn nog geen analyses in deze categorie. Binnenkort beschikbaar.
        </p>
      )}

      {/* Gerelateerde categorieen */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-xs font-medium text-text-muted font-sans uppercase tracking-wide mb-3">
          Andere markten
        </p>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/markt/${c.slug}`}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors font-sans"
            >
              {c.naam} &rarr;
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
