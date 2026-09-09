'use client';
// components/fitness/charts.jsx — small inline-SVG line/bar charts shared
// by Stats.jsx. Deliberately minimal (no charting library): each chart here
// is a single series, so per the usual chart-design rules a legend isn't
// needed (the card title names the series) and there's no categorical-hue
// assignment to get right -- just one accent color, thin marks, recessive
// gridlines, and a hover tooltip.
import { useState } from 'react';

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

function niceMax(max) {
  if (max <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / magnitude;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * magnitude;
}

// A zero-based axis is the wrong default for something like body weight or
// run duration: real values cluster in a narrow band far from zero, so a
// 0-based scale flattens every trend into a sliver at the top. Instead pad
// tightly around the data's own range -- and pick a decimal precision from
// the resulting span so the low/mid/high gridline labels never collide
// after rounding (e.g. a 74-76kg range showing "74.0 / 75.0 / 76.0", not
// "75 / 75 / 75").
function tightYDomain(values) {
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const span = dataMax - dataMin;
  const pad = span > 0 ? span * 0.2 : Math.max(Math.abs(dataMax) * 0.1, 1);
  return { min: dataMin - pad, max: dataMax + pad };
}

function precisionFor(span) {
  return span < 2 ? 1 : 0;
}

export function LineChart({ points, color, unit = '', emptyText = 'No data yet.' }) {
  const [hover, setHover] = useState(null);
  if (!points.length) return <p className="fit-chart-empty">{emptyText}</p>;

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const values = points.map((p) => p.y);
  const { min: yMin, max: yMax } = tightYDomain(values);
  const decimals = precisionFor(yMax - yMin);
  const xFor = (i) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const yFor = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.y)}`).join(' ');
  const gridLines = [0, 0.5, 1].map((f) => yMin + (yMax - yMin) * f);

  const xLabelIdx = points.length <= 6
    ? points.map((_, i) => i)
    : [0, Math.floor((points.length - 1) / 2), points.length - 1];

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let best = Infinity;
    points.forEach((_, i) => {
      const d = Math.abs(xFor(i) - relX);
      if (d < best) { best = d; nearest = i; }
    });
    setHover(nearest);
  }

  const h = hover != null ? points[hover] : null;

  return (
    <div className="fit-chart-wrap">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="fit-chart-svg"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {gridLines.map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(v)} y2={yFor(v)} className="fit-chart-grid" />
            <text x={PAD.left - 8} y={yFor(v)} className="fit-chart-axis-label" textAnchor="end" dominantBaseline="middle">
              {v.toFixed(decimals)}
            </text>
          </g>
        ))}
        {xLabelIdx.map((i) => (
          <text key={i} x={xFor(i)} y={HEIGHT - 8} className="fit-chart-axis-label" textAnchor="middle">
            {points[i].xLabel}
          </text>
        ))}
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={xFor(i)} cy={yFor(p.y)} r={i === hover ? 5 : 4} fill={color} stroke="var(--fit-paper)" strokeWidth="1.5" />
        ))}
        {h && (
          <line x1={xFor(hover)} x2={xFor(hover)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="fit-chart-crosshair" />
        )}
      </svg>
      {h && (
        <div
          className="fit-chart-tooltip"
          style={{ left: `${(xFor(hover) / WIDTH) * 100}%` }}
        >
          <strong>{h.y}{unit}</strong>
          <span>{h.xLabel}</span>
        </div>
      )}
    </div>
  );
}

export function BarChart({ bars, color, unit = '', emptyText = 'No data yet.' }) {
  const [hover, setHover] = useState(null);
  if (!bars.length) return <p className="fit-chart-empty">{emptyText}</p>;

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const yMax = niceMax(Math.max(...bars.map((b) => b.y), 1));
  const gap = 6;
  const barW = Math.max(6, innerW / bars.length - gap);
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;
  // Bars here are always whole counts, so a gridline at a fraction like
  // yMax/2 can round to the same integer as yMax itself for small ranges
  // (e.g. yMax=1 puts a "1" label at both the middle and the top). Below a
  // small threshold, just draw one gridline per integer instead.
  const gridLines = yMax <= 6
    ? Array.from({ length: yMax + 1 }, (_, i) => i)
    : [0, Math.round(yMax / 2), yMax];

  return (
    <div className="fit-chart-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="fit-chart-svg">
        {gridLines.map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(v)} y2={yFor(v)} className="fit-chart-grid" />
            <text x={PAD.left - 8} y={yFor(v)} className="fit-chart-axis-label" textAnchor="end" dominantBaseline="middle">
              {Math.round(v)}
            </text>
          </g>
        ))}
        {bars.map((b, i) => {
          const x = PAD.left + i * (barW + gap);
          const y = yFor(b.y);
          const h = PAD.top + innerH - y;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect
                x={x} y={y} width={barW} height={Math.max(h, 1)} rx="3"
                fill={color} opacity={hover === i ? 1 : 0.85}
              />
              <rect x={x} y={PAD.top} width={barW} height={innerH} fill="transparent" />
              <text x={x + barW / 2} y={HEIGHT - 8} className="fit-chart-axis-label" textAnchor="middle">
                {b.xLabel}
              </text>
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <div
          className="fit-chart-tooltip"
          style={{ left: `${((PAD.left + hover * (barW + gap) + barW / 2) / WIDTH) * 100}%` }}
        >
          <strong>{bars[hover].y}{unit}</strong>
          <span>{bars[hover].xLabel}</span>
        </div>
      )}
    </div>
  );
}
