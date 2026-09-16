// lib/fitness/gymUtils.js — pure helpers shared by the Gym Profiles UI and
// the workout-integration logic in DailyLog.jsx. Kept dependency-free of
// React/sync state so it's easy to reason about and test in isolation.
import { CATEGORIES, EQUIPMENT_CATALOG, findEquipment } from './equipmentCatalog';

// A gym's `equipment` list holds entries of the shape:
//   { id, catalogId: string|null, name, categories, unavailable, note }
// `catalogId` is set for catalog-backed equipment (name/categories/muscles/
// types/movement are then looked up live from the catalog, so editing the
// catalog -- e.g. someday adding better tags -- retroactively improves every
// gym that already has that item). `catalogId: null` means a fully custom
// piece of equipment the user typed in themselves; `name`/`categories` are
// then read straight off the entry instead.
export function resolveGymEquipment(entry) {
  if (entry.catalogId) {
    const cat = findEquipment(entry.catalogId);
    if (cat) {
      return {
        id: entry.id,
        catalogId: entry.catalogId,
        name: cat.name,
        categories: cat.categories,
        muscles: cat.muscles,
        types: cat.types,
        movement: cat.movement,
        unavailable: !!entry.unavailable,
        note: entry.note || '',
        isCustom: false,
      };
    }
  }
  return {
    id: entry.id,
    catalogId: null,
    name: entry.name || 'Custom equipment',
    categories: entry.categories && entry.categories.length ? entry.categories : ['other'],
    muscles: { primary: [], secondary: [] },
    types: [],
    movement: null,
    unavailable: !!entry.unavailable,
    note: entry.note || '',
    isCustom: true,
  };
}

// Groups a gym's equipment by category for the "Chest — 6 machines" style
// breakdown, in the same order as CATEGORIES (plus a trailing "Other" bucket
// for custom equipment nobody categorized).
export function groupGymEquipmentByCategory(gym) {
  const resolved = (gym?.equipment || []).map(resolveGymEquipment);
  const groups = CATEGORIES.map((c) => ({
    ...c,
    items: resolved.filter((r) => r.categories.includes(c.id)),
  }));
  const other = resolved.filter((r) => !CATEGORIES.some((c) => r.categories.includes(c.id)));
  if (other.length) groups.push({ id: 'other', label: 'Other', items: other });
  return groups;
}

export function isEquipmentAvailableAtGym(gym, catalogId) {
  if (!gym) return false;
  return (gym.equipment || []).some((e) => e.catalogId === catalogId && !e.unavailable);
}

// Does this exercise have everything it needs at this gym? An exercise with
// no `equipmentIds` (bodyweight-only, or never tagged) is always considered
// fine -- we only ever warn when we're confident something's missing, never
// when we simply don't know.
export function exerciseFitsGym(exercise, gym) {
  if (!exercise?.equipmentIds?.length) return true;
  if (!gym) return true;
  return exercise.equipmentIds.some((id) => isEquipmentAvailableAtGym(gym, id));
}

function overlapCount(a, b) {
  if (!a?.length || !b?.length) return 0;
  const set = new Set(a);
  return b.filter((x) => set.has(x)).length;
}

// Movement tags too generic to mean much on their own -- shared by dozens of
// unrelated exercises, so a match on one of these alone shouldn't be enough
// to call something a substitute (see the "strong signal" gate below).
const GENERIC_MOVEMENTS = ['isolation', 'compound'];

// Ranks catalog equipment available at `gym` as substitutes for an exercise
// whose usual equipment isn't available there. Primary-muscle match is
// anchored to the exercise's own tagged `muscleGroup` rather than the union
// of its acceptable equipment's own primary muscles -- some equipment
// (cable stations, Smith machines) serves several unrelated exercises, and
// unioning its full muscle profile would otherwise pull the target toward
// whatever else that equipment happens to train. An item only qualifies at
// all if it shares that primary muscle or a *specific* movement pattern
// (squat/hinge/push/pull/core/cardio, not the generic isolation/compound) --
// secondary-muscle and category overlap only add to a score that already
// has one of those, so they can't manufacture a match by themselves.
export function suggestSubstitutes(exercise, gym, { limit = 4 } = {}) {
  if (!exercise?.equipmentIds?.length || !gym) return [];
  const usual = exercise.equipmentIds.map(findEquipment).filter(Boolean);
  if (!usual.length) return [];

  const primaryTargets = exercise.muscleGroup
    ? [exercise.muscleGroup]
    : [...new Set(usual.flatMap((e) => e.muscles.primary))];
  const secondaryTargets = [...new Set(usual.flatMap((e) => [...e.muscles.primary, ...e.muscles.secondary]))]
    .filter((m) => !primaryTargets.includes(m));
  const categoryTargets = [...new Set(usual.flatMap((e) => e.categories))];
  const movementTargets = [...new Set(usual.map((e) => e.movement).filter(Boolean))];
  const usualIds = new Set(exercise.equipmentIds);

  const availableIds = new Set(
    (gym.equipment || []).filter((e) => e.catalogId && !e.unavailable).map((e) => e.catalogId)
  );

  const scored = EQUIPMENT_CATALOG
    .filter((item) => availableIds.has(item.id) && !usualIds.has(item.id))
    .map((item) => {
      const primaryScore = 3 * overlapCount(primaryTargets, item.muscles.primary);
      const specificMovementMatch = movementTargets.includes(item.movement) && !GENERIC_MOVEMENTS.includes(item.movement);
      const strongSignal = primaryScore > 0 || specificMovementMatch;
      if (!strongSignal) return { item, score: 0 };

      const score =
        primaryScore +
        (specificMovementMatch ? 2 : 0) +
        overlapCount(secondaryTargets, [...item.muscles.primary, ...item.muscles.secondary]) +
        (overlapCount(categoryTargets, item.categories) ? 1 : 0);
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);

  return scored;
}
