// app/api/cron/reminder-check/route.js — the autonomous reminder checker.
// Not on Vercel Cron: Vercel's Hobby plan caps cron jobs at once/day, too
// coarse for "a few times a day," so this is instead triggered by a GitHub
// Actions scheduled workflow (.github/workflows/reminder-check.yml),
// mirroring the polling pattern already used for dallen_notes' sync
// Action. Same CRON_SECRET bearer-token gating as the site's other
// unattended routes.
import { NextResponse } from 'next/server';
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import { getClaudeClient, CLAUDE_MODEL_FAST } from '../../../../lib/dashboard/claude';
import { buildStudyContext } from '../../../../lib/dashboard/context';
import { getRecentReminders, logReminderSent } from '../../../../lib/dashboard/remindersKv';
import { sendTelegramMessage } from '../../../../lib/dashboard/telegram';
import { sendReminderEmail } from '../../../../lib/dashboard/email';

const REMINDER_SCHEMA = {
  type: 'object',
  properties: {
    shouldNotify: {
      type: 'boolean',
      description: 'True only if there is something genuinely worth interrupting Dallen for right now -- a real risk of missing a deadline, a multi-day stall, something time-sensitive. False if nothing has meaningfully changed since the last check or recent reminders already cover it.',
    },
    message: {
      type: 'string',
      description: 'A short (1-3 sentence), specific, actionable reminder. Empty string if shouldNotify is false.',
    },
  },
  required: ['shouldNotify', 'message'],
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
    const [context, recentReminders] = await Promise.all([
      buildStudyContext(email),
      getRecentReminders(email),
    ]);

    const userPrompt = [
      "Here is Dallen's current situation, as JSON:",
      JSON.stringify(context, null, 2),
      '',
      'Reminders already sent recently (do not repeat these unless the',
      'situation has clearly gotten worse since):',
      JSON.stringify(recentReminders.slice(-10).map((r) => r.text), null, 2),
      '',
      'Decide whether anything is worth proactively flagging right now.',
      'Default to staying quiet -- only notify for something genuinely',
      'time-sensitive or actionable, not a routine restatement of his task list.',
    ].join('\n');

    const client = getClaudeClient();
    const message = await client.messages.parse({
      model: CLAUDE_MODEL_FAST,
      max_tokens: 256,
      system: "You are Dallen's autonomous study assistant, deciding whether to send him a reminder.",
      messages: [{ role: 'user', content: userPrompt }],
      output_config: { format: jsonSchemaOutputFormat(REMINDER_SCHEMA) },
    });
    const parsed = message.parsed_output;
    if (!parsed) throw new Error('no parsed_output in response');

    if (!parsed.shouldNotify || !parsed.message) {
      return NextResponse.json({ ok: true, notified: false });
    }

    const results = await Promise.allSettled([
      sendTelegramMessage(parsed.message),
      sendReminderEmail('Dashboard reminder', parsed.message),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`Reminder channel ${i} failed:`, r.reason);
    });

    await logReminderSent(email, parsed.message);
    return NextResponse.json({ ok: true, notified: true });
  } catch (e) {
    console.error('Reminder check failed:', e);
    return NextResponse.json({ error: 'reminder check failed' }, { status: 502 });
  }
}
