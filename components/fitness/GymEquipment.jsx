'use client';
// components/fitness/GymEquipment.jsx — the per-gym "Equipment" page: a
// category breakdown with counts (per the spec's "Chest — 6 machines"
// mock-up), expandable per category, backed by the shared catalog plus
// whatever custom equipment this gym has added.
import { useMemo, useState } from 'react';
import { uid } from '../../lib/fitness/util';
import { groupGymEquipmentByCategory } from '../../lib/fitness/gymUtils';
import { CATEGORIES } from '../../lib/fitness/equipmentCatalog';
import { EquipmentPicker } from './EquipmentPicker';

export function GymEquipment({ gym, onUpdate, onBack }) {
  const [expanded, setExpanded] = useState({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const groups = useMemo(() => groupGymEquipmentByCategory(gym), [gym]);
  const existingCatalogIds = useMemo(
    () => gym.equipment.filter((e) => e.catalogId).map((e) => e.catalogId),
    [gym.equipment]
  );

  function addFromCatalog(catalogId) {
    onUpdate({ equipment: [...gym.equipment, { id: uid(), catalogId, unavailable: false, note: '' }] });
  }

  function addCustom() {
    if (!customName.trim()) return;
    onUpdate({
      equipment: [
        ...gym.equipment,
        {
          id: uid(),
          catalogId: null,
          name: customName.trim(),
          categories: customCategory ? [customCategory] : [],
          unavailable: false,
          note: '',
        },
      ],
    });
    setCustomName('');
    setCustomCategory('');
  }

  function removeEquipment(id) {
    onUpdate({ equipment: gym.equipment.filter((e) => e.id !== id) });
  }
  function toggleUnavailable(id) {
    onUpdate({ equipment: gym.equipment.map((e) => (e.id === id ? { ...e, unavailable: !e.unavailable } : e)) });
  }
  function updateNote(id, note) {
    onUpdate({ equipment: gym.equipment.map((e) => (e.id === id ? { ...e, note } : e)) });
  }

  return (
    <div className="fit-gym-detail">
      <button type="button" className="fit-ghost-btn fit-gym-back-btn" onClick={onBack}>&larr; all gyms</button>

      <div className="fit-gym-detail-fields">
        <input
          className="fit-gym-name-input"
          value={gym.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Gym name"
        />
        <input
          className="fit-form-input"
          value={gym.location || ''}
          onChange={(e) => onUpdate({ location: e.target.value })}
          placeholder="Location / branch (optional)"
        />
        <input
          className="fit-form-input"
          value={gym.address || ''}
          onChange={(e) => onUpdate({ address: e.target.value })}
          placeholder="Address (optional)"
        />
        <textarea
          className="fit-form-input fit-gym-notes-input"
          value={gym.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Notes (optional)"
          rows={2}
        />
      </div>

      <h4 className="fit-gym-equipment-heading">Equipment available at {gym.name || 'this gym'}</h4>

      <ul className="fit-gym-category-list">
        {groups.map((group) => {
          const isOpen = !!expanded[group.id];
          return (
            <li key={group.id} className="fit-gym-category">
              <button
                type="button"
                className="fit-gym-category-head"
                onClick={() => setExpanded((p) => ({ ...p, [group.id]: !p[group.id] }))}
                disabled={!group.items.length}
              >
                <span>{isOpen ? '▾' : '▸'} {group.label}</span>
                <span className="fit-gym-category-count">
                  {group.items.length ? `${group.items.length} item${group.items.length === 1 ? '' : 's'}` : '—'}
                </span>
              </button>
              {isOpen && (
                <ul className="fit-gym-equipment-list">
                  {group.items.map((item) => (
                    <li key={item.id} className={`fit-gym-equipment-row${item.unavailable ? ' unavailable' : ''}`}>
                      <span className="fit-gym-equipment-name">{item.name}</span>
                      <input
                        className="fit-gym-equipment-note"
                        value={item.note}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        placeholder="note"
                      />
                      <label className="fit-gym-unavailable-toggle">
                        <input type="checkbox" checked={item.unavailable} onChange={() => toggleUnavailable(item.id)} />
                        unavailable
                      </label>
                      <button type="button" className="fit-icon-btn" onClick={() => removeEquipment(item.id)} aria-label="Remove equipment">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <button type="button" className="fit-ghost-btn fit-btn-primary fit-add-equip-btn" onClick={() => setPickerOpen((v) => !v)}>
        {pickerOpen ? 'hide catalog' : '+ add equipment'}
      </button>

      {pickerOpen && <EquipmentPicker excludeIds={existingCatalogIds} onAdd={addFromCatalog} />}

      <div className="fit-gym-custom-form">
        <span className="fit-gym-custom-label">Can&apos;t find it? Add custom equipment:</span>
        <div className="fit-gym-custom-row">
          <input
            className="fit-form-input"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Equipment name"
          />
          <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}>
            <option value="">Category (optional)</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="button" className="fit-ghost-btn" onClick={addCustom} disabled={!customName.trim()}>add</button>
        </div>
      </div>
    </div>
  );
}
