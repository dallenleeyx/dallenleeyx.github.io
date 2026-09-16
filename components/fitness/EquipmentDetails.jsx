'use client';
// components/fitness/EquipmentDetails.jsx — "what does this machine look
// like": opens when you tap a result in EquipmentPicker.jsx, showing its
// demo GIF, targeted muscles, category and mechanical type, with an
// "Add Equipment" button to actually confirm adding it to the gym. Splits
// browse-and-preview from the add action itself (the old picker added on
// tap immediately) since recognizing the right machine by sight is the
// whole point of having media here at all.
import { useState } from 'react';
import { equipmentMediaSources, EQUIPMENT_MEDIA_ATTRIBUTION } from '../../lib/fitness/equipmentMedia';
import { CATEGORIES, EQUIPMENT_TYPES } from '../../lib/fitness/equipmentCatalog';

function EquipmentMedia({ item }) {
  const sources = equipmentMediaSources(item);
  const [index, setIndex] = useState(0);
  const src = sources[index];
  if (!src) return <div className="fit-ex-details-media fit-ex-details-media-empty">No demo media available</div>;
  return (
    <img
      className="fit-ex-details-media"
      src={src}
      alt={`${item.name} demonstration`}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

export function EquipmentDetails({ item, onAdd, onClose }) {
  if (!item) return null;
  const categoryLabels = item.categories.map((c) => CATEGORIES.find((cc) => cc.id === c)?.label || c);
  const typeLabels = item.types.map((t) => EQUIPMENT_TYPES.find((tt) => tt.id === t)?.label || t);

  return (
    <div className="fit-modal-backdrop" onClick={onClose}>
      <div className="fit-modal fit-ex-details" onClick={(e) => e.stopPropagation()}>
        <div className="fit-modal-head">
          <h3>{item.name}</h3>
          <button type="button" className="fit-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <EquipmentMedia item={item} />

        <div className="fit-ex-details-row">
          <div className="fit-ex-details-col">
            <h4>Muscles</h4>
            <p><strong>Primary:</strong> {item.muscles.primary.join(', ') || '—'}</p>
            {item.muscles.secondary.length > 0 && <p><strong>Secondary:</strong> {item.muscles.secondary.join(', ')}</p>}
          </div>
          <div className="fit-ex-details-col">
            <h4>Category</h4>
            <p>{categoryLabels.join(', ') || '—'}</p>
            <h4>Type</h4>
            <p>{typeLabels.join(', ') || '—'}</p>
            {item.movement && <p><strong>Movement pattern:</strong> {item.movement}</p>}
          </div>
        </div>

        <button type="button" className="fit-ghost-btn fit-btn-primary fit-equip-details-add-btn" onClick={() => { onAdd(item.id); onClose(); }}>
          + Add Equipment
        </button>

        <p className="fit-attribution">{EQUIPMENT_MEDIA_ATTRIBUTION}</p>
      </div>
    </div>
  );
}
