import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const portfolio = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const categories = ['music', 'engineering', 'ml'];
const base = 'https://dallenleeyx.github.io';
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = value => escape(value).replace(/\r?\n/g, '<br>');

function required(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} must contain text`);
  return value.trim();
}
export function safeURL(value, category) {
  const url = required(value, 'Link URL');
  if (/[\\\u0000-\u001f]/.test(url) || url.startsWith('//')) throw new Error('Unsupported link URL');
  const parsed = new URL(url, `${base}/portfolio/${category}/`);
  if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) throw new Error('Use a website URL, email link, or relative site path');
  return {url, external: ['http:', 'https:'].includes(parsed.protocol) && parsed.origin !== base};
}
export function validate(project, category) {
  if (!project || typeof project !== 'object' || Array.isArray(project)) throw new Error('Project must be an object');
  const title = required(project.title, 'Title');
  const excerpt = required(project.excerpt, 'Excerpt');
  if (title.length > 200 || excerpt.length > 2000) throw new Error('Project text is too long');
  if (project.order != null && (typeof project.order !== 'number' || !Number.isFinite(project.order))) throw new Error('Order must be a number');
  if (project.published != null && typeof project.published !== 'boolean') throw new Error('Show in portfolio must be true or false');
  if (project.links != null && !Array.isArray(project.links)) throw new Error('Links must be a list');
  const links = (project.links || []).map(link => {
    if (!link || typeof link !== 'object') throw new Error('Invalid link');
    if (link.download != null && typeof link.download !== 'boolean') throw new Error('Download must be true or false');
    return {label: required(link.label, 'Link label'), ...safeURL(link.url, category), download: link.download === true};
  });
  let soundcloud = '';
  if (category === 'music' && project.soundcloud) {
    const parsed = new URL(project.soundcloud);
    if (parsed.protocol !== 'https:' || !['soundcloud.com', 'www.soundcloud.com'].includes(parsed.hostname) || parsed.pathname.length < 2) throw new Error('Use a full HTTPS SoundCloud track or playlist URL');
    if (parsed.username || parsed.password) throw new Error('SoundCloud URLs cannot contain credentials');
    soundcloud = parsed.href;
  }
  for (const key of ['artist', 'credit']) {
    if (project[key] != null && typeof project[key] !== 'string') throw new Error(`${key} must be text`);
  }
  if (!links.length && !soundcloud) throw new Error('Add at least one link or SoundCloud URL');
  return {title, excerpt, order: project.order ?? 1000, published: project.published !== false,
    links, soundcloud, artist: project.artist || '', credit: project.credit || ''};
}
export function renderProjects(entries, category) {
  if (!categories.includes(category)) throw new Error('Unknown portfolio');
  const projects = entries.map(entry => validate(entry, category)).filter(entry => entry.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'en'));
  if (!projects.length) return '<li class="empty-projects">No projects to show yet.</li>';
  return projects.map(project => {
    let links = project.links.map(link => `<a href="${escape(link.url)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}${link.download ? ' download' : ''}>${escape(link.label)} <span aria-hidden="true">${link.download ? '↓' : '↗'}</span></a>`).join('');
    if (project.soundcloud) {
      const playerTitle = project.title + (project.artist ? ' — ' + project.artist : '');
      links = `<button class="listen-button" type="button" data-audio="${escape(project.soundcloud)}" data-title="${escape(playerTitle)}" data-credit="${escape(project.credit)}" hidden><span class="button-icon" aria-hidden="true">▶</span><span>Listen</span></button>` + links;
    }
    const title = `<h2>${text(project.title)}</h2>`, excerpt = `<p>${text(project.excerpt)}</p>`;
    const actions = `<div class="project-links">${links}</div>`;
    if (category === 'music') return `<li><article class="track"><span class="track-number" aria-hidden="true"></span><div class="track-text">${title}${excerpt}</div>${actions}</article></li>`;
    if (category === 'engineering') return `<li><article class="build"><div class="build-title"><span class="project-number" aria-hidden="true"></span>${title}</div>${excerpt}${actions}</article></li>`;
    return `<li><article class="research"><div class="research-title"><span class="project-number" aria-hidden="true"></span>${title}</div><div class="research-description">${excerpt}${actions}</div></article></li>`;
  }).join('\n');
}
export async function build(root = portfolio) {
  const outputs = [];
  for (const category of categories) {
    const folder = join(root, 'content', category);
    const names = (await readdir(folder)).filter(name => name.endsWith('.json')).sort();
    const projects = [];
    for (const name of names) {
      try { projects.push(JSON.parse(await readFile(join(folder, name), 'utf8'))); }
      catch (error) { throw new Error(`${category}/${name}: ${error.message}`); }
    }
    let rendered;
    try { rendered = renderProjects(projects, category); }
    catch (error) { throw new Error(`${category}: ${error.message}`); }
    const file = join(root, category, 'index.html');
    const html = await readFile(file, 'utf8');
    const markers = /<!-- projects:start -->[\s\S]*?<!-- projects:end -->/;
    if (!markers.test(html)) throw new Error(`${category}: missing project list markers`);
    outputs.push({file, content: html.replace(markers, `<!-- projects:start -->\n${rendered}\n<!-- projects:end -->`)});
  }
  // Prepare and validate every portfolio before writing any page.
  for (const output of outputs) await writeFile(output.file, output.content);
  return outputs.length;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(`Built ${await build()} portfolio project lists.`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
