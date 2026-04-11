import { NextResponse } from 'next/server'
import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

export const revalidate = 300 // Cache 5 minuten

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbolsParam = searchParams.get('symbols')

  if (!symbolsParam) {
    return NextResponse.json(
      { error: 'Missing symbols parameter' },
      { status: 400 }
    )
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean)

  try {
    const quotes = await yf.quote(symbols)
    const list = Array.isArray(quotes) ? quotes : [quotes]

    const result: Record<string, { price: number; currency: string }> = {}

    for (const quote of list) {
      if (quote.symbol && quote.regularMarketPrice) {
        result[quote.symbol] = {
          price: quote.regularMarketPrice,
          currency: quote.currency ?? 'USD',
        }
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Yahoo Finance fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 502 }
    )
  }
}
