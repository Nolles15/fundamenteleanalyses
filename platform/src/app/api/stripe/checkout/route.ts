import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PRICES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const body = await req.json()
  const { type, ticker } = body as { type: string; ticker?: string }

  // Haal of maak Stripe customer
  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  let customerId = sub?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: session.user.id,
        stripeCustomerId: customerId,
        plan: 'GRATIS',
        status: 'ACTIVE',
      },
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aandelenanalyse.nl'

  // Bepaal de checkout-configuratie op basis van type
  if (type === 'analyse' && ticker) {
    // Losse analyse — one-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [{ price: PRICES.LOSSE_ANALYSE, quantity: 1 }],
      metadata: { userId: session.user.id, ticker: ticker.toUpperCase() },
      success_url: `${baseUrl}/analyse/${ticker.toLowerCase()}?betaald=1`,
      cancel_url: `${baseUrl}/analyse/${ticker.toLowerCase()}`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  }

  if (type === 'premium_maand' || type === 'premium_jaar') {
    const priceId = type === 'premium_maand' ? PRICES.PREMIUM_MAAND : PRICES.PREMIUM_JAAR

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId: session.user.id },
      success_url: `${baseUrl}/account?welkom=1`,
      cancel_url: `${baseUrl}/prijzen`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  }

  return NextResponse.json({ error: 'Ongeldig type' }, { status: 400 })
}
