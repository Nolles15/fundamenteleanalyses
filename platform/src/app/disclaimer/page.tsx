import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Aandelenanalyse.nl is geen beleggingsadvies. Lees onze volledige disclaimer over de Wft-vrijstelling en ons verificatieproces.',
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-text-primary font-serif mb-8">Disclaimer</h1>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>Geen beleggingsadvies</h2>
          <p>
            De informatie op aandelenanalyse.nl is uitsluitend bedoeld voor informatieve en educatieve
            doeleinden. De oordelen KOOP, HOLD en PASS zijn gebaseerd op vaste analyseframeworks en
            gestandaardiseerde criteria. Zij vormen geen persoonlijk beleggingsadvies in de zin van de
            Wet op het financieel toezicht (Wft). Aandelenanalyse.nl is niet geregistreerd als
            beleggingsonderneming bij de AFM en verricht geen beleggingsdiensten.
          </p>
        </section>

        <section>
          <h2>Risicowaarschuwing</h2>
          <p>
            Beleggen brengt risico&apos;s met zich mee. U kunt uw inleg geheel of gedeeltelijk verliezen.
            In het verleden behaalde resultaten bieden geen garantie voor de toekomst. Raadpleeg een
            erkend financieel adviseur voordat u beleggingsbeslissingen neemt.
          </p>
        </section>

        <section>
          <h2>Verificatieproces</h2>
          <p>
            De financi&euml;le data in onze analyses wordt handmatig gecontroleerd via een vast
            controlesysteem. Dit betreft uitsluitend verificatie van de juistheid van gepresenteerde
            cijfers (omzet, winst, schuldratio&apos;s) tegen primaire bronnen zoals jaarverslagen en
            kwartaalcijfers. Het verificatieproces beoordeelt niet de beleggingsthese, DCF-aannames
            of het KOOP/HOLD/PASS-oordeel.
          </p>
        </section>

        <section>
          <h2>Hoe onze oordelen tot stand komen</h2>
          <p>
            Elk aandeel wordt beoordeeld via 9 gestandaardiseerde analyseframeworks, waaronder
            DCF-waardering, moat-analyse en de investeringscriteria van Graham, Buffett, Lynch, Fisher
            en Greenblatt. Op basis van deze analyse valt elk aandeel in een van drie categorie&euml;n:
          </p>
          <p>
            <strong>KOOP</strong> &mdash; Het aandeel scoort sterk op onze frameworks en wordt door onze
            DCF-analyse als ondergewaardeerd beoordeeld ten opzichte van de berekende fair value.
          </p>
          <p>
            <strong>HOLD</strong> &mdash; Het aandeel scoort gemengd op onze frameworks of wordt rond
            fair value gewaardeerd. Er is onvoldoende marge voor een KOOP-oordeel.
          </p>
          <p>
            <strong>PASS</strong> &mdash; Het aandeel scoort onvoldoende op onze frameworks of wordt
            als overgewaardeerd beoordeeld. Wij zien op dit moment onvoldoende aanleiding voor een
            positief oordeel.
          </p>
          <p>
            Deze oordelen zijn gebaseerd op vaste, reproduceerbare criteria. Ze zijn geen persoonlijke
            aanbevelingen en houden geen rekening met uw individuele financi&euml;le situatie,
            beleggingshorizon of risicoprofiel.
          </p>
        </section>

        <section>
          <h2>Aansprakelijkheid</h2>
          <p>
            Aandelenanalyse.nl aanvaardt geen aansprakelijkheid voor enig verlies, direct of indirect,
            als gevolg van het gebruik van de informatie op deze website. De inhoud kan op elk moment
            zonder voorafgaande kennisgeving worden gewijzigd.
          </p>
        </section>
      </div>
    </div>
  )
}
