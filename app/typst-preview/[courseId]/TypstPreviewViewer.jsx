'use client';
// app/typst-preview/[courseId]/TypstPreviewViewer.jsx — Overleaf-style
// "view in browser" companion to the notes editor: a dedicated tab showing
// just the live-compiling preview. Has no textarea of its own -- it
// mirrors whatever's typed in an open NotesEditor for this course via
// BroadcastChannel (see lib/typst/liveChannel.js), falling back to the
// last-synced doc from /api/data so the tab shows real content immediately
// even if no editor tab happens to be open (or on a refresh). Pagination
// and zoom/pan are all PagedTypstViewer's job (shared with the split
// editor view and the read-only course preview) -- this is just the
// title bar and the live-source plumbing around it.
import { useEffect, useState } from 'react';
import { typstLiveChannelName } from '../../../lib/typst/liveChannel';
import { PagedTypstViewer } from '../../../components/tracker/PagedTypstViewer';

export function TypstPreviewViewer({ courseId }) {
  const [source, setSource] = useState(null); // null = still loading initial content
  const [courseName, setCourseName] = useState('');

  // Initial content from whatever's last synced, so this tab isn't blank
  // if no editor tab for this course happens to be open right now.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/data').then((r) => r.json()).then((data) => {
      if (cancelled) return;
      const course = (data.courses || []).find((c) => c.id === courseId);
      setSource(course ? (course.doc || '') : '');
      setCourseName(course ? course.name : '');
    }).catch(() => { if (!cancelled) setSource(''); });
    return () => { cancelled = true; };
  }, [courseId]);

  // Live updates from an open NotesEditor for this course.
  useEffect(() => {
    const channel = new BroadcastChannel(typstLiveChannelName(courseId));
    channel.onmessage = (e) => {
      if (typeof e.data?.source === 'string') setSource(e.data.source);
    };
    return () => channel.close();
  }, [courseId]);

  return (
    <div className="tk-typst-viewer">
      <div className="tk-typst-viewer-bar">
        <div className="tk-typst-viewer-title">{courseName || 'Notes'} — live preview</div>
      </div>
      {source == null ? (
        <div className="tk-typst-viewer-status">Loading…</div>
      ) : (
        <PagedTypstViewer source={source} debounceMs={250} showToolbar className="tk-typst-viewer-body" />
      )}
    </div>
  );
}
