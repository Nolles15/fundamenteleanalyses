'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Plan } from '@prisma/client'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Geen toegang')
  }
}

export async function wijzigPlan(userId: string, plan: Plan) {
  await requireAdmin()

  await prisma.subscription.upsert({
    where: { userId },
    update: { plan, status: 'ACTIVE' },
    create: { userId, plan, status: 'ACTIVE' },
  })

  revalidatePath('/admin/gebruikers')
}

export async function grantAnalyse(userId: string, ticker: string) {
  await requireAdmin()

  const cleaned = ticker.trim().toUpperCase()
  if (!cleaned) return

  await prisma.purchase.upsert({
    where: { userId_ticker: { userId, ticker: cleaned } },
    update: {},
    create: { userId, ticker: cleaned },
  })

  revalidatePath('/admin/gebruikers')
}
