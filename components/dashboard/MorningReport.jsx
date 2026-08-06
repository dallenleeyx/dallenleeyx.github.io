'use client';
// components/dashboard/MorningReport.jsx — today's 9am-generated brief.
import { renderMarkdown } from '../../lib/dashboard/renderMarkdown';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function MorningReport({ reports, loading }) {
  const today = reports?.[todayISO()]?.morning;
  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">This morning</span>
        {today && <span className="dash-card-meta">{new Date(today.generatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
      </div>
      {loading ? (
        <p className="tk-note-p tk-note-empty">Loading…</p>
      ) : today ? (
        <div className="dash-report-text">{renderMarkdown(today.text)}</div>
      ) : (
        <p className="tk-note-p tk-note-empty">No morning report yet today — generates automatically at 9am.</p>
      )}
    </div>
  );
}
