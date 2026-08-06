// app/api/dashboard/tts/route.js — English TTS for the assistant's
// speak-on-demand replies. Structurally identical to
// app/api/japanese/tts/route.js, reusing the same GOOGLE_TTS_API_KEY
// (no new env var) with an English Neural2 voice instead.
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

const DEFAULT_VOICE = 'en-US-Neural2-F';

export async function GET(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_TTS_API_KEY is not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const rawText = searchParams.get('text');
  const voice = searchParams.get('voice') || DEFAULT_VOICE;
  if (!rawText || !rawText.trim()) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  // Google's synthesize endpoint caps input around 5000 bytes -- assistant
  // replies (unlike short vocab words) can run long enough to hit that.
  const text = rawText.length > 4500 ? rawText.slice(0, 4500) : rawText;

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', name: voice },
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
