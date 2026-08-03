// lib/music/staffLayout.js — pure geometry for placing a pitch on a 5-line
// staff: which line/space it sits on, and how many ledger lines it needs.
// No SVG or rendering concerns here, so the math can be checked with plain
// assertions independent of anything visual (see the module-level sanity
// check this was developed against: middle C gets exactly 1 ledger line,
// the treble clef's own top/bottom lines get 0, etc).
const LETTER_STEP = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const LETTER_ORDER_BY_STEP = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Bottom line of each clef, as the {letter, octave} it represents -- every
// other position is measured in diatonic steps relative to this.
const CLEF_BOTTOM_LINE = {
  treble: { letter: 'E', octave: 4 },
};

function diatonicIndex(letter, octave) {
  return octave * 7 + LETTER_STEP[letter];
}

// Returns how many diatonic steps this pitch sits above the clef's bottom
// line (negative = below the staff). Each step is half a line-spacing --
// consecutive staff LINES are 2 steps apart (E-G-B-D-F each skip a letter),
// and the SPACE between them is the letter in between, 1 step off each line.
export function stepsFromBottomLine(letter, octave, clef = 'treble') {
  const bottom = CLEF_BOTTOM_LINE[clef];
  return diatonicIndex(letter, octave) - diatonicIndex(bottom.letter, bottom.octave);
}

// A standard 5-line staff spans 8 steps (bottom line to top line, 4 gaps of
// 2 steps each). Ledger lines are only needed outside that span, and only
// at "line" positions -- a note in the space just past the staff (1 step
// out) needs none; a note on the next line out (2 steps) needs one; a note
// in the space beyond THAT (3 steps) still only needs the one ledger line
// it hangs from. In general, steps-beyond-the-staff `k` needs floor(k/2)
// ledger lines, counted inward from the outermost one required.
export function ledgerLinesFor(steps) {
  if (steps >= 0 && steps <= 8) return [];
  if (steps < 0) {
    const k = -steps;
    const count = Math.floor(k / 2);
    return Array.from({ length: count }, (_, i) => -2 * (i + 1));
  }
  const k = steps - 8;
  const count = Math.floor(k / 2);
  return Array.from({ length: count }, (_, i) => 8 + 2 * (i + 1));
}

// Inverse of stepsFromBottomLine: snap a raw step count to the nearest
// natural note's {letter, octave} -- used by the "name -> note" staff drill
// to turn a click position back into a note. Diatonic steps map 1:1 onto
// natural letters, so this is just diatonicIndex's inverse.
export function noteFromSteps(steps, clef = 'treble') {
  const bottom = CLEF_BOTTOM_LINE[clef];
  const index = diatonicIndex(bottom.letter, bottom.octave) + Math.round(steps);
  const octave = Math.floor(index / 7);
  const letter = LETTER_ORDER_BY_STEP[((index % 7) + 7) % 7];
  return { letter, octave };
}

// Every natural note whose staff position falls within [minSteps, maxSteps]
// -- the pool the Staff Notes drill draws from, bounded so a session never
// serves up a note buried under half a dozen ledger lines.
export function naturalNotesInStepRange(minSteps, maxSteps, clef = 'treble') {
  const notes = [];
  for (let octave = 2; octave <= 7; octave++) {
    LETTER_ORDER_BY_STEP.forEach((letter) => {
      const steps = stepsFromBottomLine(letter, octave, clef);
      if (steps >= minSteps && steps <= maxSteps) notes.push({ letter, octave });
    });
  }
  return notes;
}
