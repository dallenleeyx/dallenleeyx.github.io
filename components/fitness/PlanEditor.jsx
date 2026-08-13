'use client';
// components/fitness/PlanEditor.jsx — the weekly template: seven day cards
// (title + exercise list), fully editable. No AI generation -- you (or a
// real trainer) write the plan, this just holds and syncs it.
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { DAY_KEYS, DAY_LABELS, uid } from '../../lib/fitness/defaultPlan';

export function PlanEditor() {
  const { state, loading, updatePlan } = useFitness();

  if (loading) return <p className="fit-empty">Loading…</p>;

  const days = state.plan.days;

  function updateDay(dayKey, patch) {
    updatePlan({ ...days, [dayKey]: { ...days[dayKey], ...patch } });
  }
  function updateExercise(dayKey, exId, patch) {
    const day = days[dayKey];
    updateDay(dayKey, { exercises: day.exercises.map((ex) => (ex.id === exId ? { ...ex, ...patch } : ex)) });
  }
  function addExercise(dayKey) {
    const day = days[dayKey];
    updateDay(dayKey, { exercises: [...day.exercises, { id: uid(), name: '', sets: 3, reps: '' }] });
  }
  function removeExercise(dayKey, exId) {
    const day = days[dayKey];
    updateDay(dayKey, { exercises: day.exercises.filter((ex) => ex.id !== exId) });
  }

  return (
    <div className="fit-plan-grid">
      {DAY_KEYS.map((dayKey) => {
        const day = days[dayKey];
        return (
          <div key={dayKey} className="fit-day-card">
            <div className="fit-day-card-head">
              <span className="fit-day-label">{DAY_LABELS[dayKey]}</span>
              <input
                className="fit-day-title-input"
                value={day.title}
                onChange={(e) => updateDay(dayKey, { title: e.target.value })}
                placeholder="Day title (e.g. Push, Rest)"
              />
            </div>

            <ul className="fit-plan-exercise-list">
              {day.exercises.map((ex) => (
                <li key={ex.id} className="fit-plan-exercise-row">
                  <input
                    className="fit-ex-name-input"
                    value={ex.name}
                    onChange={(e) => updateExercise(dayKey, ex.id, { name: e.target.value })}
                    placeholder="Exercise name"
                  />
                  <input
                    className="fit-ex-sets-input"
                    type="number"
                    min="0"
                    value={ex.sets}
                    onChange={(e) => updateExercise(dayKey, ex.id, { sets: e.target.value === '' ? '' : Number(e.target.value) })}
                    aria-label="Sets"
                  />
                  <span className="fit-ex-x">×</span>
                  <input
                    className="fit-ex-reps-input"
                    value={ex.reps}
                    onChange={(e) => updateExercise(dayKey, ex.id, { reps: e.target.value })}
                    placeholder="reps"
                    aria-label="Reps"
                  />
                  <button
                    type="button"
                    className="fit-ex-remove-btn"
                    onClick={() => removeExercise(dayKey, ex.id)}
                    aria-label="Remove exercise"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" className="fit-ghost-btn fit-add-ex-btn" onClick={() => addExercise(dayKey)}>
              + add exercise
            </button>
          </div>
        );
      })}
    </div>
  );
}
