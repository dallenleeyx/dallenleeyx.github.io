// app/api/bible/passage/route.js — server-side passage lookup, used by both
// the Reader tab and the ref-preview popover. Gated the same way as every
// other API route on this site (single-user, ALLOWED_EMAIL) rather than
// left open, so a stray/scraped link can't burn through the ESV/NIV API
// quota for free -- see lib/bible/providers.js for the actual fetch logic
// and how it falls back to a free public-domain source until real keys are
// configured.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { parseRef } from '../../../../lib/bible/refs';
import { fetchPassage } from '../../../../lib/bible/providers';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function GET(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');
  const version = (searchParams.get('version') || 'ESV').toUpperCase();

  const parsed = parseRef(ref || '');
  if (!parsed) return NextResponse.json({ error: `Could not parse "${ref}" as a Bible reference` }, { status: 400 });

  const result = await fetchPassage(version, parsed);
  if (!result) return NextResponse.json({ error: 'Passage lookup failed' }, { status: 502 });

  return NextResponse.json({ ref: parsed.display, version, ...result });
}
