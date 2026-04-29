// Owner.jsx — owner-only unlock + data.js export
const OWNER_PASSPHRASE = 'dallen-2026';

function useOwner() {
  const [owner, setOwner] = React.useState(() => localStorage.getItem('cv_owner') === '1');
  const unlock = (pass) => {
    if (pass === OWNER_PASSPHRASE) {
      localStorage.setItem('cv_owner', '1');
      setOwner(true);
      return true;
    }
    return false;
  };
  const lock = () => {
    localStorage.removeItem('cv_owner');
    setOwner(false);
  };
  return { owner, unlock, lock };
}

function OwnerUnlock({ open, onClose, onUnlock }) {
  const [pass, setPass] = React.useState('');
  const [err, setErr] = React.useState(false);
  React.useEffect(() => { if (open) { setPass(''); setErr(false); } }, [open]);
  if (!open) return null;
  const submit = () => {
    if (onUnlock(pass)) onClose();
    else setErr(true);
  };
  return (
    <div className="owner-unlock-modal" onClick={onClose}>
      <div className="owner-unlock-card" onClick={e=>e.stopPropagation()}>
        <h3>Owner Unlock</h3>
        <p>Enter the passphrase to enable post & project authoring on this device.</p>
        <input
          type="password"
          autoFocus
          value={pass}
          placeholder="passphrase"
          onChange={e => { setPass(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={err ? { borderColor: '#e85a5a' } : {}}
        />
        <div className="owner-unlock-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Unlock</button>
        </div>
      </div>
    </div>
  );
}

function OwnerBadge({ onLock, onExport }) {
  return (
    <div className="owner-badge">
      <span>● Owner mode</span>
      <button onClick={onExport} title="Download updated data.js">↓ data.js</button>
      <button onClick={onLock} title="Lock">×</button>
    </div>
  );
}

// Build a fresh data.js file string from current seed + user content.
function buildDataJs(posts, projects, courses) {
  const indent = (obj, n=2) => JSON.stringify(obj, null, 2)
    .split('\n').map((l,i)=>i===0?l:' '.repeat(n)+l).join('\n');
  const stringifyPost = (p) => {
    // Use template literals for body so multi-line LaTeX stays readable.
    const fields = [];
    fields.push(`    slug: ${JSON.stringify(p.slug)}`);
    fields.push(`    title: ${JSON.stringify(p.title)}`);
    fields.push(`    date: ${JSON.stringify(p.date)}`);
    fields.push(`    tag: ${JSON.stringify(p.tag)}`);
    fields.push(`    excerpt: ${JSON.stringify(p.excerpt || '')}`);
    // body as a backtick string, escape backticks/${
    const safeBody = (p.body || '').replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
    fields.push('    body: `' + safeBody + '`');
    return '  {\n' + fields.join(',\n') + ',\n  }';
  };
  const stringifyProject = (p) => {
    const o = { id: p.id, title: p.title, area: p.area, desc: p.desc, tags: p.tags || [], link: p.link || '' };
    return '  ' + indent(o, 2);
  };
  return `// data.js — generated ${new Date().toISOString()}
// Edit by running the site locally and using owner mode, then re-exporting this file.

window.COURSES = ${JSON.stringify(courses, null, 2)};

window.SEED_BLOG_POSTS = [
${posts.map(stringifyPost).join(',\n')}
];

window.SEED_PROJECTS = [
${projects.map(stringifyProject).join(',\n')}
];
`;
}

function downloadFile(name, contents) {
  const blob = new Blob([contents], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

window.useOwner = useOwner;
window.OwnerUnlock = OwnerUnlock;
window.OwnerBadge = OwnerBadge;
window.buildDataJs = buildDataJs;
window.downloadFile = downloadFile;
