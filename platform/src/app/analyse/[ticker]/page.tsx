import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTickers, getAnalyse, getIndex } from '@/lib/data'
import { formatKoers, formatUpside } from '@/lib/utils'
import { TABS } from '@/lib/access'
import { AnalyseHeader } from '@/components/analyse/analyse-header'
import { AnalyseLayout } from '@/components/analyse/analyse-layout'
import { SectSamenvatting } from '@/components/sections/sect-samenvatting'
import { SectBedrijf } from '@/components/sections/sect-bedrijf'
import { SectFinancieel } from '@/components/sections/sect-financieel'
import { SectMoat } from '@/components/sections/sect-moat'
import { SectManagement } from '@/components/sections/sect-management'
import { SectSector } from '@/components/sections/sect-sector'
import { SectFrameworks } from '@/components/sections/sect-frameworks'
import { SectWaardering } from '@/components/sections/sect-waardering'
import { SectRisicos } from '@/components/sections/sect-risicos'
import { SectScorekaart } from '@/components/sections/sect-scorekaart'
import { SectBronnen } from '@/components/sections/sect-bronnen'

interface Props {
  params: Promise<{ ticker: string }>
}

export async function generateStaticParams() {
  const tickers = getAllTickers()
  return tickers.map((ticker) => ({ ticker: ticker.toLowerCase() }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params
  const tickerUpper = ticker.toUpperCase()

  try {
    const analyse = getAnalyse(tickerUpper)
    const { naam } = analyse.meta
    const { oordeel, kernthese, fair_value_basis, upside_pct, valuta } =
      analyse.executive_summary

    return {
      title: `${naam} (${tickerUpper}) — Fundamentele Analyse`,
      description: `${oordeel}: ${kernthese.slice(0, 150)} Fair value ${formatKoers(fair_value_basis, valuta)}, upside ${formatUpside(upside_pct)}.`,
    }
  } catch {
    return { title: `Analyse ${tickerUpper}` }
  }
}

export default async function AnalysePage({ params }: Props) {
  const { ticker } = await params
  const tickerUpper = ticker.toUpperCase()

  const { companies } = getIndex()
  const indexEntry = companies.find((c) => c.ticker === tickerUpper)
  if (!indexEntry) notFound()

  const analyse = getAnalyse(tickerUpper)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${analyse.meta.naam} — Fundamentele Analyse`,
    datePublished: analyse.meta.peildatum,
    dateModified: analyse.update_historie?.[0]?.datum ?? analyse.meta.peildatum,
    author: { '@type': 'Organization', name: 'Aandelenanalyse' },
    publisher: { '@type': 'Organization', name: 'Aandelenanalyse' },
    description: analyse.executive_summary.kernthese,
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aandelenanalyse.nl' },
      { '@type': 'ListItem', position: 2, name: 'Analyses', item: 'https://aandelenanalyse.nl/analyses' },
      { '@type': 'ListItem', position: 3, name: analyse.meta.naam, item: `https://aandelenanalyse.nl/analyse/${ticker}` },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AnalyseHeader analyse={analyse} />

      <AnalyseLayout tabs={TABS}>
        <Section id="samenvatting" title="Samenvatting">
          <SectSamenvatting analyse={analyse} />
        </Section>

        <Section id="bedrijf" title="Bedrijf">
          <SectBedrijf analyse={analyse} />
        </Section>

        <Section id="financieel" title="Financieel">
          <SectFinancieel analyse={analyse} />
        </Section>

        <Section id="moat" title="Moat">
          <SectMoat analyse={analyse} />
        </Section>

        <Section id="management" title="Management">
          <SectManagement analyse={analyse} />
        </Section>

        <Section id="sector" title="Sector & Concurrentie">
          <SectSector analyse={analyse} />
        </Section>

        <Section id="frameworks" title="Analyseframeworks">
          <SectFrameworks analyse={analyse} />
        </Section>

        <Section id="waardering" title="Waardering">
          <SectWaardering analyse={analyse} />
        </Section>

        <Section id="risicos" title="Risico's">
          <SectRisicos analyse={analyse} />
        </Section>

        <Section id="scorekaart" title="Scorekaart">
          <SectScorekaart analyse={analyse} />
        </Section>

        {(analyse.databronnen != null || (analyse.bronnen != null && analyse.bronnen.length > 0)) && (
          <Section id="bronnen" title="Bronnen & Data">
            <SectBronnen analyse={analyse} />
          </Section>
        )}
      </AnalyseLayout>
    </div>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 pt-14 first:pt-0"
    >
      {/* Visuele sectie-divider */}
      <div className="first:hidden mb-10">
        <div className="h-px bg-border" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-6 bg-accent rounded-full" />
        <h2 className="text-lg font-bold text-text-primary font-sans tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
