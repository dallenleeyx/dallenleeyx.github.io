// components/tracker/visualizers/starterExample.js — a ready-to-run
// example handed to "+ New visualizer" so there's something to actually
// look at and tweak, since most people won't sit down and write a
// visualizer from a blank textarea. Self-contained plain HTML/CSS/JS
// (the same shape any post's code is) -- this is not a special case, it's
// just what a working visualizer looks like.
export const BAND_MATRIX_EXAMPLE_HTML = `<!doctype html>
<html>
<head>
<style>
  body { font-family: sans-serif; margin: 0; padding: 16px; background: #fff; color: #111; }
  .controls { display: flex; gap: 24px; margin-bottom: 16px; }
  label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #888; }
  .val { font-family: monospace; color: #111; text-transform: none; font-weight: 400; }
  #grid { display: grid; gap: 2px; width: 100%; max-width: 360px; aspect-ratio: 1; margin: 0 auto; }
  .cell { background: #eee; border-radius: 2px; transition: background-color .2s ease; }
  .cell.on { background: #111; }
</style>
</head>
<body>
  <div class="controls">
    <label>Size <span class="val" id="sizeVal">8</span>
      <input id="size" type="range" min="2" max="24" value="8" />
    </label>
    <label>Bandwidth <span class="val" id="bwVal">1</span>
      <input id="bandwidth" type="range" min="0" max="23" value="1" />
    </label>
  </div>
  <div id="grid"></div>
  <script>
    const sizeInput = document.getElementById('size');
    const bwInput = document.getElementById('bandwidth');
    const grid = document.getElementById('grid');

    function render() {
      const n = Number(sizeInput.value);
      bwInput.max = n - 1;
      const bw = Math.min(Number(bwInput.value), n - 1);
      document.getElementById('sizeVal').textContent = n;
      document.getElementById('bwVal').textContent = bw;
      grid.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)';
      grid.innerHTML = '';
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell' + (Math.abs(i - j) <= bw ? ' on' : '');
          grid.appendChild(cell);
        }
      }
    }
    sizeInput.addEventListener('input', render);
    bwInput.addEventListener('input', render);
    render();
  </script>
</body>
</html>
`;
