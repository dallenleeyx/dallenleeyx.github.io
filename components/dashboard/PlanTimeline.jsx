'use client';
// components/dashboard/PlanTimeline.jsx — renders goalPlan.milestones
// grouped by month (list-shaped, not a calendar grid -- six months of
// milestones is naturally list-shaped) plus the narrative write-up.
import { renderMarkdown } from '../../lib/dashboard/renderMarkdown';

function monthLabel(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function PlanTimeline({ plan, onOpenSetup }) {
  const hasPlan = plan && plan.generatedAt;
  const milestones = (plan?.milestones || []).slice().sort((a, b) => a.date.localeCompare(b.date));

  const groups = [];
  let currentMonth = null;
  milestones.forEach((m) => {
    const label = monthLabel(m.date);
    if (label !== currentMonth) {
      currentMonth = label;
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(m);
  });

  return (
    <div className="dash-card dash-grid-full">
      <div className="dash-card-head">
        <span className="dash-card-title">6-month plan</span>
        <button className="tk-mono-btn" onClick={onOpenSetup}>
          {hasPlan ? 'Regenerate' : 'Generate plan'}
        </button>
      </div>

      {!hasPlan ? (
        <div className="tk-empty">
          <div className="icon">🎯</div>
          <div className="title">No plan yet — generate one to get a 6-month timeline toward your goals.</div>
        </div>
      ) : (
        <>
          {plan.courseTargets?.length > 0 && (
            <div className="dash-task-group">
              <div className="dash-task-group-label">Targets</div>
              {plan.courseTargets.map((t) => (
                <div key={t.courseId} className="dash-target-row">
                  <span className="dash-target-name">{t.courseTitle}</span>
                  <span className="dash-target-current">{t.targetGrade}</span>
                </div>
              ))}
            </div>
          )}

          {groups.length === 0 ? (
            <p className="tk-note-p tk-note-empty">No milestones yet.</p>
          ) : (
            groups.map((g) => (
              <div key={g.label} className="dash-timeline-month">
                <div className="dash-timeline-month-label">{g.label}</div>
                {g.items.map((m) => (
                  <div key={m.id} className="dash-milestone">
                    <span className={`dash-milestone-dot${m.done ? ' done' : ''} cat-${m.category}`} />
                    <div className="dash-milestone-body">
                      <span className={`dash-milestone-title${m.done ? ' done' : ''}`}>{m.title}</span>
                      {m.description && <div className="dash-milestone-desc">{m.description}</div>}
                    </div>
                    <span className="dash-milestone-date">{m.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            ))
          )}

          {plan.narrative && <div className="dash-narrative">{renderMarkdown(plan.narrative)}</div>}
        </>
      )}
    </div>
  );
}
