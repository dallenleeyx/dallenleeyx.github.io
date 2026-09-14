// lib/jobs/kv.js — thin wrapper around Redis for the single Jobs record,
// mirroring lib/math/kv.js's <domain>:<email> approach.
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

function jobsKey(email) {
  return `jobs:${email}`;
}

export async function getJobsRecord(email) {
  const redis = await getClient();
  const raw = await redis.get(jobsKey(email));
  return raw ? JSON.parse(raw) : null;
}

export async function setJobsRecord(email, state, updatedAt) {
  const record = { version: 1, updatedAt, state };
  const redis = await getClient();
  await redis.set(jobsKey(email), JSON.stringify(record));
  return record;
}
