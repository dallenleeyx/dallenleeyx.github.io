// app/api/dashboard/assistant/route.js — the "Claude voice" chat backend.
// Streaming (unlike the other three Claude call sites here): this is the
// one interactive, user-watching call, paired with voice, so a dead
// multi-second silence before any text appears would be the worst UX of
// all four. Stateless: the client keeps a short rolling history and sends
// it each turn, matching this app's existing no-server-session-state
// pattern (auth aside).
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import { auth } from '../../../../lib/auth';
import { getClaudeClient, CLAUDE_MODEL, CLAUDE_MODEL_FAST } from '../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../lib/dashboard/context';
import { appendMemoryEntries } from '../../../../lib/dashboard/memoryKv';

const LEARNING_SCHEMA = {
  type: 'object',
  properties: {
    learnings: {
      type: 'array',
      items: { type: 'string' },
      description: '0-2 short, durable observations about Dallen worth remembering long-term from this exchange (patterns, preferences, weak spots) -- empty if this exchange revealed nothing genuinely new.',
    },
  },
  required: ['learnings'],
};

// Fire a cheap Haiku call to distill anything worth remembering from this
// exchange, now that memory's only writers (the cron reports) are gone --
// the assistant is the sole source of "learning" now. Best-effort: never
// lets a memory-extraction failure surface as a chat error.
async function extractAndSaveLearnings(client, email, userMessage, replyText) {
  try {
    const result = await client.messages.parse({
      model: CLAUDE_MODEL_FAST,
      max_tokens: 256,
      system: 'Distill durable observations about Dallen from one chat exchange. Respond only with the requested structured output.',
      messages: [{
        role: 'user',
        content: `Dallen asked: ${userMessage}\n\nThe assistant replied: ${replyText}`,
      }],
      output_config: { format: jsonSchemaOutputFormat(LEARNING_SCHEMA) },
    });
    const learnings = result.parsed_output?.learnings;
    if (learnings?.length) {
      await appendMemoryEntries(email, learnings.map((text) => ({ text, source: 'assistant' })));
    }
  } catch (e) {
    console.error('Memory extraction failed:', e);
  }
}

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

  let context;
  try {
    context = await buildStudyContext(email);
  } catch (e) {
    console.error('buildStudyContext failed:', e);
    return new Response(JSON.stringify({ error: 'failed to load context' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }

  // Split into two system blocks so the (larger, semi-stable) context JSON
  // can be cached separately from the always-identical instructions --
  // repeat chat messages within the cache window then only pay the ~10%
  // cached-read rate on this block instead of full input price each time.
  const systemPrompt = [
    {
      type: 'text',
      text: [
        "You are Dallen's personal study assistant, embedded on his own website's Dashboard.",
        'You know his real courses, assignments, Japanese study progress, 6-month goal plan, and',
        'what you\'ve learned about him from past reports/conversations -- here it all is as JSON:',
        JSON.stringify(context, null, 2),
      ].join('\n'),
      cache_control: { type: 'ephemeral', ttl: '1h' },
    },
    {
      type: 'text',
      text: [
        'Answer naturally and concisely, grounded in the above. If asked something genuinely outside',
        "this context, say so plainly rather than guessing. You're speaking directly to Dallen.",
      ].join('\n'),
    },
  ];

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
        const final = await claudeStream.finalMessage();
        const replyText = final.content?.filter((b) => b.type === 'text').map((b) => b.text).join('') || '';
        await extractAndSaveLearnings(client, email, message, replyText);
        controller.close();
      } catch (e) {
        console.error('Assistant stream failed:', e);
        controller.error(e);
      }
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
