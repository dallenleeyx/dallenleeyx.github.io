// lib/typst/liveChannel.js — one BroadcastChannel per course, used to
// mirror the notes editor's live source into a separate "view in browser"
// tab (see app/typst-preview/[courseId]/page.js), Overleaf-style. Same-tab
// (BroadcastChannel is same-origin, cross-tab, no server round-trip) so
// keystrokes reach the preview tab with no network dependency.
export function typstLiveChannelName(courseId) {
  return `typst-live-${courseId}`;
}
