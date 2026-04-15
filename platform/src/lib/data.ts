import fs from 'fs'
import path from 'path'
import type { Analyse, AnalyseIndex } from './types'

const DATA_DIR = path.join(process.cwd(), 'src', 'content', 'data')

/**
 * Bouwt de index automatisch op uit alle analyse-JSON's in de data-map.
 * Geen index.json meer nodig — voorkomt sync-problemen.
 */
export function getIndex(): { laatste_update: string; companies: AnalyseIndex[] } {
  const files = fs.readdirSync(DATA_DIR).filter(
    (f) => f.endsWith('.json') && f !== 'index.json'
  )

  const companies: AnalyseIndex[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')
    const data: Analyse = JSON.parse(raw)
    return {
      ticker: data.meta.ticker,
      naam: data.meta.naam,
      sector: data.meta.sector,
      exchange: data.meta.exchange,
      koers: data.meta.koers,
      valuta: data.meta.valuta,
      fair_value_basis: data.executive_summary.fair_value_basis,
      upside_pct: data.executive_summary.upside_pct,
      oordeel: data.executive_summary.oordeel,
      scorekaart_totaal: data.scorekaart.totaal,
      scorekaart_max: data.scorekaart.max,
      peildatum: data.meta.peildatum,
      domein: data.meta.domein,
      yahoo_symbol: data.meta.yahoo_symbol,
    }
  })

  const laatste_update = companies.length
    ? companies.reduce((latest, c) => (c.peildatum > latest ? c.peildatum : latest), companies[0].peildatum)
    : new Date().toISOString().slice(0, 10)

  return { laatste_update, companies }
}

export function getAllTickers(): string[] {
  return getIndex().companies.map((c) => c.ticker)
}

export function getAnalyse(ticker: string): Analyse {
  const raw = fs.readFileSync(path.join(DATA_DIR, `${ticker}.json`), 'utf-8')
  return JSON.parse(raw)
}

export function getAnalyseMd(ticker: string): string | null {
  const mdPath = path.join(DATA_DIR, `${ticker}.md`)
  if (fs.existsSync(mdPath)) {
    return fs.readFileSync(mdPath, 'utf-8')
  }
  return null
}
