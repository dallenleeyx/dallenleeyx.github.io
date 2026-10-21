import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, renderProjects, safeURL } from './build-projects.mjs';

const project = (changes = {}) => ({title:'Example', excerpt:'A short project description.', order:10, published:true, links:[{label:'Read more',url:'example/'}], ...changes});
test('orders visible projects and preserves the three list formats', () => {
  for (const [category, className] of [['music','track'],['engineering','build'],['ml','research']]) {
    const html=renderProjects([project({title:'Last',order:30}),project({title:'Hidden',published:false}),project({title:'First',order:1})],category);
    assert.ok(html.indexOf('First') < html.indexOf('Last'));
    assert.ok(!html.includes('Hidden'));
    assert.equal((html.match(/<article/g)||[]).length,2);
    assert.ok(html.includes(`class="${className}"`));
  }
});
test('escapes text and attributes, and rejects executable links', () => {
  const html=renderProjects([project({title:'<img onerror="alert(1)">',excerpt:'A & B\nSecond line',links:[{label:'<script>',url:'https://example.com/?a="x"&b=2'}]})],'ml');
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('A &amp; B<br>Second line'));
  assert.ok(html.includes('noopener noreferrer'));
  for(const url of ['javascript:alert(1)','data:text/html,evil','//evil.test','\\evil.test']) assert.throws(()=>safeURL(url,'music'));
});
test('validates SoundCloud players and keeps per-track credits', () => {
  const html=renderProjects([project({soundcloud:'https://soundcloud.com/tycho/tycho-awake',artist:'Tycho',credit:'Not my recording.'})],'music');
  assert.ok(html.includes('data-audio="https://soundcloud.com/tycho/tycho-awake"'));
  assert.ok(html.includes('data-credit="Not my recording."'));
  assert.ok(html.includes('data-title="Example — Tycho"'));
  assert.throws(()=>renderProjects([project({soundcloud:'https://evil.test/track'})],'music'));
  assert.throws(()=>renderProjects([project({soundcloud:'https://user:password@soundcloud.com/track'})],'music'));
});
test('handles deletion of every project and hundreds of entries without embeds', () => {
  assert.ok(renderProjects([],'engineering').includes('No projects to show yet.'));
  const html=renderProjects(Array.from({length:300},(_,i)=>project({title:`Project ${i}`,order:i})),'music');
  assert.equal((html.match(/<article/g)||[]).length,300);
  assert.ok(!html.includes('<iframe'));
  assert.ok(!html.includes('<canvas'));
});
test('CMS create/edit/reorder/delete changes flow through the static build', async () => {
  const root=await mkdtemp(join(tmpdir(),'portfolio-cms-'));
  try {
    for(const category of ['music','engineering','ml']) {
      await mkdir(join(root,'content',category),{recursive:true});
      await mkdir(join(root,category),{recursive:true});
      await writeFile(join(root,category,'index.html'),'<header>Keep design</header><ol><!-- projects:start -->old<!-- projects:end --></ol><footer>Keep footer</footer>');
    }
    const folder=join(root,'content','engineering');
    await writeFile(join(folder,'first.json'),JSON.stringify(project({title:'Original',order:20})));
    await build(root);
    assert.ok((await readFile(join(root,'engineering/index.html'),'utf8')).includes('Original'));
    await writeFile(join(folder,'first.json'),JSON.stringify(project({title:'Edited',order:20})));
    await writeFile(join(folder,'new.json'),JSON.stringify(project({title:'Added',order:1})));
    await build(root);
    let html=await readFile(join(root,'engineering/index.html'),'utf8');
    assert.ok(html.indexOf('Added')<html.indexOf('Edited'));
    assert.ok(html.includes('<header>Keep design</header>'));
    assert.ok(html.includes('<footer>Keep footer</footer>'));
    await rm(join(folder,'new.json'));
    await build(root);
    html=await readFile(join(root,'engineering/index.html'),'utf8');
    assert.ok(!html.includes('Added'));
    const previous=html;
    await writeFile(join(folder,'bad.json'),'{broken JSON');
    await assert.rejects(build(root));
    assert.equal(await readFile(join(root,'engineering/index.html'),'utf8'),previous);
  } finally { await rm(root,{recursive:true,force:true}); }
});
