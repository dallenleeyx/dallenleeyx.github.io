// lib/japanese/kv.js — thin wrapper around Redis for the single Japanese
// progress document, mirroring lib/kv.js's courses:<email> approach.
import { createClient } from 'redis';

let client;
let connectionPromise;

async function getClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('Japanese sync database is not configured');
  }
  if (client?.isReady) return client;
  if (connectionPromise) return connectionPromise;

  // Free Redis Cloud databases may disappear after inactivity. Fail fast if
  // the stored REDIS_URL points at a deleted database, rather than keeping
  // /api/japanese requests hanging in Redis' default reconnect loop.
  const candidate = createClient({
    url: process.env.REDIS_URL,
    disableOfflineQueue: true,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: false,
    },
  });
  candidate.on('error', (err) => console.error('Japanese sync Redis error:', err?.code || 'connection failed'));
  connectionPromise = candidate.connect()
    .then(() => {
      client = candidate;
      return client;
    })
    .finally(() => {
      connectionPromise = null;
    });
  return connectionPromise;
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
