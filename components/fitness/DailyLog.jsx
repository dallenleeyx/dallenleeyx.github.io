'use client';
// components/fitness/DailyLog.jsx — the "Today" view: shows the plan's
// exercises for whichever day is selected (defaults to today), a checkbox
// to mark the day done, and any Apple Health data already synced in for
// that day. Prev/next arrows let you glance at yesterday or preview
// tomorrow's plan without leaving the tab.
import { useMemo, useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { DAY_LABELS, dayKeyForDate } from '../../lib/fitness/defaultPlan';

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, n) {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

function formatHeading(date, todayISOStr) {
  const iso = toISO(date);
  if (iso === todayISOStr) return 'Today';
  const yesterday = toISO(addDays(new Date(), -1));
  const tomorrow = toISO(addDays(new Date(), 1));
  if (iso === yesterday) return 'Yesterday';
  if (iso === tomorrow) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

function HealthCard({ health }) {
  if (!health) return null;
  const parts = [];
  if (health.workoutType) parts.push(health.workoutType);
  if (health.durationMin != null) parts.push(`${health.durationMin} min`);
  if (health.calories != null) parts.push(`${health.calories} cal`);
  if (health.distanceKm != null) parts.push(`${health.distanceKm} km`);
  if (health.steps != null) parts.push(`${health.steps} steps`);
  return (
    <div className="fit-health-card">
      <span className="fit-health-badge">Synced from Apple Health</span>
      <p className="fit-health-summary">{parts.length ? parts.join(' · ') : 'Workout logged'}</p>
    </div>
  );
}

export function DailyLog() {
  const { state, loading, updateLog } = useFitness();
  const [offset, setOffset] = useState(0);

  const date = useMemo(() => addDays(new Date(), offset), [offset]);
  const dateISO = toISO(date);
  const todayISOStr = toISO(new Date());
  const dayKey = dayKeyForDate(date);
  const day = state.plan.days[dayKey] || { title: 'Rest', exercises: [] };
  const entry = state.logs[dateISO] || {};
  const completed = !!entry.manual?.completed;

  if (loading) return <p className="fit-empty">Loading…</p>;

  return (
    <div className="fit-log">
      <div className="fit-log-nav">
        <button className="fit-ghost-btn" onClick={() => setOffset((o) => o - 1)} aria-label="Previous day">←</button>
        <div className="fit-log-heading">
          <h3>{formatHeading(date, todayISOStr)}</h3>
          <span className="fit-log-subheading">{DAY_LABELS[dayKey]} · {day.title}</span>
        </div>
        <button className="fit-ghost-btn" onClick={() => setOffset((o) => o + 1)} aria-label="Next day">→</button>
      </div>

      <HealthCard health={entry.health} />

      <label className="fit-complete-toggle">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => updateLog(dateISO, { completed: e.target.checked })}
        />
        Mark this workout complete
      </label>

      {day.exercises.length === 0 ? (
        <p className="fit-empty">Rest day — nothing planned.</p>
      ) : (
        <ul className="fit-exercise-list">
          {day.exercises.map((ex) => (
            <li key={ex.id} className="fit-exercise-row">
              <span className="fit-exercise-name">{ex.name}</span>
              <span className="fit-exercise-target">{ex.sets} × {ex.reps}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
