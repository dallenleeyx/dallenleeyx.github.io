// app/api/math/route.js — GET/PUT sync API for the Math record, same shape
// as app/api/japanese/route.js and app/api/fitness/route.js. PUT merges
// against whatever's already in Redis -- see lib/math/syncMerge.js.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getMathRecord, setMathRecord } from '../../../lib/math/kv';
import { mergeMathState, normalizeMathState } from '../../../lib/math/syncMerge';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getMathRecord(email);
  if (!record) {
    return NextResponse.json({ state: normalizeMathState(null), updatedAt: 0 });
  }
  return NextResponse.json({ state: normalizeMathState(record.state), updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }

  const current = await getMathRecord(email);
  const merged = mergeMathState(current?.state, body.state);
  const updatedAt = Date.now();
  await setMathRecord(email, merged, updatedAt);
  return NextResponse.json({ ok: true, state: merged, updatedAt });
}
