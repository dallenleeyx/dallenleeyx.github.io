'use client';
// components/jobs/Board.jsx — the whole Jobs tracker: a quick-add form and a
// three-column board (one column per status) so moving an application along
// the pipeline is just changing its status, not re-filing it somewhere.
import { useMemo, useState } from 'react';
import { useJobs } from '../../lib/jobs/JobsSyncContext';
import { STATUSES } from '../../lib/jobs/items';

export function Board() {
  const { state, loading, addItem, updateItem, deleteItem } = useJobs();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const items = useMemo(
    () => Object.values(state.items).filter((it) => !it.deleted),
    [state.items]
  );

  if (loading) return <p className="job-empty">Loading…</p>;

  function handleAdd(e) {
    e.preventDefault();
    if (!company.trim() && !role.trim()) return;
    addItem({ company: company.trim(), role: role.trim(), status: STATUSES[0] });
    setCompany('');
    setRole('');
  }

  function handleDelete(item) {
    if (!window.confirm(`Remove ${item.company || 'this entry'}${item.role ? ` — ${item.role}` : ''}?`)) return;
    deleteItem(item.id);
  }

  return (
    <div className="job-board">
      <form className="job-add-form" onSubmit={handleAdd}>
        <input
          className="job-form-input job-add-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
        />
        <input
          className="job-form-input job-add-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
        />
        <button className="job-ghost-btn job-btn-primary" type="submit" disabled={!company.trim() && !role.trim()}>
          + add
        </button>
      </form>

      <div className="job-columns">
        {STATUSES.map((status) => {
          const columnItems = items.filter((it) => it.status === status);
          return (
            <div key={status} className={`job-column job-column-${status.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="job-column-head">
                <span className="job-column-title">{status}</span>
                <span className="job-column-count">{columnItems.length}</span>
              </div>
              {columnItems.length === 0 && <p className="job-empty">Nothing here yet.</p>}
              <ul className="job-card-list">
                {columnItems.map((item) => (
                  <li key={item.id} className="job-card">
                    <button
                      type="button"
                      className="job-icon-btn job-card-remove"
                      onClick={() => handleDelete(item)}
                      aria-label="Remove application"
                    >
                      ✕
                    </button>
                    <input
                      className="job-card-company"
                      value={item.company}
                      onChange={(e) => updateItem(item.id, { company: e.target.value })}
                      placeholder="Company"
                    />
                    <input
                      className="job-card-role"
                      value={item.role}
                      onChange={(e) => updateItem(item.id, { role: e.target.value })}
                      placeholder="Role"
                    />
                    <select
                      className="job-card-status-select"
                      value={item.status}
                      onChange={(e) => updateItem(item.id, { status: e.target.value })}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
