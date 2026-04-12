import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { getIndex } from '@/lib/data'
import { FeaturedAnalyse } from '@/components/landing/featured-analyse'
import { AnalysePreviewGrid } from '@/components/landing/analyse-preview-grid'
import { FAQ } from '@/components/landing/faq'
import { PersonalSection } from '@/components/landing/personal-section'
import { ShowWhenLoggedOut } from '@/components/landing/auth-visibility'

function findHeroImage(ticker: string): string | undefined {
  const dir = path.join(process.cwd(), 'public/images/heroes')
  for (const ext of ['jpg', 'jpeg', 'webp', 'png']) {
    if (fs.existsSync(path.join(dir, `${ticker}.${ext}`))) {
      return `/images/heroes/${ticker}.${ext}`
    }
  }
  return undefined
}

export default function HomePage() {
  const { companies } = getIndex()

  // Uitgelichte analyse: ASML (of eerste KOOP-oordeel als fallback)
  const featured = companies.find((c) => c.ticker === 'ASML')
    ?? companies.find((c) => c.oordeel === 'KOOP')
    ?? companies[0]

  const heroImage = findHeroImage(featured.ticker)

  // Nieuwste 4 analyses (op peildatum, aflopend)
  const nieuwste = [...companies]
    .sort((a, b) => b.peildatum.localeCompare(a.peildatum))
    .slice(0, 4)

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aandelenanalyse',
    url: 'https://aandelenanalyse.nl',
    description: 'Fundamentele analyses van Europese aandelen',
    publisher: { '@type': 'Organization', name: 'Aandelenanalyse', url: 'https://aandelenanalyse.nl' },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Zijn dit beleggingsadviezen?',
        acceptedAnswer: { '@type': 'Answer', text: 'Nee. Onze oordelen (KOOP, HOLD, PASS) zijn gebaseerd op vaste, gestandaardiseerde analyseframeworks. Ze geven aan hoe een aandeel scoort op onze criteria, niet wat u persoonlijk zou moeten doen.' },
      },
      {
        '@type': 'Question',
        name: 'Hoe worden analyses gecontroleerd?',
        acceptedAnswer: { '@type': 'Answer', text: 'Elke analyse doorloopt een vast controlesysteem op juistheid van de financiële cijfers. Dit systeem is opgezet volgens de methodiek van een Register Accountant.' },
      },
      {
        '@type': 'Question',
        name: 'Wat kost het?',
        acceptedAnswer: { '@type': 'Answer', text: 'Het oordeel, de kernthese en het bedrijfsprofiel zijn gratis. De volledige analyse is beschikbaar als losse aankoop (€4,95) of via een abonnement (vanaf €9,95/mnd).' },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ── Persoonlijke sectie (alleen zichtbaar als ingelogd) ── */}
      <PersonalSection companies={companies} />

      {/* ── Hero (alleen zichtbaar als NIET ingelogd) ──────────── */}
      <ShowWhenLoggedOut>
        <section className="bg-bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Linker kolom: tekst */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary font-serif leading-tight mb-6">
                  Direct toegang tot diepgaande Europese aandelenanalyses.
                </h1>
                <p className="text-lg text-text-secondary font-sans mb-8 max-w-lg">
                  Wij analyseren de fundamentals, zodat u zich kunt richten op het rendement.
                  Geen hypes, alleen harde cijfers en strategisch inzicht.
                </p>

                {/* Social proof badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {['RA-geverifieerd', '9 frameworks', 'DCF-waardering'].map((badge) => (
                    <span
                      key={badge}
                      className="text-xs font-medium text-text-secondary bg-bg-muted px-3 py-1.5 rounded-full font-sans"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/analyses"
                    className="btn-cta px-6 py-3 rounded-lg text-sm font-semibold font-sans"
                  >
                    Bekijk alle analyses
                  </Link>
                  <Link
                    href="/methode"
                    className="text-sm font-semibold text-text-primary border border-border px-6 py-3 rounded-lg hover:bg-bg-muted transition-colors font-sans"
                  >
                    Onze methode
                  </Link>
                </div>
              </div>

              {/* Rechter kolom: featured analyse */}
              <div className="hidden lg:block">
                <FeaturedAnalyse analyse={featured} heroImage={heroImage} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof bar ─────────────────────────────── */}
        <section className="bg-bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-text-secondary font-sans">
              <span>{companies.length}+ uitgebreide analyses</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>9 frameworks per analyse</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>RA-geverifieerd proces</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Europese small &amp; midcap focus</span>
            </div>
          </div>
        </section>
      </ShowWhenLoggedOut>

      {/* ── Nieuwste analyses ────────────────────────────── */}
      <section className="bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary font-serif mb-2">
                Nieuwste Analyses
              </h2>
              <p className="text-text-secondary font-sans text-sm">
                Real-time fundamentele inzichten uit de Europese markten.
              </p>
            </div>
            <Link
              href="/analyses"
              className="hidden sm:inline-flex text-sm font-medium text-accent hover:underline font-sans"
            >
              Bekijk alle {companies.length}+ analyses &rarr;
            </Link>
          </div>

          <AnalysePreviewGrid companies={nieuwste} />

          {/* Categorielinks */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Nederlandse markt', href: '/markt/aex' },
              { label: 'Europese small caps', href: '/markt/europese-small-caps' },
              { label: 'Tech & groei', href: '/markt/tech-en-groei' },
              { label: 'Scandinavie', href: '/markt/scandinavie' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors font-sans"
              >
                {cat.label} &rarr;
              </Link>
            ))}
          </div>

          <Link
            href="/analyses"
            className="sm:hidden inline-flex mt-6 text-sm font-medium text-accent hover:underline font-sans"
          >
            Bekijk alle {companies.length}+ analyses &rarr;
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-text-primary font-serif mb-8">
            Veelgestelde vragen
          </h2>
          <FAQ />
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────── */}
      <section className="bg-bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-4">
            Nieuwe analyse? Jij weet het eerst.
          </h2>
          <p className="text-white/70 font-sans mb-8">
            Ontvang analyses, marktinzichten en fundamentele updates direct in je inbox.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={undefined}
          >
            <input
              type="email"
              placeholder="je@email.nl"
              className="flex-1 px-4 py-3 rounded-lg text-sm font-sans bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-white/50"
              disabled
            />
            <button
              type="button"
              className="px-6 py-3 rounded-lg text-sm font-semibold font-sans bg-white text-accent hover:bg-white/90 transition-colors"
              disabled
            >
              Inschrijven
            </button>
          </form>
          <p className="text-xs text-white/40 font-sans mt-4">
            Binnenkort beschikbaar. Meld je vast aan om als eerste op de hoogte te zijn.
          </p>
        </div>
      </section>
    </>
  )
}
