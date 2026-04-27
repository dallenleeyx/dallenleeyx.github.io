/**
 * ══════════════════════════════════════════════
 *  main.js  —  Site logic (don't need to touch this)
 * ══════════════════════════════════════════════
 */

/* ── THEME TOGGLE ── */
const toggle = document.getElementById('themeToggle');
const html   = document.documentElement;
const saved  = localStorage.getItem('theme');
const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
html.setAttribute('data-theme', preferred);

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


/* ── SCROLL-TRIGGERED SECTION FADE IN ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.sidebar-nav a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.sidebar-nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.12 });

sections.forEach(s => sectionObserver.observe(s));

// Trigger first section immediately
setTimeout(() => {
  const first = document.querySelector('section');
  if (first) first.classList.add('visible');
}, 50);


/* ── PARTICLE BACKGROUND ── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const SYMBOLS = ['∂', '∇', '∑', 'ℝ', 'ℂ', '∞', 'π', '∫', '√', 'θ', 'λ', 'μ', 'σ', '⊕', '∈'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      sym:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size: 9 + Math.random() * 10,
      vx:   (Math.random() - 0.5) * 0.15,
      vy:   -0.12 - Math.random() * 0.18,
      life: Math.random(),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 28 }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isDark = html.getAttribute('data-theme') === 'dark';
    const baseColor = isDark ? '200,200,200' : '80,80,80';

    particles.forEach(p => {
      p.life += 0.002;
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -30) { Object.assign(p, mkParticle(), { y: H + 10, x: Math.random() * W }); }

      const alpha = 0.04 + 0.09 * Math.sin(p.life * Math.PI);
      ctx.save();
      ctx.font = `${p.size}px 'DM Mono', monospace`;
      ctx.fillStyle = `rgba(${baseColor},${alpha})`;
      ctx.fillText(p.sym, p.x, p.y);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ── COURSES ── */
(function initCourses() {
  if (typeof COURSES === 'undefined' || !COURSES.length) return;

  const grid     = document.getElementById('coursesGrid');
  const metaEl   = document.getElementById('coursesMeta');
  const searchEl = document.getElementById('courseSearch');
  const pillsEl  = document.getElementById('deptFilter');

  // Build dept filter pills
  const depts = ['All', ...new Set(COURSES.map(c => c.dept))];
  let activeDept = 'All';

  depts.forEach(dept => {
    const pill = document.createElement('button');
    pill.className = 'filter-pill' + (dept === 'All' ? ' active' : '');
    pill.textContent = dept;
    pill.addEventListener('click', () => {
      activeDept = dept;
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      render();
    });
    pillsEl.appendChild(pill);
  });

  function render() {
    const q = searchEl.value.toLowerCase().trim();
    const filtered = COURSES.filter(c => {
      const matchDept  = activeDept === 'All' || c.dept === activeDept;
      const matchQuery = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.dept.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });

    metaEl.textContent = `Showing ${filtered.length} of ${COURSES.length} courses`;

    grid.innerHTML = '';
    if (!filtered.length) {
      grid.innerHTML = '<div class="course-no-results">No courses match your search.</div>';
      return;
    }

    filtered.forEach(c => {
      const a = document.createElement('a');
      a.className  = 'course-card';
      a.href       = `https://nusmods.com/courses/${c.code}`;
      a.target     = '_blank';
      a.rel        = 'noopener noreferrer';
      a.innerHTML  = `
        <div class="course-code">${c.code}</div>
        <div class="course-name">${c.name}</div>
        <div class="course-dept">${c.dept}</div>
      `;
      grid.appendChild(a);
    });
  }

  searchEl.addEventListener('input', render);
  render();
})();


/* ── BLOG ── */
(function initBlog() {
  if (typeof BLOG_POSTS === 'undefined') return;

  const listEl  = document.getElementById('blogList');
  const emptyEl = document.getElementById('blog-empty');

  if (!BLOG_POSTS.length) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  BLOG_POSTS.forEach(post => {
    // Determine the link:
    //   — if the post has a slug  → post.html?post=SLUG  (internal reader)
    //   — if it has a url         → that external URL
    //   — otherwise               → no link (non-clickable card)
    const href = post.slug
      ? `post.html?post=${encodeURIComponent(post.slug)}`
      : (post.url || null);

    const el = href
      ? document.createElement('a')
      : document.createElement('div');

    el.className = 'blog-post';

    if (href) {
      el.href = href;
      // Internal post pages open in the same tab; external URLs open in a new tab
      if (post.url && !post.slug) {
        el.target = '_blank';
        el.rel    = 'noopener noreferrer';
      }
    }

    el.innerHTML = `
      <div class="blog-post-meta">
        <span class="blog-date">${post.date}</span>
        <span class="blog-tag">${post.tag}</span>
      </div>
      <div class="blog-title">${post.title}</div>
      <div class="blog-excerpt">${post.excerpt}</div>
    `;
    listEl.appendChild(el);
  });
})();


/* ── PERSONAL PROJECTS — hide empty state if cards present ── */
(function checkProjects() {
  const section  = document.getElementById('projects');
  const emptyEl  = document.getElementById('projects-empty');
  const cards    = section ? section.querySelectorAll('.project-card') : [];
  if (emptyEl && cards.length > 0) emptyEl.style.display = 'none';
})();
