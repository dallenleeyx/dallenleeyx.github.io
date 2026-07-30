// app/api/bible/passage/route.js — thin server-side proxy to api.bible's
// chapter-content endpoint. BIBLE_API_KEY stays server-only; this route
// fetches on the signed-in user's behalf and returns just the text needed
// to render, using content-type=text (no embedded HTML) to keep the
// response trivial to render safely on the client.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { chapterId } from '../../../../lib/bible/usfm';

export async function GET(request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BIBLE_API_KEY is not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const bibleId = searchParams.get('bibleId');
  const bookId = searchParams.get('bookId');
  const chapter = searchParams.get('chapter');
  const cid = chapterId(bookId, chapter);
  if (!bibleId || !cid) {
    return NextResponse.json({ error: 'bibleId, bookId and chapter are required' }, { status: 400 });
  }

  try {
    const url = `https://api.scripture.api.bible/v1/bibles/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(cid)}`
      + '?content-type=text&include-notes=false&include-titles=true&include-verse-numbers=true';
    const res = await fetch(url, { headers: { 'api-key': apiKey } });
    if (!res.ok) throw new Error(`api.bible responded ${res.status}`);
    const body = await res.json();
    const data = body.data || {};
    return NextResponse.json({
      reference: data.reference,
      content: data.content,
      copyright: data.copyright || null,
    });
  } catch (e) {
    return NextResponse.json({ error: 'failed to reach api.bible' }, { status: 502 });
  }
}
