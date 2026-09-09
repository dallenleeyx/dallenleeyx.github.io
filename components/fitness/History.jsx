'use client';
// components/fitness/History.jsx — last 14 days at a glance: whichever
// workout you logged (or the Apple Health workout that synced in), your
// weight if you logged it, and any cardio -- plus the reference info for
// wiring up the Apple Shortcut that POSTs to /api/fitness/health-sync.
import { useMemo } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { toISO, addDays } from '../../lib/fitness/util';

const DAYS_SHOWN = 14;

function healthSummary(health) {
  if (!health) return null;
  const parts = [];
  if (health.workoutType) parts.push(health.workoutType);
  if (health.durationMin != null) parts.push(`${health.durationMin} min`);
  if (health.calories != null) parts.push(`${health.calories} cal`);
  return parts.join(' · ') || 'synced';
}

function cardioSummary(cardio) {
  if (!cardio || !cardio.type) return null;
  const parts = [cardio.type];
  if (cardio.durationMin != null) parts.push(`${cardio.durationMin} min`);
  if (cardio.distanceKm != null) parts.push(`${cardio.distanceKm} km`);
  return parts.join(' · ');
}

export function History() {
  const { state, loading } = useFitness();

  const rows = useMemo(() => {
    const out = [];
    for (let i = 0; i < DAYS_SHOWN; i++) {
      const date = addDays(new Date(), -i);
      const iso = toISO(date);
      const entry = state.logs[iso] || {};
      const manual = entry.manual || {};
      const workout = manual.workoutId ? state.workouts.list.find((w) => w.id === manual.workoutId) : null;
      const setsLogged = (manual.exercises || []).reduce((n, ex) => n + ex.sets.filter((s) => s != null).length, 0);
      const active = !!workout || !!manual.cardio?.type || !!entry.health || manual.weightKg != null;
      out.push({
        iso, date, active, workout, setsLogged,
        weightKg: manual.weightKg,
        cardio: cardioSummary(manual.cardio),
        health: entry.health,
      });
    }
    return out;
  }, [state.logs, state.workouts.list]);

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
            <span className="fit-history-day-title">
              {row.workout ? row.workout.name : row.cardio ? 'Cardio' : row.health ? (row.health.workoutType || 'Workout') : '—'}
              {row.setsLogged > 0 && <span className="fit-history-sets"> · {row.setsLogged} sets</span>}
            </span>
            <span className="fit-history-health">
              {row.weightKg != null && <span className="fit-history-weight">{row.weightKg} kg</span>}
              {row.cardio || healthSummary(row.health)}
            </span>
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
