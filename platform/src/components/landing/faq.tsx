'use client'

import { useState } from 'react'
import Link from 'next/link'

const items = [
  {
    q: 'Zijn dit beleggingsadviezen?',
    a: 'Nee. Onze oordelen (KOOP, HOLD, PASS) zijn gebaseerd op vaste, gestandaardiseerde analyseframeworks. Ze geven aan hoe een aandeel scoort op onze criteria, niet wat u persoonlijk zou moeten doen. Wij kennen uw financiële situatie niet en geven geen persoonlijk advies. Raadpleeg altijd een erkend financieel adviseur voordat u beleggingsbeslissingen neemt.',
  },
  {
    q: 'Hoe worden analyses gecontroleerd?',
    a: 'Elke analyse doorloopt een vast controlesysteem op juistheid van de financiële cijfers. Alle gepresenteerde data wordt handmatig geverifieerd tegen primaire bronnen zoals jaarverslagen en kwartaalcijfers.',
  },
  {
    q: 'Hoe vaak komen er nieuwe analyses?',
    a: 'We publiceren wekelijks nieuwe analyses. Meld je aan voor onze nieuwsbrief om als eerste op de hoogte te zijn.',
  },
  {
    q: 'Wat kost het?',
    a: 'Het oordeel, de kernthese en het bedrijfsprofiel zijn gratis toegankelijk bij elke analyse. De volledige analyse — inclusief DCF-waardering, moat-beoordeling, managementanalyse en scorekaart — is beschikbaar als losse aankoop (\u20ac4,95) of via een abonnement (vanaf \u20ac9,95/mnd).',
  },
] as const

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-semibold text-text-primary font-sans pr-4">
              {item.q}
            </span>
            <span className="text-text-muted text-lg shrink-0">
              {open === i ? '\u2212' : '+'}
            </span>
          </button>
          {open === i && (
            <div className="pb-5 pr-8">
              <p className="text-sm text-text-secondary font-sans leading-relaxed">
                {item.a}
                {item.q === 'Wat kost het?' && (
                  <>
                    {' '}
                    <Link href="/prijzen" className="underline hover:text-text-primary transition-colors">
                      Bekijk alle opties
                    </Link>.
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
