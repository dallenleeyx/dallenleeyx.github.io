// lib/fitness/kv.js — thin wrapper around Redis for the single Fitness
// progress document, mirroring lib/japanese/kv.js's japanese:<email>
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

function fitnessKey(email) {
  return `fitness:${email}`;
}

export async function getFitnessRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(fitnessKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setFitnessRecord(email, state, updatedAt) {
  const record = { version: 1, updatedAt, state };
  const redis = await getClient();
  await redis.set(fitnessKey(email), JSON.stringify(record));
  return record;
}
