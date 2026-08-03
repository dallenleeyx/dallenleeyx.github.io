// lib/music/chords.js — the 4 triad qualities and generators for the Staff
// and Ear drills. A triad's third is always 2 letters above the root and
// its fifth always 4 letters above (C-E-G, D-F-A, ...; that's what makes a
// stack of thirds "a chord" rather than some other 3-note shape), so
// spelling only needs pitch.js's spellNote fed the right letterShift --
// the accidentals fall out of the quality's semitone intervals.
import { spellNote, randomNaturalRoot, randomMidi, midiFromSpelled } from './pitch';

export const CHORD_QUALITIES = [
  { id: 'major', label: 'Major', intervals: [0, 4, 7] },
  { id: 'minor', label: 'Minor', intervals: [0, 3, 7] },
  { id: 'diminished', label: 'Diminished', intervals: [0, 3, 6] },
  { id: 'augmented', label: 'Augmented', intervals: [0, 4, 8] },
];

const THIRD_LETTER_SHIFT = 2;
const FIFTH_LETTER_SHIFT = 4;
const MAX_SPELLING_ATTEMPTS = 30;

function trySpellChord(root, quality) {
  const third = spellNote(root.letter, root.octave, THIRD_LETTER_SHIFT, quality.intervals[1]);
  const fifth = spellNote(root.letter, root.octave, FIFTH_LETTER_SHIFT, quality.intervals[2]);
  if (Math.abs(third.accidental) <= 1 && Math.abs(fifth.accidental) <= 1) {
    return { root: { letter: root.letter, accidental: 0, octave: root.octave }, third, fifth, quality };
  }
  return null;
}

// Root pinned to one octave for the same reason as intervals.js's staff
// generator: a wider range pushes some fifths several ledger lines up,
// which reads as clutter rather than a fair reading exercise.
export function randomChordForStaff(minOctave = 4, maxOctave = 4) {
  for (let attempt = 0; attempt < MAX_SPELLING_ATTEMPTS; attempt++) {
    const root = randomNaturalRoot(minOctave, maxOctave);
    const quality = CHORD_QUALITIES[Math.floor(Math.random() * CHORD_QUALITIES.length)];
    const spelled = trySpellChord(root, quality);
    if (spelled) return spelled;
  }
  // Known-safe fallback (C major) rather than looping forever.
  const quality = CHORD_QUALITIES[0];
  return trySpellChord({ letter: 'C', octave: 4 }, quality);
}

export function chordToMidi({ root, third, fifth }) {
  return [midiFromSpelled(root), midiFromSpelled(third), midiFromSpelled(fifth)];
}

export function randomChordForEar(minMidi = 48, maxMidi = 64) {
  const rootMidi = randomMidi(minMidi, maxMidi);
  const quality = CHORD_QUALITIES[Math.floor(Math.random() * CHORD_QUALITIES.length)];
  return { midis: quality.intervals.map((i) => rootMidi + i), quality };
}
