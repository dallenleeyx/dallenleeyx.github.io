// lib/dashboard/memoryKv.js — the assistant's persistent, cumulative
// "what I've learned about Dallen" store. Distinct from goalPlan (the
// explicit, user-editable 6-month plan) and reports (dated report text):
// this is a growing list of short observations distilled by Claude itself
// while generating the morning/evening reports (and, later, the assistant
// chat) -- e.g. recurring patterns, weak spots, working habits -- read back
// into every future Claude call via lib/dashboard/context.js so the
// assistant actually gets to know Dallen over time instead of starting
// fresh every conversation.
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

function memoryKey(email) {
  return `dashmemory:${email}`;
}

// Bounds how much accumulates -- old entries are dropped oldest-first once
// this many exist, rather than growing the document (and the prompt built
// from it) forever.
const MAX_ENTRIES_KEPT = 150;

export async function getMemoryRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(memoryKey(email));
  return raw ? JSON.parse(raw) : null;
}

// Appends newEntries ({text, source}) with generated id/createdAt, prunes
// to the most recent MAX_ENTRIES_KEPT, and persists. Read-merge-write like
// reportsKv's setReportForDate -- callers (report/assistant generation
// code) pass just what's new, not the whole history.
export async function appendMemoryEntries(email, newEntries) {
  if (!newEntries || !newEntries.length) return getMemoryRecord(email);
  const redis = await getClient();
  const raw = await redis.get(memoryKey(email));
  const current = raw ? JSON.parse(raw) : { version: 1, updatedAt: 0, entries: [] };
  const now = Date.now();
  const appended = newEntries
    .filter((e) => e && typeof e.text === 'string' && e.text.trim())
    .map((e, i) => ({
      id: `${now}-${i}`,
      text: e.text.trim(),
      source: e.source || 'unknown',
      createdAt: now,
    }));
  const entries = [...current.entries, ...appended].slice(-MAX_ENTRIES_KEPT);
  const record = { version: 1, updatedAt: now, entries };
  await redis.set(memoryKey(email), JSON.stringify(record));
  return record;
}
