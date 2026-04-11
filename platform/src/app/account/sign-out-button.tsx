'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
    >
      Uitloggen
    </button>
  )
}
