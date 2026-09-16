'use client';
// components/fitness/DailyLog.jsx — the "Today" view: log what you actually
// did, not just what was planned. Pick whichever workout you trained (it
// defaults to whatever Schedule.jsx has for the day, but you can always log
// something different) to seed today's exercises from that workout's
// canonical Exercise references, then log each set as weight x reps (with
// an optional note like "failure"). Every logged exercise for the day is
// freely editable -- swap in a stand-in exercise, or cancel one you skipped
// -- without ever touching the workout template in "My Program".
//
// Also pick which saved gym (see Gyms.jsx) you're training at today. Each
// exercise's REQUIRED equipment (automatic, from exerciseCatalog.js) is
// checked against that gym's saved inventory; if it doesn't fit,
// SubstitutionBanner suggests the closest available alternative EXERCISE
// for today only -- the workout program itself never changes.
import { useMemo, useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { toISO, addDays, todayISO, normalizeSet } from '../../lib/fitness/util';
import { getAllExercises, findExercise, findPreviousPerformance, progressionSuggestion } from '../../lib/fitness/exerciseUtils';
import { SubstitutionBanner } from './SubstitutionBanner';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetails } from './ExerciseDetails';
import { ExerciseLibrary } from './ExerciseLibrary';
import { MuscleHeatmap } from './MuscleHeatmap';

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
  const { state, loading, updateLog, updateCustomExercises } = useFitness();
  const [offset, setOffset] = useState(0);
  const [detailsExercise, setDetailsExercise] = useState(null);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const date = useMemo(() => addDays(new Date(), offset), [offset]);
  const dateISO = toISO(date);
  const todayISOStr = todayISO();

  if (loading) return <p className="fit-empty">Loading…</p>;

  const workouts = state.workouts.list;
  const gyms = state.gyms.list;
  const customExercises = state.customExercises.list;
  const allExercises = getAllExercises(customExercises);
  const scheduled = state.schedule.days[dateISO];
  const entry = state.logs[dateISO] || {};
  const manual = entry.manual || {};
  const activeWorkoutId = manual.workoutId ?? '';
  const activeGymId = manual.gymId ?? '';
  const activeGym = activeGymId ? gyms.find((g) => g.id === activeGymId) || null : null;
  const scheduledWorkout = scheduled?.workoutId ? workouts.find((w) => w.id === scheduled.workoutId) : null;
  const loggedExercises = manual.exercises || [];
  const cardio = manual.cardio || null;

  const resolvedForHeatmap = loggedExercises
    .map((ex) => findExercise(ex.exerciseId, customExercises))
    .filter(Boolean);

  function selectWorkout(workoutId) {
    if (!workoutId) {
      updateLog(dateISO, { workoutId: null, exercises: [] });
      return;
    }
    const workout = workouts.find((w) => w.id === workoutId);
    updateLog(dateISO, {
      workoutId,
      exercises: (workout?.exercises || []).map((we) => ({
        exerciseId: we.exerciseId,
        targetSets: we.sets, minReps: we.minReps, maxReps: we.maxReps, restSeconds: we.restSeconds,
        note: '', sets: [],
      })),
    });
  }

  function selectGym(gymId) {
    updateLog(dateISO, { gymId: gymId || null });
  }

  // These two only ever touch *this day's* log entry -- never the workout
  // template in My Program -- so adding a stand-in exercise or skipping one
  // you didn't get to today doesn't affect the default for next time.
  function addLoggedExercise(exercise) {
    updateLog(dateISO, {
      exercises: [...loggedExercises, { exerciseId: exercise.id, targetSets: 3, minReps: 8, maxReps: 12, restSeconds: 90, note: '', sets: [] }],
    });
    setLibraryOpen(false);
  }
  function cancelLoggedExercise(exIndex) {
    const ex = loggedExercises[exIndex];
    const hasData = ex.sets.some((s) => s != null);
    const exercise = findExercise(ex.exerciseId, customExercises);
    if (hasData && !window.confirm(`Remove "${exercise?.canonicalName || 'this exercise'}" from today's log? Its logged sets will be lost.`)) return;
    updateLog(dateISO, { exercises: loggedExercises.filter((_, i) => i !== exIndex) });
  }
  function updateExerciseField(exIndex, patch) {
    const next = loggedExercises.map((ex, i) => (i === exIndex ? { ...ex, ...patch } : ex));
    updateLog(dateISO, { exercises: next });
  }

  function addSet(exIndex) {
    const next = loggedExercises.map((ex, i) => {
      if (i !== exIndex) return ex;
      const last = ex.sets.length ? normalizeSet(ex.sets[ex.sets.length - 1]) : null;
      return { ...ex, sets: [...ex.sets, { weight: last?.weight ?? null, reps: null, note: '' }] };
    });
    updateLog(dateISO, { exercises: next });
  }
  function updateSet(exIndex, setIndex, patch) {
    const next = loggedExercises.map((ex, i) => {
      if (i !== exIndex) return ex;
      return { ...ex, sets: ex.sets.map((s, j) => (j === setIndex ? { ...normalizeSet(s), ...patch } : s)) };
    });
    updateLog(dateISO, { exercises: next });
  }
  function removeSet(exIndex, setIndex) {
    const next = loggedExercises.map((ex, i) => (i === exIndex ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) } : ex));
    updateLog(dateISO, { exercises: next });
  }
  function copyPreviousWeights(exIndex, previous) {
    const next = loggedExercises.map((ex, i) => (i === exIndex
      ? { ...ex, sets: previous.sets.map((s) => ({ weight: s.weight ?? null, reps: null, note: '' })) }
      : ex));
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

      {activeGym ? (
        <div className="fit-current-gym">
          <span className="fit-current-gym-label">Gym</span>
          <span className="fit-current-gym-name">{activeGym.name}</span>
          <button type="button" className="fit-ghost-btn fit-change-gym-btn" onClick={() => selectGym('')}>Change gym</button>
        </div>
      ) : (
        <label className="fit-form-label-block">
          Which gym are you training at today?
          <select value={activeGymId} onChange={(e) => selectGym(e.target.value)}>
            <option value="">{gyms.length ? '— select a gym —' : '— no gyms saved yet (see the Gyms tab) —'}</option>
            {gyms.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
      )}

      <MuscleHeatmap exercises={resolvedForHeatmap} title="Today's muscles trained" />

      <ul className="fit-log-exercise-list">
        {loggedExercises.map((ex, i) => {
          const exercise = findExercise(ex.exerciseId, customExercises);
          if (!exercise) return null;
          const previous = findPreviousPerformance(ex.exerciseId, state.logs, { beforeDateISO: dateISO, customExercises });
          const suggestion = progressionSuggestion(previous, ex.maxReps);
          return (
            <li key={i}>
              <ExerciseCard
                exercise={exercise}
                sets={ex.targetSets}
                minReps={ex.minReps}
                maxReps={ex.maxReps}
                restSeconds={ex.restSeconds}
                gym={activeGym}
                allExercises={allExercises}
                onOpenDetails={setDetailsExercise}
                className="fit-log-exercise-card"
                actions={<button type="button" className="fit-icon-btn" onClick={() => cancelLoggedExercise(i)} aria-label="Cancel exercise">✕</button>}
              >
                {previous && (
                  <div className="fit-prev-performance">
                    <span>LAST SESSION: {previous.sets.map((s) => `${s.weight ?? '?'}${s.weight != null ? 'kg' : ''}/${s.reps ?? '?'}`).join(', ')}</span>
                    <button type="button" className="fit-ghost-btn" onClick={() => copyPreviousWeights(i, previous)}>Copy weights</button>
                  </div>
                )}
                {suggestion && <p className="fit-progression-hint">{suggestion}</p>}

                <input
                  className="fit-log-exercise-note-input"
                  value={ex.note || ''}
                  onChange={(e) => updateExerciseField(i, { note: e.target.value })}
                  placeholder="note, e.g. set knob at 1"
                />
                <div className="fit-set-chip-row">
                  {ex.sets.map((raw, si) => {
                    const s = normalizeSet(raw);
                    return (
                      <span key={si} className="fit-set-chip">
                        <span className="fit-set-chip-label">{si + 1}</span>
                        <input
                          type="number" min="0" step="0.5" className="fit-set-weight-input" value={s.weight ?? ''}
                          onChange={(e) => updateSet(i, si, { weight: e.target.value === '' ? null : Number(e.target.value) })}
                          placeholder="wt"
                        />
                        <span className="fit-set-x">×</span>
                        <input
                          type="number" min="0" className="fit-set-reps-input" value={s.reps ?? ''}
                          onChange={(e) => updateSet(i, si, { reps: e.target.value === '' ? null : Number(e.target.value) })}
                          placeholder="reps"
                        />
                        <input
                          type="text" className="fit-set-note-input" value={s.note}
                          onChange={(e) => updateSet(i, si, { note: e.target.value })}
                          placeholder="note"
                        />
                        <button type="button" onClick={() => removeSet(i, si)} aria-label="Remove set">✕</button>
                      </span>
                    );
                  })}
                  <button type="button" className="fit-ghost-btn fit-add-set-btn" onClick={() => addSet(i)}>+ set</button>
                </div>
                <SubstitutionBanner exercise={exercise} gym={activeGym} allExercises={allExercises} />
              </ExerciseCard>
            </li>
          );
        })}
      </ul>
      <button type="button" className="fit-ghost-btn fit-add-ex-btn" onClick={() => setLibraryOpen(true)}>+ add exercise</button>

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

      {detailsExercise && (
        <ExerciseDetails
          exercise={detailsExercise}
          logs={state.logs}
          customExercises={customExercises}
          onClose={() => setDetailsExercise(null)}
        />
      )}
      {libraryOpen && (
        <ExerciseLibrary
          allExercises={allExercises}
          onSelect={addLoggedExercise}
          onCreateCustom={(exercise) => updateCustomExercises([...customExercises, exercise])}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  );
}
