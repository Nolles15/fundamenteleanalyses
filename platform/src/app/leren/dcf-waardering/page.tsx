import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DCF-waardering uitgelegd — Discounted Cash Flow voor beleggers',
  description:
    'Leer stap voor stap hoe een DCF-analyse werkt. Van vrije kasstroom tot WACC en terminal value: zo bereken je de fair value van een aandeel.',
}

export default function DcfWaarderingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link
          href="/leren"
          className="text-sm text-text-muted hover:text-text-secondary transition-colors font-sans"
        >
          &larr; Alle artikelen
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-text-primary font-serif mb-4">
        DCF-waardering uitgelegd
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        De discounted cash flow-methode is de meest grondige manier om de intrinsieke waarde
        van een aandeel te berekenen. Hier leggen we stap voor stap uit hoe het werkt.
      </p>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>Het basisprincipe</h2>
          <p>
            Een DCF-analyse beantwoordt een simpele vraag: wat zijn alle toekomstige kasstromen
            van een bedrijf vandaag waard? Geld in de toekomst is minder waard dan geld nu
            &mdash; door inflatie, risico en alternatieve investeringsmogelijkheden. De DCF
            rekent toekomstige kasstromen terug naar hun huidige waarde met een disconteringsvoet.
          </p>
          <p>
            Het resultaat is een berekende fair value per aandeel. Als de huidige beurskoers
            onder die fair value ligt, is het aandeel potentieel ondergewaardeerd.
          </p>
        </section>

        <section>
          <h2>Stap 1: Vrije kasstroom (FCF)</h2>
          <p>
            De basis van elke DCF is de vrije kasstroom &mdash; free cash flow (FCF). Dit is
            het geld dat een bedrijf overhoudt nadat het alle operationele kosten heeft betaald
            en de nodige investeringen heeft gedaan.
          </p>
          <p>
            De formule: <strong>FCF = operationele kasstroom &minus; kapitaalinvesteringen (capex)</strong>.
          </p>
          <p>
            Waarom FCF en niet winst? Omdat winst een boekhoudkundig begrip is dat door
            afschrijvingsmethodes, voorzieningen en andere keuzes vertekend kan zijn. Kasstroom
            is concreet: het is geld dat daadwerkelijk beschikbaar is voor aandeelhouders,
            schuldaflossing of herinvestering.
          </p>
        </section>

        <section>
          <h2>Stap 2: Groeiprojecties</h2>
          <p>
            De volgende stap is inschatten hoe de vrije kasstroom zich ontwikkelt. Dit is het
            meest subjectieve onderdeel van een DCF en waar de meeste fouten worden gemaakt.
          </p>
          <p>
            Een standaard aanpak gebruikt twee fases:
          </p>
          <p>
            <strong>Expliciete projectieperiode (5-10 jaar)</strong> &mdash; hier maak je concrete
            schattingen van omzetgroei, marges en capex. Hoe verder in de toekomst, hoe
            onzekerder de schatting. Gebruik historische trends, sectorgemiddelden en
            managementguidance als uitgangspunt, maar denk kritisch na over wat realistisch is.
          </p>
          <p>
            <strong>Terminal value</strong> &mdash; na de expliciete periode neem je aan dat het
            bedrijf voor altijd doorgroeit met een stabiel, laag percentage (de terminal growth
            rate). Dit is doorgaans 2-3%, in lijn met langetermijninflatie en economische groei.
            De terminal value maakt vaak 60-80% uit van de totale DCF-waarde &mdash; een kleine
            verandering in deze aanname heeft grote impact.
          </p>
        </section>

        <section>
          <h2>Stap 3: WACC &mdash; de disconteringsvoet</h2>
          <p>
            Om toekomstige kasstromen terug te rekenen naar vandaag heb je een
            disconteringsvoet nodig. De meest gebruikte is de WACC: Weighted Average Cost
            of Capital.
          </p>
          <p>
            De WACC weegt de kosten van eigen vermogen en vreemd vermogen naar hun aandeel
            in de totale financiering. Een bedrijf met veel schuld en hoog risico heeft een
            hogere WACC, wat toekomstige kasstromen zwaarder verdisconteert en de fair value
            verlaagt.
          </p>
          <p>
            Typische WACC-waardes liggen tussen 7% en 12%. Een technologiebedrijf met
            volatiele kasstromen heeft een hogere WACC dan een nutsbedrijf met stabiele
            inkomsten.
          </p>
        </section>

        <section>
          <h2>Stap 4: Van ondernemingswaarde naar fair value per aandeel</h2>
          <p>
            De som van alle verdisconteerde kasstromen plus de verdisconteerde terminal value
            geeft de ondernemingswaarde (enterprise value). Om tot een fair value per aandeel
            te komen:
          </p>
          <p>
            <strong>Fair value per aandeel = (enterprise value + cash &minus; schuld) &divide;
            aantal uitstaande aandelen</strong>
          </p>
          <p>
            Dit getal vergelijk je met de huidige beurskoers. Het verschil, uitgedrukt als
            percentage, is de upside (of downside) ten opzichte van fair value.
          </p>
        </section>

        <section>
          <h2>Gevoeligheidsanalyse: omgaan met onzekerheid</h2>
          <p>
            Elke DCF bevat aannames die fout kunnen zijn. Daarom is een gevoeligheidsanalyse
            essentieel: wat gebeurt er met de fair value als de groei 2% lager uitvalt? Of als
            de WACC een half procent hoger is?
          </p>
          <p>
            Een gevoeligheidsmatrix toont de fair value bij verschillende combinaties van
            groeivoet en WACC. Dit geeft een range waarbinnen de werkelijke waarde
            waarschijnlijk ligt, in plaats van een enkel getal dat onterecht precies lijkt.
          </p>
          <p>
            Aanvullend gebruiken wij meerdere scenario&apos;s (bear, base, bull) met
            uiteenlopende aannames. Zo zie je niet alleen de verwachte fair value, maar ook
            wat er in het slechtste en beste geval kan gebeuren.
          </p>
        </section>

        <section>
          <h2>Veelgemaakte fouten bij DCF-analyses</h2>
          <p>
            <strong>Te optimistische groeiprojecties</strong> &mdash; het is verleidelijk om
            recente hoge groei door te trekken naar de toekomst. Maar de meeste bedrijven
            groeien langzamer naarmate ze groter worden. Wees conservatief.
          </p>
          <p>
            <strong>Te lage WACC</strong> &mdash; een lagere disconteringsvoet maakt toekomstige
            kasstromen meer waard, wat de fair value kunstmatig verhoogt. Gebruik realistische
            risicopremies.
          </p>
          <p>
            <strong>Terminal value dominantie negeren</strong> &mdash; als 80% van je DCF-waarde
            uit de terminal value komt, is je analyse extreem gevoelig voor de terminal growth
            rate. Controleer dit altijd.
          </p>
          <p>
            <strong>Geen margevergelijking</strong> &mdash; projecteer niet zomaar hogere marges
            als het bedrijf die historisch nooit heeft gehaald. Kijk naar sectorgemiddelden.
          </p>
        </section>

        <section>
          <h2>DCF in de praktijk</h2>
          <p>
            In onze analyses passen we DCF-waardering toe met vier scenario&apos;s (bear, base,
            bull en optimistic), een volledige WACC-opbouw en een gevoeligheidsmatrix.{' '}
            <Link href="/methode" className="underline hover:text-text-primary transition-colors">
              Bekijk onze methode
            </Link>{' '}
            voor de volledige uitleg, of zie het in de praktijk bij bijvoorbeeld{' '}
            <Link href="/analyse/ASML" className="underline hover:text-text-primary transition-colors">
              de ASML-analyse
            </Link>{' '}
            of{' '}
            <Link href="/analyse/ADYEN" className="underline hover:text-text-primary transition-colors">
              de Adyen-analyse
            </Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
