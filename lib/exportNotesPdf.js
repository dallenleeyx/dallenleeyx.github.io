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

  // .no-print elements (e.g. a stray toolbar button) shouldn't end up
  // rasterized into the export even though they're not hidden outside an
  // actual browser print.
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-99999px';
  wrapper.style.background = '#ffffff';
  wrapper.style.padding = `${MARGIN_PX}px`;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // This is still a rasterized image embedded in the PDF, not vector
    // text -- scale 2.5 (vs. the earlier 1.5) noticeably sharpens fine
    // KaTeX glyphs and small text at a real file-size cost, but it's not,
    // and structurally can't be, true LaTeX-quality output.
    const canvas = await html2canvas(wrapper, { scale: 2.5, backgroundColor: '#ffffff', useCORS: true });
    const pdf = new jsPDF({ unit: 'px', format: [PAGE_WIDTH_PX, PAGE_HEIGHT_PX] });
    const imgWidth = PAGE_WIDTH_PX;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageCount = Math.max(1, Math.ceil(imgHeight / PAGE_HEIGHT_PX));
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    for (let page = 0; page < pageCount; page++) {
      if (page > 0) pdf.addPage([PAGE_WIDTH_PX, PAGE_HEIGHT_PX]);
      pdf.addImage(imgData, 'JPEG', 0, -page * PAGE_HEIGHT_PX, imgWidth, imgHeight);
    }
    pdf.save(`${sanitizeFilename(courseName)}-notes.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}
