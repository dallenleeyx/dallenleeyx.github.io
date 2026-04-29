// markdown.js — minimal Markdown + KaTeX renderer
// Supports: # ## ### headings, **bold**, *italic*, `code`, $inline$, $$display$$, paragraphs.
// Math is rendered with KaTeX (loaded globally).

(function(){
  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderMath(tex, displayMode){
    if (typeof katex === 'undefined') {
      return `<code>${escapeHtml(tex)}</code>`;
    }
    try {
      return katex.renderToString(tex, { displayMode, throwOnError: false, strict: 'ignore' });
    } catch (e) {
      return `<code style="color:var(--accent)">${escapeHtml(tex)}</code>`;
    }
  }

  // Pull math out first so it isn't mangled by inline replacements.
  function tokenizeMath(src){
    const tokens = [];
    let out = '';
    let i = 0;
    while (i < src.length) {
      // $$ ... $$
      if (src[i] === '$' && src[i+1] === '$') {
        const end = src.indexOf('$$', i+2);
        if (end !== -1) {
          tokens.push({ display: true, tex: src.slice(i+2, end) });
          out += `\u0000M${tokens.length-1}\u0000`;
          i = end + 2;
          continue;
        }
      }
      // $ ... $   (single-line, not preceded by backslash)
      if (src[i] === '$' && src[i-1] !== '\\') {
        const end = src.indexOf('$', i+1);
        if (end !== -1 && src.slice(i+1, end).indexOf('\n') === -1) {
          tokens.push({ display: false, tex: src.slice(i+1, end) });
          out += `\u0000M${tokens.length-1}\u0000`;
          i = end + 1;
          continue;
        }
      }
      out += src[i];
      i++;
    }
    return { stripped: out, tokens };
  }

  function inlineFormat(s){
    // already escaped except math placeholders
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+)`/g, (_,c)=>`<code>${c}</code>`);
    return s;
  }

  function renderMarkdown(src){
    if (!src) return '';
    const { stripped, tokens } = tokenizeMath(src);
    const lines = stripped.split(/\r?\n/);
    let html = '';
    let buf = [];

    function flushPara(){
      if (!buf.length) return;
      const text = buf.join(' ').trim();
      if (text) html += `<p>${inlineFormat(escapeHtml(text))}</p>\n`;
      buf = [];
    }

    for (let raw of lines) {
      const line = raw.trim();
      if (!line) { flushPara(); continue; }
      let m;
      if ((m = line.match(/^###\s+(.*)$/))) { flushPara(); html += `<h3>${inlineFormat(escapeHtml(m[1]))}</h3>\n`; }
      else if ((m = line.match(/^##\s+(.*)$/))) { flushPara(); html += `<h2>${inlineFormat(escapeHtml(m[1]))}</h2>\n`; }
      else if ((m = line.match(/^#\s+(.*)$/))) { flushPara(); html += `<h2>${inlineFormat(escapeHtml(m[1]))}</h2>\n`; }
      else { buf.push(raw); }
    }
    flushPara();

    // Substitute math placeholders. Render math (already raw TeX) and wrap display in .katex-display.
    html = html.replace(/\u0000M(\d+)\u0000/g, (_,i) => {
      const t = tokens[+i];
      const rendered = renderMath(t.tex, t.display);
      return t.display ? `<div class="katex-display">${rendered}</div>` : rendered;
    });
    return html;
  }

  window.renderMarkdown = renderMarkdown;
})();
