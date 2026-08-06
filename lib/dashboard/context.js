// lib/dashboard/context.js — assembles one compact "what's going on"
// snapshot, reused by every Claude call site on the Dashboard (plan
// generation, the assistant, and both cron reports) so their context can't
// drift apart by construction. Pure data assembly -- no Claude call here.
import { getCoursesRecord } from '../kv';
import { getUpcomingDueAssignments, getWeekDueAssignments } from '../schedule';
import { getJapaneseRecord } from '../japanese/kv';
import { normalizeSyncState } from '../japanese/syncMerge';
import { VOCAB_DATA } from '../japanese/data/vocab';
import { GRAMMAR_DATA } from '../japanese/data/grammar';
import { buildLessonQueue, nextUndone, planPhase, todayISO, defaultPlan, REVIEW_HABITS } from '../japanese/timeline';
import { getGoalPlanRecord } from './planKv';
import { getMemoryRecord } from './memoryKv';

export async function buildStudyContext(email) {
  const [coursesRecord, japaneseRecord, goalPlanRecord, memoryRecord] = await Promise.all([
    getCoursesRecord(email),
    getJapaneseRecord(email),
    getGoalPlanRecord(email),
    getMemoryRecord(email),
  ]);

  const courses = coursesRecord?.courses || [];
  const now = new Date();
  const today = todayISO(now);

  const upcomingAssignments = getUpcomingDueAssignments(courses, now, 30)
    .slice(0, 20)
    .map((a) => ({ title: a.title, date: a.date, course: a.course.name }));
  const weekAssignments = getWeekDueAssignments(courses, now)
    .map((a) => ({ title: a.title, date: a.date, course: a.course.name }));

  const state = normalizeSyncState(japaneseRecord?.state);
  const plan = Object.keys(state.planBundle.plan || {}).length ? state.planBundle.plan : defaultPlan();
  const planDone = state.planBundle.planDone;
  const phase = planPhase(plan, today);

  let japaneseToday;
  if (phase === 'learn') {
    const vocabQueue = buildLessonQueue(VOCAB_DATA, 'vocab');
    const grammarQueue = buildLessonQueue(GRAMMAR_DATA, 'grammar');
    japaneseToday = {
      phase,
      nextVocabLessons: nextUndone(vocabQueue, planDone, plan.vocabPerDay || 3),
      nextGrammarLessons: nextUndone(grammarQueue, planDone, plan.grammarPerDay || 2),
    };
  } else if (phase === 'review') {
    // Recurring daily habits, not lesson-queue items -- no per-day "done"
    // signal exists for these (see lib/japanese/timeline.js's own comment
    // on REVIEW_HABITS), so just list what they're meant to check today
    // rather than claiming to know completion state.
    japaneseToday = { phase, habits: REVIEW_HABITS.map((h) => h.label) };
  } else {
    japaneseToday = { phase };
  }

  return {
    today,
    courses: courses.map((c) => ({ id: c.id, name: c.name, code: c.code })),
    upcomingAssignments,
    weekAssignments,
    japaneseToday,
    japaneseExamDate: plan.examDate,
    goalPlan: goalPlanRecord?.plan || null,
    // What's been learned about Dallen across past reports/conversations --
    // most-recent-first so a truncated prompt still keeps the freshest
    // observations over stale ones.
    learnings: (memoryRecord?.entries || [])
      .slice()
      .reverse()
      .slice(0, 40)
      .map((e) => e.text),
  };
}
