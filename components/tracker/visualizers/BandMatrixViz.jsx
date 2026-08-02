'use client';
// components/tracker/visualizers/BandMatrixViz.jsx — an n×n grid where
// cells within `bandwidth` of the diagonal are highlighted, i.e. the
// nonzero entries of a band matrix. Plain CSS grid rather than Canvas --
// this is a static arrangement of discrete cells, not a continuous
// animated path, so CSS handles the (size, bandwidth)-change transition
// for free via its own background-color transition.
export const BAND_MATRIX_DEFAULTS = { size: 8, bandwidth: 1 };

export function BandMatrixViz({ params, onChange }) {
  const size = params.size ?? BAND_MATRIX_DEFAULTS.size;
  const bandwidth = Math.min(params.bandwidth ?? BAND_MATRIX_DEFAULTS.bandwidth, size - 1);

  const setSize = (next) => onChange({ ...params, size: next, bandwidth: Math.min(bandwidth, next - 1) });
  const setBandwidth = (next) => onChange({ ...params, bandwidth: Math.min(next, size - 1) });

  const cells = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      cells.push({ key: `${i}-${j}`, on: Math.abs(i - j) <= bandwidth });
    }
  }

  return (
    <div className="tk-viz-bandmatrix">
      <div className="tk-viz-controls">
        <label>
          Size <span className="tk-viz-control-val">{size}</span>
          <input type="range" min="2" max="24" value={size} onChange={e => setSize(Number(e.target.value))} />
        </label>
        <label>
          Bandwidth <span className="tk-viz-control-val">{bandwidth}</span>
          <input type="range" min="0" max={size - 1} value={bandwidth} onChange={e => setBandwidth(Number(e.target.value))} />
        </label>
      </div>
      <div className="tk-viz-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {cells.map(c => (
          <div key={c.key} className={`tk-viz-cell${c.on ? ' on' : ''}`} />
        ))}
      </div>
    </div>
  );
}
