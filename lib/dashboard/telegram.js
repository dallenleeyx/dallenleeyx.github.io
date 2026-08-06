// lib/dashboard/telegram.js — pushes a reminder to Dallen's phone via the
// Telegram Bot API. Chosen over browser push notifications for v1: no
// service worker, VAPID keys, or per-device subscription storage needed --
// a single bot token + chat id and one fetch() call, matching this repo's
// existing raw-fetch-for-external-APIs convention.
export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { skipped: true, reason: 'not configured' };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Telegram send failed: ${res.status} ${body}`);
  }
  return { skipped: false };
}
