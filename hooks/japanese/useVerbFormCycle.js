'use client';
// hooks/japanese/useVerbFormCycle.js — React wrapper around
// lib/japanese/verbFormCycle.js for Conjugation's "By verb" mode.
import { useCallback, useState } from 'react';
import { startVerbCycle, flipVerbCard, gradeVerbForm, unflipVerbCard } from '../../lib/japanese/verbFormCycle';

export function useVerbFormCycle(initialVerb) {
  const [state, setState] = useState(() => startVerbCycle(initialVerb || null));

  const start = useCallback((verb) => setState(startVerbCycle(verb)), []);
  const flip = useCallback(() => setState((prev) => flipVerbCard(prev)), []);
  const unflip = useCallback(() => setState((prev) => unflipVerbCard(prev)), []);
  const grade = useCallback((isCorrect) => setState((prev) => gradeVerbForm(prev, isCorrect)), []);

  return { ...state, start, flip, unflip, grade };
}
