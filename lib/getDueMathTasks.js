// lib/getDueMathTasks.js — the math side's half of the combined Dashboard
// "due today" contract, matching lib/japanese/timeline.js's getDueToday
// shape exactly: a plain array of { id, kind, label, level, lesson, count }
// (level/lesson are Japanese-only, always null here) plus a `due` ISO date
// the Dashboard sorts on. Today's Math dashboard computes "upcoming" inline
// rather than as a reusable function -- this gives it the same contract so
// the combined Dashboard can just concat and sort both arrays.
//
// Limited to overdue + due within the next 7 days (matching the Home tab's
// own week-ahead window) rather than every undone assignment for the whole
// semester, which the Math dashboard's own "Assignments" list already shows
// in full -- the combined Dashboard is for "what needs attention now".
export function getDueMathTasks(courses, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const items = [];
  (courses || []).forEach((course) => {
    (course.assignments || []).forEach((a) => {
      if (a.status === 'done' || !a.due) return;
      const diff = Math.round((new Date(a.due + 'T00:00:00') - today) / 86400000);
      if (diff > 7) return;
      items.push({
        id: `math:${course.id}:${a.id}`,
        kind: 'math',
        label: `${course.nickname}: ${a.title}`,
        level: null,
        lesson: null,
        count: 1,
        due: a.due,
      });
    });
  });
  return items.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
}
