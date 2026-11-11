import { readdir, readFile, writeFile, mkdir, copyFile, cp } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://dallenleeyx.github.io';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const safeLink = href => {
  if (typeof href !== 'string' || !href.trim() || /[\u0000-\u001f\\]/.test(href) || href.startsWith('//')) return false;
  try {
    const url = new URL(href, SITE + '/');
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch { return false; }
};

marked.use(markedKatex({ throwOnError: false, trust: false }));
marked.use({
  renderer: {
    html(token) { return escapeHtml(token.text); },
    link(token) {
      const label = this.parser.parseInline(token.tokens);
      if (!safeLink(token.href)) return label;
      const external = /^https?:\/\//i.test(token.href);
      return '<a href="' + escapeHtml(token.href) + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : '') +
        (token.title ? ' title="' + escapeHtml(token.title) + '"' : '') + '>' + label + '</a>';
    },
    image(token) {
      if (!safeLink(token.href)) return escapeHtml(token.text || '');
      return '<img loading="lazy" src="' + escapeHtml(token.href) + '" alt="' + escapeHtml(token.text || '') +
        '"' + (token.title ? ' title="' + escapeHtml(token.title) + '"' : '') + '>';
    }
  }
});

function dateString(value) {
  const date = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw Error('Date must be YYYY-MM-DD');
  return date;
}
function makeEmbed(kind, label, href) {
  if (kind === 'manim') {
    if (!/^\/notes\/media\/videos\/[A-Za-z0-9_./-]+\.(mp4|webm)$/.test(href) || href.includes('..')) throw Error('Manim video must be under /notes/media/videos/ and end in .mp4 or .webm');
    return '<figure class="embed"><video controls playsinline preload="metadata" aria-label="' + escapeHtml(label || 'Mathematical animation') + '"><source src="' + escapeHtml(href) +
      '" type="video/' + (href.endsWith('.webm') ? 'webm' : 'mp4') + '">Your browser does not support embedded video.</video>' +
      (label ? '<figcaption>' + escapeHtml(label) + '</figcaption>' : '') + '</figure>';
  }
  if (kind === 'simulation') {
    if (!/^\/simulations\/[a-z0-9-]+\/$/.test(href)) throw Error('Simulation must be a local /simulations/name/ directory');
    return '<figure class="embed"><iframe title="' + escapeHtml(label || 'Interactive simulation') + '" src="' + escapeHtml(href) +
      '" loading="lazy" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>' +
      (label ? '<figcaption>' + escapeHtml(label) + '</figcaption>' : '') + '</figure>';
  }
  throw Error('Unknown embed type');
}

