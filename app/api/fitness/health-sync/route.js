// app/api/fitness/health-sync/route.js — POST-only endpoint an Apple
// Shortcut calls directly from the phone to push a workout into today's (or
// an explicit date's) Fitness log. There's no browser session on a
// Shortcut's HTTP request, so this is authenticated by a static secret
// (FITNESS_SYNC_SECRET) sent as a Bearer token instead of the cookie-based
// `auth()` the rest of the app uses -- see the setup steps this route's
// sibling docs describe for how the Shortcut is configured.
//
// Writes only the `health` sub-object of the day's log entry (see
// lib/fitness/syncMerge.js) -- it can never clobber a manual log edit made
// from the web UI, and vice versa, because each is merged independently by
// its own updatedAt.
import { NextResponse } from 'next/server';
import { getFitnessRecord, setFitnessRecord } from '../../../../lib/fitness/kv';
import { mergeFitnessState, normalizeFitnessState } from '../../../../lib/fitness/syncMerge';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!process.env.FITNESS_SYNC_SECRET || token !== process.env.FITNESS_SYNC_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : todayISO();
  const email = process.env.ALLOWED_EMAIL;

  const current = await getFitnessRecord(email);
  const currentState = normalizeFitnessState(current?.state);

  const healthEntry = {
    updatedAt: Date.now(),
    source: 'apple-health',
    workoutType: typeof body.workoutType === 'string' ? body.workoutType : null,
    durationMin: num(body.durationMin),
    calories: num(body.calories),
    distanceKm: num(body.distanceKm),
    steps: num(body.steps),
  };

  const incoming = {
    plan: currentState.plan,
    logs: {
      ...currentState.logs,
      [date]: { ...currentState.logs[date], health: healthEntry },
    },
  };

  const merged = mergeFitnessState(currentState, incoming);
  const updatedAt = Date.now();
  await setFitnessRecord(email, merged, updatedAt);

  return NextResponse.json({ ok: true, date, health: healthEntry });
}
