// lib/math/renderLatex.js — turns `$inline$` / `$$display$$` LaTeX inside a
// plain-text field into safe HTML. Same escape-first-then-substitute
// rationale as japanese/richText.js: everything that isn't inside a math
// delimiter is HTML-escaped, so the only markup that can ever appear is
// KaTeX's own trusted output.
import katex from 'katex';

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// $$...$$ (display) must be tried before $...$ (inline) so a display block
// isn't mistaken for two empty inline pairs. \ref{...} is matched alongside
// them so a reference dropped mid-sentence ("by \ref{4.10}") survives outside
// of math mode, same as real LaTeX.
const MATH_RE = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\ref\{([^}]+)\}/g;

function tokenize(raw) {
  const tokens = [];
  let last = 0;
  let m;
  MATH_RE.lastIndex = 0;
  while ((m = MATH_RE.exec(raw))) {
    if (m.index > last) tokens.push({ type: 'text', value: raw.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ type: 'display', value: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: 'inline', value: m[2] });
    else tokens.push({ type: 'ref', value: m[3] });
    last = MATH_RE.lastIndex;
  }
  if (last < raw.length) tokens.push({ type: 'text', value: raw.slice(last) });
  return tokens;
}

export function renderLatexToHtml(raw) {
  return tokenize(raw || '')
    .map((t) => {
      if (t.type === 'text') return escapeHtml(t.value).replace(/\n/g, '<br />');
      if (t.type === 'ref') {
        const key = escapeHtml(t.value.trim());
        return `<span class="math-ref-chip" data-ref-key="${key}" role="button" tabindex="0">${key}</span>`;
      }
      try {
        return katex.renderToString(t.value, { displayMode: t.type === 'display', throwOnError: false });
      } catch (e) {
        return escapeHtml(t.value);
      }
    })
    .join('');
}
