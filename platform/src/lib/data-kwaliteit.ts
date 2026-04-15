import type { Analyse, DataKwaliteit } from './types'

/**
 * Berekent datakwaliteit dynamisch uit de financiële tabellen.
 * Werkt voor alle analyses, ook zonder data_kwaliteit in de JSON.
 */

const KERN_VELDEN_RR = ['omzet', 'ebit', 'nettowinst', 'eps'] as const
const KERN_VELDEN_KS = ['cfo', 'capex', 'fcf'] as const
const KERN_VELDEN_BS = ['nettoschuld'] as const

export function berekenDataKwaliteit(analyse: Analyse): DataKwaliteit {
  // Als de skill het al heeft meegegeven, gebruik dat
  if (analyse.data_kwaliteit) return analyse.data_kwaliteit

  const fin = analyse.financieel
  const rr = fin.resultatenrekening ?? []
  const ks = fin.kasstromen ?? []
  const bs = fin.balans ?? []
  const riRaw = fin.rendementsindicatoren
  const ri = Array.isArray(riRaw) ? riRaw : riRaw ? [riRaw] : []

  // Verzamel alle jaren
  const alleJaren = new Set<number>()
  for (const r of rr) alleJaren.add(r.jaar)
  for (const k of ks) alleJaren.add(k.jaar)
  for (const b of bs) alleJaren.add(b.jaar)
  for (const r of ri) if (r.jaar) alleJaren.add(r.jaar)

  const jaren = Array.from(alleJaren).sort((a, b) => a - b)

  const jarenVolledig: number[] = []
  const jarenGedeeltelijk: number[] = []
  const jarenOntbrekend: number[] = []

  let totaalVelden = 0
  let gevuldeVelden = 0

  for (const jaar of jaren) {
    const rrJaar = rr.find((r) => r.jaar === jaar) as Record<string, unknown> | undefined
    const ksJaar = ks.find((k) => k.jaar === jaar) as Record<string, unknown> | undefined
    const bsJaar = bs.find((b) => b.jaar === jaar) as Record<string, unknown> | undefined
    const riJaar = ri.find((r) => r.jaar === jaar)

    let jaarTotaal = 0
    let jaarGevuld = 0

    for (const v of KERN_VELDEN_RR) {
      jaarTotaal++
      if (rrJaar && rrJaar[v] != null) jaarGevuld++
    }
    for (const v of KERN_VELDEN_KS) {
      jaarTotaal++
      if (ksJaar && ksJaar[v] != null) jaarGevuld++
    }
    for (const v of KERN_VELDEN_BS) {
      jaarTotaal++
      if (bsJaar && bsJaar[v] != null) jaarGevuld++
    }
    // ROIC check
    jaarTotaal++
    if (riJaar && riJaar.roic_pct != null) jaarGevuld++

    totaalVelden += jaarTotaal
    gevuldeVelden += jaarGevuld

    const dekkingJaar = jaarTotaal > 0 ? jaarGevuld / jaarTotaal : 0
    if (dekkingJaar >= 0.9) jarenVolledig.push(jaar)
    else if (dekkingJaar > 0) jarenGedeeltelijk.push(jaar)
    else jarenOntbrekend.push(jaar)
  }

  const dekking_pct = totaalVelden > 0 ? Math.round((gevuldeVelden / totaalVelden) * 100) : 0

  const label: DataKwaliteit['label'] =
    dekking_pct >= 90 ? 'Volledige data'
    : dekking_pct >= 70 ? 'Gedeeltelijke data'
    : 'Beperkte data'

  const ontbrekendStr = jarenOntbrekend.length > 0
    ? `Data voor ${jarenOntbrekend.join(', ')} niet beschikbaar.`
    : jarenGedeeltelijk.length > 0
    ? `Data voor ${jarenGedeeltelijk.join(', ')} gedeeltelijk beschikbaar.`
    : undefined

  return {
    jaren_aanwezig: jaren,
    jaren_volledig: jarenVolledig,
    jaren_gedeeltelijk: jarenGedeeltelijk,
    jaren_ontbrekend: jarenOntbrekend,
    dekking_pct,
    label,
    toelichting: ontbrekendStr,
  }
}
