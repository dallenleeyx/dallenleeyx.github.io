// lib/math/sections.js — groups a course's items by section, in the order
// the user defined via SectionManager. Shared by Browse (which renders the
// groups) and TableOfContents (which links to them), so the two can never
// disagree about what a section's anchor id is.
export function groupItemsBySection(items, sectionList) {
  const bySection = {};
  items.forEach((it) => {
    const key = it.section || '';
    if (!bySection[key]) bySection[key] = [];
    bySection[key].push(it);
  });
  // Sections the user defined come first, in their order, even if empty --
  // that's what lets you pre-create a section before writing anything into
  // it. Any section value found on an item but not in the list (e.g. it was
  // renamed/removed by a stale device) still gets shown so nothing vanishes.
  const named = sectionList.map((name) => ({ id: name, name, items: bySection[name] || [] }));
  const extra = Object.keys(bySection)
    .filter((k) => k && !sectionList.includes(k))
    .map((name) => ({ id: name, name, items: bySection[name] }));
  const groups = [...named, ...extra];
  if (bySection['']) groups.push({ id: '', name: 'Unsectioned', items: bySection[''] });
  return groups.map((g, i) => ({ ...g, anchor: `math-section-${i}` }));
}
