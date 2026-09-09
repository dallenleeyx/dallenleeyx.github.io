'use client';
// components/math/LatexText.jsx — renders a statement/proof field that may
// contain $inline$ or $$display$$ LaTeX. See lib/math/renderLatex.js for
// why dangerouslySetInnerHTML is safe here: everything outside a math
// delimiter is HTML-escaped first, so only KaTeX's own trusted markup ever
// reaches the DOM.
import { renderLatexToHtml } from '../../lib/math/renderLatex';

export function LatexText({ text, className }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderLatexToHtml(text) }} />;
}
