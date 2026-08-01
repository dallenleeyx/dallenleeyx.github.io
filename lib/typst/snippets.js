// lib/typst/snippets.js — toolbar insert-snippet templates for the Typst
// editor, mirroring the shape lib/markdown.jsx's blockTemplate/mathTemplate
// used for the old markdown-shorthand editor (same {text, selStart, selEnd}
// contract, so NotesEditor.jsx's insert/tab-stop logic barely has to change).
export const ENV_LABELS = { theorem: 'Theorem', proposition: 'Proposition', definition: 'Definition', lemma: 'Lemma', corollary: 'Corollary', example: 'Example', remark: 'Remark', proof: 'Proof' };
export const ENV_TYPES = Object.keys(ENV_LABELS);

// Typst's math library has cal()/frak()/bb() built in for calligraphic,
// fraktur, and blackboard-bold letters -- the direct equivalents of LaTeX's
// \mathcal, \mathfrak, \mathbb. Used the same way: inside a $...$ span.
export const MATH_CMDS = [
  { cmd: 'cal', glyph: '𝒜' },
  { cmd: 'frak', glyph: '𝔄' },
  { cmd: 'bb', glyph: '𝔸' },
];

export function blockTemplate(type) {
  const hasName = type !== 'proof';
  if (!hasName) {
    const bodyPlaceholder = 'Proof.';
    const text = `#proof[\n  ${bodyPlaceholder}\n]\n`;
    const selStart = text.indexOf(bodyPlaceholder);
    const selEnd = selStart + bodyPlaceholder.length;
    return { text, selStart, selEnd, hasName: false };
  }
  const namePlaceholder = 'Name';
  const bodyPlaceholder = 'Statement.';
  const text = `#${type}(name: "${namePlaceholder}")[\n  ${bodyPlaceholder}\n]\n`;
  const selStart = text.indexOf(namePlaceholder);
  const selEnd = selStart + namePlaceholder.length;
  return { text, selStart, selEnd, hasName: true };
}

export function mathTemplate(cmd) {
  const text = `${cmd}()`;
  return { text, selStart: text.length - 1, selEnd: text.length - 1 };
}

// visible red inline flag/comment (see #flag in lib/typst/preamble.js)
export function flagInlineTemplate() {
  const placeholder = "What don't you understand here?";
  const text = `#flag[${placeholder}]`;
  const selStart = text.indexOf(placeholder);
  const selEnd = selStart + placeholder.length;
  return { text, selStart, selEnd };
}

// Typst headings (`=`, `==`, `===`) for the editor's TOC + heading toolbar,
// mirroring extractToc() in lib/markdown.jsx but for `=`-style headings.
export function extractTypstToc(doc) {
  const lines = String(doc || '').split('\n');
  const toc = [];
  lines.forEach((line, i) => {
    const m = line.match(/^(={1,3})\s+(.*)$/);
    if (m) toc.push({ level: m[1].length, text: m[2].trim(), line: i });
  });
  return toc;
}
