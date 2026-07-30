// lib/bible/kv.js — thin wrapper around Redis for the single `bible`
// document, mirroring lib/kv.js's `courses` document exactly (one email ->
// one JSON blob, last-write-wins by timestamp).
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

function bibleKey(email) {
  return `bible:${email}`;
}

export async function getBibleRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(bibleKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setBibleRecord(email, state, updatedAt) {
  const record = { version: 1, updatedAt, state };
  const redis = await getClient();
  await redis.set(bibleKey(email), JSON.stringify(record));
  return record;
}
