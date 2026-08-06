'use client';
// components/dashboard/ImportantDates.jsx — every date actually worth
// tracking in one sorted list: math assignments due soon, the JLPT exam
// date, and NUS's own examination periods (a heads-up before individual
// papers are even scheduled).
import { useRouter } from 'next/navigation';
import { getUpcomingDueAssignments } from '../../lib/schedule';
import { upcomingExamPeriods } from '../../lib/academicCalendar';
import { usePlan } from '../../lib/japanese/PlanContext';
import { todayISO, fmtDateShort } from '../../lib/japanese/timeline';

export function ImportantDates({ courses }) {
  const router = useRouter();
  const { plan } = usePlan();
  const today = todayISO();

  const items = [];
  getUpcomingDueAssignments(courses.filter((c) => !c.archived), new Date(), 60).forEach((a) => {
    items.push({ date: a.date, label: a.title, tag: a.course.glyph, kind: 'math', onClick: () => router.push(`/math?course=${a.course.id}`) });
  });
  if (plan?.examDate && plan.examDate >= today) {
    items.push({ date: plan.examDate, label: 'JLPT exam', tag: '日', kind: 'japanese', onClick: () => router.push('/japanese') });
  }
  upcomingExamPeriods(today).slice(0, 1).forEach((ex) => {
    items.push({ date: ex.start, label: ex.label, tag: 'NUS', kind: 'exams', onClick: null });
  });
  items.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Important dates</span>
      </div>
      {items.length === 0 ? (
        <p className="tk-note-p tk-note-empty">Nothing on the horizon.</p>
      ) : (
        items.slice(0, 10).map((it, i) => (
          <div key={i} className={`dash-task-item${it.onClick ? '' : ' no-click'}`} onClick={it.onClick || undefined}>
            <span className="dash-task-date">{fmtDateShort(it.date)}</span>
            <span className="dash-task-title">{it.label}</span>
            <span className={`dash-date-tag tag-${it.kind}`}>{it.tag}</span>
          </div>
        ))
      )}
    </div>
  );
}
