// app/api/dashboard/plan/generate/route.js — (re)generates the 6-month
// goal plan from Claude, grounded in buildStudyContext's snapshot of
// Dallen's real courses/assignments/Japanese progress/accumulated
// learnings. Forces structured JSON output (via the SDK's
// jsonSchemaOutputFormat + messages.parse) so the result is reliably
// parseable, not free prose the app would have to guess how to render.
// Non-streaming: this is a bounded one-shot call with nobody watching
// tokens arrive, unlike the assistant chat route.
import { NextResponse } from 'next/server';
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import { auth } from '../../../../../lib/auth';
import { getClaudeClient, CLAUDE_MODEL } from '../../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../../lib/dashboard/context';
import { getGoalPlanRecord, setGoalPlanRecord } from '../../../../../lib/dashboard/planKv';

async function requireEmail() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || email !== process.env.ALLOWED_EMAIL) return null;
  return email;
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    jlptExamDate: { type: 'string', description: 'ISO date (YYYY-MM-DD), or empty string if unknown.' },
    courseTargets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          courseId: { type: 'string' },
          courseTitle: { type: 'string' },
          targetGrade: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['courseId', 'courseTitle', 'targetGrade', 'notes'],
      },
    },
    milestones: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          date: { type: 'string', description: 'ISO date (YYYY-MM-DD).' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string', enum: ['math', 'japanese', 'general'] },
          done: { type: 'boolean' },
        },
        required: ['id', 'date', 'title', 'description', 'category', 'done'],
      },
    },
    narrative: { type: 'string', description: 'A markdown write-up of the overall strategy.' },
  },
  required: ['jlptExamDate', 'courseTargets', 'milestones', 'narrative'],
};

export async function POST(request) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const { jlptExamDate, courseTargets, notes } = body || {};

  const context = await buildStudyContext(email);

  const userPrompt = [
    "Here is Dallen's current situation, as JSON:",
    JSON.stringify(context, null, 2),
    '',
    'He wants a 6-month study plan. His stated inputs:',
    `- JLPT exam date: ${jlptExamDate || '(not given -- infer from context or leave blank)'}`,
    `- Per-course target grades: ${JSON.stringify(courseTargets || [])}`,
    notes ? `- Extra notes from Dallen: ${notes}` : '',
    '',
    'Produce a concrete, realistic 6-month plan: a handful of dated',
    'milestones spread across his math courses and Japanese study (tagged',
    "by category), the course targets carried through (fill in each course's",
    'courseId/courseTitle from the courses list above), and a narrative',
    'explaining the overall strategy to hit his target grades and pass the',
    "JLPT exam. Be specific and grounded in what's actually in his",
    'schedule/plan above -- not generic study advice.',
  ].filter(Boolean).join('\n');

  try {
    const client = getClaudeClient();
    const message = await client.messages.parse({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: "You are Dallen's study-planning assistant. You know his real course load, assignments, and Japanese study progress. Respond only with the requested structured plan.",
      messages: [{ role: 'user', content: userPrompt }],
      output_config: { format: jsonSchemaOutputFormat(PLAN_SCHEMA) },
    });
    const parsed = message.parsed_output;
    if (!parsed) throw new Error('no parsed_output in response');

    const existing = await getGoalPlanRecord(email);
    const now = Date.now();
    const plan = {
      createdAt: existing?.plan?.createdAt || now,
      jlptExamDate: parsed.jlptExamDate || null,
      courseTargets: parsed.courseTargets || [],
      milestones: parsed.milestones || [],
      narrative: parsed.narrative || '',
      generatedAt: now,
      generatedByModel: CLAUDE_MODEL,
    };
    const record = await setGoalPlanRecord(email, plan, now);
    return NextResponse.json({ plan: record.plan, updatedAt: record.updatedAt });
  } catch (e) {
    console.error('Plan generation failed:', e);
    return NextResponse.json({ error: 'Plan generation failed' }, { status: 502 });
  }
}
