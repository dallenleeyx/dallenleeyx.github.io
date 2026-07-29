// lib/japanese/normalizeReading.js — strips parens/full-width parens/
// whitespace before comparing a typed reading to the word's own reading,
// so "(ご)しゅじん" and "ごしゅじん" both count as correct.
export function normalizeReading(str) {
  return (str || '').replace(/[()（）\s　]/g, '').trim();
}
