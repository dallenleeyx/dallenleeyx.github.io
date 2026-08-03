'use client';
// components/music/StaffView.jsx — draws a 5-line treble staff and any
// number of noteheads on it (a single note, a stacked interval, or a
// stacked triad), computed purely from lib/music/staffLayout.js. Also
// doubles as the clickable staff for the "name -> note" drill: pass
// `onStaffClick` and a click anywhere on the staff resolves to the nearest
// natural note.
import { stepsFromBottomLine, ledgerLinesFor, noteFromSteps } from '../../lib/music/staffLayout';
import { accidentalSymbol } from '../../lib/music/pitch';

const LINE_GAP = 12; // px between adjacent staff lines
const STAFF_LEFT = 56; // leaves room for the clef glyph
const NOTEHEAD_RX = 7;
const NOTEHEAD_RY = 5.5;

function yForSteps(steps, centerY) {
  // Step 4 (the staff's middle line) sits at the vertical center.
  return centerY - (steps - 4) * (LINE_GAP / 2);
}

function stepsForY(y, centerY) {
  return 4 - (y - centerY) / (LINE_GAP / 2);
}

export function StaffView({
  notes = [],
  clef = 'treble',
  width = 240,
  height = 180,
  interactive = false,
  onStaffClick,
  markers = [],
}) {
  const centerY = height / 2;
  const staffRight = width - 20;

  const positioned = notes
    .map((note) => ({ note, steps: stepsFromBottomLine(note.letter, note.octave, clef) }))
    .sort((a, b) => a.steps - b.steps)
    // A second (adjacent line/space) collides visually if drawn at the same
    // x -- standard notation offsets every other close notehead to the
    // right instead of stacking noteheads on top of each other.
    .map((entry, i, arr) => {
      const collides = i > 0 && Math.abs(entry.steps - arr[i - 1].steps) <= 1;
      return { ...entry, xOffset: collides ? NOTEHEAD_RX * 1.8 : 0 };
    });

  const noteCenterX = STAFF_LEFT + 46;

  const handleClick = (e) => {
    if (!interactive || !onStaffClick) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const steps = Math.round(stepsForY(y, centerY));
    onStaffClick(noteFromSteps(steps, clef));
  };

  return (
    <svg
      className={`music-staff-svg${interactive ? ' interactive' : ''}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      onClick={handleClick}
    >
      {/* the 5 staff lines: steps 0,2,4,6,8 */}
      {[0, 2, 4, 6, 8].map((steps) => (
        <line
          key={steps}
          x1={STAFF_LEFT}
          y1={yForSteps(steps, centerY)}
          x2={staffRight}
          y2={yForSteps(steps, centerY)}
          className="music-staff-line"
        />
      ))}

      {clef === 'treble' && (
        <text x={STAFF_LEFT - 38} y={centerY + 20} className="music-staff-clef">𝄞</text>
      )}

      {positioned.map(({ note, steps, xOffset }, i) => {
        const cx = noteCenterX + xOffset;
        const cy = yForSteps(steps, centerY);
        const ledgers = ledgerLinesFor(steps);
        return (
          <g key={i}>
            {ledgers.map((ledgerStep) => (
              <line
                key={ledgerStep}
                x1={cx - NOTEHEAD_RX - 4}
                x2={cx + NOTEHEAD_RX + 4}
                y1={yForSteps(ledgerStep, centerY)}
                y2={yForSteps(ledgerStep, centerY)}
                className="music-ledger-line"
              />
            ))}
            {note.accidental !== 0 && (
              <text x={cx - NOTEHEAD_RX - 14} y={cy + 5} className="music-accidental">
                {accidentalSymbol(note.accidental)}
              </text>
            )}
            <ellipse cx={cx} cy={cy} rx={NOTEHEAD_RX} ry={NOTEHEAD_RY} className="music-notehead" />
          </g>
        );
      })}

      {markers.map((marker, i) => {
        const steps = stepsFromBottomLine(marker.letter, marker.octave, clef);
        const cy = yForSteps(steps, centerY);
        return (
          <circle
            key={i}
            cx={noteCenterX}
            cy={cy}
            r={NOTEHEAD_RX + 3}
            className={`music-marker music-marker-${marker.variant}`}
          />
        );
      })}
    </svg>
  );
}
