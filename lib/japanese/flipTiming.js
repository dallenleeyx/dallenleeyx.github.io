// lib/japanese/flipTiming.js — shared timing constant for the card flip-back
// animation (must match japanese.css's `.card { transition: transform .5s }`)
// so JS-side grading delays (see Flashcards.jsx and Conjugation.jsx's
// ByFormPractice) never swap a card's content until its flip-back has
// visually finished rotating past the perpendicular point where
// backface-visibility actually hides it.
export const CARD_FLIP_MS = 500;

export function cardFlipDelay() {
  if (typeof window === 'undefined' || !window.matchMedia) return CARD_FLIP_MS;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : CARD_FLIP_MS;
}
