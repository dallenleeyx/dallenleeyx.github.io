'use client';
// components/dashboard/Dashboard.jsx — combines math's "due today"
// (assignments overdue or due within a week) and Japanese's "due today"
// (today's lesson quota or review-phase habits) into one sorted task list,
// plus the independent Goals widget for named target dates. Reuses the
// math tracker's tk-* classes/patterns (tk-hero/tk-timeline/tk-tl-item/
// tk-modal, etc.) for visual consistency rather than inventing a fourth
// design language.
import { useCoursesSync } from '../../lib/useCoursesSync';
import { useGoalsSync } from '../../hooks/useGoalsSync';
import { useJapaneseDueToday } from '../../hooks/useJapaneseDueToday';
import { getDueMathTasks } from '../../lib/getDueMathTasks';
import { GoalsWidget } from './GoalsWidget';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const KIND_BADGE = { math: 'Math', vocab: 'Vocab', grammar: 'Grammar', review: 'Review' };

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysInfo(due) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(due + 'T00:00:00') - today) / 86400000);
  if (diff < 0) return { label: `overdue ${-diff}d`, cls: 'overdue' };
  if (diff === 0) return { label: 'today', cls: 'today' };
  return { label: `${diff}d`, cls: diff <= 3 ? 'soon' : '' };
}

export function Dashboard() {
  const { courses, loading: coursesLoading } = useCoursesSync();
  const { goals, setGoals, loading: goalsLoading } = useGoalsSync();
  const japaneseDue = useJapaneseDueToday();

  if (coursesLoading || !courses) {
    return <div className="tk-loading-screen">Loading your dashboard…</div>;
  }

  const now = new Date();
  const mathTasks = getDueMathTasks(courses, now);
  const today = todayISO();
  const combined = mathTasks
    .concat(japaneseDue.map((it) => ({ ...it, due: today })))
    .sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));

  return (
    <div className="tk-app" style={{ display: 'block' }}>
      <main className="tk-main" style={{ marginLeft: 0 }}>
        <div className="tk-hero fade-up">
          <div>
            <h1>Dashboard</h1>
            <div className="tk-hero-meta">{String(now.getDate()).padStart(2, '0')} {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
          </div>
        </div>

        <div className="fade-up d1">
          <div className="tk-section-label"><span>What needs attention<span className="sub">math + japanese, soonest first</span></span></div>
          {combined.length ? (
            <div className="tk-timeline" style={{ marginBottom: '3.2rem' }}>
              {combined.map((it) => {
                const di = it.kind === 'math' ? daysInfo(it.due) : null;
                return (
                  <div className="tk-tl-item" key={it.id}>
                    <div className="tk-row-card">
                      <div style={{ minWidth: 0 }}>
                        <div className="tk-row-title">{it.label}</div>
                      </div>
                      <div className="tk-row-actions">
                        {di && <span className={`tk-days ${di.cls}`}>{di.label}</span>}
                        <span className={`tk-pill ${it.kind === 'math' ? 'todo' : 'doing'}`}>{KIND_BADGE[it.kind] || it.kind}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ marginBottom: '3.2rem' }}>
              <div className="tk-empty"><div className="icon">✅</div><div className="title">Nothing needs attention right now.</div></div>
            </div>
          )}
        </div>

        {!goalsLoading && goals && <GoalsWidget goals={goals} setGoals={setGoals} />}
      </main>
    </div>
  );
}
