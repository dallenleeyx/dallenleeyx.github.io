// lib/japanese/wordId.js — stable per-word key so progress survives
// level/lesson filter changes and only resets if the word itself is edited
// in the source data.
export function wordId(item) {
  return `${item.level}::${item.lesson}::${item.word}`;
}
