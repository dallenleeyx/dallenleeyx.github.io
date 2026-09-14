// app/api/jobs/route.js — GET/PUT sync API for the Jobs record, same shape
// as app/api/math/route.js. PUT merges against whatever's already in
// Redis -- see lib/jobs/syncMerge.js.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getJobsRecord, setJobsRecord } from '../../../lib/jobs/kv';
import { mergeJobsState, normalizeJobsState } from '../../../lib/jobs/syncMerge';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getJobsRecord(email);
  if (!record) {
    return NextResponse.json({ state: normalizeJobsState(null), updatedAt: 0 });
  }
  return NextResponse.json({ state: normalizeJobsState(record.state), updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }

  const current = await getJobsRecord(email);
  const merged = mergeJobsState(current?.state, body.state);
  const updatedAt = Date.now();
  await setJobsRecord(email, merged, updatedAt);
  return NextResponse.json({ ok: true, state: merged, updatedAt });
}
