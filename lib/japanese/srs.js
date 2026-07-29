// lib/japanese/srs.js — pure SM-2-lite scheduler for Grammar Practice. One
// record per question id: { ease, interval (days), due (ms epoch), reps,
// lapses }. A correct answer stretches the gap to the next showing by the
// card's own ease factor; a miss resets the card to "due now" and drops its
// ease, so questions you keep missing come back sooner than ones you know
// cold. `now` is always passed in explicitly rather than read internally, so
// this is testable without mocking Date.now().

export const DAY_MS = 24 * 60 * 60 * 1000;

// Schedule off the FIRST answer only -- the second exposure in the same run
// is reinforcement, not an honest recall test, and must not reschedule the
// card. Callers are responsible for only calling this once per question per
// run (see useGrammarPractice's isFirstAttempt gating).
export function scheduleCard(rec, isCorrect, now) {
  const next = rec ? { ...rec } : { ease: 2.5, interval: 0, reps: 0, lapses: 0 };
  if (isCorrect) {
    next.reps += 1;
    if (next.reps === 1) next.interval = 1;
    else if (next.reps === 2) next.interval = 3;
    else next.interval = Math.round(next.interval * next.ease);
    next.ease = Math.min(2.8, next.ease + 0.1);
  } else {
    next.reps = 0;
    next.lapses += 1;
    next.interval = 0; // back in the pile for the next session
    next.ease = Math.max(1.3, next.ease - 0.2);
  }
  next.due = now + next.interval * DAY_MS;
  return next;
}

export function isDue(rec, now) {
  if (!rec) return true; // never seen -- new cards are always fair game
  return rec.due <= now;
}

export function isNew(rec) {
  return !rec;
}
