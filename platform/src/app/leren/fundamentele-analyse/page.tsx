import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wat is fundamentele analyse? — Uitleg voor beleggers',
  description:
    'Fundamentele analyse is de methode om de intrinsieke waarde van een aandeel te bepalen. Leer hoe je jaarverslagen, kasstromen en groeivooruitzichten analyseert.',
}

export default function FundamenteleAnalysePage() {
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
        Wat is fundamentele analyse?
      </h1>
      <p className="text-lg text-text-secondary font-sans mb-12 max-w-2xl">
        De methode achter value investing: hoe bepaal je wat een aandeel werkelijk waard is,
        los van wat de markt ervoor vraagt?
      </p>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>De kern: intrinsieke waarde vs. marktprijs</h2>
          <p>
            Fundamentele analyse draait om een simpel principe: elk bedrijf heeft een intrinsieke
            waarde die je kunt berekenen op basis van de onderliggende financiele prestaties. Als
            de marktprijs lager is dan die intrinsieke waarde, is het aandeel ondergewaardeerd
            &mdash; en daarmee potentieel een goede investering.
          </p>
          <p>
            Dit staat tegenover technische analyse, waarbij beleggers patronen in koersgrafieken
            zoeken. Fundamentele analisten kijken niet naar de koers zelf, maar naar wat er
            achter de koers zit: omzet, winst, kasstromen, schulden, groeipotentieel en
            concurrentiepositie.
          </p>
        </section>

        <section>
          <h2>Welke cijfers zijn belangrijk?</h2>
          <p>
            Een fundamentele analyse begint altijd bij de financiele verslaggeving van een bedrijf.
            De drie belangrijkste documenten zijn:
          </p>
          <p>
            <strong>De resultatenrekening</strong> toont omzet, kosten en winst over een periode.
            Hier kijk je naar omzetgroei, winstmarges en de trend over meerdere jaren. Een bedrijf
            dat structureel groeit en haar marges verbetert, is een ander verhaal dan een bedrijf
            met dalende omzet.
          </p>
          <p>
            <strong>De balans</strong> geeft een momentopname van bezittingen en schulden. Cruciaal
            is de verhouding tussen eigen vermogen en schuld. Een bedrijf met te veel schuld is
            kwetsbaar in een recessie, hoe mooi de winstcijfers er ook uitzien.
          </p>
          <p>
            <strong>Het kasstroomoverzicht</strong> laat zien hoeveel geld er daadwerkelijk
            binnenkomt en uitgaat. Dit is voor veel analisten het belangrijkste document, omdat
            kasstromen moeilijker te manipuleren zijn dan boekhoudkundige winst.
          </p>
        </section>

        <section>
          <h2>Van cijfers naar waardering</h2>
          <p>
            Zodra je de financiele gezondheid van een bedrijf begrijpt, is de volgende stap: wat
            is het waard? Daarvoor bestaan verschillende waarderingsmethodes:
          </p>
          <p>
            <strong>Koers-winstverhouding (P/E-ratio)</strong> &mdash; de meest gebruikte maatstaf.
            Een P/E van 15 betekent dat je 15 keer de jaarwinst betaalt voor het aandeel. Maar een
            lage P/E is niet automatisch goedkoop: het kan ook betekenen dat de markt weinig groei
            verwacht.
          </p>
          <p>
            <strong>Discounted Cash Flow (DCF)</strong> &mdash; de meest grondige methode. Je
            schat de toekomstige kasstromen van een bedrijf en rekent die terug naar vandaag.
            Het resultaat is een berekende fair value waarmee je de huidige koers kunt vergelijken.{' '}
            <Link href="/leren/dcf-waardering" className="underline hover:text-text-primary transition-colors">
              Lees onze uitleg over DCF-waardering
            </Link>.
          </p>
          <p>
            <strong>EV/EBITDA</strong> &mdash; vergelijkt de totale ondernemingswaarde (inclusief
            schuld) met de operationele winst. Nuttig om bedrijven met verschillende
            schuldniveaus eerlijk te vergelijken.
          </p>
        </section>

        <section>
          <h2>Meer dan alleen cijfers</h2>
          <p>
            Goede fundamentele analyse stopt niet bij de spreadsheet. Je wilt ook begrijpen
            waarom een bedrijf geld verdient en of dat zo blijft. Dat betekent kijken naar:
          </p>
          <p>
            <strong>Concurrentievoordeel (moat)</strong> &mdash; heeft het bedrijf een duurzaam
            voordeel dat concurrenten buitenhoudt? Denk aan schaalvoordelen, netwerkeffecten
            of hoge overstapkosten.{' '}
            <Link href="/leren/moat-analyse" className="underline hover:text-text-primary transition-colors">
              Lees meer over moat-analyse
            </Link>.
          </p>
          <p>
            <strong>Management</strong> &mdash; is het bestuur betrouwbaar? Investeren zij mee
            met eigen geld? Hoe alloceren ze kapitaal &mdash; kopen ze aandelen terug, betalen
            ze dividend, of doen ze dure overnames?
          </p>
          <p>
            <strong>Sectortrends</strong> &mdash; groeit de markt waarin het bedrijf opereert?
            Of is het een krimpende industrie waar zelfs het beste bedrijf uiteindelijk vastloopt?
          </p>
        </section>

        <section>
          <h2>De vijf investeringsframeworks</h2>
          <p>
            De grote namen in value investing hebben elk hun eigen benadering van fundamentele
            analyse. Vijf frameworks die breed worden toegepast:
          </p>
          <p>
            <strong>Benjamin Graham</strong> &mdash; de vader van value investing. Focus op margin
            of safety: koop alleen aandelen die ver onder hun berekende waarde noteren.
          </p>
          <p>
            <strong>Warren Buffett</strong> &mdash; zoekt &ldquo;wonderful companies at a fair
            price&rdquo;. Kwaliteit boven goedkoopte, met nadruk op voorspelbare kasstromen en
            sterke merken.
          </p>
          <p>
            <strong>Peter Lynch</strong> &mdash; categoriseert bedrijven (slow grower, stalwart,
            fast grower, cyclical) en zoekt naar onderschatte groeiers via de PEG-ratio.
          </p>
          <p>
            <strong>Philip Fisher</strong> &mdash; kwalitatief onderzoek naar groeibedrijven.
            Praat met klanten, leveranciers en concurrenten om de werkelijke kwaliteit te meten.
          </p>
          <p>
            <strong>Joel Greenblatt</strong> &mdash; de Magic Formula: rangschik aandelen op
            earnings yield en return on capital. Simpel, systematisch, effectief.
          </p>
          <p>
            Op aandelenanalyse.nl passen wij al deze frameworks toe op elk geanalyseerd aandeel.{' '}
            <Link href="/methode" className="underline hover:text-text-primary transition-colors">
              Bekijk onze volledige methode
            </Link>.
          </p>
        </section>

        <section>
          <h2>Fundamentele analyse in de praktijk</h2>
          <p>
            Theorie is waardevol, maar de echte lessen zitten in de toepassing. In onze analyses
            zie je precies hoe deze methodes werken bij echte bedrijven:
          </p>
          <p>
            <Link href="/analyse/ASML" className="underline hover:text-text-primary transition-colors">
              ASML
            </Link>{' '}
            &mdash; hoe analyseer je een bedrijf met een bijna-monopolie en extreem hoge
            waardering? Waar zit de margin of safety bij een P/E boven 30?
          </p>
          <p>
            <Link href="/analyse/EDEN" className="underline hover:text-text-primary transition-colors">
              Edenred
            </Link>{' '}
            &mdash; een voorbeeld van een bedrijf dat tijdelijk wordt afgestraft door regelgeving.
            Hoe onderscheid je een structureel probleem van een koopkans?
          </p>
          <p>
            <Link href="/analyses" className="underline hover:text-text-primary transition-colors">
              Bekijk alle analyses
            </Link>{' '}
            om te zien hoe fundamentele analyse er in de praktijk uitziet.
          </p>
        </section>
      </div>
    </div>
  )
}
