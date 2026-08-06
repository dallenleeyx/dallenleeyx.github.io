// app/api/dashboard/assistant/route.js — the "Claude voice" chat backend.
// Streaming (unlike the other three Claude call sites here): this is the
// one interactive, user-watching call, paired with voice, so a dead
// multi-second silence before any text appears would be the worst UX of
// all four. Stateless: the client keeps a short rolling history and sends
// it each turn, matching this app's existing no-server-session-state
// pattern (auth aside).
import { auth } from '../../../../lib/auth';
import { getClaudeClient, CLAUDE_MODEL } from '../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../lib/dashboard/context';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

export async function POST(request) {
  const email = await requireEmail();
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const body = await request.json().catch(() => ({}));
  const message = String(body?.message || '').trim();
  const history = Array.isArray(body?.history) ? body.history : [];
  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const context = await buildStudyContext(email);
  const systemPrompt = [
    "You are Dallen's personal study assistant, embedded on his own website's Dashboard.",
    'You know his real courses, assignments, Japanese study progress, 6-month goal plan, and',
    'what you\'ve learned about him from past reports/conversations -- here it all is as JSON:',
    JSON.stringify(context, null, 2),
    '',
    'Answer naturally and concisely, grounded in the above. If asked something genuinely outside',
    "this context, say so plainly rather than guessing. You're speaking directly to Dallen.",
  ].join('\n');

  const messages = [
    ...history.slice(-10).map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '') })),
    { role: 'user', content: message },
  ];

  const client = getClaudeClient();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const claudeStream = client.messages.stream({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      });
      claudeStream.on('text', (delta) => {
        controller.enqueue(encoder.encode(delta));
      });
      claudeStream.on('error', (err) => {
        console.error('Assistant stream error:', err);
        controller.error(err);
      });
      try {
        await claudeStream.finalMessage();
        controller.close();
      } catch (e) {
        console.error('Assistant stream failed:', e);
        controller.error(e);
      }
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
