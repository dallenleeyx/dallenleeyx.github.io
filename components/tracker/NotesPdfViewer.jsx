'use client';
// components/tracker/NotesPdfViewer.jsx — shows a course's notes as a PDF
// synced from the dallen_notes repo (see its README): written in Overleaf,
// compiled server-side by a GitHub Action, pushed here as a static file.
// No client-side compiling at all, so no lag no matter how long the notes
// get -- replaces the old in-browser Typst WASM editor.
import { useEffect, useState } from 'react';

export function NotesPdfViewer({ course }) {
  const slug = (course.code || '').trim();
  const [status, setStatus] = useState('checking'); // checking | ok | missing

  useEffect(() => {
    if (!slug) { setStatus('missing'); return; }
    setStatus('checking');
    let cancelled = false;
    fetch(`/notes/${encodeURIComponent(slug)}.pdf`, { method: 'HEAD' })
      .then((res) => { if (!cancelled) setStatus(res.ok ? 'ok' : 'missing'); })
      .catch(() => { if (!cancelled) setStatus('missing'); });
    return () => { cancelled = true; };
  }, [slug]);

  if (!slug) {
    return (
      <div className="tk-notes-pdf-wrap">
        <div className="tk-note-p tk-note-empty" style={{ padding: '1.4rem' }}>
          This course needs a code (Edit → Code) matching its folder name in the dallen_notes repo, so its PDF can be found.
        </div>
      </div>
    );
  }
  if (status === 'checking') {
    return <div className="tk-notes-pdf-wrap"><div className="tk-note-p tk-note-empty" style={{ padding: '1.4rem' }}>Loading…</div></div>;
  }
  if (status === 'missing') {
    return (
      <div className="tk-notes-pdf-wrap">
        <div className="tk-note-p tk-note-empty" style={{ padding: '1.4rem' }}>
          No notes PDF synced yet for &ldquo;{slug}&rdquo;. Push from Overleaf to <code className="t-code">dallen_notes/{slug}/main.tex</code> to generate one.
        </div>
      </div>
    );
  }
  return (
    <div className="tk-notes-pdf-wrap">
      <object data={`/notes/${encodeURIComponent(slug)}.pdf`} type="application/pdf" className="tk-notes-pdf-embed">
        <div className="tk-note-p tk-note-empty" style={{ padding: '1.4rem' }}>
          Couldn&rsquo;t load a PDF viewer.{' '}
          <a href={`/notes/${encodeURIComponent(slug)}.pdf`} target="_blank" rel="noreferrer">Open the PDF directly ↗</a>
        </div>
      </object>
    </div>
  );
}
