// lib/dashboard/reportsKv.js — thin Redis wrapper for the `dashreports`
// document: one entry per calendar day, each holding a morning and/or
// evening report. Unlike goalPlan/courses, the only writer is the two cron
// routes (see app/api/cron/*) -- there's no client-facing PUT, so
// `setReportForDate` is called directly from server code, not through an
// HTTP round-trip guarded by requireEmail().
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

function reportsKey(email) {
  return `dashreports:${email}`;
}

// Keeps the document from growing forever -- a report is only ever useful
// for a couple of months of lookback, and the free-text `text` fields make
// this the one Dashboard document with unbounded-ish per-entry size.
const MAX_DAYS_KEPT = 60;

export async function getReportsRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(reportsKey(email));
  return raw ? JSON.parse(raw) : null;
}

// Read-merge-write: upserts just `reports[dateISO][slot]`, leaving every
// other day and the other slot on the same day untouched.
export async function setReportForDate(email, dateISO, slot, payload) {
  const redis = await getClient();
  const raw = await redis.get(reportsKey(email));
  const current = raw ? JSON.parse(raw) : { version: 1, updatedAt: 0, reports: {} };
  const reports = { ...current.reports };
  reports[dateISO] = { ...reports[dateISO], [slot]: payload };

  const prunedDates = Object.keys(reports).sort().slice(-MAX_DAYS_KEPT);
  const pruned = {};
  prunedDates.forEach((d) => { pruned[d] = reports[d]; });

  const updatedAt = Date.now();
  const record = { version: 1, updatedAt, reports: pruned };
  await redis.set(reportsKey(email), JSON.stringify(record));
  return record;
}
