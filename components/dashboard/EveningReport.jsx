'use client';
// components/dashboard/EveningReport.jsx — today's 10pm-generated
// wrap-up: what got done, an assessment, and suggested plan revisions.
// Suggestions are display-only in v1 -- no "apply" action (see the plan
// doc's Phase 10, deliberately deferred).
import { renderMarkdown } from '../../lib/dashboard/renderMarkdown';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ASSESSMENT_LABEL = { good: 'On top of it', on_track: 'On track', behind: 'Falling behind' };

export function EveningReport({ reports, loading }) {
  const today = reports?.[todayISO()]?.evening;
  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <span className="dash-card-title">Tonight</span>
        {today && <span className="dash-card-meta">{new Date(today.generatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}
      </div>
      {loading ? (
        <p className="tk-note-p tk-note-empty">Loading…</p>
      ) : today ? (
        <>
          {today.assessment && (
            <span className={`dash-assessment ${today.assessment}`}>{ASSESSMENT_LABEL[today.assessment] || today.assessment}</span>
          )}
          <div className="dash-report-text">{renderMarkdown(today.text)}</div>
          {today.suggestedChanges?.length > 0 && (
            <div className="dash-suggestions">
              <div className="dash-suggestions-label">Suggested plan revisions</div>
              {today.suggestedChanges.map((s) => (
                <div key={s.id} className="dash-suggestion">
                  <div className="dash-suggestion-desc">{s.description}</div>
                  {s.rationale && <div className="dash-suggestion-rationale">{s.rationale}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="tk-note-p tk-note-empty">No evening report yet today — generates automatically at 10pm.</p>
      )}
    </div>
  );
}
