'use client'

import { useState, useEffect } from 'react'

interface LivePrice {
  price: number
  currency: string
}

type PriceMap = Record<string, LivePrice>

let cachedPrices: PriceMap | null = null
let fetchPromise: Promise<PriceMap> | null = null

async function fetchPrices(symbols: string[]): Promise<PriceMap> {
  if (cachedPrices) return cachedPrices

  if (fetchPromise) return fetchPromise

  fetchPromise = fetch(`/api/koersen?symbols=${symbols.join(',')}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    })
    .then((data: PriceMap) => {
      cachedPrices = data
      return data
    })
    .catch(() => {
      fetchPromise = null
      return {} as PriceMap
    })

  return fetchPromise
}

export function useLivePrices(
  yahooSymbols: string[]
): { prices: PriceMap; loading: boolean } {
  const [prices, setPrices] = useState<PriceMap>(cachedPrices ?? {})
  const [loading, setLoading] = useState(!cachedPrices)

  useEffect(() => {
    if (!yahooSymbols.length) return

    fetchPrices(yahooSymbols).then((data) => {
      setPrices(data)
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { prices, loading }
}
