import { NextResponse } from 'next/server'
import { getAnalyse, getAllTickers } from '@/lib/data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  const upper = ticker.toUpperCase()

  if (!getAllTickers().includes(upper)) {
    return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
  }

  const analyse = getAnalyse(upper)
  return NextResponse.json(analyse)
}
