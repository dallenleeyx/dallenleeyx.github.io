// lib/fitness/exerciseUtils.js — pure helpers built on top of the canonical
// Exercise catalog (exerciseCatalog.js): search with alias support,
// gym-availability checking, exercise-level substitute ranking, and
// previous-performance lookups against logged history. Kept
// dependency-free of React so it's easy to reason about and reuse from
// both components and (if ever needed) an API route.
import { EXERCISE_CATALOG, findExerciseById } from './exerciseCatalog';
import { findEquipment } from './equipmentCatalog';
import { isEquipmentAvailableAtGym } from './gymUtils';

// Custom exercises (user-created, or auto-migrated from the old workout
// format -- see syncMerge.js) live in state.customExercises.list and are
// always unioned with the built-in catalog so the rest of the app can
// treat "all exercises" as one flat list.
export function getAllExercises(customExercises) {
  return [...EXERCISE_CATALOG, ...(customExercises || [])];
}

export function findExercise(id, customExercises) {
  return findExerciseById(id, customExercises || []);
}

function normalize(s) {
  return String(s || '').trim().toLowerCase();
}

// Search matches canonical name, aliases, and body part/muscle -- so "RDL"
// finds Romanian Deadlift, "pulldown" finds Lat Pulldown, and "rear delt"
// finds Reverse Pec Deck, all without the caller needing to know canonical
// names up front.
export function searchExercises(query, allExercises, { bodyPart, muscle, movementPattern, equipmentType } = {}) {
  const q = normalize(query);
  return allExercises.filter((e) => {
    if (bodyPart && !e.bodyParts.includes(bodyPart)) return false;
    if (movementPattern && e.movementPattern !== movementPattern) return false;
    if (muscle && !e.primaryMuscles.includes(muscle) && !e.secondaryMuscles.includes(muscle)) return false;
    if (equipmentType) {
      const ids = (e.equipmentSlots || []).flat();
      const hasType = ids.some((id) => (findEquipment(id)?.types || []).includes(equipmentType));
      if (!hasType) return false;
    }
    if (!q) return true;
    const haystack = [e.canonicalName, ...(e.aliases || []), ...e.bodyParts, ...e.primaryMuscles]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

// An exercise with no equipment slots (bodyweight, e.g. Plank) is always
// available. Otherwise every slot needs at least one of its options at the
// gym -- see exerciseCatalog.js's header comment for why slots (not one
// flat list) are needed to represent "needs a barbell AND a bench".
export function exerciseFitsGym(exercise, gym) {
  if (!exercise?.equipmentSlots?.length) return true;
  if (!gym) return true;
  return exercise.equipmentSlots.every((slot) => slot.some((id) => isEquipmentAvailableAtGym(gym, id)));
}

// The canonical (first-listed) equipment id for each slot -- what gets
// shown in compact UI as "Equipment: X" / "Equipment: X + Y".
export function primaryEquipmentIds(exercise) {
  return (exercise?.equipmentSlots || []).map((slot) => slot[0]);
}

export function primaryEquipmentNames(exercise) {
  return primaryEquipmentIds(exercise).map((id) => findEquipment(id)?.name).filter(Boolean);
}

function overlapCount(a, b) {
  if (!a?.length || !b?.length) return 0;
  const set = new Set(a);
  return b.filter((x) => set.has(x)).length;
}

// Shared scoring for "how similar is `e` to `exercise`": shared primary
// muscle (weighted highest), movement pattern match, secondary muscle
// overlap, and body part overlap -- gated behind a "strong signal"
// requirement (primary muscle match OR movement-pattern match) so a weak
// secondary-only overlap can't manufacture a false match. Returns 0 for no
// meaningful similarity.
function similarityScore(exercise, e) {
  const primaryScore = 3 * overlapCount(exercise.primaryMuscles, e.primaryMuscles);
  const movementMatch = e.movementPattern === exercise.movementPattern;
  const strongSignal = primaryScore > 0 || movementMatch;
  if (!strongSignal) return 0;
  return (
    primaryScore +
    (movementMatch ? 2 : 0) +
    overlapCount(exercise.secondaryMuscles, e.secondaryMuscles) +
    (overlapCount(exercise.bodyParts, e.bodyParts) ? 1 : 0)
  );
}

// Ranks other catalog exercises as substitutes when `exercise` doesn't fit
// the given gym, restricted to exercises that actually DO fit the gym. This
// operates one level up from the old (pre-rework) equipment-level
// substitution: it now recommends a whole alternative EXERCISE, matching
// how a trainer would actually reason about "the machine's taken/missing,
// what else works the same muscles the same way" -- see gymUtils.js's
// header comment for the equipment-level version this replaces for
// exercise-driven flows.
export function findSubstituteExercises(exercise, gym, allExercises, { limit = 3 } = {}) {
  if (!exercise || !gym) return [];
  const candidates = allExercises.filter((e) => e.id !== exercise.id && exerciseFitsGym(e, gym));
  return candidates
    .map((e) => ({ item: e, score: similarityScore(exercise, e) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

// The "Replace Exercise" ranking used by the workout editor's Exercise
// Library: same similarity scoring, but over the WHOLE library (not
// gated to one gym's inventory) since replacing an exercise in the actual
// program should surface the best training match first, regardless of
// which gym you happen to be picking it from.
export function rankSimilarExercises(exercise, allExercises, { limit = 8 } = {}) {
  if (!exercise) return [];
  return allExercises
    .filter((e) => e.id !== exercise.id)
    .map((e) => ({ item: e, score: similarityScore(exercise, e) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

// Looks back through logged days (most recent first) for the last time this
// exercise was logged with actual sets, so the UI can show "last time: 55kg
// x 10/10/9" and offer a one-tap copy into today's sets.
export function findPreviousPerformance(exerciseId, logs, { beforeDateISO, customExercises } = {}) {
  const exercise = findExercise(exerciseId, customExercises);
  if (!exercise) return null;
  const dates = Object.keys(logs || {}).sort().reverse();
  for (const date of dates) {
    if (beforeDateISO && date >= beforeDateISO) continue;
    const manual = logs[date]?.manual;
    if (!manual?.exercises) continue;
    const match = manual.exercises.find((e) => e.exerciseId === exerciseId || e.name === exercise.canonicalName);
    if (!match) continue;
    const sets = (match.sets || []).filter((s) => s != null);
    if (!sets.length) continue;
    return { date, sets };
  }
  return null;
}

// Scans every logged day (not just the most recent) for the heaviest
// logged set of this exercise, for the Exercise Details "best" line.
export function findBestPerformance(exerciseId, logs, { customExercises } = {}) {
  const exercise = findExercise(exerciseId, customExercises);
  if (!exercise) return null;
  let best = null;
  for (const date of Object.keys(logs || {})) {
    const manual = logs[date]?.manual;
    if (!manual?.exercises) continue;
    const match = manual.exercises.find((e) => e.exerciseId === exerciseId || e.name === exercise.canonicalName);
    if (!match) continue;
    (match.sets || []).forEach((raw) => {
      const s = typeof raw === 'number' ? { weight: null, reps: raw } : raw;
      if (s?.weight == null) return;
      if (!best || s.weight > best.weight) best = { date, weight: s.weight, reps: s.reps };
    });
  }
  return best;
}

// Aggregates a whole workout day's exercises into one muscle "coverage"
// summary for the Level-1 (workout-day) diagram -- see MuscleHeatmap.jsx.
// A muscle trained as the primary target of 2+ exercises reads "high";
// primary once (or secondary in several) reads "moderate"; secondary once
// reads "low". This is a coarse, visual-only signal, not a volume metric.
export function aggregateWorkoutMuscles(exercises) {
  const primaryCount = {};
  const secondaryCount = {};
  exercises.forEach((e) => {
    (e.primaryMuscles || []).forEach((m) => { primaryCount[m] = (primaryCount[m] || 0) + 1; });
    (e.secondaryMuscles || []).forEach((m) => { secondaryCount[m] = (secondaryCount[m] || 0) + 1; });
  });
  const muscles = new Set([...Object.keys(primaryCount), ...Object.keys(secondaryCount)]);
  const coverage = [...muscles].map((muscle) => {
    const p = primaryCount[muscle] || 0;
    const s = secondaryCount[muscle] || 0;
    let level = 'low';
    if (p >= 2) level = 'high';
    else if (p >= 1 || s >= 2) level = 'moderate';
    return { muscle, level, primaryCount: p, secondaryCount: s };
  });
  coverage.sort((a, b) => (b.primaryCount * 2 + b.secondaryCount) - (a.primaryCount * 2 + a.secondaryCount));
  return {
    coverage,
    primary: [...new Set(Object.keys(primaryCount))],
    secondary: [...new Set(Object.keys(secondaryCount))].filter((m) => !primaryCount[m]),
  };
}

// A simple, optional nudge -- never an automatic change. If every logged
// set last time met or exceeded the top of the exercise's target rep range,
// suggest trying more weight next time.
export function progressionSuggestion(previous, targetMaxReps) {
  if (!previous?.sets?.length || !targetMaxReps) return null;
  const allAtOrAboveTop = previous.sets.every((s) => {
    const reps = typeof s === 'number' ? s : s?.reps;
    return reps != null && reps >= targetMaxReps;
  });
  return allAtOrAboveTop ? 'Consider increasing weight next session.' : null;
}
