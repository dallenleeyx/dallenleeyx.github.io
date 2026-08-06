// app/api/dashboard/reports/route.js — GET-only. Reports are written by
// the two cron routes (app/api/cron/*) directly via lib/dashboard/reportsKv's
// setReportForDate, never through this route -- there is no PUT here.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { getReportsRecord } from '../../../../lib/dashboard/reportsKv';

const RETURNED_DAYS = 14;

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const record = await getReportsRecord(email);
  if (!record) {
    return NextResponse.json({ reports: {}, updatedAt: 0 });
  }
  const recentDates = Object.keys(record.reports).sort().slice(-RETURNED_DAYS);
  const reports = {};
  recentDates.forEach((d) => { reports[d] = record.reports[d]; });
  return NextResponse.json({ reports, updatedAt: record.updatedAt });
}
