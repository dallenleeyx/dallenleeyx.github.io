// lib/math/items.js — shared constants for the Math revision section.
// Courses are a fixed short list (add more here as needed) rather than a
// user-managed list, since there are only ever a couple of live modules at
// once. Items belong to one course + lecture number and carry a `type` for
// the badge shown in Browse/Flashcards.
export const COURSES = ['MA4262', 'MA4266'];

export const ITEM_TYPES = ['Theorem', 'Definition', 'Lemma', 'Proposition', 'Corollary', 'Remark', 'Example'];

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
