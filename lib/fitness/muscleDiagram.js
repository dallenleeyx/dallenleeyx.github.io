// lib/fitness/muscleDiagram.js — turns equipmentCatalog.js's loose muscle
// names (e.g. "quads", "back") into a muscle diagram image URL from
// Anatome (https://anatome.dev, hosted API at api.anatome.dev), a free,
// Apache-2.0-licensed muscle-group image generator. This is a pure
// client-side <img src>, called directly by the viewer's own browser --
// no server-side fetch, no API key, no bundled dataset -- so there's
// nothing to self-host and nothing that can go stale.
//
// Anatome's own muscle slugs are a fixed 23-item vocabulary (see their
// src/data/muscleCatalog.js); this file's ANATOME_SLUG map is this app's
// translation from equipmentCatalog.js's muscle names to those slugs.
// "full-body" and "cardio" aren't real muscles, so they intentionally have
// no mapping -- buildMuscleImageUrl just omits whatever it can't translate.
const ANATOME_SLUG = {
  chest: 'chest',
  back: 'upper-back',
  shoulders: 'deltoids',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearm',
  quads: 'quadriceps',
  hamstrings: 'hamstring',
  glutes: 'gluteal',
  calves: 'calves',
  adductors: 'adductors',
  core: 'abs',
  'lower-back': 'lower-back',
};

const ANATOME_API_BASE = 'https://api.anatome.dev/generateImage';
const PRIMARY_COLOR = 'DC2626';
const SECONDARY_COLOR = 'F59E0B';

export const MUSCLE_DIAGRAM_ATTRIBUTION = 'Muscle diagrams via Anatome (anatome.dev)';

function toSlugs(names) {
  return [...new Set((names || []).map((n) => ANATOME_SLUG[n]).filter(Boolean))];
}

// Returns null when neither muscle list maps to anything drawable (e.g. a
// "full-body" free-weight tool, or an untagged custom exercise) so callers
// can skip rendering entirely instead of showing a blank/broken image.
export function buildMuscleImageUrl({ primary, secondary, view = 'front', gender = 'male', width = 260 } = {}) {
  const primarySlugs = toSlugs(primary);
  const secondarySlugs = toSlugs(secondary).filter((s) => !primarySlugs.includes(s));
  if (!primarySlugs.length && !secondarySlugs.length) return null;

  const layers = [];
  if (primarySlugs.length) layers.push(`${PRIMARY_COLOR}:${primarySlugs.join(',')}`);
  if (secondarySlugs.length) layers.push(`${SECONDARY_COLOR}:${secondarySlugs.join(',')}`);

  const params = new URLSearchParams({ gender, view, width: String(width), layers: layers.join('|'), output: 'raw' });
  return `${ANATOME_API_BASE}?${params.toString()}`;
}
