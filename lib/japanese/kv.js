// lib/japanese/kv.js — thin wrapper around Redis for the single Japanese
// progress document, mirroring lib/kv.js's courses:<email> approach.
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

function japaneseKey(email) {
  return `japanese:${email}`;
}

export async function getJapaneseRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(japaneseKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setJapaneseRecord(email, state, updatedAt) {
  const record = { version: 1, updatedAt, state };
  const redis = await getClient();
  await redis.set(japaneseKey(email), JSON.stringify(record));
  return record;
}
