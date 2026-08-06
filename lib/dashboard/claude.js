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
// Sonnet is reserved for calls Dallen actually reads/watches (chat) or that
// need real strategic reasoning (plan generation) -- budget math showed
// running every call, especially high-volume/background ones, on Sonnet
// blows past a $10/month cap fast. Haiku is 3x cheaper on both input and
// output and is plenty for grounded, data-driven writing (reports,
// autonomous checks) where the task is "summarize this JSON," not
// open-ended reasoning.
export const CLAUDE_MODEL = 'claude-sonnet-5';
export const CLAUDE_MODEL_FAST = 'claude-haiku-4-5-20251001';
