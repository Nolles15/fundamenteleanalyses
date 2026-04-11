import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SignOutButton } from './sign-out-button'

const PLAN_LABELS: Record<string, string> = {
  GRATIS: 'Gratis',
  PREMIUM_MAAND: 'Premium (maandelijks)',
  PREMIUM_JAAR: 'Premium (jaarlijks)',
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/inloggen')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true, purchases: true },
  })

  if (!user) redirect('/inloggen')

  const plan = user.subscription?.plan ?? 'GRATIS'
  const planLabel = PLAN_LABELS[plan] ?? plan

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-text-primary font-serif mb-8">
        Mijn account
      </h1>

      <div className="space-y-6">
        {/* Profiel */}
        <section
          className="bg-bg-surface border border-border rounded-lg p-6"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Profiel
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-text-secondary">Naam</dt>
              <dd className="text-sm text-text-primary font-medium">
                {user.naam ?? '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-text-secondary">E-mail</dt>
              <dd className="text-sm text-text-primary font-medium">
                {user.email}
              </dd>
            </div>
          </dl>
        </section>

        {/* Abonnement */}
        <section
          className="bg-bg-surface border border-border rounded-lg p-6"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Abonnement
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary font-medium">
                {planLabel}
              </p>
              {user.subscription?.currentPeriodEnd && (
                <p className="text-xs text-text-muted mt-1">
                  Geldig tot{' '}
                  {new Date(
                    user.subscription.currentPeriodEnd
                  ).toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            {plan === 'GRATIS' && (
              <a
                href="/prijzen"
                className="text-sm text-accent font-medium hover:underline"
              >
                Upgraden
              </a>
            )}
          </div>
        </section>

        {/* Gekochte analyses */}
        {user.purchases.length > 0 && (
          <section
            className="bg-bg-surface border border-border rounded-lg p-6"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
              Gekochte analyses
            </h2>
            <ul className="space-y-2">
              {user.purchases.map((purchase: { id: string; ticker: string; createdAt: Date }) => (
                <li key={purchase.id} className="flex items-center justify-between">
                  <a
                    href={`/analyse/${purchase.ticker.toLowerCase()}`}
                    className="text-sm text-accent font-medium hover:underline"
                  >
                    {purchase.ticker}
                  </a>
                  <span className="text-xs text-text-muted">
                    {new Date(purchase.createdAt).toLocaleDateString('nl-NL')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Uitloggen */}
        <SignOutButton />
      </div>
    </div>
  )
}
