import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description:
    'Hoe aandelenanalyse.nl omgaat met uw persoonsgegevens. AVG/GDPR-compliant privacybeleid.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-text-primary font-serif mb-8">Privacyverklaring</h1>

      <div className="prose-analyse space-y-6">
        <section>
          <h2>Verwerkingsverantwoordelijke</h2>
          <p>
            Aandelenanalyse.nl is verantwoordelijk voor de verwerking van persoonsgegevens zoals
            beschreven in deze privacyverklaring. Voor vragen kunt u contact opnemen via
            privacy@aandelenanalyse.nl.
          </p>
        </section>

        <section>
          <h2>Welke gegevens verzamelen wij</h2>
          <p>
            <strong>E-mailadres (nieuwsbrief)</strong> &mdash; Op basis van uw toestemming (opt-in).
            Bewaard tot uitschrijving plus 30 dagen.
          </p>
          <p>
            <strong>Naam en e-mailadres (account)</strong> &mdash; Voor de uitvoering van de
            overeenkomst. Bewaard gedurende de looptijd van uw account plus 2 jaar.
          </p>
          <p>
            <strong>Betalingsgegevens</strong> &mdash; Voor de uitvoering van de overeenkomst.
            Bewaard gedurende 7 jaar (fiscale bewaarplicht). Betalingen worden verwerkt door Stripe.
          </p>
          <p>
            <strong>Analyticsdata (anoniem)</strong> &mdash; Op basis van gerechtvaardigd belang.
            Wij gebruiken privacy-vriendelijke analytics zonder cookies.
          </p>
        </section>

        <section>
          <h2>Uw rechten</h2>
          <p>
            U heeft recht op inzage, rectificatie, verwijdering, beperking van verwerking,
            overdraagbaarheid en bezwaar. U kunt deze rechten uitoefenen door een e-mail te sturen
            naar privacy@aandelenanalyse.nl. U heeft ook het recht een klacht in te dienen bij de
            Autoriteit Persoonsgegevens.
          </p>
        </section>

        <section>
          <h2>Verwerkers</h2>
          <p>
            Wij maken gebruik van de volgende dienstverleners voor de verwerking van uw gegevens:
          </p>
          <p><strong>Vercel</strong> &mdash; Hosting (EU/VS met Standard Contractual Clauses).</p>
          <p><strong>Stripe</strong> &mdash; Betalingsverwerking (VS met Standard Contractual Clauses).</p>
          <p>
            Met al onze verwerkers zijn verwerkersovereenkomsten gesloten conform de AVG.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Wij gebruiken privacy-vriendelijke analytics die geen cookies plaatsen. Essenti&euml;le
            cookies (sessie, authenticatie) zijn altijd toegestaan en noodzakelijk voor het functioneren
            van het platform. Er is geen cookiebanner nodig.
          </p>
        </section>

        <section>
          <h2>Wijzigingen</h2>
          <p>
            Deze privacyverklaring kan worden gewijzigd. Materiële wijzigingen worden via e-mail
            gecommuniceerd aan geregistreerde gebruikers. De meest recente versie is altijd
            beschikbaar op deze pagina.
          </p>
        </section>
      </div>
    </div>
  )
}
