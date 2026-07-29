// app/api/data/route.js — GET/PUT sync API for the `courses` document.
// Middleware already gates all non-auth routes, but re-check the session
// email here too as defense-in-depth.
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { getCoursesRecord, setCoursesRecord } from '../../../lib/kv';
import { TRACKER_SEED } from '../../../lib/seed-data';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getCoursesRecord(email);
  if (!record) {
    return NextResponse.json({ courses: TRACKER_SEED, updatedAt: 0, seeded: true });
  }
  return NextResponse.json({ courses: record.courses, updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!Array.isArray(body?.courses)) {
    return NextResponse.json({ error: 'courses must be an array' }, { status: 400 });
  }
  const updatedAt = body.updatedAt || Date.now();
  await setCoursesRecord(email, body.courses, updatedAt);
  return NextResponse.json({ ok: true, updatedAt });
}
