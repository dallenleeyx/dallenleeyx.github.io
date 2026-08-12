// app/api/fitness/route.js — GET/PUT sync API for the Fitness record (plan
// + logs), same shape as app/api/japanese/route.js. PUT merges against
// whatever's already in Redis -- see lib/fitness/syncMerge.js -- since the
// Apple Health sync endpoint can write to the same record independently.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getFitnessRecord, setFitnessRecord } from '../../../lib/fitness/kv';
import { mergeFitnessState, normalizeFitnessState } from '../../../lib/fitness/syncMerge';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getFitnessRecord(email);
  if (!record) {
    return NextResponse.json({ state: normalizeFitnessState(null), updatedAt: 0 });
  }
  return NextResponse.json({ state: normalizeFitnessState(record.state), updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }

  const current = await getFitnessRecord(email);
  const merged = mergeFitnessState(current?.state, body.state);
  const updatedAt = Date.now();
  await setFitnessRecord(email, merged, updatedAt);
  return NextResponse.json({ ok: true, state: merged, updatedAt });
}
