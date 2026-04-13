import { Resend } from 'resend'

// Gebruik RESEND_FROM als je eigen domein geverifieerd is, anders de Resend test-afzender
const FROM = process.env.RESEND_FROM || 'Aandelenanalyse <onboarding@resend.dev>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? null
}

async function sendAdmin(subject: string, text: string) {
  const resend = getResend()
  const to = getAdminEmail()
  if (!resend || !to) return

  try {
    await resend.emails.send({ from: FROM, to, subject, text })
  } catch (e) {
    console.error('[email] Fout bij admin-notificatie:', e)
  }
}

export function notifyAdminNewUser(naam: string, email: string) {
  const tijd = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })
  sendAdmin(
    `Nieuwe registratie: ${naam}`,
    `Nieuwe gebruiker geregistreerd:\n\nNaam:  ${naam}\nEmail: ${email}\nTijd:  ${tijd}`
  )
}

export function notifyAdminPurchase(email: string, ticker: string) {
  const tijd = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })
  sendAdmin(
    `Nieuwe aankoop: ${ticker}`,
    `Losse analyse gekocht:\n\nTicker: ${ticker}\nDoor:   ${email}\nTijd:   ${tijd}`
  )
}

export function notifyAdminSubscription(
  email: string,
  plan: 'PREMIUM_MAAND' | 'PREMIUM_JAAR'
) {
  const planLabel = plan === 'PREMIUM_JAAR' ? 'Premium (jaar)' : 'Premium (maand)'
  const tijd = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })
  sendAdmin(
    `Nieuw abonnement: ${planLabel}`,
    `Nieuw premium abonnement:\n\nPlan:  ${planLabel}\nDoor:  ${email}\nTijd:  ${tijd}`
  )
}

export function notifyAdminCancellation(email: string) {
  const tijd = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })
  sendAdmin(
    `Abonnement opgezegd`,
    `Abonnement opgezegd:\n\nDoor:  ${email}\nTijd:  ${tijd}`
  )
}
