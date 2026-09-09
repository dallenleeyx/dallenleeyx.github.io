'use client';
// components/fitness/DailyLog.jsx — the "Today" view: log what you actually
// did, not just what was planned. Pick whichever workout you trained (it
// defaults to whatever Schedule.jsx has for the day, but you can always log
// something different), then log each set's reps as you go, plus today's
// body weight and any cardio. Prev/next arrows let you glance at yesterday
// or back-fill a day you forgot to log.
import { useMemo, useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { toISO, addDays, todayISO } from '../../lib/fitness/util';

const CARDIO_TYPES = ['Run', 'Swim', 'Bike', 'Row', 'Other'];

function formatHeading(date, todayISOStr) {
  const iso = toISO(date);
  if (iso === todayISOStr) return 'Today';
  if (iso === toISO(addDays(new Date(), -1))) return 'Yesterday';
  if (iso === toISO(addDays(new Date(), 1))) return 'Tomorrow';
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
  const todayISOStr = todayISO();

  if (loading) return <p className="fit-empty">Loading…</p>;

  const workouts = state.workouts.list;
  const scheduled = state.schedule.days[dateISO];
  const entry = state.logs[dateISO] || {};
  const manual = entry.manual || {};
  const activeWorkoutId = manual.workoutId ?? '';
  const scheduledWorkout = scheduled?.workoutId ? workouts.find((w) => w.id === scheduled.workoutId) : null;
  const loggedExercises = manual.exercises || [];
  const cardio = manual.cardio || null;

  function selectWorkout(workoutId) {
    if (!workoutId) {
      updateLog(dateISO, { workoutId: null, exercises: [] });
      return;
    }
    const workout = workouts.find((w) => w.id === workoutId);
    updateLog(dateISO, {
      workoutId,
      exercises: (workout?.exercises || []).map((ex) => ({
        name: ex.name, targetSets: ex.sets, targetReps: ex.reps, sets: [],
      })),
    });
  }

  function addSet(exIndex) {
    const next = loggedExercises.map((ex, i) => (i === exIndex ? { ...ex, sets: [...ex.sets, null] } : ex));
    updateLog(dateISO, { exercises: next });
  }
  function updateSetReps(exIndex, setIndex, value) {
    const reps = value === '' ? null : Number(value);
    const next = loggedExercises.map((ex, i) => {
      if (i !== exIndex) return ex;
      return { ...ex, sets: ex.sets.map((s, j) => (j === setIndex ? reps : s)) };
    });
    updateLog(dateISO, { exercises: next });
  }
  function removeSet(exIndex, setIndex) {
    const next = loggedExercises.map((ex, i) => (i === exIndex ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) } : ex));
    updateLog(dateISO, { exercises: next });
  }

  function setWeight(value) {
    updateLog(dateISO, { weightKg: value === '' ? null : Number(value) });
  }

  function setCardio(patch) {
    const current = cardio || { type: '', durationMin: null, distanceKm: null };
    updateLog(dateISO, { cardio: { ...current, ...patch } });
  }

  return (
    <div className="fit-log">
      <div className="fit-log-nav">
        <button className="fit-ghost-btn" onClick={() => setOffset((o) => o - 1)} aria-label="Previous day">←</button>
        <div className="fit-log-heading">
          <h3>{formatHeading(date, todayISOStr)}</h3>
          {scheduledWorkout && <span className="fit-log-subheading">scheduled: {scheduledWorkout.name}</span>}
        </div>
        <button className="fit-ghost-btn" onClick={() => setOffset((o) => o + 1)} aria-label="Next day">→</button>
      </div>

      <HealthCard health={entry.health} />

      <label className="fit-form-label-block">
        Weight (kg)
        <input
          type="number" step="0.1" min="0" className="fit-weight-input"
          value={manual.weightKg ?? ''}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 72.5"
        />
      </label>

      <label className="fit-form-label-block">
        Workout
        <select value={activeWorkoutId} onChange={(e) => selectWorkout(e.target.value)}>
          <option value="">{scheduledWorkout ? '— none logged (scheduled above) —' : '— rest / cardio only —'}</option>
          {workouts.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </label>

      {loggedExercises.length > 0 && (
        <ul className="fit-log-exercise-list">
          {loggedExercises.map((ex, i) => (
            <li key={i} className="fit-log-exercise-card">
              <div className="fit-log-exercise-head">
                <span className="fit-exercise-name">{ex.name}</span>
                <span className="fit-exercise-target">target {ex.targetSets} × {ex.targetReps}</span>
              </div>
              <div className="fit-set-chip-row">
                {ex.sets.map((reps, si) => (
                  <span key={si} className="fit-set-chip">
                    <span className="fit-set-chip-label">Set {si + 1}</span>
                    <input
                      type="number" min="0" value={reps ?? ''}
                      onChange={(e) => updateSetReps(i, si, e.target.value)}
                      placeholder="reps"
                    />
                    <button type="button" onClick={() => removeSet(i, si)} aria-label="Remove set">✕</button>
                  </span>
                ))}
                <button type="button" className="fit-ghost-btn fit-add-set-btn" onClick={() => addSet(i)}>+ set</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="fit-cardio-block">
        <div className="fit-cardio-head">
          <span>Cardio</span>
          {cardio && <button type="button" className="fit-ghost-btn" onClick={() => updateLog(dateISO, { cardio: null })}>clear</button>}
        </div>
        <div className="fit-cardio-row">
          <select value={cardio?.type || ''} onChange={(e) => setCardio({ type: e.target.value })}>
            <option value="">— none —</option>
            {CARDIO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number" min="0" placeholder="minutes"
            value={cardio?.durationMin ?? ''}
            onChange={(e) => setCardio({ durationMin: e.target.value === '' ? null : Number(e.target.value) })}
          />
          <input
            type="number" min="0" step="0.1" placeholder="km (optional)"
            value={cardio?.distanceKm ?? ''}
            onChange={(e) => setCardio({ distanceKm: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
