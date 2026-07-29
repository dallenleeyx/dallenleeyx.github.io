// lib/kv.js — thin wrapper around Redis (Vercel's Marketplace Redis
// integration, connected via REDIS_URL) for the single `courses` document.
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

function coursesKey(email) {
  return `courses:${email}`;
}

export async function getCoursesRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(coursesKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setCoursesRecord(email, courses, updatedAt) {
  const record = { version: 1, updatedAt, courses };
  const redis = await getClient();
  await redis.set(coursesKey(email), JSON.stringify(record));
  return record;
}
