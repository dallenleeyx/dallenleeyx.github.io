// app/api/bible/route.js — GET/PUT sync API for the Bible record, same
// shape as app/api/math/route.js. PUT merges against whatever's already in
// Redis -- see lib/bible/syncMerge.js.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getBibleRecord, setBibleRecord } from '../../../lib/bible/kv';
import { mergeBibleState, normalizeBibleState } from '../../../lib/bible/syncMerge';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getBibleRecord(email);
  if (!record) {
    return NextResponse.json({ state: normalizeBibleState(null), updatedAt: 0 });
  }
  return NextResponse.json({ state: normalizeBibleState(record.state), updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }

  const current = await getBibleRecord(email);
  const merged = mergeBibleState(current?.state, body.state);
  const updatedAt = Date.now();
  await setBibleRecord(email, merged, updatedAt);
  return NextResponse.json({ ok: true, state: merged, updatedAt });
}
