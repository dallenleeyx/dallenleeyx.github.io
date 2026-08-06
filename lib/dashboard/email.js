// lib/dashboard/email.js — pushes a reminder to Dallen's inbox via Resend's
// HTTP API. Plain fetch(), no SDK, matching this repo's existing
// raw-fetch-for-external-APIs convention. Resend's shared sandbox sender
// (onboarding@resend.dev) works with no domain verification as long as the
// recipient is the Resend account's own signed-up address -- fine here,
// this only ever emails Dallen himself.
export async function sendReminderEmail(subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REMINDER_EMAIL_TO;
  if (!apiKey || !to) return { skipped: true, reason: 'not configured' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.REMINDER_EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend send failed: ${res.status} ${body}`);
  }
  return { skipped: false };
}
