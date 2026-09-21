'use client';

import { useMemo, useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { findExercise } from '../../lib/fitness/exerciseUtils';
import { addDays, normalizeSet, toISO } from '../../lib/fitness/util';

const RANGE_OPTIONS = [
  { value: 'last1', label: 'Last workout' },
  { value: 'last3', label: 'Last 3 workouts' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'all', label: 'All workout data' },
];

function hasLoggedSet(raw) {
  if (raw == null) return false;
  if (typeof raw === 'number') return true;
  return raw.weight != null || raw.reps != null || !!raw.note?.trim();
}

function isTrainingSession(entry) {
  const manual = entry?.manual || {};
  const hasExerciseSets = (manual.exercises || []).some((exercise) =>
    (exercise.sets || []).some(hasLoggedSet)
  );
  const hasManualCardio = !!manual.cardio?.type;
  const health = entry?.health;
  const hasHealthWorkout = !!(
    health?.workoutType ||
    health?.durationMin != null ||
    health?.calories != null ||
    health?.distanceKm != null
  );
  return hasExerciseSets || hasManualCardio || hasHealthWorkout;
}

function workoutName(workouts, id) {
  if (!id) return null;
  return workouts.find((workout) => workout.id === id)?.name || id;
}

function gymName(gyms, id) {
  if (!id) return null;
  return gyms.find((gym) => gym.id === id)?.name || id;
}

function sessionFromLog(date, entry, state) {
  const manual = entry?.manual || {};
  const customExercises = state.customExercises.list;
  const schedule = state.schedule.days[date] || {};

  const exercises = (manual.exercises || []).map((loggedExercise) => {
    const exercise = findExercise(loggedExercise.exerciseId, customExercises);
    const sets = (loggedExercise.sets || [])
      .filter(hasLoggedSet)
      .map((raw, index) => ({ set: index + 1, ...normalizeSet(raw) }));

    return {
      exerciseId: loggedExercise.exerciseId,
      name: exercise?.canonicalName || loggedExercise.name || loggedExercise.exerciseId || 'Unknown exercise',
      primaryMuscles: exercise?.primaryMuscles || [],
      secondaryMuscles: exercise?.secondaryMuscles || [],
      target: {
        sets: loggedExercise.targetSets ?? null,
        minReps: loggedExercise.minReps ?? null,
        maxReps: loggedExercise.maxReps ?? null,
        restSeconds: loggedExercise.restSeconds ?? null,
      },
      note: loggedExercise.note || '',
      sets,
    };
  });

  return {
    date,
    workout: workoutName(state.workouts.list, manual.workoutId),
    scheduledWorkout: workoutName(state.workouts.list, schedule.workoutId),
    gym: gymName(state.gyms.list, manual.gymId),
    bodyWeightKg: manual.weightKg ?? null,
    exercises,
    cardio: manual.cardio || null,
    appleHealth: entry?.health
      ? {
          workoutType: entry.health.workoutType ?? null,
          durationMin: entry.health.durationMin ?? null,
          calories: entry.health.calories ?? null,
          distanceKm: entry.health.distanceKm ?? null,
          steps: entry.health.steps ?? null,
        }
      : null,
  };
}

function selectSessions(allSessions, range) {
  if (range === 'last1') return allSessions.slice(-1);
  if (range === 'last3') return allSessions.slice(-3);
  if (range === 'all') return allSessions;

  const days = range === 'last7days' ? 7 : 30;
  const cutoff = toISO(addDays(new Date(), -(days - 1)));
  return allSessions.filter((session) => session.date >= cutoff);
}

function makeFilename(range) {
  return `fitness-${range}-${toISO(new Date())}.json`;
}

export function FitnessExport() {
  const { state } = useFitness();
  const [range, setRange] = useState('last3');
  const [status, setStatus] = useState('');

  const allSessions = useMemo(
    () =>
      Object.keys(state.logs || {})
        .sort()
        .filter((date) => isTrainingSession(state.logs[date]))
        .map((date) => sessionFromLog(date, state.logs[date], state)),
    [state]
  );

  const sessions = useMemo(() => selectSessions(allSessions, range), [allSessions, range]);

  const payload = useMemo(
    () => ({
      exportType: 'fitness-workout-log',
      version: 1,
      generatedAt: new Date().toISOString(),
      range,
      sessionCount: sessions.length,
      sessions,
    }),
    [range, sessions]
  );

  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);
  const disabled = sessions.length === 0;

  async function copyForChatGPT() {
    try {
      await navigator.clipboard.writeText(json);
      setStatus(`Copied ${sessions.length} workout${sessions.length === 1 ? '' : 's'} to clipboard.`);
    } catch {
      setStatus('Could not copy automatically. Download the JSON file instead.');
    }
  }

  function downloadJson() {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = makeFilename(range);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus(`Downloaded ${sessions.length} workout${sessions.length === 1 ? '' : 's'}.`);
  }

  return (
    <section className="fit-export" aria-labelledby="fitness-export-heading">
      <div className="fit-export-head">
        <div>
          <h4 id="fitness-export-heading">Export for ChatGPT</h4>
          <p>Exports readable workout data only — no login, Redis, or sync secrets.</p>
        </div>
      </div>

      <div className="fit-export-controls">
        <label>
          Range
          <select value={range} onChange={(event) => { setRange(event.target.value); setStatus(''); }}>
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <span className="fit-export-count">
          {sessions.length} workout{sessions.length === 1 ? '' : 's'} selected
        </span>
      </div>

      <div className="fit-export-actions">
        <button
          type="button"
          className="fit-ghost-btn fit-btn-primary"
          onClick={copyForChatGPT}
          disabled={disabled}
        >
          Copy for ChatGPT
        </button>
        <button type="button" className="fit-ghost-btn" onClick={downloadJson} disabled={disabled}>
          Download JSON
        </button>
      </div>

      {disabled && <p className="fit-export-status">No workout sessions found for this range.</p>}
      {!disabled && status && <p className="fit-export-status" role="status">{status}</p>}
    </section>
  );
}
