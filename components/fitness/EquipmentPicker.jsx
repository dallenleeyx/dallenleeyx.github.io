'use client';
// components/fitness/EquipmentPicker.jsx — searchable, filterable catalog
// browser. Selecting a card adds it immediately (onAdd) rather than
// requiring a separate "confirm" step, since a gym's equipment list is
// trivially undoable (remove button right there) and the whole point is
// fast entry -- "select equipment" per the spec, not type it out.
import { useMemo, useState } from 'react';
import { CATEGORIES, EQUIPMENT_CATALOG, EQUIPMENT_TYPES } from '../../lib/fitness/equipmentCatalog';

export function EquipmentPicker({ excludeIds, onAdd }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const excluded = useMemo(() => new Set(excludeIds || []), [excludeIds]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EQUIPMENT_CATALOG.filter((item) => {
      if (excluded.has(item.id)) return false;
      if (category && !item.categories.includes(category)) return false;
      if (type && !item.types.includes(type)) return false;
      if (q) {
        // Matches the equipment's own name ("leg press") but also its
        // category ("legs") and target muscles ("quads"), so a quick search
        // like "leg" surfaces category-mates such as Hack squat too, not
        // just items with "leg" literally in the name.
        const haystack = [item.name, ...item.categories, ...item.muscles.primary, ...item.muscles.secondary]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, type, excluded]);

  return (
    <div className="fit-equip-picker">
      <div className="fit-equip-picker-controls">
        <input
          className="fit-form-input fit-equip-picker-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search equipment, e.g. "leg"'
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {EQUIPMENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      <div className="fit-equip-picker-grid">
        {results.map((item) => (
          <button type="button" key={item.id} className="fit-equip-card" onClick={() => onAdd(item.id)}>
            <span className="fit-equip-card-name">{item.name}</span>
            <span className="fit-equip-card-meta">
              {item.categories.map((c) => CATEGORIES.find((cc) => cc.id === c)?.label || c).join(' · ')}
            </span>
          </button>
        ))}
        {!results.length && <p className="fit-empty">No equipment matches.</p>}
      </div>
    </div>
  );
}
