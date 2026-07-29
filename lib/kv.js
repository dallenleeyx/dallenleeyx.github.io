// lib/kv.js — thin wrapper around Vercel KV for the single `courses` document.
import { kv } from '@vercel/kv';

function coursesKey(email) {
  return `courses:${email}`;
}

export async function getCoursesRecord(email) {
  return kv.get(coursesKey(email));
}

export async function setCoursesRecord(email, courses, updatedAt) {
  const record = { version: 1, updatedAt, courses };
  await kv.set(coursesKey(email), record);
  return record;
}
