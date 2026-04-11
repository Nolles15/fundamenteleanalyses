import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Wachtwoord', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
          include: { subscription: true, purchases: true },
        })

        if (!user) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.naam,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/inloggen',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Bij inloggen of session update: haal plan + purchases op
      if (user || trigger === 'update') {
        const id = (user?.id ?? token.id) as string
        const dbUser = await prisma.user.findUnique({
          where: { id },
          include: { subscription: true, purchases: true },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.plan = dbUser.subscription?.plan ?? 'GRATIS'
          token.purchasedTickers = dbUser.purchases.map((p) => p.ticker)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = (token.plan as string) ?? 'GRATIS'
        session.user.purchasedTickers = (token.purchasedTickers as string[]) ?? []
      }
      return session
    },
  },
})
