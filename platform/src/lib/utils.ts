export function formatKoers(koers: number | null | undefined, valuta: string): string {
  if (koers == null) return '—'
  const symbol = valutaSymbool(valuta)
  if (koers >= 1000) {
    return `${symbol}${koers.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  if (koers >= 10) {
    return `${symbol}${koers.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
  }
  return `${symbol}${koers.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`
}

export function formatUpside(pct: number): string {
  const prefix = pct >= 0 ? '+' : ''
  return `${prefix}${pct.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
}


export function formatGetal(n: number | null | undefined, decimals = 1): string {
  if (n == null) return '—'
  return n.toLocaleString('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDatum(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function valutaSymbool(valuta: string): string {
  const map: Record<string, string> = {
    EUR: '€',
    USD: '$',
    SEK: 'kr ',
    NOK: 'kr ',
    DKK: 'kr ',
    PLN: 'zł ',
    INR: '₹',
    GBP: '£',
  }
  return map[valuta] ?? `${valuta} `
}


export function scoreKleur(score: number, max: number): string {
  const ratio = score / max
  if (ratio >= 0.75) return 'bg-buy'
  if (ratio >= 0.55) return 'bg-hold'
  return 'bg-pass'
}
