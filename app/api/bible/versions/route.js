// app/api/bible/versions/route.js — thin server-side proxy to api.bible's
// own bible-version list, so BIBLE_API_KEY never reaches the client bundle.
// Requires the caller's own session (this app is single-user, but the key
// is a shared secret worth gating behind auth like everything else here).
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BIBLE_API_KEY is not configured' }, { status: 503 });
  }

  try {
    const res = await fetch('https://api.scripture.api.bible/v1/bibles?language=eng', {
      headers: { 'api-key': apiKey },
    });
    if (!res.ok) throw new Error(`api.bible responded ${res.status}`);
    const body = await res.json();
    const versions = (body.data || []).map((b) => ({
      id: b.id,
      name: b.name,
      abbreviation: b.abbreviationLocal || b.abbreviation,
    }));
    return NextResponse.json({ versions });
  } catch (e) {
    return NextResponse.json({ error: 'failed to reach api.bible' }, { status: 502 });
  }
}
