// lib/math/groupByLecture.js — shared by Browse.jsx and Export.jsx so both
// views group/sort entries identically. Items are grouped by lecture and,
// within a lecture, sorted by an explicit `order` field (set only once a
// lecture has been manually reordered). Items without one sort to the end
// but keep their original relative order (Array#sort is stable), so a
// lecture nobody has ever reordered just keeps showing entries in the order
// they were added.
export function groupByLecture(items) {
  const groups = {};
  items.forEach((it) => {
    const key = it.lecture ?? 0;
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  });
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({
      lecture: n,
      items: groups[n].slice().sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)),
    }));
}
