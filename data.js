// data.js — courses, projects, blog post auto-loader.
//
// Blog posts live as .md files in posts/. Drop a new file in and it will
// appear automatically — no _index.json edit needed.
// Posts can have an optional YAML front-matter block:
//   ---
//   title: My Post
//   date: Apr 2025
//   tag: Notes
//   excerpt: One-line summary.
//   ---
// If absent, title falls back to the first H1, date is blank, etc.

window.COURSES = [
  { code: "MA1100", name: "Basic Discrete Mathematics", dept: "Mathematics" },
  { code: "MA2001", name: "Linear Algebra I", dept: "Mathematics" },
  { code: "MA2002", name: "Calculus", dept: "Mathematics" },
  { code: "MA2101", name: "Linear Algebra II", dept: "Mathematics" },
  { code: "MA2104", name: "Multivariable Calculus", dept: "Mathematics" },
  { code: "MA2108", name: "Mathematical Analysis I", dept: "Mathematics" },
  { code: "MA2202", name: "Algebra I", dept: "Mathematics" },
  { code: "MA3210", name: "Mathematical Analysis II", dept: "Mathematics" },
  { code: "MA3201", name: "Algebra II", dept: "Mathematics" },
  { code: "MA3264", name: "Mathematical Modelling", dept: "Mathematics" },
  { code: "MA3270", name: "Mathematics for AI", dept: "Mathematics" },
  { code: "MA3209", name: "Metric and Topological Spaces", dept: "Mathematics" },
  { code: "MA2116", name: "Probability", dept: "Mathematics" },
  { code: "MA4271", name: "Differential Geometry of Curves and Surfaces", dept: "Mathematics" },
  { code: "QF1100", name: "Introduction to Quantitative Finance", dept: "Quantitative Finance" },
  { code: "ST2132", name: "Mathematical Statistics", dept: "Statistics" },
  { code: "CS1010", name: "Programming Methodology", dept: "CS" },
];

window.SEED_PROJECTS = [
  {
    id: "p1",
    title: "Riemannian Optimisation Playground",
    area: "Differential Geometry · Python",
    desc: "Interactive notebook that lets you visualise gradient flows on the sphere, the Stiefel manifold, and the Poincaré disc. Compares Euclidean SGD to natural-gradient updates.",
    tags: ["Python", "JAX", "Geometry"],
    link: "https://github.com/",
  },
];

// ── Blog config ──────────────────────────────────────────────────────────
// Auto-detected from window.location when deployed at <user>.github.io.
// You can also hard-code your own owner/repo here.
window.BLOG_CONFIG = (function() {
  const host = (window.location && window.location.hostname) || '';
  const m = host.match(/^([^.]+)\.github\.io$/i);
  return {
    owner: m ? m[1] : 'dallenleeyx',
    repo:  m ? host : 'dallenleeyx.github.io',
    folder: 'posts',
  };
})();

// ── Front-matter parser ──────────────────────────────────────────────────
window.parseFrontMatter = function(text) {
  const m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  m[1].split(/\r?\n/).forEach(line => {
    const kv = /^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*?)\s*$/.exec(line);
    if (!kv) return;
    let v = kv[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    meta[kv[1].toLowerCase()] = v;
  });
  return { meta, body: m[2] };
};

function titleFromSlug(slug) {
  return slug.replace(/[-_]+/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Cache: file → full raw text
const _postTextCache = {};

window.loadPostBody = async function(file) {
  if (_postTextCache[file] != null) return _postTextCache[file];
  try {
    const res = await fetch('posts/' + file, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    _postTextCache[file] = text;
    return text;
  } catch (e) {
    console.warn('[blog] could not load', file, e.message);
    return '_Could not load this post (' + file + ')._';
  }
};

async function _hydrate(file) {
  const text = await window.loadPostBody(file);
  const { meta, body } = window.parseFrontMatter(text);
  const slug = file.replace(/\.md$/i, '');
  const firstLine = (body.trim().split('\n')[0] || '').replace(/^#+\s*/, '').trim();
  const cleanBody = body.replace(/^#+.*$/gm,'').replace(/\$\$[\s\S]*?\$\$/g,'').replace(/\$[^$]*\$/g,'').replace(/[*_`>#-]/g,'').replace(/\s+/g,' ').trim();
  return {
    slug,
    file,
    title: meta.title || firstLine || titleFromSlug(slug),
    date: meta.date || '',
    tag: meta.tag || meta.category || 'Notes',
    excerpt: meta.excerpt || meta.summary || cleanBody.slice(0, 180),
    _order: meta.order != null ? Number(meta.order) : null,
  };
}

// Try GitHub Contents API to list .md files in posts/.
// Uses default branch (omit ?ref=) so it works whether the repo is on main or master.
async function _listFromGitHubAPI() {
  const { owner, repo, folder } = window.BLOG_CONFIG;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('GitHub API ' + res.status);
  const list = await res.json();
  return list
    .filter(f => f.type === 'file' && /\.md$/i.test(f.name)
      && !f.name.startsWith('_')
      && f.name.toLowerCase() !== 'readme.md')
    .map(f => f.name);
}

// Fallback: read posts/_index.json (if present, for local dev / offline).
async function _listFromIndexJson() {
  const res = await fetch('posts/_index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('no _index.json');
  const data = await res.json();
  return (data.posts || []).map(p => p.file || (p.slug + '.md'));
}

window.loadPostIndex = async function() {
  let files = [];
  // 1. GitHub API — auto-discovery.
  try {
    files = await _listFromGitHubAPI();
    console.info('[blog] discovered', files.length, 'posts via GitHub API');
  } catch (e) {
    console.info('[blog] GitHub API unavailable —', e.message);
    // 2. _index.json — explicit list.
    try {
      files = await _listFromIndexJson();
      console.info('[blog] using _index.json with', files.length, 'posts');
    } catch (e2) {
      console.warn('[blog] no post source available');
      return [];
    }
  }
  if (!files.length) return [];
  const posts = await Promise.all(files.map(_hydrate));
  // Sort: explicit `order` first (asc), then date desc, else stable.
  return posts.sort((a, b) => {
    if (a._order != null && b._order != null) return a._order - b._order;
    if (a._order != null) return -1;
    if (b._order != null) return 1;
    const ad = Date.parse(a.date), bd = Date.parse(b.date);
    if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
    return 0;
  });
};
