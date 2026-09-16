'use client';
// components/fitness/Gyms.jsx — the "Gyms" tab: a list of saved gym
// profiles, each opening into its own equipment editor (GymEquipment.jsx).
// Gyms persist permanently once saved (synced like everything else in
// Fitness) -- picking a gym again later in DailyLog.jsx just reads its
// already-saved inventory, no need to re-enter it.
import { useState } from 'react';
import { useFitness } from '../../lib/fitness/FitnessSyncContext';
import { uid } from '../../lib/fitness/util';
import { GymEquipment } from './GymEquipment';

export function Gyms() {
  const { state, loading, updateGyms } = useFitness();
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return <p className="fit-empty">Loading…</p>;

  const gyms = state.gyms.list;
  const selected = gyms.find((g) => g.id === selectedId) || null;

  function addGym() {
    const id = uid();
    updateGyms([...gyms, { id, name: 'New gym', location: '', address: '', notes: '', equipment: [] }]);
    setSelectedId(id);
  }
  function updateGym(id, patch) {
    updateGyms(gyms.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }
  function removeGym(id) {
    if (!window.confirm('Delete this gym profile? Its saved equipment will be lost.')) return;
    updateGyms(gyms.filter((g) => g.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  if (selected) {
    return (
      <GymEquipment
        gym={selected}
        onUpdate={(patch) => updateGym(selected.id, patch)}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="fit-gyms">
      {!gyms.length && <p className="fit-empty">No gyms saved yet — add the first one you train at.</p>}
      <ul className="fit-gym-list">
        {gyms.map((g) => (
          <li key={g.id} className="fit-gym-card">
            <button type="button" className="fit-gym-card-main" onClick={() => setSelectedId(g.id)}>
              <span className="fit-gym-card-name">{g.name || 'Unnamed gym'}</span>
              {g.location && <span className="fit-gym-card-location">{g.location}</span>}
              <span className="fit-gym-card-count">{g.equipment.length} equipment</span>
            </button>
            <button type="button" className="fit-icon-btn" onClick={() => removeGym(g.id)} aria-label="Delete gym">✕</button>
          </li>
        ))}
      </ul>
      <button type="button" className="fit-ghost-btn fit-btn-primary fit-add-gym-btn" onClick={addGym}>+ add gym</button>
    </div>
  );
}
