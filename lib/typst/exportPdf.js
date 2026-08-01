// lib/typst/exportPdf.js — real, vector-quality PDF export straight from
// the Typst compiler (see lib/typst/engine.js), replacing the old
// html2canvas+jsPDF raster export (lib/exportNotesPdf.js): no rasterization
// step at all, so text stays crisp at any zoom and the file is small.
import { compilePdf } from './engine';
import { wrapWithPreamble } from './preamble';

function sanitizeFilename(name) {
  return (name || 'notes').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'notes';
}

export async function exportTypstNotesToPdf(source, courseName) {
  const bytes = await compilePdf(wrapWithPreamble(source));
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(courseName)}-notes.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
