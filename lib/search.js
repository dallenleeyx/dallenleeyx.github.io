// lib/search.js — global search across every course's theorem/definition/
// lemma/etc. blocks (the same ones Revision.jsx cycles through), for
// finding "where did I write about X" across all courses at once.
import { extractFlashcards } from './markdown';

export function searchTheorems(courses, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  courses.forEach(c => {
    extractFlashcards(c.doc).forEach(block => {
      const nameMatch = block.name.toLowerCase().includes(q);
      const bodyMatch = block.statement.toLowerCase().includes(q) || (block.proof || '').toLowerCase().includes(q);
      if (nameMatch || bodyMatch) {
        results.push({ course: c, ...block, nameMatch });
      }
    });
  });
  // name matches first (more likely what was meant), then document order
  results.sort((a, b) => (b.nameMatch ? 1 : 0) - (a.nameMatch ? 1 : 0));
  return results;
}
