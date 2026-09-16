'use client';
// components/fitness/ExerciseLibrary.jsx — the "Add Exercise" / "Replace
// Exercise" picker: searches the canonical Exercise catalog (aliases
// included, so "RDL", "pulldown", "rear delt" all resolve) and filters by
// body part / muscle / equipment type / movement pattern. Selecting an
// exercise hands back the whole canonical record -- the caller never needs
// to configure muscles/equipment afterward, since that's the entire point
// of the workout-architecture rework.
import { useMemo, useState } from 'react';
import { BODY_PARTS, MOVEMENT_PATTERNS } from '../../lib/fitness/exerciseCatalog';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES, EQUIPMENT_CATALOG } from '../../lib/fitness/equipmentCatalog';
import { searchExercises, rankSimilarExercises, primaryEquipmentNames } from '../../lib/fitness/exerciseUtils';
import { uid } from '../../lib/fitness/util';
import { ExerciseThumb } from './ExerciseCard';

function ResultRow({ exercise, onSelect }) {
  const equipmentNames = primaryEquipmentNames(exercise);
  return (
    <li className="fit-ex-lib-row">
      <ExerciseThumb exercise={exercise} onClick={() => onSelect(exercise)} size={44} />
      <div className="fit-ex-lib-row-info">
        <span className="fit-ex-lib-row-name">{exercise.canonicalName}</span>
        <span className="fit-ex-lib-row-meta">
          {exercise.primaryMuscles.join(', ')}
          {equipmentNames.length ? ` · ${equipmentNames.join(' + ')}` : ' · bodyweight'}
        </span>
      </div>
      <button type="button" className="fit-ghost-btn fit-btn-primary" onClick={() => onSelect(exercise)}>Use</button>
    </li>
  );
}

const emptyCustomDraft = { name: '', primaryMuscle: '', secondaryMuscle: '', movementPattern: '', equipmentId: '', gifUrl: '', notes: '' };

export function ExerciseLibrary({ allExercises, onSelect, onClose, onCreateCustom, replacing = null }) {
  const [query, setQuery] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [muscle, setMuscle] = useState('');
  const [movementPattern, setMovementPattern] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [draft, setDraft] = useState(emptyCustomDraft);

  const suggestions = useMemo(
    () => (replacing ? rankSimilarExercises(replacing, allExercises, { limit: 5 }) : []),
    [replacing, allExercises]
  );

  const results = useMemo(
    () => searchExercises(query, allExercises, {
      bodyPart: bodyPart || undefined,
      muscle: muscle || undefined,
      movementPattern: movementPattern || undefined,
      equipmentType: equipmentType || undefined,
    }),
    [query, bodyPart, muscle, movementPattern, equipmentType, allExercises]
  );

  function submitCustom() {
    if (!draft.name.trim() || !draft.primaryMuscle) return;
    const exercise = {
      id: `custom-${uid()}`,
      canonicalName: draft.name.trim(),
      aliases: [],
      bodyParts: [],
      primaryMuscles: [draft.primaryMuscle],
      secondaryMuscles: draft.secondaryMuscle ? [draft.secondaryMuscle] : [],
      movementPattern: draft.movementPattern || null,
      equipmentSlots: draft.equipmentId ? [[draft.equipmentId]] : [],
      instructions: draft.notes ? [draft.notes] : [],
      demoMedia: draft.gifUrl ? { source: 'custom', url: draft.gifUrl } : null,
      apiSource: 'custom',
      apiExerciseId: null,
      custom: true,
    };
    onCreateCustom?.(exercise);
    onSelect(exercise);
  }

  return (
    <div className="fit-modal-backdrop" onClick={onClose}>
      <div className="fit-modal fit-ex-library" onClick={(e) => e.stopPropagation()}>
        <div className="fit-modal-head">
          <h3>{replacing ? `Replace "${replacing.canonicalName}"` : 'Add Exercise'}</h3>
          <button type="button" className="fit-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {suggestions.length > 0 && (
          <div className="fit-ex-lib-suggestions">
            <span className="fit-ex-lib-suggestions-label">Ranked alternatives</span>
            <ul className="fit-ex-lib-list">
              {suggestions.map((e) => <ResultRow key={e.id} exercise={e} onSelect={onSelect} />)}
            </ul>
          </div>
        )}

        <input
          className="fit-ex-lib-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises (e.g. lat, RDL, rear delt)"
          autoFocus
        />

        <div className="fit-ex-lib-filters">
          <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
            <option value="">Body part</option>
            {BODY_PARTS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
          <select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            <option value="">Muscle</option>
            {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={movementPattern} onChange={(e) => setMovementPattern(e.target.value)}>
            <option value="">Movement</option>
            {MOVEMENT_PATTERNS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
            <option value="">Equipment</option>
            {EQUIPMENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <ul className="fit-ex-lib-list">
          {results.map((e) => <ResultRow key={e.id} exercise={e} onSelect={onSelect} />)}
          {results.length === 0 && <li className="fit-empty">No exercises match.</li>}
        </ul>

        <div className="fit-ex-lib-custom">
          <button type="button" className="fit-ghost-btn" onClick={() => setCreatingCustom((v) => !v)}>
            {creatingCustom ? 'Cancel' : "Can't find it? + Create custom exercise"}
          </button>
          {creatingCustom && (
            <div className="fit-ex-lib-custom-form">
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Exercise name"
              />
              <select value={draft.primaryMuscle} onChange={(e) => setDraft((d) => ({ ...d, primaryMuscle: e.target.value }))}>
                <option value="">Primary muscle</option>
                {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={draft.secondaryMuscle} onChange={(e) => setDraft((d) => ({ ...d, secondaryMuscle: e.target.value }))}>
                <option value="">Secondary muscle (optional)</option>
                {MUSCLE_GROUPS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={draft.movementPattern} onChange={(e) => setDraft((d) => ({ ...d, movementPattern: e.target.value }))}>
                <option value="">Movement pattern (optional)</option>
                {MOVEMENT_PATTERNS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={draft.equipmentId} onChange={(e) => setDraft((d) => ({ ...d, equipmentId: e.target.value }))}>
                <option value="">Equipment (optional)</option>
                {EQUIPMENT_CATALOG.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
              <input
                value={draft.gifUrl}
                onChange={(e) => setDraft((d) => ({ ...d, gifUrl: e.target.value }))}
                placeholder="Image/GIF URL (optional)"
              />
              <input
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Notes (optional)"
              />
              <button
                type="button"
                className="fit-ghost-btn fit-btn-primary"
                disabled={!draft.name.trim() || !draft.primaryMuscle}
                onClick={submitCustom}
              >
                Create &amp; use
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
