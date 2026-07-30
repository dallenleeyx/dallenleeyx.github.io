'use client';
// components/tracker/EditCourseModal.jsx — edit a course's title/code/
// description; the red "Delete course" button at the bottom opens the
// existing type-DELETE-to-confirm modal on top of this one.
import { Fragment, useState } from 'react';
import { DeleteCourseModal } from './DeleteCourseModal';

export function EditCourseModal({ course, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(course.name);
  const [glyph, setGlyph] = useState(course.glyph || '');
  const [nickname, setNickname] = useState(course.nickname || '');
  const [desc, setDesc] = useState(course.description || '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const submit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const fallback = trimmedTitle.slice(0, 2).toUpperCase();
    onSave({
      name: trimmedTitle,
      glyph: glyph.trim() || fallback,
      nickname: nickname.trim() || fallback,
      description: desc.trim(),
    });
  };

  return (
    <Fragment>
      <div className="tk-modal-backdrop" onClick={onClose} />
      <div className="tk-modal-wrap">
        <div className="tk-modal">
          <div className="tk-modal-title">Edit course</div>
          <div className="tk-modal-field">
            <label>Course title</label>
            <input className="tk-input" autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Glyph (shown in the course header)</label>
            <input className="tk-input" value={glyph} onChange={e => setGlyph(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Sidebar label</label>
            <input className="tk-input" value={nickname} onChange={e => setNickname(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div className="tk-modal-field">
            <label>Description</label>
            <textarea className="tk-textarea" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="tk-modal-foot">
            <button className="tk-mono-btn" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={!title.trim()} onClick={submit}>Save</button>
          </div>
          <div className="tk-modal-danger-zone">
            <button className="tk-btn tk-btn-danger tk-btn-sm" onClick={() => setConfirmingDelete(true)}>Delete course…</button>
          </div>
        </div>
      </div>
      {confirmingDelete && (
        <DeleteCourseModal course={course} onClose={() => setConfirmingDelete(false)} onConfirm={onDelete} />
      )}
    </Fragment>
  );
}
