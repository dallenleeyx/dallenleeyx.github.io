// lib/japanese/richText.js — tiny markup for the Journal editor: **bold**,
// *italic*, ==highlight==. Deliberately not a WYSIWYG/contentEditable
// editor or a full markdown library -- the toolbar just wraps the current
// textarea selection in these markers (see the math site's NotesEditor
// wrapSelection precedent), and this module turns the result into safe
// HTML for the read-only preview. Input is HTML-escaped before any marker
// is turned into a tag, so the only tags that can ever appear are the ones
// inserted below.
function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderNoteBody(raw) {
  return escapeHtml(raw)
    .replace(/\*\*([^\n]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^\n]+?)\*/g, '<em>$1</em>')
    .replace(/==([^\n]+?)==/g, '<mark>$1</mark>')
    .replace(/\n/g, '<br />');
}

export function stripNoteMarkup(raw) {
  return (raw || '')
    .replace(/\*\*([^\n]+?)\*\*/g, '$1')
    .replace(/\*([^\n]+?)\*/g, '$1')
    .replace(/==([^\n]+?)==/g, '$1')
    .replace(/\n/g, ' ');
}
