// lib/dashboard/claude.js — one shared Anthropic client for the Dashboard's
// four call sites (plan generation, the assistant, the two cron reports),
// mirroring lib/kv.js's lazy-singleton shape for the Redis client.
import Anthropic from '@anthropic-ai/sdk';

let client;

export function getClaudeClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

// One place to change the model for every Dashboard Claude call.
export const CLAUDE_MODEL = 'claude-sonnet-5';
