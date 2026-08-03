// lib/music/pitch.js — pitch representation and conventional note spelling.
// A pitch used for staff rendering is {letter, accidental, octave}: letter
// is one of A-G, accidental is -1/0/1 (flat/natural/sharp), octave follows
// scientific pitch notation (middle C = C4). A pitch used for audio playback
// is a bare MIDI number (middle C = 60).
export const LETTER_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Semitones above C for each natural letter -- this is what lets a single
// "spell this pitch" routine (below) place both an interval's upper note
// and a chord's third/fifth without duplicating the reasoning per caller.
const LETTER_SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function midiFromSpelled({ letter, accidental = 0, octave }) {
  return (octave + 1) * 12 + LETTER_SEMITONE[letter] + accidental;
}

export function frequencyFromMidi(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function accidentalSymbol(accidental) {
  if (accidental > 0) return '♯';
  if (accidental < 0) return '♭';
  return '';
}

// The core spelling routine: given a root pitch, how many *letter names* up
// the target is (letterShift -- e.g. a third is 2 letters up, C to E), and
// how many semitones up it should actually be, work out which letter this
// lands on and what accidental makes the semitone math come out right.
// This single routine is what gives both intervals.js (an interval's size
// determines letterShift) and chords.js (a third is always letterShift 2,
// a fifth always letterShift 4) their conventional, non-enharmonic-confused
// spelling, instead of hand-picking sharps/flats per case.
export function spellNote(rootLetter, rootOctave, letterShift, semitoneInterval) {
  const rootIdx = LETTER_ORDER.indexOf(rootLetter);
  const rawIdx = rootIdx + letterShift;
  const targetIdx = ((rawIdx % 7) + 7) % 7;
  const octaveShift = Math.floor(rawIdx / 7);
  const targetLetter = LETTER_ORDER[targetIdx];
  const naturalDistance = (LETTER_SEMITONE[targetLetter] + 12 * octaveShift) - LETTER_SEMITONE[rootLetter];
  const accidental = semitoneInterval - naturalDistance;
  return { letter: targetLetter, accidental, octave: rootOctave + octaveShift };
}

export function randomNaturalRoot(minOctave, maxOctave) {
  const letter = LETTER_ORDER[Math.floor(Math.random() * LETTER_ORDER.length)];
  const octave = minOctave + Math.floor(Math.random() * (maxOctave - minOctave + 1));
  return { letter, octave };
}

export function randomMidi(minMidi, maxMidi) {
  return minMidi + Math.floor(Math.random() * (maxMidi - minMidi + 1));
}

export function spelledLabel({ letter, accidental }) {
  return letter + accidentalSymbol(accidental);
}
