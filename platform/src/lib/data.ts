import fs from 'fs'
import path from 'path'
import type { Analyse, AnalyseIndex } from './types'

const DATA_DIR = path.join(process.cwd(), 'src', 'content', 'data')

export function getIndex(): { laatste_update: string; companies: AnalyseIndex[] } {
  const raw = fs.readFileSync(path.join(DATA_DIR, 'index.json'), 'utf-8')
  const data = JSON.parse(raw)
  // Ondersteun zowel "companies" als "stocks" als sleutel in index.json
  const companies: AnalyseIndex[] = data.companies ?? data.stocks ?? []
  const laatste_update: string = data.laatste_update ?? new Date().toISOString().slice(0, 10)
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
