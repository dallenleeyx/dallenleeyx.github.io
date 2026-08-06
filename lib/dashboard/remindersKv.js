// lib/dashboard/remindersKv.js — a short log of recently-sent autonomous
// reminders, keyed by email like memoryKv.js. Not a user-facing feed (no
// route reads this for display) -- its only job is giving the reminder
// checker (app/api/cron/reminder-check/route.js) something to avoid
// repeating itself every few hours when nothing's actually changed.
import { createClient } from 'redis';

let client;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('Redis error:', err));
  }
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

function remindersKey(email) {
  return `dashreminders:${email}`;
}

const MAX_ENTRIES_KEPT = 30;

export async function getRecentReminders(email) {
  const redis = await getClient();
  const raw = await redis.get(remindersKey(email));
  const record = raw ? JSON.parse(raw) : { version: 1, updatedAt: 0, sent: [] };
  return record.sent || [];
}

export async function logReminderSent(email, text) {
  const redis = await getClient();
  const raw = await redis.get(remindersKey(email));
  const current = raw ? JSON.parse(raw) : { version: 1, updatedAt: 0, sent: [] };
  const now = Date.now();
  const sent = [...current.sent, { id: `${now}`, text, sentAt: now }].slice(-MAX_ENTRIES_KEPT);
  const record = { version: 1, updatedAt: now, sent };
  await redis.set(remindersKey(email), JSON.stringify(record));
  return record;
}
