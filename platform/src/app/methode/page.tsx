import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methode — Hoe wij analyseren',
  description:
    'Onze methode: 9 frameworks, DCF-waardering, moat-analyse en scorekaart. Zo komen onze KOOP/HOLD/PASS-oordelen tot stand.',
}

export default function MethodePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-text-primary font-serif mb-4">
        Hoe wij analyseren
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        Elke analyse doorloopt hetzelfde gestandaardiseerde proces: 9 frameworks, een
        DCF-waardering en een handmatig controlesysteem. Zo is elke analyse vergelijkbaar
        en reproduceerbaar.
      </p>

      <div className="prose-analyse space-y-8">
        {/* Het proces */}
        <section>
          <h2>Het proces in drie stappen</h2>
          <div className="grid sm:grid-cols-3 gap-6 not-prose mt-4">
            {[
              {
                stap: '1',
                titel: 'Analyse',
                tekst: 'AI-geassisteerd onderzoek volgens 9 frameworks. Van jaarverslagen tot kwartaalcijfers — alle primaire bronnen worden doorgewerkt.',
              },
              {
                stap: '2',
                titel: 'Controle',
                tekst: 'Alle cijfers worden handmatig gecontroleerd tegen primaire bronnen zoals jaarverslagen en kwartaalcijfers.',
              },
              {
                stap: '3',
                titel: 'Oordeel',
                tekst: 'KOOP, HOLD of PASS op basis van de scorekaart en DCF-waardering. Gestandaardiseerd, reproduceerbaar, transparant.',
              },
            ].map((item) => (
              <div key={item.stap} className="bg-bg-muted rounded-xl p-5">
                <span className="text-xs font-bold text-accent font-sans">Stap {item.stap}</span>
                <p className="text-sm font-semibold text-text-primary font-sans mt-2 mb-1">
                  {item.titel}
                </p>
                <p className="text-xs text-text-secondary font-sans leading-relaxed">
                  {item.tekst}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9 Frameworks */}
        <section>
          <h2>De 9 frameworks</h2>
          <p>
            Elke analyse scoort een aandeel op 9 dimensies. Samen vormen zij de scorekaart
            die het eindoordeel bepaalt.
          </p>
          <div className="not-prose mt-4 space-y-3">
            {[
              { naam: 'DCF-waardering', beschrijving: 'Discounted cash flow met meerdere scenario\'s, WACC-opbouw en gevoeligheidsanalyse.' },
              { naam: 'Moat-analyse', beschrijving: 'Beoordeling van duurzaam concurrentievoordeel: schaalvoordelen, switching costs, netwerkeffecten, merkkracht.' },
              { naam: 'Managementbeoordeling', beschrijving: 'Track record, capital allocation, insider ownership, compensatiestructuur, integriteit.' },
              { naam: 'Financiele gezondheid', beschrijving: 'Balanssterkte, schuldpositie, kasstromen, earnings quality, rendementsindicatoren.' },
              { naam: 'Benjamin Graham', beschrijving: 'Margin of safety, Graham Number, defensieve criteria voor waardebeleggers.' },
              { naam: 'Buffett & Munger', beschrijving: 'Begrijpelijkheid, voorspelbaarheid, structurele ROIC boven WACC.' },
              { naam: 'Peter Lynch', beschrijving: 'Categorisering (stalwart, fast grower, cyclical), PEG-ratio, verhaalhelderheid.' },
              { naam: 'Philip Fisher', beschrijving: 'Groeipotentieel, R&D-intensiteit, margeontwikkeling, managementintegriteit.' },
              { naam: 'Joel Greenblatt', beschrijving: 'Magic Formula: earnings yield en return on capital als gecombineerde rangschikking.' },
            ].map((fw) => (
              <div key={fw.naam} className="bg-bg-muted rounded-lg px-5 py-4">
                <p className="text-sm font-semibold text-text-primary font-sans">{fw.naam}</p>
                <p className="text-xs text-text-secondary font-sans mt-1">{fw.beschrijving}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Oordelen */}
        <section>
          <h2>Hoe komen onze oordelen tot stand?</h2>
          <p>
            Op basis van de scorekaart en DCF-waardering valt elk aandeel in een van drie
            categorie&euml;n:
          </p>
          <p>
            <strong>KOOP</strong> &mdash; Het aandeel scoort sterk op onze frameworks en wordt door
            onze DCF-analyse als ondergewaardeerd beoordeeld ten opzichte van de berekende fair value.
          </p>
          <p>
            <strong>HOLD</strong> &mdash; Het aandeel scoort gemengd op onze frameworks of wordt rond
            fair value gewaardeerd. Er is onvoldoende marge voor een KOOP-oordeel.
          </p>
          <p>
            <strong>PASS</strong> &mdash; Het aandeel scoort onvoldoende op onze frameworks of wordt
            als overgewaardeerd beoordeeld.
          </p>
          <p>
            Deze oordelen zijn gebaseerd op vaste, reproduceerbare criteria. Ze zijn geen persoonlijke
            aanbevelingen en houden geen rekening met uw individuele financi&euml;le situatie,
            beleggingshorizon of risicoprofiel.{' '}
            <Link href="/disclaimer" className="underline hover:text-text-primary transition-colors">
              Lees onze volledige disclaimer
            </Link>.
          </p>
        </section>

        {/* Verificatie */}
        <section>
          <h2>Verificatieproces</h2>
          <p>
            Het controlesysteem verifieert de juistheid van alle gepresenteerde financi&euml;le
            data (omzet, winst, schuldratio&apos;s, kasstromen) tegen primaire bronnen zoals
            jaarverslagen en kwartaalcijfers. Elke claim in de analyse bevat een bronverwijzing
            met paginanummer, zodat de verificatie traceerbaar is.
          </p>
          <p>
            Het verificatieproces beoordeelt niet de beleggingsthese, DCF-aannames of het
            KOOP/HOLD/PASS-oordeel. Die verantwoordelijkheid ligt bij het analyseproces zelf.
          </p>
        </section>
      </div>
    </div>
  )
}
