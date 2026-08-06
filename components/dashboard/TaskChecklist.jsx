'use client';
// components/dashboard/TaskChecklist.jsx — the Dashboard's interactive
// checklist: math assignments (checking one sets it done via the same
// setCourses used by /math, so it's the same LWW-synced document, not a
// separate copy) and today's Japanese tasks (checking one calls the exact
// same toggleTaskDone/toggleHabitDone /japanese itself uses, so the merge
// semantics in lib/japanese/syncMerge.js apply identically). Both writes
// are visible on their own pages within a few seconds via their normal
// poll loops -- there's no separate "Dashboard state" to drift from them.
import { useRouter } from 'next/navigation';
import { usePlan } from '../../lib/japanese/PlanContext';
import { VOCAB_DATA } from '../../lib/japanese/data/vocab';
import { GRAMMAR_DATA } from '../../lib/japanese/data/grammar';
import { buildLessonQueue, nextUndone, planPhase, todayISO, taskKey, REVIEW_HABITS } from '../../lib/japanese/timeline';

const LEVEL_LABEL = { N4: 'N4', N3: 'N3' };
const formatLesson = (t) => `${t.kind === 'vocab' ? 'Vocab' : 'Grammar'} — ${LEVEL_LABEL[t.level] || t.level} Lesson ${t.lesson}`;

export function TaskChecklist({ courses, setCourses }) {
  const router = useRouter();
  const { plan, planDone, planDaily, toggleTaskDone, toggleHabitDone } = usePlan();
  const today = todayISO();

  const activeCourses = courses.filter((c) => !c.archived);
  const mathPending = activeCourses
    .flatMap((c) => c.assignments.filter((a) => a.status !== 'done').map((a) => ({ ...a, course: c })))
    .sort((x, y) => (x.due || '9999').localeCompare(y.due || '9999'))
    .slice(0, 10);

  const markMathDone = (courseId, assignmentId) => {
    setCourses((cs) => cs.map((c) => (
      c.id !== courseId ? c : { ...c, assignments: c.assignments.map((a) => (a.id !== assignmentId ? a : { ...a, status: 'done' })) }
    )));
  };

  const phase = planPhase(plan, today);
  let japaneseItems = [];
  if (phase === 'learn') {
    const vocabQueue = buildLessonQueue(VOCAB_DATA, 'vocab');
    const grammarQueue = buildLessonQueue(GRAMMAR_DATA, 'grammar');
    japaneseItems = [
      ...nextUndone(vocabQueue, planDone, plan.vocabPerDay || 3),
      ...nextUndone(grammarQueue, planDone, plan.grammarPerDay || 2),
    ].map((task) => ({
      key: taskKey(task),
      label: formatLesson(task),
      onToggle: () => toggleTaskDone(task, taskKey(task)),
    }));
  } else if (phase === 'review') {
    const doneToday = planDaily[today] || {};
    japaneseItems = REVIEW_HABITS.map((h) => ({
      key: h.id,
      label: h.label,
      done: !!doneToday[h.id],
      onToggle: () => toggleHabitDone(h.id),
    }));
  }

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Checklist</span>
      </div>

      <div className="dash-task-group">
        <div className="dash-task-group-label">Math</div>
        {mathPending.length === 0 ? (
          <p className="tk-note-p tk-note-empty">Nothing pending.</p>
        ) : (
          mathPending.map((a) => (
            <label key={a.id} className="dash-check-item">
              <input type="checkbox" checked={false} onChange={() => markMathDone(a.course.id, a.id)} />
              <span className="dash-check-label" onClick={() => router.push(`/math?course=${a.course.id}`)}>{a.title}</span>
              <span className="dash-task-course">{a.course.glyph}</span>
              {a.due && <span className="dash-task-date">{a.due.slice(5)}</span>}
            </label>
          ))
        )}
      </div>

      <div className="dash-task-group">
        <div className="dash-task-group-label">Japanese — {phase === 'learn' ? 'today' : phase === 'review' ? 'review habits' : 'plan finished'}</div>
        {phase === 'done' ? (
          <p className="tk-note-p tk-note-empty">Study plan finished — nice work.</p>
        ) : japaneseItems.length === 0 ? (
          <p className="tk-note-p tk-note-empty">All caught up.</p>
        ) : (
          japaneseItems.map((it) => (
            <label key={it.key} className="dash-check-item">
              <input type="checkbox" checked={!!it.done} onChange={it.onToggle} />
              <span className="dash-check-label" onClick={() => router.push('/japanese')}>{it.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
