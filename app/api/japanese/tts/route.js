// app/api/japanese/tts/route.js — thin server-side proxy to Google Cloud
// Text-to-Speech, so GOOGLE_TTS_API_KEY stays server-only (the same
// keep-the-key-server-only shape as app/api/japanese/dictionary/route.js
// for Jisho). Returns raw MP3 bytes directly (not JSON-wrapped base64) so
// the client can just point an <audio> element/Audio() object at this
// route's response with no extra decoding step.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

// Neural2 is Google's newest, most natural Japanese voice tier (vs the
// older, more robotic Standard tier) -- a female voice by default, as a
// reasonable single default rather than exposing every voice choice.
const DEFAULT_VOICE = 'ja-JP-Neural2-B';

export async function GET(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_TTS_API_KEY is not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const voice = searchParams.get('voice') || DEFAULT_VOICE;
  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'ja-JP', name: voice },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      throw new Error(detail?.error?.message || `Google TTS responded ${res.status}`);
    }
    const { audioContent } = await res.json();
    const audioBytes = Buffer.from(audioContent, 'base64');
    return new NextResponse(audioBytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'failed to reach Google Cloud TTS' }, { status: 502 });
  }
}
