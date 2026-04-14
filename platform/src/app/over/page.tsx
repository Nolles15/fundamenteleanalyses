import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Over aandelenanalyse.nl: diepgaande fundamentele analyses van Europese aandelen. AI-geassisteerd, handmatig geverifieerd.',
}

export default function OverPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-text-primary font-serif mb-4">
        Over Aandelenanalyse.nl
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        Diepgaande fundamentele analyses van Europese aandelen. Onafhankelijk, gestandaardiseerd
        en handmatig geverifieerd.
      </p>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>Waarom dit platform</h2>
          <p>
            Europese small- en midcaps krijgen nauwelijks professionele coverage. Retail-beleggers
            moeten zelf urenlang jaarverslagen doorploegen of vertrouwen op oppervlakkige analyses.
            Aandelenanalyse.nl vult dat gat: elke analyse doorloopt 9 gestandaardiseerde frameworks,
            een DCF-waardering met meerdere scenario&apos;s, en een onafhankelijk controlesysteem.
          </p>
        </section>

        <section>
          <h2>Onze aanpak</h2>
          <p>
            Wij combineren AI-geassisteerd onderzoek met een vast controlesysteem. Het
            AI-proces levert snelheid en consistentie: elke analyse volgt exact hetzelfde framework.
            De controle levert betrouwbaarheid: het proces wordt gecheckt en financi&euml;le
            cijfers worden steekproefsgewijs geverifieerd tegen primaire bronnen.
          </p>
          <p>
            Het resultaat: analyses met de diepte van een institutioneel rapport, maar dan voor
            individuele beleggers en tegen een fractie van de prijs.
          </p>
        </section>

        <section>
          <h2>Europese focus</h2>
          <p>
            Terwijl de meeste analyseplatforms zich richten op Amerikaanse aandelen, focussen wij
            op de Europese markten. Van de AEX tot Scandinavische small caps, van Poolse
            groeiwaarden tot Portugese niche-spelers. Markten die nergens anders serieus geanalyseerd
            worden.
          </p>
        </section>

        <section>
          <h2>Transparantie</h2>
          <p>
            Onze oordelen zijn gebaseerd op vaste, reproduceerbare criteria. De scorekaart toont
            exact hoe een aandeel scoort op elke dimensie. Onze{' '}
            <Link href="/methode" className="underline hover:text-text-primary transition-colors">
              methode
            </Link>{' '}
            is volledig open.
          </p>
          <p>
            Wij geven geen persoonlijk beleggingsadvies. Lees onze{' '}
            <Link href="/disclaimer" className="underline hover:text-text-primary transition-colors">
              disclaimer
            </Link>{' '}
            voor meer informatie over de juridische context.
          </p>
        </section>
      </div>
    </div>
  )
}
