export type AccessLevel = 'free' | 'full'

export interface TabDefinition {
  id: string
  label: string
  access: AccessLevel
}

export const TABS: TabDefinition[] = [
  { id: 'samenvatting',  label: 'Samenvatting',  access: 'free' },
  { id: 'bedrijf',       label: 'Bedrijf',        access: 'free' },
  { id: 'financieel',    label: 'Financieel',     access: 'full' },
  { id: 'moat',          label: 'Moat',           access: 'full' },
  { id: 'management',    label: 'Management',     access: 'full' },
  { id: 'sector',        label: 'Sector',         access: 'full' },
  { id: 'frameworks',    label: 'Frameworks',     access: 'full' },
  { id: 'waardering',    label: 'Waardering',     access: 'full' },
  { id: 'risicos',       label: "Risico's",       access: 'full' },
  { id: 'scorekaart',    label: 'Scorekaart',     access: 'full' },
  { id: 'bronnen',       label: 'Bronnen',        access: 'free' },
]

/** Check of een gebruiker toegang heeft tot premium content voor een ticker */
export function hasAccess(
  user: { plan: string; purchasedTickers: string[] } | null | undefined,
  ticker: string,
  level: AccessLevel
): boolean {
  if (level === 'free') return true
  if (!user) return false
  if (user.plan !== 'GRATIS') return true
  if (user.purchasedTickers.includes(ticker.toUpperCase())) return true
  return false
}
