import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

// Convenience alias — lazy initialization via Proxy
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop]
  },
})

// Stripe Price IDs — stel in via Stripe Dashboard
export const PRICES = {
  LOSSE_ANALYSE: process.env.STRIPE_PRICE_LOSSE_ANALYSE ?? '',
  PREMIUM_MAAND: process.env.STRIPE_PRICE_PREMIUM_MAAND ?? '',
  PREMIUM_JAAR: process.env.STRIPE_PRICE_PREMIUM_JAAR ?? '',
} as const
