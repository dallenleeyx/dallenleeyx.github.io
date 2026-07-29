// lib/japanese/conjugationForms.js — the 8 conjugation forms drilled by
// Conjugation's three practice modes, in the fixed teaching order used by
// "By verb"'s breadcrumb. Labels are always shown in Japanese script
// regardless of the UI language toggle -- these ARE the Japanese
// grammatical terms, not translatable chrome text.
export const FORM_LABELS = {
  te: 'て形',
  ta: 'た形',
  potential: '可能形',
  ba: 'ば形',
  volitional: 'う・よう形',
  passive: '受身形',
  causative: '使役形',
  causativePassive: '使役受身形',
};

export const FORM_SEQUENCE = Object.keys(FORM_LABELS);
