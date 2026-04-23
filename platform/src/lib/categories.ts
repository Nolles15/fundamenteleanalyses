import type { AnalyseIndex } from './types'

export interface Category {
  slug: string
  naam: string
  beschrijving: string
  filter: (c: AnalyseIndex) => boolean
}

const AEX_TICKERS = [
  'ADYEN', 'ASML', 'HEIJM', 'PHARM',
  // Uitbreiden als meer AEX-aandelen worden geanalyseerd
]

const SCANDINAVIE_TICKERS = ['ARP', 'BETS-B', 'MIPS', 'HUSCO', 'PNDORA', 'EQNR', 'WAWI']
const TECH_TICKERS = ['ASML', 'ADYEN', 'CRWD', 'MIPS', 'EDEN']

export const CATEGORIES: Category[] = [
  {
    slug: 'aex',
    naam: 'AEX Aandelen',
    beschrijving: 'Fundamentele analyses van aandelen genoteerd aan de Amsterdamse beurs.',
    filter: (c) => AEX_TICKERS.includes(c.ticker) || (c.exchange?.includes('AEX') ?? false) || (c.exchange?.includes('Euronext Amsterdam') ?? false),
  },
  {
    slug: 'europese-small-caps',
    naam: 'Europese Small Caps',
    beschrijving: 'Diepgaande analyses van Europese small- en midcap aandelen. Van Polen tot Portugal, van Scandinavie tot Spanje.',
    filter: (c) =>
      !['NASDAQ', 'NYSE'].some((ex) => c.exchange?.includes(ex) ?? false) &&
      (c.koers < 100 || ['ARP', 'ALTR', 'KPL', 'HUSCO', 'PUIG', 'PZU'].includes(c.ticker)),
  },
  {
    slug: 'tech-en-groei',
    naam: 'Tech & Groei',
    beschrijving: 'Technologie- en groeiaandelen geanalyseerd op fundamentele waarde. Van halfgeleiders tot cybersecurity.',
    filter: (c) =>
      TECH_TICKERS.includes(c.ticker) ||
      (c.sector?.toLowerCase().includes('tech') ?? false) ||
      (c.sector?.toLowerCase().includes('software') ?? false),
  },
  {
    slug: 'scandinavie',
    naam: 'Scandinavie',
    beschrijving: 'Fundamentele analyses van Scandinavische aandelen. Noorwegen, Zweden, Denemarken en Finland.',
    filter: (c) =>
      SCANDINAVIE_TICKERS.includes(c.ticker) ||
      (c.exchange?.includes('Stockholm') ?? false) ||
      (c.exchange?.includes('Oslo') ?? false) ||
      (c.exchange?.includes('Copenhagen') ?? false),
  },
]

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug)
}

export function getCategoryCompanies(
  cat: Category,
  companies: AnalyseIndex[]
): AnalyseIndex[] {
  return companies.filter(cat.filter)
}
