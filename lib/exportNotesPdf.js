// lib/exportNotesPdf.js — turns an already-rendered notes-preview DOM node
// into an actual downloadable, paginated PDF, instead of routing through
// window.print() (which printed the whole browser window/page rather than
// just the notes). html2canvas/jsPDF are dynamically imported so their
// weight only loads when "Export to PDF" is actually clicked.
const PAGE_WIDTH_PX = 794; // ~210mm at 96dpi (A4 width)
const PAGE_HEIGHT_PX = 1123; // ~297mm at 96dpi (A4 height)
const MARGIN_PX = 40;

function sanitizeFilename(name) {
  return (name || 'notes').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'notes';
}

// sourceEl is the live, on-screen notes-preview node -- cloned rather than
// rasterized directly so the export can force a fixed, light-themed,
// unclipped layout regardless of the site's current theme or the preview's
// on-screen scroll height (it's normally height-capped with overflow:auto).
export async function exportNotesToPdf(sourceEl, courseName) {
  const [html2canvasMod, jsPdfMod] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const html2canvas = html2canvasMod.default;
  const { jsPDF } = jsPdfMod;

  const clone = sourceEl.cloneNode(true);
  clone.style.maxHeight = 'none';
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.width = `${PAGE_WIDTH_PX - MARGIN_PX * 2}px`;
  clone.style.background = '#ffffff';
  clone.style.color = '#111111';
  clone.style.border = 'none';
  clone.style.boxShadow = 'none';
  clone.style.padding = '0';

  // The preview may be wrapped in ZoomableNotes -- export the full document
  // at its natural scale regardless of the on-screen zoom/pan state, and
  // drop its toolbar (already .no-print, but that only applies to actual
  // browser printing, not this html2canvas rasterization).
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());
  clone.querySelectorAll('.tk-zoom-viewport').forEach((el) => { el.style.height = 'auto'; });
  clone.querySelectorAll('.tk-zoom-surface').forEach((el) => { el.style.overflow = 'visible'; el.style.height = 'auto'; });
  clone.querySelectorAll('.tk-zoom-content').forEach((el) => { el.style.transform = 'none'; });

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-99999px';
  wrapper.style.background = '#ffffff';
  wrapper.style.padding = `${MARGIN_PX}px`;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // scale 1.5 (not the default devicePixelRatio-driven 2+) keeps text/KaTeX
    // crisp while keeping the embedded raster (and so the final file size)
    // reasonable -- a multi-page notes doc at scale 2 balloons into tens of
    // MB for what's ultimately mostly text.
    const canvas = await html2canvas(wrapper, { scale: 1.5, backgroundColor: '#ffffff', useCORS: true });
    const pdf = new jsPDF({ unit: 'px', format: [PAGE_WIDTH_PX, PAGE_HEIGHT_PX] });
    const imgWidth = PAGE_WIDTH_PX;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageCount = Math.max(1, Math.ceil(imgHeight / PAGE_HEIGHT_PX));
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    for (let page = 0; page < pageCount; page++) {
      if (page > 0) pdf.addPage([PAGE_WIDTH_PX, PAGE_HEIGHT_PX]);
      pdf.addImage(imgData, 'JPEG', 0, -page * PAGE_HEIGHT_PX, imgWidth, imgHeight);
    }
    pdf.save(`${sanitizeFilename(courseName)}-notes.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}
