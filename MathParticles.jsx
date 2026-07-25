// MathParticles.jsx — animated math-glyph background canvas
function MathParticles() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const SYMBOLS = ['∂','∇','∑','ℝ','ℂ','∞','π','∫','√','θ','λ','μ','σ','⊕','∈'];
    let W, H, particles = [], raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const mk = () => ({
      x: Math.random()*W, y: Math.random()*H,
      sym: SYMBOLS[(Math.random()*SYMBOLS.length)|0],
      size: 9 + Math.random()*10,
      vx: (Math.random()-.5)*.15,
      vy: -.12 - Math.random()*.18,
      life: Math.random(),
    });
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const base = isDark ? '200,200,200' : '80,80,80';
      particles.forEach(p => {
        p.life += .002; p.x += p.vx; p.y += p.vy;
        if (p.y < -30) Object.assign(p, mk(), { y: H + 10, x: Math.random()*W });
        const alpha = .04 + .09*Math.sin(p.life*Math.PI);
        ctx.save();
        ctx.font = `${p.size}px 'DM Mono', monospace`;
        ctx.fillStyle = `rgba(${base},${alpha})`;
        ctx.fillText(p.sym, p.x, p.y);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    resize();
    particles = Array.from({length:28}, mk);
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas id="particles" ref={ref} aria-hidden="true" />;
}

window.MathParticles = MathParticles;
