// lib/math/kv.js — thin wrapper around Redis for the single Math record,
// mirroring lib/japanese/kv.js and lib/fitness/kv.js's <domain>:<email>
// approach.
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

function mathKey(email) {
  return `math:${email}`;
}

export async function getMathRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(mathKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setMathRecord(email, state, updatedAt) {
  const record = { version: 1, updatedAt, state };
  const redis = await getClient();
  await redis.set(mathKey(email), JSON.stringify(record));
  return record;
}
