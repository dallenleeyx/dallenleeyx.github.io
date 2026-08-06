// app/api/cron/evening-report/route.js — Vercel Cron hits this at 10pm
// SGT (see vercel.json). Same CRON_SECRET gating as morning-report.
// Explicitly does NOT write to goalplan:<email> -- suggestedChanges are
// stored/displayed only in v1, never auto-applied (see the plan doc's
// deliberately-deferred "apply" action).
import { NextResponse } from 'next/server';
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import { getClaudeClient, CLAUDE_MODEL } from '../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../lib/dashboard/context';
import { setReportForDate } from '../../../../lib/dashboard/reportsKv';
import { appendMemoryEntries } from '../../../../lib/dashboard/memoryKv';
import { todayISO } from '../../../../lib/japanese/timeline';

const EVENING_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'Markdown evening wrap-up: what happened today.' },
    assessment: { type: 'string', enum: ['good', 'on_track', 'behind'], description: 'Overall assessment of today against the 6-month plan.' },
    suggestedChanges: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['pace', 'milestoneDate', 'other'] },
          targetId: { type: 'string', description: 'The milestone/target id this concerns, or empty string if general.' },
          description: { type: 'string' },
          rationale: { type: 'string' },
        },
        required: ['id', 'type', 'targetId', 'description', 'rationale'],
      },
    },
    learnings: {
      type: 'array',
      items: { type: 'string' },
      description: '0-3 short, durable observations about Dallen worth remembering long-term.',
    },
  },
  required: ['summary', 'assessment', 'suggestedChanges', 'learnings'],
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

  try {
    const context = await buildStudyContext(email);

    const userPrompt = [
      "Here is Dallen's current situation, as JSON:",
      JSON.stringify(context, null, 2),
      '',
      'Write tonight\'s wrap-up. Note: math assignments only carry a',
      "done/not-done status with no completion timestamp, so you can say",
      'an assignment is "still pending" but not confidently that it was',
      '"finished today" specifically -- Japanese does track per-day',
      'progress, so be concrete there. Assess whether today, and the recent',
      'trend, is on track for the 6-month plan\'s targets, and suggest any',
      'concrete revisions to the plan if genuinely warranted (don\'t suggest',
      'changes just to have something to say).',
    ].join('\n');

    const client = getClaudeClient();
    const message = await client.messages.parse({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: "You are Dallen's personal study assistant, writing his daily evening wrap-up.",
      messages: [{ role: 'user', content: userPrompt }],
      output_config: { format: jsonSchemaOutputFormat(EVENING_SCHEMA) },
    });
    const parsed = message.parsed_output;
    if (!parsed) throw new Error('no parsed_output in response');

    await setReportForDate(email, todayISO(), 'evening', {
      text: parsed.summary,
      assessment: parsed.assessment,
      suggestedChanges: parsed.suggestedChanges || [],
      generatedAt: Date.now(),
    });
    if (parsed.learnings?.length) {
      await appendMemoryEntries(email, parsed.learnings.map((text) => ({ text, source: 'evening-report' })));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Evening report generation failed:', e);
    return NextResponse.json({ error: 'generation failed' }, { status: 502 });
  }
}
