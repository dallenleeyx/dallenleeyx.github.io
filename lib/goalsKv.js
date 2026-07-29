// lib/goalsKv.js — thin wrapper around Redis for the single `goals`
// document, mirroring lib/kv.js's courses:<email> approach.
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

function goalsKey(email) {
  return `goals:${email}`;
}

export async function getGoalsRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(goalsKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setGoalsRecord(email, goals, updatedAt) {
  const record = { version: 1, updatedAt, goals };
  const redis = await getClient();
  await redis.set(goalsKey(email), JSON.stringify(record));
  return record;
}