export function renderArticleBody(body) {
  const embeds = [];
  const source = String(body).replace(/^::(manim|simulation)\[([^\]\n]*)\]\(([^)\n]+)\)\s*$/gm, (_all, kind, label, href) => {
    const key = 'DALLENEMBEDTOKEN' + embeds.length + 'END';
    embeds.push(makeEmbed(kind, label, href));
    return key;
  });
  let html = marked.parse(source);
  embeds.forEach((entry, i) => {
    html = html.replace('<p>DALLENEMBEDTOKEN' + i + 'END</p>', entry);
  });
  return html;
}
function navigation() {
  return '<header class="notebook-nav"><a class="wordmark" href="../../">Dallen Lee</a><nav aria-label="Main navigation">' +
    '<a href="../../">Home</a><a href="../../portfolio/music/">Music</a><a href="../" aria-current="page">Notes &amp; simulations</a></nav></header>';
}
function articleHtml(entry) {
  const title = escapeHtml(entry.title);
  const cover = entry.cover ? '<img class="article-cover" src="' + escapeHtml(entry.cover) + '" alt="">' : '';
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + ' — Dallen Lee</title><meta name="description" content="' + escapeHtml(entry.summary) + '">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:wght@400;500;600;700&display=swap">' +
    '<link rel="stylesheet" href="../assets/notes.css"><link rel="stylesheet" href="../assets/katex.min.css"></head><body>' +
    '<div class="notebook-shell"><a class="skip-link" href="#article">Skip to article</a>' + navigation() +
    '<main id="article" class="article-main"><a class="back-link" href="../">← All notes</a><header class="article-header">' +
    '<p class="article-kicker">' + escapeHtml(entry.kind) + ' · <time datetime="' + entry.date + '">' + escapeHtml(entry.date) + '</time></p>' +
    '<h1>' + title + '</h1><p class="article-subtitle">' + escapeHtml(entry.summary) + '</p></header>' +
    cover + '<article class="prose">' + entry.html + '</article>' +
    '<footer class="article-footer"><a class="back-link" href="../">← Back to notes &amp; simulations</a></footer></main>' +
    '<footer class="notebook-footer"><span>© Dallen Lee</span><a href="../../">Home</a></footer></div></body></html>';
}
function indexRow(entry) {
  const tags = entry.tags.length ? '<div class="entry-tags">' + escapeHtml(entry.tags.join(' · ')) + '</div>' : '';
  return '<a class="entry-row" href="' + entry.slug + '/" data-kind="' + escapeHtml(entry.kind) + '">' +
    '<div class="entry-meta"><span class="kind">' + escapeHtml(entry.kind) + '</span><time datetime="' + entry.date + '">' + entry.date + '</time></div>' +
    '<h2>' + escapeHtml(entry.title) + '</h2><p>' + escapeHtml(entry.summary) + '</p>' + tags + '</a>';
}
export function validateEntry(filename, frontmatter, body) {
  const slug = filename.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error('Use lowercase words joined by hyphens for the filename');
  const title = String(frontmatter.title ?? '').trim(), summary = String(frontmatter.summary ?? '').trim();
  if (!title || !summary) throw Error('Title and summary are required');
  const kind = frontmatter.kind || 'Note';
  if (!['Note', 'Simulation'].includes(kind)) throw Error('Entry type must be Note or Simulation');
  if (frontmatter.published != null && typeof frontmatter.published !== 'boolean') throw Error('published must be true or false');
  const cover = frontmatter.cover ? String(frontmatter.cover) : '';
  if (cover && (!safeLink(cover) || !/^\/notes\/media\/images\/[A-Za-z0-9_./-]+$/.test(cover) || cover.includes('..'))) throw Error('Cover image must be a local uploaded image');
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : String(frontmatter.tags || '').split(',');
  return {slug, title, summary, kind, date:dateString(frontmatter.date), published:frontmatter.published !== false,
    tags:tags.map(s => s.trim()).filter(Boolean), cover, body:String(body ?? '')};
}

export async function build() {
  const names = (await readdir(join(root, 'content'))).filter(name => name.endsWith('.md')).sort();
  const entries = [];
  for (const name of names) {
    const input = await readFile(join(root, 'content', name), 'utf8');
    let entry;
    try {
      const parsed = matter(input);
      entry = validateEntry(name, parsed.data, parsed.content);
      if (entry.published) {
        entry.html = renderArticleBody(entry.body);
        entries.push(entry);
      }
    } catch (error) { throw Error('notes/content/' + name + ': ' + error.message); }
  }
  entries.sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const indexPath = join(root, 'index.html');
  const inputIndex = await readFile(indexPath,'utf8');
  const marker = /<!-- entries:start -->[\s\S]*?<!-- entries:end -->/;
  if (!marker.test(inputIndex)) throw Error('Missing entries markers in notes/index.html');
  const list = entries.length ? entries.map(indexRow).join('\n') : '<p class="empty-list">No published entries yet.</p>';
  await writeFile(indexPath, inputIndex.replace(marker, '<!-- entries:start -->\n' + list + '\n<!-- entries:end -->'));
  for (const entry of entries) {
    const output = join(root, entry.slug);
    await mkdir(output,{recursive:true});
    await writeFile(join(output,'index.html'),articleHtml(entry));
  }
  await copyFile(join(root,'node_modules/katex/dist/katex.min.css'),join(root,'assets/katex.min.css'));
  await cp(join(root,'node_modules/katex/dist/fonts'),join(root,'assets/fonts'),{recursive:true});
  return entries.length;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().then(count => console.log('Built ' + count + ' notebook entries.')).catch(error => {
    console.error(error);process.exitCode=1;
  });
}
