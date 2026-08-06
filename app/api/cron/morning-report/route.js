// app/api/cron/morning-report/route.js — Vercel Cron hits this at 9am SGT
// (see vercel.json). Not requireEmail()-gated -- there's no user session
// on a cron request; Vercel Cron sends `Authorization: Bearer
// $CRON_SECRET` instead (single-user app, so ALLOWED_EMAIL is the target
// directly, no lookup needed).
import { NextResponse } from 'next/server';
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import { getClaudeClient, CLAUDE_MODEL } from '../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../lib/dashboard/context';
import { setReportForDate } from '../../../../lib/dashboard/reportsKv';
import { appendMemoryEntries } from '../../../../lib/dashboard/memoryKv';
import { todayISO } from '../../../../lib/japanese/timeline';

const MORNING_SCHEMA = {
  type: 'object',
  properties: {
    text: { type: 'string', description: 'Concise, encouraging, actionable markdown morning brief.' },
    learnings: {
      type: 'array',
      items: { type: 'string' },
      description: '0-3 short, durable observations about Dallen worth remembering long-term (patterns, preferences, weak spots) -- not just a restatement of today\'s tasks.',
    },
  },
  required: ['text', 'learnings'],
};

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 503 });
  }

  const email = process.env.ALLOWED_EMAIL;
  const context = await buildStudyContext(email);

  const userPrompt = [
    "Here is Dallen's current situation, as JSON:",
    JSON.stringify(context, null, 2),
    '',
    "Write today's morning brief: what he should focus on today, tied",
    'explicitly to his 6-month plan and what\'s actually due/next. Be',
    'specific, concise, and encouraging -- not generic study advice.',
  ].join('\n');

  try {
    const client = getClaudeClient();
    const message = await client.messages.parse({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: "You are Dallen's personal study assistant, writing his daily morning brief.",
      messages: [{ role: 'user', content: userPrompt }],
      output_config: { format: jsonSchemaOutputFormat(MORNING_SCHEMA) },
    });
    const parsed = message.parsed_output;
    if (!parsed) throw new Error('no parsed_output in response');

    await setReportForDate(email, todayISO(), 'morning', { text: parsed.text, generatedAt: Date.now() });
    if (parsed.learnings?.length) {
      await appendMemoryEntries(email, parsed.learnings.map((text) => ({ text, source: 'morning-report' })));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Morning report generation failed:', e);
    return NextResponse.json({ error: 'generation failed' }, { status: 502 });
  }
}
