// lib/academicCalendar.js — NUS AY2026/2027 academic calendar (both
// semesters), sourced from the official NUS Registrar calendar. Powers the
// Dashboard's "which week is it" banner. Update SEMESTERS once NUS
// publishes AY2027/2028 dates (semester 2 here ends 8 May 2027).
function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// 6 teaching weeks, then (via the caller) a recess week, then 7 more
// teaching weeks (13 total) -- the standard NUS semester shape.
function buildWeeks(startISO, count, label, firstWeekNum) {
  const weeks = [];
  for (let i = 0; i < count; i++) {
    weeks.push({
      label: `${label} — Week ${firstWeekNum + i}`,
      start: addDays(startISO, i * 7),
      end: addDays(startISO, i * 7 + 6),
    });
  }
  return weeks;
}

function semesterBlocks(sem) {
  const firstHalf = buildWeeks(sem.weeksStart, 6, sem.label, 1);
  firstHalf[5].end = addDays(sem.recess.start, -1); // clip to the Friday before recess starts
  const secondHalf = buildWeeks(addDays(sem.recess.end, 1), 7, sem.label, 7);
  secondHalf[6].end = addDays(sem.readingWeek.start, -1); // clip to the Friday before reading week
  return [
    ...firstHalf,
    { label: `${sem.label} — Recess Week`, start: sem.recess.start, end: sem.recess.end },
    ...secondHalf,
    { label: `${sem.label} — Reading Week`, start: sem.readingWeek.start, end: sem.readingWeek.end },
    { label: `${sem.label} — Examinations`, start: sem.exams.start, end: sem.exams.end },
  ];
}

const SEMESTERS = [
  {
    label: 'Semester 1',
    weeksStart: '2026-08-10',
    recess: { start: '2026-09-19', end: '2026-09-27' },
    readingWeek: { start: '2026-11-14', end: '2026-11-20' },
    exams: { start: '2026-11-21', end: '2026-12-05' },
  },
  {
    label: 'Semester 2',
    weeksStart: '2027-01-11',
    recess: { start: '2027-02-20', end: '2027-02-28' },
    readingWeek: { start: '2027-04-17', end: '2027-04-23' },
    exams: { start: '2027-04-24', end: '2027-05-08' },
  },
];

const ALL_BLOCKS = SEMESTERS.flatMap(semesterBlocks).sort((a, b) => (a.start < b.start ? -1 : 1));

// The block (a study week, recess, reading week, or exam period)
// containing `iso`, or null if it's outside every known range (orientation,
// term break, or beyond what NUS has published so far).
export function currentAcademicBlock(iso) {
  return ALL_BLOCKS.find((b) => iso >= b.start && iso <= b.end) || null;
}

// The next known block starting after `iso` -- used to say "starts in Nd"
// during a gap (term break, or before this calendar's first known date).
export function nextAcademicBlock(iso) {
  return ALL_BLOCKS.find((b) => b.start > iso) || null;
}

// The exam-period blocks specifically, for the Dashboard's "important
// dates" list (a heads-up on finals even before individual papers are
// scheduled).
export function upcomingExamPeriods(iso) {
  return ALL_BLOCKS.filter((b) => b.label.includes('Examinations') && b.end >= iso);
}
