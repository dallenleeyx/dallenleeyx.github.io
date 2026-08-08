// app/api/japanese/route.js — GET/PUT sync API for the Japanese progress
// document. PUT merges the incoming state against whatever is already in
// Redis, since two devices can each add distinct progress that must both
// survive -- see lib/japanese/syncMerge.js for the section-by-section merge
// rules.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getJapaneseRecord, setJapaneseRecord } from '../../../lib/japanese/kv';
import { mergeSyncState, normalizeSyncState } from '../../../lib/japanese/syncMerge';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getJapaneseRecord(email);
  if (!record) {
    return NextResponse.json({ state: normalizeSyncState(null), updatedAt: 0 });
  }
  return NextResponse.json({ state: normalizeSyncState(record.state), updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }

  const current = await getJapaneseRecord(email);
  const merged = mergeSyncState(current?.state, body.state);
  const updatedAt = Date.now();
  await setJapaneseRecord(email, merged, updatedAt);
  return NextResponse.json({ ok: true, state: merged, updatedAt });
}
