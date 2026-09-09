'use client';
// components/fitness/Schedule.jsx — your own rolling plan for the next
// ~3 weeks, since workouts don't run on fixed weekdays here: you decide
// when you're training and which workout from the library it'll be. This
// is deliberately just a plan, not an auto-generated rotation -- Today.jsx
// shows whatever you assign here as a hint, but always lets you log
// something different if that's what you actually did.
import { useMemo, useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { toISO, addDays } from '../../lib/fitness/util';

const WINDOW_DAYS = 21;

export function Schedule() {
  const { state, loading, updateSchedule } = useFitness();
  const [noteDrafts, setNoteDrafts] = useState({});

  const upcoming = useMemo(() => {
    const today = new Date();
    return Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(today, i));
  }, []);

  if (loading) return <p className="fit-empty">Loading…</p>;

  const workouts = state.workouts.list;
  const days = state.schedule.days;

  function setDay(iso, patch) {
    const existing = days[iso] || {};
    const next = { ...existing, ...patch };
    const isEmpty = !next.workoutId && !next.note?.trim();
    const nextDays = { ...days };
    if (isEmpty) delete nextDays[iso];
    else nextDays[iso] = next;
    updateSchedule(nextDays);
  }

  return (
    <div className="fit-schedule">
      <p className="fit-schedule-hint">
        Fill in whichever days you plan to train over the next {WINDOW_DAYS} days — no fixed weekdays, just
        whatever fits. This is a plan, not a commitment: Today always lets you log something different.
      </p>
      <ul className="fit-schedule-list">
        {upcoming.map((date) => {
          const iso = toISO(date);
          const entry = days[iso] || {};
          const isToday = iso === toISO(new Date());
          const noteValue = noteDrafts[iso] ?? entry.note ?? '';
          return (
            <li key={iso} className={`fit-schedule-row${isToday ? ' today' : ''}`}>
              <div className="fit-schedule-date">
                <span className="fit-schedule-weekday">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="fit-schedule-daynum">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
              <select
                className="fit-schedule-select"
                value={entry.workoutId || ''}
                onChange={(e) => setDay(iso, { workoutId: e.target.value || null })}
              >
                <option value="">— nothing planned —</option>
                {workouts.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <input
                className="fit-schedule-note"
                value={noteValue}
                onChange={(e) => setNoteDrafts((p) => ({ ...p, [iso]: e.target.value }))}
                onBlur={() => setDay(iso, { note: noteValue })}
                placeholder="note (optional)"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
