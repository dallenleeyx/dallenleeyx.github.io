// Composer.jsx — slide-over drawer for writing blog posts and adding projects
// with live LaTeX/markdown preview.

function useLocalStorage(key, initial) {
  const [val, setVal] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch { return initial; }
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

function slugify(s) {
  return (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0, 60);
}

function nowDate() {
  const d = new Date();
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

const MD_SNIPPETS = [
  { label: 'H2', insert: '\n## Heading\n' },
  { label: 'H3', insert: '\n### Subheading\n' },
  { label: 'Bold', insert: '**bold**' },
  { label: 'Italic', insert: '*italic*' },
  { label: 'Code', insert: '`code`' },
  { label: '$ inline $', insert: '$x^2 + y^2 = r^2$' },
  { label: '$$ block $$', insert: '\n$$\n\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}\n$$\n' },
  { label: 'Matrix', insert: '$$\n\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\n$$\n' },
  { label: 'Sum', insert: '$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$' },
];

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = before + text + after;
  const pos = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  textarea.focus();
  // Trigger React onChange by dispatching input event
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function BlogComposer({ onClose, onSave, draft, setDraft }) {
  const bodyRef = React.useRef(null);
  const previewHtml = React.useMemo(() => {
    return window.renderMarkdown(draft.body || '');
  }, [draft.body]);

  return (
    <>
      <div className="composer-body">
        <div className="composer-edit">
          <div>
            <div className="field-label">Title</div>
            <input className="field-input" value={draft.title} onChange={e=>setDraft({...draft, title: e.target.value})} placeholder="A short, evocative title…"/>
          </div>
          <div className="field-row">
            <div>
              <div className="field-label">Date</div>
              <input className="field-input" value={draft.date} onChange={e=>setDraft({...draft, date: e.target.value})} placeholder="Apr 2025"/>
            </div>
            <div>
              <div className="field-label">Tag</div>
              <input className="field-input" value={draft.tag} onChange={e=>setDraft({...draft, tag: e.target.value})} placeholder="Differential Geometry"/>
            </div>
          </div>
          <div>
            <div className="field-label">Excerpt</div>
            <textarea className="field-textarea" style={{minHeight:'70px'}} value={draft.excerpt} onChange={e=>setDraft({...draft, excerpt: e.target.value})} placeholder="A 1–2 sentence summary. Supports $inline math$."/>
          </div>
          <div>
            <div className="field-label">Body — Markdown + LaTeX</div>
            <div className="inserter-row">
              {MD_SNIPPETS.map(s => (
                <button key={s.label} type="button" className="inserter-btn" onClick={()=>{
                  if (bodyRef.current) insertAtCursor(bodyRef.current, s.insert);
                }}>{s.label}</button>
              ))}
            </div>
            <textarea
              ref={bodyRef}
              className="field-textarea"
              style={{minHeight:'320px'}}
              value={draft.body}
              onChange={e=>setDraft({...draft, body: e.target.value})}
              placeholder={'Write your post in Markdown.\n\nUse $...$ for inline math and $$...$$ for display math.\n\n## Section\n\nThe Riemann zeta function $\\zeta(s)$ is...\n\n$$\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}$$'}
            />
          </div>
        </div>
        <div className="composer-preview">
          <div className="post-header">
            <div className="post-meta">
              <span className="post-date">{draft.date || '—'}</span>
              {draft.tag ? <span className="post-tag-big">{draft.tag}</span> : null}
            </div>
            <div className="post-title-big">{draft.title || 'Untitled post'}</div>
            {draft.excerpt ? (
              <div className="post-excerpt-big" dangerouslySetInnerHTML={{__html: window.renderMarkdown(draft.excerpt).replace(/^<p>|<\/p>\s*$/g,'')}}/>
            ) : null}
          </div>
          <hr className="post-divider"/>
          <div className="post-body" dangerouslySetInnerHTML={{__html: previewHtml}}/>
        </div>
      </div>
      <div className="composer-foot">
        <div className="composer-hint">
          <code>$...$</code> · <code>$$...$$</code> · <code>**bold**</code> · <code>## heading</code>  ·  saves as <code>posts/{slugify(draft.title)||'your-post'}.md</code>
        </div>
        <div className="composer-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={!draft.title.trim()}>Download Post</button>
        </div>
      </div>
    </>
  );
}

function ProjectComposer({ onClose, onSave, draft, setDraft }) {
  return (
    <>
      <div className="composer-body">
        <div className="composer-edit">
          <div>
            <div className="field-label">Title</div>
            <input className="field-input" value={draft.title} onChange={e=>setDraft({...draft, title: e.target.value})} placeholder="Project name"/>
          </div>
          <div>
            <div className="field-label">Area</div>
            <input className="field-input" value={draft.area} onChange={e=>setDraft({...draft, area: e.target.value})} placeholder="Differential Geometry · Python"/>
          </div>
          <div>
            <div className="field-label">Description</div>
            <textarea className="field-textarea" style={{minHeight:'140px',fontFamily:'var(--font-sans)',fontSize:'.88rem'}} value={draft.desc} onChange={e=>setDraft({...draft, desc: e.target.value})} placeholder="A short paragraph. Plain text or $LaTeX$ supported."/>
          </div>
          <div>
            <div className="field-label">Tags (comma-separated)</div>
            <input className="field-input" value={draft.tagsRaw} onChange={e=>setDraft({...draft, tagsRaw: e.target.value})} placeholder="Python, JAX, Geometry"/>
          </div>
          <div>
            <div className="field-label">Link (optional)</div>
            <input className="field-input" value={draft.link} onChange={e=>setDraft({...draft, link: e.target.value})} placeholder="https://github.com/…"/>
          </div>
        </div>
        <div className="composer-preview">
          <div className="field-label" style={{marginBottom:'.6rem'}}>Live Preview</div>
          <div className="project-card">
            <div className="project-header">
              <div>
                <div className="project-title">{draft.title || 'Project title'}</div>
                <div className="project-area">{draft.area || 'Area · Stack'}</div>
              </div>
              {draft.link ? <span className="project-link">View →</span> : null}
            </div>
            <div className="project-desc" dangerouslySetInnerHTML={{__html: window.renderMarkdown(draft.desc || '').replace(/^<p>|<\/p>\s*$/g,'') || '<em style="color:var(--fg-muted)">Description appears here…</em>'}}/>
            <div className="project-tags">
              {draft.tagsRaw.split(',').map(t=>t.trim()).filter(Boolean).map((t,i)=>(
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="composer-foot">
        <div className="composer-hint">Tags <code>,</code>-separated · description supports <code>$math$</code></div>
        <div className="composer-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={!draft.title.trim()}>Add Project</button>
        </div>
      </div>
    </>
  );
}

function Composer({ open, mode, onClose, onSubmit, initial }) {
  const blankFor = (m) => m === 'blog'
    ? { title:'', date: nowDate(), tag:'', excerpt:'', body:'' }
    : { title:'', area:'', desc:'', tagsRaw:'', link:'' };
  const [draft, setDraft] = React.useState(() => initial || blankFor(mode));
  React.useEffect(() => { setDraft(initial || blankFor(mode)); /* eslint-disable-next-line */ }, [open, mode]);
  // Guard against a transient render where mode flipped but draft is stale shape.
  const safeDraft = mode === 'blog'
    ? { title:'', date:'', tag:'', excerpt:'', body:'', ...draft }
    : { title:'', area:'', desc:'', tagsRaw:'', link:'', ...draft };

  const handleSave = () => {
    const d = safeDraft;
    if (mode === 'blog') {
      const slug = slugify(d.title);
      const file = slug + '.md';
      const indexEntry = {
        slug,
        title: d.title.trim(),
        date: (d.date||'').trim() || nowDate(),
        tag: (d.tag||'').trim() || 'Notes',
        excerpt: (d.excerpt||'').trim() || (d.body||'').slice(0, 160).replace(/\n/g,' '),
        file,
      };
      // Download two files: the .md body and a JSON snippet for posts/_index.json
      const dl = (name, contents, type) => {
        const blob = new Blob([contents], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      };
      dl(file, d.body || '', 'text/markdown');
      // Slight delay so browsers don't merge the two downloads.
      setTimeout(() => {
        dl('_index-snippet.json', JSON.stringify(indexEntry, null, 2) + '\n', 'application/json');
      }, 400);
      onSubmit && onSubmit(indexEntry);
    } else {
      const project = {
        id: 'p-' + Date.now().toString(36),
        title: d.title.trim(),
        area: (d.area||'').trim() || 'Personal Project',
        desc: (d.desc||'').trim(),
        tags: (d.tagsRaw||'').split(',').map(t=>t.trim()).filter(Boolean),
        link: (d.link||'').trim(),
        userProject: true,
      };
      onSubmit(project);
    }
    onClose();
  };

  return (
    <>
      <div className={`composer-backdrop ${open?'open':''}`} onClick={onClose}></div>
      <aside className={`composer ${open?'open':''}`} aria-hidden={!open}>
        <header className="composer-head">
          <div className="composer-title">{mode === 'blog' ? 'Write a Post' : 'Add a Project'}</div>
          <button className="composer-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        {open && (mode === 'blog'
          ? <BlogComposer key="blog" draft={safeDraft} setDraft={setDraft} onClose={onClose} onSave={handleSave}/>
          : <ProjectComposer key="project" draft={safeDraft} setDraft={setDraft} onClose={onClose} onSave={handleSave}/>)}
      </aside>
    </>
  );
}

window.Composer = Composer;
window.useLocalStorage = useLocalStorage;
