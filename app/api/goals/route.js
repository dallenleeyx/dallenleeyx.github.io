// app/api/goals/route.js — GET/PUT sync API for the Dashboard's Goals
// widget. Last-write-wins, same as app/api/data/route.js -- a user-edited
// list of named target dates has no meaningful concurrent-edit case worth a
// merge (unlike the Japanese progress document, where two devices routinely
// add distinct progress that must both survive).
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getGoalsRecord, setGoalsRecord } from '../../../lib/goalsKv';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getGoalsRecord(email);
  if (!record) {
    return NextResponse.json({ goals: [], updatedAt: 0 });
  }
  return NextResponse.json({ goals: record.goals, updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!Array.isArray(body?.goals)) {
    return NextResponse.json({ error: 'goals must be an array' }, { status: 400 });
  }
  const updatedAt = body.updatedAt || Date.now();
  await setGoalsRecord(email, body.goals, updatedAt);
  return NextResponse.json({ ok: true, updatedAt });
}
