'use client';
// components/bible/QT.jsx — daily quiet-time log: passage(s) read, comments,
// plus a persistent (not per-day) "praying for this season" note, since that
// changes far less often than a daily entry would suggest. Day navigation
// mirrors fitness/DailyLog.jsx; "share to Notes" uses the Web Share API so a
// tap on iOS Safari opens the native share sheet with Notes as one of the
// targets -- no account, key, or Shortcut needed for the common case.
import { useMemo, useState } from 'react';
import { useBible } from '../../lib/bible/BibleSyncContext';
import { BibleText } from './BibleText';
import { toISO, addDays, todayISO } from '../../lib/bible/util';

function formatDay(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function buildShareText(iso, entry) {
  const lines = [`QT — ${formatDay(iso)}`, ''];
  if (entry?.passage?.trim()) lines.push(`Passage: ${entry.passage.trim()}`, '');
  if (entry?.comments?.trim()) lines.push(entry.comments.trim());
  return lines.join('\n');
}

export function QT() {
  const { state, updateQt, setPrayerFocus } = useBible();
  const [dateISO, setDateISO] = useState(todayISO());
  const [prayerDraft, setPrayerDraft] = useState(null); // null = not editing
  const [shareStatus, setShareStatus] = useState(null);

  const entry = state.qt[dateISO] || {};
  const isToday = dateISO === todayISO();
  const hasEntry = !!(entry.passage?.trim() || entry.comments?.trim());

  const history = useMemo(
    () => Object.entries(state.qt)
      .filter(([, e]) => e.passage?.trim() || e.comments?.trim())
      .sort(([a], [b]) => (a < b ? 1 : -1)),
    [state.qt]
  );

  function go(deltaDays) {
    setDateISO((prev) => toISO(addDays(new Date(`${prev}T00:00:00`), deltaDays)));
  }

  async function handleShare() {
    const text = buildShareText(dateISO, entry);
    if (navigator.share) {
      try {
        await navigator.share({ text, title: `QT — ${formatDay(dateISO)}` });
      } catch (e) {
        // user cancelled the share sheet -- not an error
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setShareStatus('Copied — paste it into Notes.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  }

  return (
    <div className="bible-qt">
      <div className="bible-qt-prayer">
        <div className="bible-qt-prayer-head">
          <h4>Praying for this season</h4>
          {prayerDraft === null && (
            <button className="bible-ghost-btn" onClick={() => setPrayerDraft(state.prayerFocus.text || '')}>
              {state.prayerFocus.text ? 'edit' : 'add'}
            </button>
          )}
        </div>
        {prayerDraft === null ? (
          state.prayerFocus.text ? (
            <BibleText text={state.prayerFocus.text} className="bible-qt-prayer-text" />
          ) : (
            <p className="bible-empty">Nothing set yet — optional.</p>
          )
        ) : (
          <div className="bible-qt-prayer-edit">
            <textarea
              className="bible-form-textarea"
              value={prayerDraft}
              onChange={(e) => setPrayerDraft(e.target.value)}
              rows={3}
              placeholder="What are you praying for this season?"
            />
            <div className="bible-form-actions">
              <button
                className="bible-ghost-btn bible-btn-primary"
                onClick={() => { setPrayerFocus(prayerDraft.trim()); setPrayerDraft(null); }}
              >
                Save
              </button>
              <button className="bible-ghost-btn" onClick={() => setPrayerDraft(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="bible-qt-day">
        <div className="bible-qt-day-nav">
          <button className="bible-icon-btn" onClick={() => go(-1)} aria-label="Previous day">←</button>
          <span className="bible-qt-day-label">
            {formatDay(dateISO)}
            {isToday && <span className="bible-qt-today-badge">today</span>}
          </span>
          <button className="bible-icon-btn" onClick={() => go(1)} disabled={isToday} aria-label="Next day">→</button>
        </div>

        <label className="bible-form-label-block">
          Passage(s) read
          <input
            className="bible-form-input"
            value={entry.passage || ''}
            onChange={(e) => updateQt(dateISO, { passage: e.target.value })}
            placeholder="e.g. [Romans 8:1-11]"
          />
        </label>
        {entry.passage?.trim() && <BibleText text={entry.passage} className="bible-qt-passage-preview" />}

        <label className="bible-form-label-block">
          Comments
          <textarea
            className="bible-form-textarea"
            value={entry.comments || ''}
            onChange={(e) => updateQt(dateISO, { comments: e.target.value })}
            rows={6}
            placeholder="What stood out? What is God saying to you through this?"
          />
        </label>

        <div className="bible-qt-share-row">
          <button className="bible-ghost-btn" onClick={handleShare} disabled={!hasEntry}>
            share to Notes
          </button>
          {shareStatus && <span className="bible-qt-share-status">{shareStatus}</span>}
        </div>
      </div>

      {history.length > 0 && (
        <div className="bible-qt-history">
          <h4>Past QTs</h4>
          <ul className="bible-qt-history-list">
            {history.map(([iso, e]) => (
              <li key={iso} className={`bible-qt-history-item${iso === dateISO ? ' active' : ''}`}>
                <button className="bible-qt-history-btn" onClick={() => setDateISO(iso)}>
                  <span className="bible-qt-history-date">{formatDay(iso)}</span>
                  {e.passage && <span className="bible-qt-history-passage">{e.passage}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
