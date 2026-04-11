import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutButton } from '@/components/pricing/checkout-button'

export const metadata: Metadata = {
  title: 'Prijzen',
  description:
    'Bekijk onze prijzen: gratis samenvattingen, losse analyses vanaf \u20ac4,95, of premium toegang vanaf \u20ac9,95/mnd.',
}

const plans = [
  {
    naam: 'Gratis',
    prijs: '\u20ac0',
    periode: '',
    beschrijving: 'Ontdek onze analyses',
    features: [
      'Oordeel (KOOP/HOLD/PASS)',
      'Kernthese en grootste kans/risico',
      'Bedrijfsprofiel en segmenten',
      'Live koersen',
    ],
    cta: 'Bekijk analyses',
    ctaHref: '/analyses',
    type: null,
    highlighted: false,
  },
  {
    naam: 'Losse analyse',
    prijs: '\u20ac4,95',
    periode: 'eenmalig',
    beschrijving: 'Permanent toegang tot 1 analyse',
    features: [
      'Alle 10 secties van de analyse',
      'DCF-waardering met scenario\u2019s',
      'Moat, management, frameworks',
      'Volledige scorekaart',
      'Permanente toegang',
    ],
    cta: null,
    ctaHref: null,
    type: null,
    highlighted: false,
  },
  {
    naam: 'Premium',
    prijs: '\u20ac9,95',
    periode: '/mnd',
    beschrijving: 'Alle analyses, alle secties',
    features: [
      'Alles uit Gratis +',
      'Alle analyses volledig ontgrendeld',
      'Nieuwe analyses direct beschikbaar',
      'DCF, moat, management, frameworks',
      'Volledige scorekaarten',
    ],
    cta: 'Start Premium',
    ctaHref: null,
    type: 'premium_maand' as const,
    highlighted: true,
    jaarOptie: {
      prijs: '\u20ac89',
      periode: '/jaar',
      besparing: '2 maanden gratis',
      type: 'premium_jaar' as const,
    },
  },
]

export default function PrijzenPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-serif mb-4">
          Kies je toegangsniveau
        </h1>
        <p className="text-lg text-text-secondary font-sans max-w-2xl mx-auto">
          Oordeel en kernthese zijn altijd gratis. De volledige analyse ontgrendel je per stuk
          of met een abonnement.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.naam}
            className={`rounded-2xl p-6 sm:p-8 flex flex-col ${
              plan.highlighted
                ? 'bg-accent text-white ring-2 ring-accent'
                : 'bg-bg-surface'
            }`}
            style={!plan.highlighted ? { boxShadow: 'var(--shadow-md)' } : undefined}
          >
            <div className="mb-6">
              <p className={`text-sm font-medium mb-2 font-sans ${plan.highlighted ? 'text-white/70' : 'text-text-secondary'}`}>
                {plan.naam}
              </p>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold font-sans ${plan.highlighted ? 'text-white' : 'text-text-primary'}`}>
                  {plan.prijs}
                </span>
                {plan.periode && (
                  <span className={`text-sm font-sans ${plan.highlighted ? 'text-white/60' : 'text-text-muted'}`}>
                    {plan.periode}
                  </span>
                )}
              </div>
              <p className={`text-sm font-sans mt-2 ${plan.highlighted ? 'text-white/80' : 'text-text-secondary'}`}>
                {plan.beschrijving}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className={`text-xs mt-0.5 ${plan.highlighted ? 'text-white/60' : 'text-buy'}`}>
                    &#10003;
                  </span>
                  <span className={`text-sm font-sans ${plan.highlighted ? 'text-white/90' : 'text-text-secondary'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {plan.ctaHref && !plan.type && (
              <Link
                href={plan.ctaHref}
                className={`block text-center text-sm font-semibold py-3 rounded-lg font-sans transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-accent hover:bg-white/90'
                    : 'border border-border text-text-primary hover:bg-bg-muted'
                }`}
              >
                {plan.cta}
              </Link>
            )}

            {plan.type && (
              <div className="space-y-3">
                <CheckoutButton type={plan.type} highlighted>
                  {plan.cta}
                </CheckoutButton>

                {plan.jaarOptie && (
                  <div className="text-center">
                    <CheckoutButton type={plan.jaarOptie.type}>
                      {plan.jaarOptie.prijs}{plan.jaarOptie.periode}
                    </CheckoutButton>
                    <p className={`text-xs mt-1 font-sans ${plan.highlighted ? 'text-white/50' : 'text-text-muted'}`}>
                      {plan.jaarOptie.besparing}
                    </p>
                  </div>
                )}
              </div>
            )}

            {plan.naam === 'Losse analyse' && (
              <p className="text-xs text-text-muted font-sans text-center">
                Koop rechtstreeks op de analyse-pagina
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted font-sans text-center mt-10 max-w-xl mx-auto">
        Oordelen zijn gebaseerd op vaste analyseframeworks en vormen geen persoonlijk beleggingsadvies.{' '}
        <Link href="/disclaimer" className="underline hover:text-text-secondary transition-colors">
          Lees onze disclaimer
        </Link>.
      </p>
    </div>
  )
}
