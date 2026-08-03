// app/api/japanese/dictionary/route.js — thin server-side proxy to Jisho's
// public word-search API (jisho.org doesn't send CORS headers, so the
// browser can't call it directly, and it needs no API key -- it's the same
// free, unauthenticated JSON endpoint the Jisho web UI itself calls).
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

const MAX_RESULTS = 20;

export async function GET(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ error: 'q is required' }, { status: 400 });

  try {
    const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`Jisho responded ${res.status}`);
    const data = await res.json();
    const results = (data.data || []).slice(0, MAX_RESULTS).map((entry) => {
      const japanese = (entry.japanese && entry.japanese[0]) || {};
      return {
        word: japanese.word || japanese.reading || q,
        reading: japanese.reading || '',
        jlpt: (entry.jlpt || []).map((lvl) => lvl.replace('jlpt-', '').toUpperCase()),
        isCommon: !!entry.is_common,
        senses: (entry.senses || []).map((s) => ({
          englishDefinitions: s.english_definitions || [],
          partsOfSpeech: s.parts_of_speech || [],
        })),
      };
    });
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ error: 'failed to reach the dictionary service' }, { status: 502 });
  }
}
