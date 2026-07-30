// lib/japanese/verbFormCycle.js — pure linear cycle for Conjugation's
// "By verb" mode: walks ONE verb through all 8 forms in a fixed order (no
// queue, no requeuing), so the breadcrumb always shows the whole sequence
// with the current form highlighted and finished ones marked correct/wrong.
import { FORM_SEQUENCE } from './conjugationForms';

export function startVerbCycle(verb) {
  return { verb, formIndex: 0, results: FORM_SEQUENCE.map(() => null), flipped: false };
}

export function flipVerbCard(state) {
  if (!state.verb || state.formIndex >= FORM_SEQUENCE.length) return state;
  return { ...state, flipped: !state.flipped };
}

// Callers are expected to only grade a flipped card -- the flipped check
// itself lives on the caller side (see Conjugation.jsx's ByVerbPractice),
// which delays this call until after the flip-back animation finishes and
// so needs to call unflipVerbCard() first, at which point state.flipped is
// already false.
export function gradeVerbForm(state, isCorrect) {
  if (!state.verb || state.formIndex >= FORM_SEQUENCE.length) return state;
  const results = state.results.slice();
  results[state.formIndex] = isCorrect;
  return { ...state, results, formIndex: state.formIndex + 1, flipped: false };
}

export function unflipVerbCard(state) {
  return { ...state, flipped: false };
}
