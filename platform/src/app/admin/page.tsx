import { prisma } from '@/lib/prisma'

const PLAN_LABELS: Record<string, string> = {
  GRATIS: 'Gratis',
  PREMIUM_MAAND: 'Premium (mnd)',
  PREMIUM_JAAR: 'Premium (jaar)',
}

export default async function AdminDashboard() {
  const now = new Date()
  const maandStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalUsers,
    premiumCount,
    purchasesThisMonth,
    recentUsers,
    recentPurchases,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: { plan: { not: 'GRATIS' }, status: 'ACTIVE' },
    }),
    prisma.purchase.count({
      where: { createdAt: { gte: maandStart } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { subscription: true },
    }),
    prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { email: true, naam: true } } },
    }),
  ])

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary font-sans mb-6">
        Dashboard
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <KpiCard label="Totaal gebruikers" value={totalUsers} />
        <KpiCard label="Premium abonnees" value={premiumCount} />
        <KpiCard label="Aankopen deze maand" value={purchasesThisMonth} />
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Laatste registraties */}
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Laatste registraties
          </h2>
          <div
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Naam</th>
                  <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Plan</th>
                  <th className="text-right px-4 py-2.5 font-medium text-text-secondary">Datum</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-text-primary">{user.naam ?? '—'}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <PlanBadge plan={user.subscription?.plan ?? 'GRATIS'} />
                    </td>
                    <td className="px-4 py-2.5 text-right text-text-muted tabular-nums">
                      {user.createdAt.toLocaleDateString('nl-NL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laatste aankopen */}
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Laatste aankopen
          </h2>
          <div
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            {recentPurchases.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-muted text-center">
                Nog geen aankopen
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-muted">
                    <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Gebruiker</th>
                    <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Ticker</th>
                    <th className="text-right px-4 py-2.5 font-medium text-text-secondary">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-text-primary">{p.user.naam ?? '—'}</div>
                        <div className="text-xs text-text-muted">{p.user.email}</div>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-text-primary">
                        {p.ticker}
                      </td>
                      <td className="px-4 py-2.5 text-right text-text-muted tabular-nums">
                        {p.createdAt.toLocaleDateString('nl-NL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="bg-bg-surface border border-border rounded-lg p-5"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-text-primary tabular-nums">
        {value}
      </p>
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const label = PLAN_LABELS[plan] ?? plan
  const isPremium = plan !== 'GRATIS'
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
        isPremium
          ? 'bg-buy-bg text-buy'
          : 'bg-bg-muted text-text-muted'
      }`}
    >
      {label}
    </span>
  )
}
