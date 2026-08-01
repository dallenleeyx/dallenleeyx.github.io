// lib/typst/pagedSvg.js — figures out where page boundaries fall inside
// the single tall <svg> that $typst.svg() returns for a multi-page
// document (it does not expose separate per-page markup, just one
// concatenated image the height of every page stacked with no gap). Pure
// math: given the SVG's own declared pixel width/height and the page size
// (in mm) the document was compiled with, page height in the SVG's pixel
// space is derived from the same px-per-mm ratio the width implies --
// PagedTypstViewer uses this to place page-break dividers and to drive
// Prev/Next page navigation over the single rendered SVG (see that
// component's file-level comment for why it renders one plain SVG rather
// than slicing/reusing the content via <use>).
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM } from './preamble';

// Reads width/height straight off the <svg> tag rather than parsing the
// whole document, so this stays cheap even for a many-page compile.
export function readSvgSize(svgString) {
  const m = /<svg[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/.exec(svgString);
  if (!m) return null;
  return { width: parseFloat(m[1]), height: parseFloat(m[2]) };
}

export function computePageLayout(svgString) {
  const size = readSvgSize(svgString);
  if (!size || !size.width || !size.height) return null;
  const pxPerMm = size.width / PAGE_WIDTH_MM;
  const pageHeightPx = PAGE_HEIGHT_MM * pxPerMm;
  const pageWidthPx = size.width;
  const numPages = Math.max(1, Math.round(size.height / pageHeightPx));
  return { pageWidthPx, pageHeightPx, numPages, totalHeightPx: size.height };
}
