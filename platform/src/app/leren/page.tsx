import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Leren beleggen — Fundamentele analyse uitleg',
  description:
    'Leer hoe fundamentele analyse werkt. Van DCF-waardering tot moat-analyse: begrijp de methodes achter professionele aandelenanalyses.',
}

const artikelen = [
  {
    slug: 'fundamentele-analyse',
    titel: 'Wat is fundamentele analyse?',
    beschrijving:
      'De basis van value investing: hoe bepaal je de intrinsieke waarde van een aandeel aan de hand van financiele cijfers, groeivooruitzichten en concurrentiepositie?',
    categorie: 'Basis',
  },
  {
    slug: 'dcf-waardering',
    titel: 'DCF-waardering uitgelegd',
    beschrijving:
      'Hoe werkt een discounted cash flow-analyse? Leer stap voor stap hoe je toekomstige kasstromen verdisconteert naar een fair value.',
    categorie: 'Waardering',
  },
  {
    slug: 'moat-analyse',
    titel: 'Moat-analyse: duurzaam concurrentievoordeel',
    beschrijving:
      'Wat maakt een bedrijf onverslaanbaar? Leer de vijf bronnen van concurrentievoordeel herkennen die Warren Buffett een economic moat noemt.',
    categorie: 'Strategie',
  },
]

export default function LerenPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-text-primary font-serif mb-4">
        Leren beleggen
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        Begrijp de methodes achter professionele aandelenanalyses. Van de basis van
        fundamentele analyse tot geavanceerde waarderingstechnieken.
      </p>

      <div className="space-y-4">
        {artikelen.map((artikel) => (
          <Link
            key={artikel.slug}
            href={`/leren/${artikel.slug}`}
            className="block bg-bg-muted rounded-xl p-6 hover:bg-bg-muted/80 transition-colors group"
          >
            <span className="text-xs font-medium text-accent font-sans uppercase tracking-wide">
              {artikel.categorie}
            </span>
            <h2 className="text-lg font-semibold text-text-primary font-sans mt-2 group-hover:text-accent transition-colors">
              {artikel.titel}
            </h2>
            <p className="text-sm text-text-secondary font-sans mt-2 leading-relaxed">
              {artikel.beschrijving}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-bg-surface rounded-xl border border-border">
        <p className="text-sm text-text-secondary font-sans">
          Wil je zien hoe wij deze methodes toepassen?{' '}
          <Link href="/methode" className="underline hover:text-text-primary transition-colors">
            Bekijk onze methode
          </Link>{' '}
          of ga direct naar{' '}
          <Link href="/analyses" className="underline hover:text-text-primary transition-colors">
            de analyses
          </Link>.
        </p>
      </div>
    </div>
  )
}
