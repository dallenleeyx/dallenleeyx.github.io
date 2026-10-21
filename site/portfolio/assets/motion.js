/* One background per page. Project rows stay still and require no animation work. */
(() => {
  'use strict';
  const canvas = document.querySelector('#atmosphere');
  const ctx = canvas?.getContext('2d');
  const toggle = document.querySelector('#motionToggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = document.body.dataset.scene;
  let savedPause = false;
  try { savedPause = localStorage.getItem('portfolioMotionPaused') === 'true'; } catch {}
  let paused = reduced.matches || savedPause;
  let width = 0, height = 0, time = 0, last = 0, frame = 0;
  const pointer = {x: 0, y: 0, targetX: 0, targetY: 0};

  function music() {
    // Slowly moving contour lines, like a long exposure of sound.
    ctx.lineWidth = 1;
    for (let band = 0; band < 17; band++) {
      ctx.beginPath();
      ctx.strokeStyle = band % 5 === 0 ? 'rgba(237,121,93,.16)' : 'rgba(240,237,198,.09)';
      for (let x = -30; x <= width + 30; x += 16) {
        const envelope = Math.sin(x / width * Math.PI);
        const y = height * .43 + (band - 8) * 21
          + Math.sin(x / width * 6.2 + time * .16 + band * .12) * height * .2 * envelope
          + Math.cos(x / width * 10 - time * .11) * 22
          + pointer.y * 20 + pointer.x * (band - 8) * 3;
        if (x === -30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  function engineering() {
    const grid = width < 650 ? 48 : 72;
    const ox = pointer.x * 7, oy = pointer.y * 7;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(40,51,45,.055)';
    ctx.beginPath();
    for (let x = grid / 2 + ox; x < width; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = grid / 2 + oy; y < height; y += grid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
    // A moving drafting instrument around the outer margin.
    const inset = width < 650 ? 11 : 20;
    const perimeter = 2 * (width + height - inset * 4);
    let distance = (time * 36) % perimeter;
    const w = width - inset * 2, h = height - inset * 2;
    let x = inset, y = inset;
    if (distance < w) x += distance;
    else if ((distance -= w) < h) { x += w; y += distance; }
    else if ((distance -= h) < w) { x += w - distance; y += h; }
    else { distance -= w; y += h - distance; }
    ctx.strokeStyle = 'rgba(180,61,32,.3)';
    ctx.strokeRect(inset, inset, w, h);
    ctx.fillStyle = 'rgba(180,61,32,.65)';
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.beginPath(); ctx.moveTo(x - 13, y); ctx.lineTo(x + 13, y); ctx.moveTo(x, y - 13); ctx.lineTo(x, y + 13); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,51,45,.10)';
    const r = Math.min(width, height) * .3;
    ctx.beginPath(); ctx.arc(width * .88 + ox, height * .48 + oy, r, time * .025, Math.PI * 1.65 + time * .025); ctx.stroke();
    ctx.beginPath(); ctx.arc(width * .88 + ox, height * .48 + oy, r + 16, -time * .02, Math.PI * 1.3 - time * .02); ctx.stroke();
  }
  function ml() {
    // A single field of connected points, independent of the number of projects.
    const cols = width < 650 ? 7 : 12, rows = 7;
    const points = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const phase = row * .6 + col * .45;
        points.push({x: col / (cols - 1) * width + Math.sin(time * .14 + phase) * 17 + pointer.x * 12,
          y: row / (rows - 1) * height + Math.cos(time * .12 + phase) * 22 + pointer.y * 12});
      }
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(102,80,174,.065)';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i % cols < cols - 1) { ctx.moveTo(p.x, p.y); ctx.lineTo(points[i + 1].x, points[i + 1].y); }
      if (i + cols < points.length) { ctx.moveTo(p.x, p.y); ctx.lineTo(points[i + cols].x, points[i + cols].y); }
    });
    ctx.stroke();
    points.forEach((p, i) => {
      ctx.fillStyle = 'rgba(102,80,174,' + (.12 + .07 * Math.sin(time * .25 + i)) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 + Math.sin(time * .2 + i) * .6, 0, Math.PI * 2); ctx.fill();
    });
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (scene === 'music') music();
    else if (scene === 'engineering') engineering();
    else ml();
  }
  function loop(stamp) {
    frame = 0;
    if (paused || document.hidden) return;
    if (!last || stamp - last >= 32) {
      time += last ? Math.min((stamp - last) / 1000, .1) : .033;
      last = stamp;
      pointer.x += (pointer.targetX - pointer.x) * .06;
      pointer.y += (pointer.targetY - pointer.y) * .06;
      draw();
    }
    frame = requestAnimationFrame(loop);
  }
  function start() {
    if (!frame && !paused && !document.hidden) { last = 0; frame = requestAnimationFrame(loop); }
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    document.documentElement.classList.toggle('motion-off', paused);
    toggle.classList.toggle('is-paused', paused);
    const label = paused ? 'Resume background animation' : 'Pause background animation';
    toggle.setAttribute('aria-label', label); toggle.title = label;
    draw(); start();
  }
  function size() {
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  if (ctx && toggle) {
    toggle.hidden = false;
    size(); sync();
    window.addEventListener('resize', size, {passive: true});
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      pointer.targetX = event.clientX / width * 2 - 1;
      pointer.targetY = event.clientY / height * 2 - 1;
    }, {passive: true});
    document.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (frame) cancelAnimationFrame(frame); frame = 0; }
      else start();
    });
    toggle.addEventListener('click', () => {
      paused = !paused;
      try { localStorage.setItem('portfolioMotionPaused', String(paused)); } catch {}
      sync();
    });
    reduced.addEventListener('change', event => { if (event.matches) { paused = true; sync(); } });
  }

  // One reusable audio dialog for every recording in the music list.
  const dialog = document.querySelector('#audioDialog');
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-audio]').forEach(button => { button.hidden = false; });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-audio]');
      if (!button) return;
      const url = new URL(button.dataset.audio);
      if (url.protocol !== 'https:' || url.hostname !== 'soundcloud.com') return;
      const iframe = document.createElement('iframe');
      iframe.title = button.dataset.title + ' — SoundCloud player';
      iframe.allow = 'autoplay';
      iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url.href) + '&color=%23ed795d&auto_play=false&hide_related=true&show_comments=false&visual=false';
      document.querySelector('#audioTitle').textContent = button.dataset.title;
      document.querySelector('#audioPlayer').replaceChildren(iframe);
      dialog.showModal();
    });
    dialog.querySelector('.close-player').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.querySelector('#audioPlayer').replaceChildren());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  }
})();
