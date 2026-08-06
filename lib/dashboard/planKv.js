// lib/dashboard/planKv.js — thin Redis wrapper for the single `goalPlan`
// document (the 6-month plan: JLPT date, per-course target grades,
// milestones, narrative). Structurally identical to lib/kv.js's `courses`
// wrapper -- last-write-wins, single owner, rarely concurrently edited,
// unlike Japanese's merge-based sync. Key is deliberately `goalplan:` (not
// `plan:`) to avoid colliding with the Japanese Home tab's own unrelated
// `planBundle` concept under `japanese:<email>`.
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

function goalPlanKey(email) {
  return `goalplan:${email}`;
}

export async function getGoalPlanRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(goalPlanKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setGoalPlanRecord(email, plan, updatedAt) {
  const record = { version: 1, updatedAt, plan };
  const redis = await getClient();
  await redis.set(goalPlanKey(email), JSON.stringify(record));
  return record;
}
