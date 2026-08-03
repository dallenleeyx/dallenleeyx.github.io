// lib/music/intervals.js — the 13 interval qualities within an octave,
// keyed by semitone distance, plus generators for the Staff and Ear drills.
// Staff intervals need a conventionally-spelled upper note (no B#/Cb
// surprises), which is why the size (in letter-steps) is tracked alongside
// the semitone count -- see pitch.js's spellNote for how the two combine.
import { spellNote, randomNaturalRoot, randomMidi } from './pitch';

export const INTERVALS = [
  { semitones: 0, letterShift: 0, short: 'P1', label: 'Unison' },
  { semitones: 1, letterShift: 1, short: 'm2', label: 'Minor 2nd' },
  { semitones: 2, letterShift: 1, short: 'M2', label: 'Major 2nd' },
  { semitones: 3, letterShift: 2, short: 'm3', label: 'Minor 3rd' },
  { semitones: 4, letterShift: 2, short: 'M3', label: 'Major 3rd' },
  { semitones: 5, letterShift: 3, short: 'P4', label: 'Perfect 4th' },
  { semitones: 6, letterShift: 3, short: 'TT', label: 'Tritone' },
  { semitones: 7, letterShift: 4, short: 'P5', label: 'Perfect 5th' },
  { semitones: 8, letterShift: 5, short: 'm6', label: 'Minor 6th' },
  { semitones: 9, letterShift: 5, short: 'M6', label: 'Major 6th' },
  { semitones: 10, letterShift: 6, short: 'm7', label: 'Minor 7th' },
  { semitones: 11, letterShift: 6, short: 'M7', label: 'Major 7th' },
  { semitones: 12, letterShift: 7, short: 'P8', label: 'Octave' },
];

const MAX_SPELLING_ATTEMPTS = 30;

// Natural-note-only, so it always lands on a renderable staff position.
// Rerolls (root, interval) combinations that would need a double sharp/flat
// to spell correctly -- rare, and simpler to avoid than to render. Root is
// pinned to one octave by default: an octave-wide interval from the lowest
// vs. highest possible root would need up to 5 ledger lines on one side,
// which reads as clutter rather than a fair reading exercise.
export function randomIntervalForStaff(minOctave = 4, maxOctave = 4) {
  for (let attempt = 0; attempt < MAX_SPELLING_ATTEMPTS; attempt++) {
    const root = randomNaturalRoot(minOctave, maxOctave);
    const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
    const upper = spellNote(root.letter, root.octave, interval.letterShift, interval.semitones);
    if (Math.abs(upper.accidental) <= 1) {
      return { low: { letter: root.letter, accidental: 0, octave: root.octave }, high: upper, interval };
    }
  }
  // Falls back to a known-safe combination (C4 + a perfect 5th) rather than
  // looping forever -- practically unreachable given how few natural roots
  // need a double accidental for any interval.
  const interval = INTERVALS[7];
  return { low: { letter: 'C', accidental: 0, octave: 4 }, high: spellNote('C', 4, interval.letterShift, interval.semitones), interval };
}

// Full chromatic range for ear training -- no spelling constraint since
// nothing needs to be drawn, so every interval quality is equally likely.
export function randomIntervalForEar(minMidi = 55, maxMidi = 72) {
  const lowMidi = randomMidi(minMidi, maxMidi);
  const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
  return { lowMidi, highMidi: lowMidi + interval.semitones, interval };
}
