import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Beschermde routes: redirect naar /inloggen
  if (pathname.startsWith('/account') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/inloggen', req.url))
  }

  // Ingelogde users weg van auth-pagina's
  if (
    (pathname.startsWith('/inloggen') || pathname.startsWith('/registreren')) &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  return NextResponse.next()
})

// Fallback: als auth() zelf faalt door corrupt token, vang het op
// zodat de pagina laadt als uitgelogde gebruiker i.p.v. crasht.
export function onError(request: NextRequest) {
  const response = NextResponse.next()

  // Verwijder corrupte auth cookies
  response.cookies.delete('authjs.session-token')
  response.cookies.delete('__Secure-authjs.session-token')

  return response
}

export const config = {
  matcher: ['/account/:path*', '/inloggen', '/registreren'],
}
