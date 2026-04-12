'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function InloggenPage() {
  return (
    <Suspense>
      <InloggenForm />
    </Suspense>
  )
}

function InloggenForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email') as string,
      password: form.get('password') as string,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Onjuist e-mailadres of wachtwoord')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-serif">
            Inloggen
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Log in om je analyses en account te beheren
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-surface border border-border rounded-lg p-6 space-y-5"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary"
            >
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jouw@email.nl"
              className="w-full rounded-sm border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              Wachtwoord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-sm border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-sm bg-pass-bg border border-pass-border px-3 py-2">
              <p className="text-pass text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-accent text-white py-2.5 text-sm font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Nog geen account?{' '}
          <Link
            href={`/registreren${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="text-accent font-medium hover:underline"
          >
            Registreer je hier
          </Link>
        </p>
      </div>
    </div>
  )
}
