'use client';
// components/fitness/History.jsx — last 14 days at a glance (manual
// check-offs and/or synced Apple Health workouts both count as "active"),
// plus the reference info for wiring up the Apple Shortcut that POSTs to
// /api/fitness/health-sync.
import { useMemo } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { dayKeyForDate, DAY_LABELS } from '../../lib/fitness/defaultPlan';

const DAYS_SHOWN = 14;

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function healthSummary(health) {
  if (!health) return null;
  const parts = [];
  if (health.workoutType) parts.push(health.workoutType);
  if (health.durationMin != null) parts.push(`${health.durationMin} min`);
  if (health.calories != null) parts.push(`${health.calories} cal`);
  return parts.join(' · ') || 'synced';
}

export function History() {
  const { state, loading } = useFitness();

  const rows = useMemo(() => {
    const out = [];
    for (let i = 0; i < DAYS_SHOWN; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const iso = toISO(date);
      const entry = state.logs[iso] || {};
      const active = !!entry.manual?.completed || !!entry.health;
      out.push({ iso, date, dayKey: dayKeyForDate(date), active, health: entry.health });
    }
    return out;
  }, [state.logs]);

  const activeInLastWeek = rows.slice(0, 7).filter((r) => r.active).length;
  const syncOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  if (loading) return <p className="fit-empty">Loading…</p>;

  return (
    <div className="fit-history">
      <p className="fit-history-stat">{activeInLastWeek} of the last 7 days active</p>

      <ul className="fit-history-list">
        {rows.map((row) => (
          <li key={row.iso} className={`fit-history-row${row.active ? ' active' : ''}`}>
            <span className="fit-history-dot" aria-hidden="true">{row.active ? '●' : '○'}</span>
            <span className="fit-history-date">
              {row.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="fit-history-day-title">{state.plan.days[row.dayKey]?.title || DAY_LABELS[row.dayKey]}</span>
            <span className="fit-history-health">{healthSummary(row.health)}</span>
          </li>
        ))}
      </ul>

      <details className="fit-sync-setup">
        <summary>Set up Apple Health sync</summary>
        <div className="fit-sync-setup-body">
          <p>
            Build a Shortcut (Automation → run daily, or after a workout ends) that reads your Health
            data and sends a <code>POST</code> request to:
          </p>
          <code className="fit-sync-endpoint">{syncOrigin || 'https://your-site'}/api/fitness/health-sync</code>
          <p>With header <code>Authorization: Bearer &lt;FITNESS_SYNC_SECRET&gt;</code> and a JSON body like:</p>
          <pre className="fit-sync-example">{`{
  "date": "2026-08-12",
  "workoutType": "Running",
  "durationMin": 32,
  "calories": 310,
  "distanceKm": 5.1,
  "steps": 6200
}`}</pre>
          <p>
            <code>date</code> is optional (defaults to the server's today) and only <code>workoutType</code> is required to log
            something meaningful — the rest fill in whatever your Shortcut has. Set <code>FITNESS_SYNC_SECRET</code> in your
            Vercel project's environment variables to any private token, and use that same value in the Shortcut.
          </p>
        </div>
      </details>
    </div>
  );
}
