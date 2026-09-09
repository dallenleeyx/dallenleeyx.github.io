'use client';
// components/fitness/WorkoutLibrary.jsx — the workout library: named,
// reusable workouts (e.g. "Workout A — Upper Pull + Chest") instead of a
// fixed Monday-Sunday template, since the rotation runs by "whichever
// workout comes next" rather than by weekday. Fully editable: rename a
// workout, add/remove/edit its exercises, or add/delete a whole workout.
// Schedule.jsx assigns these to upcoming dates; Today.jsx logs actual
// performance against whichever one you pick for that day.
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { uid } from '../../lib/fitness/util';

export function WorkoutLibrary() {
  const { state, loading, updateWorkouts } = useFitness();

  if (loading) return <p className="fit-empty">Loading…</p>;

  const workouts = state.workouts.list;

  function updateWorkout(workoutId, patch) {
    updateWorkouts(workouts.map((w) => (w.id === workoutId ? { ...w, ...patch } : w)));
  }
  function updateExercise(workoutId, exId, patch) {
    const workout = workouts.find((w) => w.id === workoutId);
    updateWorkout(workoutId, { exercises: workout.exercises.map((ex) => (ex.id === exId ? { ...ex, ...patch } : ex)) });
  }
  function addExercise(workoutId) {
    const workout = workouts.find((w) => w.id === workoutId);
    updateWorkout(workoutId, { exercises: [...workout.exercises, { id: uid(), name: '', sets: 3, reps: '' }] });
  }
  function removeExercise(workoutId, exId) {
    const workout = workouts.find((w) => w.id === workoutId);
    updateWorkout(workoutId, { exercises: workout.exercises.filter((ex) => ex.id !== exId) });
  }
  function addWorkout() {
    updateWorkouts([...workouts, { id: uid(), name: 'New workout', exercises: [] }]);
  }
  function removeWorkout(workoutId) {
    if (!window.confirm('Delete this workout? This does not affect logs you’ve already recorded.')) return;
    updateWorkouts(workouts.filter((w) => w.id !== workoutId));
  }

  return (
    <div className="fit-plan-grid">
      {workouts.map((workout) => (
        <div key={workout.id} className="fit-day-card">
          <div className="fit-day-card-head fit-workout-card-head">
            <input
              className="fit-day-title-input"
              value={workout.name}
              onChange={(e) => updateWorkout(workout.id, { name: e.target.value })}
              placeholder="Workout name (e.g. Workout A — Upper Pull + Chest)"
            />
            <button type="button" className="fit-icon-btn" onClick={() => removeWorkout(workout.id)} aria-label="Delete workout">✕</button>
          </div>

          <ul className="fit-plan-exercise-list">
            {workout.exercises.map((ex) => (
              <li key={ex.id} className="fit-plan-exercise-row">
                <input
                  className="fit-ex-name-input"
                  value={ex.name}
                  onChange={(e) => updateExercise(workout.id, ex.id, { name: e.target.value })}
                  placeholder="Exercise name"
                />
                <input
                  className="fit-ex-sets-input"
                  type="number"
                  min="0"
                  value={ex.sets}
                  onChange={(e) => updateExercise(workout.id, ex.id, { sets: e.target.value === '' ? '' : Number(e.target.value) })}
                  aria-label="Sets"
                />
                <span className="fit-ex-x">×</span>
                <input
                  className="fit-ex-reps-input"
                  value={ex.reps}
                  onChange={(e) => updateExercise(workout.id, ex.id, { reps: e.target.value })}
                  placeholder="reps"
                  aria-label="Reps"
                />
                <button
                  type="button"
                  className="fit-ex-remove-btn"
                  onClick={() => removeExercise(workout.id, ex.id)}
                  aria-label="Remove exercise"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className="fit-ghost-btn fit-add-ex-btn" onClick={() => addExercise(workout.id)}>
            + add exercise
          </button>
        </div>
      ))}

      <button type="button" className="fit-ghost-btn fit-btn-primary fit-add-workout-btn" onClick={addWorkout}>
        + add workout
      </button>
    </div>
  );
}
