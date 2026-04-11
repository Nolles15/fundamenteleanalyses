'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

type Result =
  | { success: true }
  | { success: false; error: string }

export async function registreer(formData: FormData): Promise<Result> {
  const naam = (formData.get('naam') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string

  if (!naam || !email || !password) {
    return { success: false, error: 'Vul alle velden in' }
  }

  if (password.length < 8) {
    return { success: false, error: 'Wachtwoord moet minimaal 8 tekens zijn' }
  }

  if (password !== passwordConfirm) {
    return { success: false, error: 'Wachtwoorden komen niet overeen' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: 'Er bestaat al een account met dit e-mailadres' }
  }

  const passwordHash = await hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      naam,
      passwordHash,
      subscription: {
        create: { plan: 'GRATIS' },
      },
    },
  })

  return { success: true }
}
