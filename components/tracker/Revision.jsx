'use client';
// components/tracker/Revision.jsx — cycle through the course's theorem/
// definition/example blocks as flashcards; tap reveals a nested proof
import { Fragment, useEffect, useMemo, useState } from 'react';
import { extractFlashcards, renderDoc, ENV_LABELS } from '../../lib/markdown';

function Empty({ icon, children }) {
  return <div className="tk-empty"><div className="icon">{icon}</div><div className="title">{children}</div></div>;
}

export function Revision({ course, onClose }) {
  const pool = useMemo(() => extractFlashcards(course.doc), [course.doc]);
  const [idx, setIdx] = useState(() => (Math.random() * pool.length) | 0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const has = pool.length > 0;
  const current = has ? pool[idx % pool.length] : null;
  const canReveal = has && !!current.proof;
  const next = () => {
    if (pool.length > 1) { let n; do { n = (Math.random() * pool.length) | 0; } while (n === idx); setIdx(n); }
    setRevealed(false);
  };
  const flip = () => { if (canReveal) setRevealed(r => !r); };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className={`tk-revision-card${canReveal ? ' tappable' : ''}`} onClick={flip}>
          <div className="tk-revision-top">
            <span className="tk-revision-eyebrow">Revision</span>
            <span className="tk-revision-course">{course.name}</span>
          </div>
          {has ? (
            <Fragment>
              <div className="tk-note-block-head">
                <span className="tk-type">{ENV_LABELS[current.type] || current.type}</span>
                <span className="tk-revision-name">{current.name || <span className="tk-note-empty">Untitled</span>}</span>
              </div>
              <div>{renderDoc(current.statement, `rv${idx}s-`)}</div>
              {revealed && (
                <div className="tk-revision-proof">
                  <div className="tk-revision-proof-label">Proof</div>
                  {renderDoc(current.proof, `rv${idx}p-`)}
                </div>
              )}
              <div className="tk-revision-foot" onClick={e => e.stopPropagation()}>
                {canReveal ? (
                  <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={flip}>{revealed ? 'Hide proof' : 'Show proof'}</button>
                ) : <span className="tk-note-empty" style={{ fontSize: '.72rem' }}>No proof to reveal</span>}
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="tk-mono-btn" onClick={next}>Next</button>
                  <button className="tk-mono-btn" onClick={onClose}>Close</button>
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Empty icon="🔧">No theorems, definitions, or examples yet — add some via the Notes editor.</Empty>
              <div className="tk-revision-foot" style={{ justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                <button className="tk-mono-btn" onClick={onClose}>Close</button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
