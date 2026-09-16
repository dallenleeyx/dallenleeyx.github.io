'use client';
// components/fitness/WorkoutLibrary.jsx — "My Program": the fixed weekly
// program (Push/Pull/Legs/Upper/Lower+Core, see programTemplate.js) as a
// day-card grid, each opening a full workout editor. This replaces the old
// "+ Link Equipment" workflow entirely -- every exercise here is a
// reference to a canonical Exercise (see exerciseCatalog.js), so its
// muscles/equipment are automatic and never hand-configured. The program
// itself stays fixed (no add/delete a whole day); what's editable per day
// is the exercise order, which exercise fills each slot, and its
// sets/rep-range/rest prescription.
import { useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { uid } from '../../lib/fitness/util';
import { getAllExercises, findExercise } from '../../lib/fitness/exerciseUtils';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseDetails } from './ExerciseDetails';
import { ExerciseLibrary } from './ExerciseLibrary';
import { MuscleHeatmap } from './MuscleHeatmap';

function DayCard({ day, allExercises, onOpen }) {
  const muscleSummary = [...new Set(day.focus || [])];
  return (
    <button type="button" className="fit-program-day-card" onClick={() => onOpen(day.id)}>
      <span className="fit-program-day-name">{day.name}</span>
      <span className="fit-program-day-meta">
        {day.exercises.length} exercise{day.exercises.length === 1 ? '' : 's'}
        {muscleSummary.length ? ` · ${muscleSummary.join(' • ')}` : ''}
      </span>
    </button>
  );
}

