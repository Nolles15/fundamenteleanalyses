import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Geen signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Ongeldige signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (!userId) break

      if (session.mode === 'payment') {
        // Losse analyse-aankoop
        const ticker = session.metadata?.ticker
        if (ticker) {
          await prisma.purchase.upsert({
            where: { userId_ticker: { userId, ticker } },
            update: {},
            create: { userId, ticker },
          })
        }
      }

      if (session.mode === 'subscription') {
        // Premium abonnement
        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const firstItem = subscription.items.data[0]
        const isYearly = firstItem?.plan?.interval === 'year'
        const periodEnd = firstItem?.current_period_end
          ? new Date(firstItem.current_period_end * 1000)
          : null

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: subscriptionId,
            plan: isYearly ? 'PREMIUM_JAAR' : 'PREMIUM_MAAND',
            status: 'ACTIVE',
            currentPeriodEnd: periodEnd,
          },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            plan: isYearly ? 'PREMIUM_JAAR' : 'PREMIUM_MAAND',
            status: 'ACTIVE',
            currentPeriodEnd: periodEnd,
          },
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const sub = await prisma.subscription.findUnique({
        where: { stripeCustomerId: customerId },
      })

      if (sub) {
        const firstItem = subscription.items.data[0]
        const isYearly = firstItem?.plan?.interval === 'year'
        const periodEnd = firstItem?.current_period_end
          ? new Date(firstItem.current_period_end * 1000)
          : null

        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            plan: isYearly ? 'PREMIUM_JAAR' : 'PREMIUM_MAAND',
            status: subscription.status === 'active' ? 'ACTIVE'
              : subscription.status === 'past_due' ? 'PAST_DUE'
              : subscription.status === 'canceled' ? 'CANCELED'
              : 'INCOMPLETE',
            currentPeriodEnd: periodEnd,
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan: 'GRATIS',
          status: 'CANCELED',
          stripeSubscriptionId: null,
        },
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: { status: 'PAST_DUE' },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
