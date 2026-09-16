// lib/fitness/gymUtils.js — pure helpers for the Gym Profiles UI: resolving
// a gym's saved equipment entries against the catalog, grouping them for
// display, and checking whether a given catalog id is available. Exercise-
// level availability/substitution (which exercise fits a gym, what to
// suggest instead) now lives in exerciseUtils.js, one level up from here --
// see its header comment for why substitution moved from "recommend other
// equipment" to "recommend other exercises" in the workout-architecture
// rework.
import { CATEGORIES, findEquipment } from './equipmentCatalog';

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