export function WorkoutLibrary() {
  const { state, loading, updateWorkouts, updateCustomExercises } = useFitness();
  const [openDayId, setOpenDayId] = useState(null);
  const [detailsExercise, setDetailsExercise] = useState(null);
  const [libraryFor, setLibraryFor] = useState(null); // { mode: 'add' | 'replace', weId? }

  if (loading) return <p className="fit-empty">Loading…</p>;

  const workouts = state.workouts.list;
  const customExercises = state.customExercises.list;
  const allExercises = getAllExercises(customExercises);
  const openDay = workouts.find((w) => w.id === openDayId) || null;

  function updateDay(dayId, patch) {
    updateWorkouts(workouts.map((w) => (w.id === dayId ? { ...w, ...patch } : w)));
  }
  function updateWorkoutExercise(dayId, weId, patch) {
    const day = workouts.find((w) => w.id === dayId);
    updateDay(dayId, { exercises: day.exercises.map((e) => (e.id === weId ? { ...e, ...patch } : e)) });
  }
  function removeWorkoutExercise(dayId, weId) {
    const day = workouts.find((w) => w.id === dayId);
    if (!window.confirm('Remove this exercise from the day? This does not affect logs you’ve already recorded.')) return;
    updateDay(dayId, { exercises: day.exercises.filter((e) => e.id !== weId) });
  }
  function moveWorkoutExercise(dayId, index, dir) {
    const day = workouts.find((w) => w.id === dayId);
    const next = [...day.exercises];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    updateDay(dayId, { exercises: next });
  }
  function addWorkoutExercise(dayId, exercise) {
    const day = workouts.find((w) => w.id === dayId);
    updateDay(dayId, {
      exercises: [...day.exercises, { id: uid(), exerciseId: exercise.id, sets: 3, minReps: 8, maxReps: 12, restSeconds: 90, notes: '' }],
    });
    setLibraryFor(null);
  }
  function replaceWorkoutExercise(dayId, weId, exercise) {
    updateWorkoutExercise(dayId, weId, { exerciseId: exercise.id });
    setLibraryFor(null);
  }
  function createCustomExercise(exercise) {
    updateCustomExercises([...customExercises, exercise]);
  }

  if (!openDay) {
    return (
      <div className="fit-program">
        <p className="fit-program-hint">
          Your fixed weekly program. Tap a day to reorder exercises, swap one out, or adjust sets/reps/rest —
          the exercises themselves already know their own muscles and equipment.
        </p>
        <div className="fit-program-grid">
          {workouts.map((day) => (
            <DayCard key={day.id} day={day} allExercises={allExercises} onOpen={setOpenDayId} />
          ))}
        </div>
      </div>
    );
  }

  const resolvedExercises = openDay.exercises.map((we) => findExercise(we.exerciseId, customExercises)).filter(Boolean);

  return (
    <div className="fit-workout-editor">
      <div className="fit-workout-editor-head">
        <button type="button" className="fit-ghost-btn" onClick={() => setOpenDayId(null)}>← My Program</button>
        <h3>{openDay.name}</h3>
      </div>

      <MuscleHeatmap exercises={resolvedExercises} title={`${openDay.name} — muscles trained`} />

      <ul className="fit-workout-editor-list">
        {openDay.exercises.map((we, i) => {
          const exercise = findExercise(we.exerciseId, customExercises);
          if (!exercise) return null;
          return (
            <li key={we.id}>
              <ExerciseCard
                exercise={exercise}
                sets={we.sets}
                minReps={we.minReps}
                maxReps={we.maxReps}
                restSeconds={we.restSeconds}
                allExercises={allExercises}
                onOpenDetails={setDetailsExercise}
                actions={
                  <div className="fit-ex-editor-actions">
                    <button type="button" className="fit-icon-btn" disabled={i === 0} onClick={() => moveWorkoutExercise(openDay.id, i, -1)} aria-label="Move up">↑</button>
                    <button type="button" className="fit-icon-btn" disabled={i === openDay.exercises.length - 1} onClick={() => moveWorkoutExercise(openDay.id, i, 1)} aria-label="Move down">↓</button>
                    <button type="button" className="fit-icon-btn" onClick={() => removeWorkoutExercise(openDay.id, we.id)} aria-label="Remove exercise">✕</button>
                  </div>
                }
              >
                <div className="fit-ex-editor-row">
                  <label>Sets <input type="number" min="1" value={we.sets ?? ''} onChange={(e) => updateWorkoutExercise(openDay.id, we.id, { sets: e.target.value === '' ? null : Number(e.target.value) })} /></label>
                  <label>Min reps <input type="number" min="0" value={we.minReps ?? ''} onChange={(e) => updateWorkoutExercise(openDay.id, we.id, { minReps: e.target.value === '' ? null : Number(e.target.value) })} /></label>
                  <label>Max reps <input type="number" min="0" value={we.maxReps ?? ''} onChange={(e) => updateWorkoutExercise(openDay.id, we.id, { maxReps: e.target.value === '' ? null : Number(e.target.value) })} /></label>
                  <label>Rest (s) <input type="number" min="0" step="15" value={we.restSeconds ?? ''} onChange={(e) => updateWorkoutExercise(openDay.id, we.id, { restSeconds: e.target.value === '' ? null : Number(e.target.value) })} /></label>
                  <button type="button" className="fit-ghost-btn" onClick={() => setLibraryFor({ mode: 'replace', weId: we.id })}>Replace</button>
                </div>
                <input
                  className="fit-ex-editor-notes"
                  value={we.notes || ''}
                  onChange={(e) => updateWorkoutExercise(openDay.id, we.id, { notes: e.target.value })}
                  placeholder="note (optional)"
                />
              </ExerciseCard>
            </li>
          );
        })}
      </ul>

      <button type="button" className="fit-ghost-btn fit-btn-primary fit-add-ex-btn" onClick={() => setLibraryFor({ mode: 'add' })}>
        + Add Exercise
      </button>

      {detailsExercise && (
        <ExerciseDetails
          exercise={detailsExercise}
          logs={state.logs}
          customExercises={customExercises}
          onClose={() => setDetailsExercise(null)}
        />
      )}

      {libraryFor && (
        <ExerciseLibrary
          allExercises={allExercises}
          replacing={libraryFor.mode === 'replace' ? findExercise(openDay.exercises.find((e) => e.id === libraryFor.weId)?.exerciseId, customExercises) : null}
          onCreateCustom={createCustomExercise}
          onSelect={(exercise) => (libraryFor.mode === 'replace'
            ? replaceWorkoutExercise(openDay.id, libraryFor.weId, exercise)
            : addWorkoutExercise(openDay.id, exercise))}
          onClose={() => setLibraryFor(null)}
        />
      )}
    </div>
  );
}
