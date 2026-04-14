import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Moat-analyse — Duurzaam concurrentievoordeel herkennen',
  description:
    'Wat is een economic moat? Leer de vijf bronnen van duurzaam concurrentievoordeel herkennen: schaalvoordelen, switching costs, netwerkeffecten, merkkracht en kostenvoordeel.',
}

export default function MoatAnalysePage() {
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
        Moat-analyse: duurzaam concurrentievoordeel
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        Warren Buffett investeert het liefst in bedrijven met een &ldquo;economic moat&rdquo;
        &mdash; een duurzaam concurrentievoordeel dat het bedrijf beschermt tegen concurrenten.
        Maar hoe herken je zo&apos;n moat?
      </p>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>Wat is een economic moat?</h2>
          <p>
            De term komt van Warren Buffett, die bedrijven vergelijkt met kastelen omringd door
            een slotgracht (moat). Hoe breder de gracht, hoe moeilijker het voor concurrenten
            om het kasteel aan te vallen. In zakelijke termen: een moat is een structureel
            voordeel waardoor een bedrijf langdurig hogere rendementen kan behalen dan
            concurrenten.
          </p>
          <p>
            Dit is cruciaal voor beleggers. Een bedrijf zonder moat kan tijdelijk winstgevend
            zijn, maar concurrenten zullen die winst uiteindelijk wegconcurreren. Een bedrijf
            met een brede moat kan jarenlang &mdash; soms tientallen jaren &mdash; bovengemiddeld
            presteren.
          </p>
        </section>

        <section>
          <h2>De vijf bronnen van concurrentievoordeel</h2>
          <p>
            Niet elk voordeel is een moat. Een goed product, een sterke CEO of een tijdelijke
            trend zijn geen moats &mdash; ze zijn vergankelijk. Echte moats komen voort uit
            structurele eigenschappen van het bedrijf of de markt:
          </p>
        </section>

        <section>
          <h2>1. Schaalvoordelen</h2>
          <p>
            Hoe groter het bedrijf, hoe lager de kosten per eenheid. Een concurrent die dezelfde
            markt wil bedienen, moet eerst dezelfde schaal bereiken &mdash; en dat kost jaren en
            miljarden aan investeringen.
          </p>
          <p>
            <strong>Voorbeeld:</strong>{' '}
            <Link href="/analyse/ASML" className="underline hover:text-text-primary transition-colors">
              ASML
            </Link>{' '}
            investeert jaarlijks miljarden in R&amp;D voor EUV-lithografie. Geen concurrent kan
            die investeringen evenaren zonder vergelijkbare omzet. Het resultaat: een virtueel
            monopolie in de meest geavanceerde chipmachines.
          </p>
        </section>

        <section>
          <h2>2. Switching costs (overstapkosten)</h2>
          <p>
            Als het overstappen naar een concurrent duur, tijdrovend of risicovol is, blijven
            klanten bij het huidige product. Hoe hoger de overstapkosten, hoe sterker de moat.
          </p>
          <p>
            <strong>Voorbeeld:</strong>{' '}
            <Link href="/analyse/EDEN" className="underline hover:text-text-primary transition-colors">
              Edenred
            </Link>{' '}
            integreert diep in de salarisadministratie en HR-systemen van werkgevers. Overstappen
            naar een concurrent raakt compliance, personeelstevredenheid en operationele
            processen. Dat doe je niet zomaar.
          </p>
        </section>

        <section>
          <h2>3. Netwerkeffecten</h2>
          <p>
            Een product wordt waardevoller naarmate meer mensen het gebruiken. Dit creëert een
            zelfversterkend effect: meer gebruikers trekken meer gebruikers aan, waardoor
            nieuwkomers steeds moeilijker kunnen concurreren.
          </p>
          <p>
            <strong>Voorbeeld:</strong>{' '}
            <Link href="/analyse/ADYEN" className="underline hover:text-text-primary transition-colors">
              Adyen
            </Link>{' '}
            profiteert van een tweezijdig netwerk: meer merchants op het platform trekken meer
            betaalmethoden aan, en meer betaalmethoden trekken meer merchants. Elk nieuw
            aangesloten land versterkt de positie in alle andere landen.
          </p>
        </section>

        <section>
          <h2>4. Merkkracht en immateriële activa</h2>
          <p>
            Sterke merken, patenten, licenties en regulatoire goedkeuringen kunnen krachtige
            moats zijn. Een merk dat klanten bereid maakt meer te betalen &mdash; of dat als
            eerste in hun hoofd opkomt &mdash; creëert pricing power die concurrenten niet
            kunnen kopiëren.
          </p>
          <p>
            Patenten zijn per definitie tijdelijk, maar in sectoren als farmacie en technologie
            kunnen ze decennialange voorsprongen opleveren. Regulatoire barrières &mdash; zoals
            banklicenties of medische goedkeuringen &mdash; houden nieuwe toetreders buiten.
          </p>
        </section>

        <section>
          <h2>5. Kostenvoordeel</h2>
          <p>
            Sommige bedrijven hebben structureel lagere kosten dan concurrenten, bijvoorbeeld
            door locatie, unieke toegang tot grondstoffen, of superieure processen. Dit stelt
            hen in staat om lagere prijzen te bieden en toch winstgevend te blijven &mdash; of
            dezelfde prijs te vragen met hogere marges.
          </p>
          <p>
            Een kostenvoordeel is alleen een moat als het structureel is. Eenmalige
            kostenbesparingen of tijdelijke prijsvoordelen tellen niet.
          </p>
        </section>

        <section>
          <h2>Moat beoordelen: breed, smal of afwezig</h2>
          <p>
            Niet elke moat is even sterk. In onze analyses beoordelen we de moat op een schaal:
          </p>
          <p>
            <strong>Brede moat</strong> &mdash; meerdere bronnen van concurrentievoordeel die
            naar verwachting 20+ jaar standhouden. Het bedrijf kan structureel hogere
            rendementen behalen dan het gemiddelde.
          </p>
          <p>
            <strong>Smalle moat</strong> &mdash; een of twee bronnen van voordeel, maar met
            risico op erosie binnen 10-20 jaar. Het voordeel is reëel maar niet onaantastbaar.
          </p>
          <p>
            <strong>Geen moat</strong> &mdash; het bedrijf opereert in een competitieve markt
            zonder structureel voordeel. Winsten worden op termijn wegconcurreerd.
          </p>
        </section>

        <section>
          <h2>Moat-analyse in de praktijk</h2>
          <p>
            In onze analyses krijgt elk bedrijf een volledige moat-beoordeling als onderdeel
            van de{' '}
            <Link href="/leren/fundamentele-analyse" className="underline hover:text-text-primary transition-colors">
              fundamentele analyse
            </Link>. We beoordelen elke bron van concurrentievoordeel individueel en combineren
            dit tot een totaaloordeel.{' '}
            <Link href="/methode" className="underline hover:text-text-primary transition-colors">
              Bekijk onze volledige methode
            </Link>{' '}
            of zie het in actie bij{' '}
            <Link href="/analyses" className="underline hover:text-text-primary transition-colors">
              de analyses
            </Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
