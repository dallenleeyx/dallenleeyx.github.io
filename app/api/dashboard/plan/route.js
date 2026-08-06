// app/api/dashboard/plan/route.js — GET/PUT sync API for the `goalPlan`
// document. Structurally identical to app/api/data/route.js.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { getGoalPlanRecord, setGoalPlanRecord } from '../../../../lib/dashboard/planKv';
import { EMPTY_GOAL_PLAN } from '../../../../lib/dashboard/planSeed';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getGoalPlanRecord(email);
  if (!record) {
    return NextResponse.json({ plan: EMPTY_GOAL_PLAN, updatedAt: 0 });
  }
  return NextResponse.json({ plan: record.plan, updatedAt: record.updatedAt });
}

export async function PUT(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body?.plan || typeof body.plan !== 'object') {
    return NextResponse.json({ error: 'plan must be an object' }, { status: 400 });
  }
  const updatedAt = body.updatedAt || Date.now();
  await setGoalPlanRecord(email, body.plan, updatedAt);
  return NextResponse.json({ ok: true, updatedAt });
}
