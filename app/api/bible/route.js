// app/api/bible/route.js — GET/PUT sync API for the `bible` document.
// Middleware already gates all non-auth routes, but re-check the session
// email here too as defense-in-depth (mirrors app/api/data/route.js).
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getBibleRecord, setBibleRecord } from '../../../lib/bible/kv';

const EMPTY_STATE = { notes: {}, completed: {}, current: null, versionId: null };

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
    return NextResponse.json({ state: EMPTY_STATE, updatedAt: 0 });
  }
  return NextResponse.json({ state: record.state, updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.state || typeof body.state !== 'object') {
    return NextResponse.json({ error: 'state must be an object' }, { status: 400 });
  }
  const updatedAt = body.updatedAt || Date.now();
  await setBibleRecord(email, body.state, updatedAt);
  return NextResponse.json({ ok: true, updatedAt });
}
