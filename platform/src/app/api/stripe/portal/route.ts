import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: 'Geen Stripe-klant' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aandelenanalyse.nl'

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${baseUrl}/account`,
  })

  return NextResponse.json({ url: portalSession.url })
}
