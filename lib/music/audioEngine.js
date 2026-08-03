// lib/music/audioEngine.js — synthesizes tones with the Web Audio API
// rather than shipping sample files or a soundfont library: every drill
// here only needs plain, in-tune single notes, which an oscillator does
// with zero asset weight. One shared AudioContext (browsers cap how many
// can exist, and reusing one keeps the very first note reliably inside the
// user gesture that unlocks autoplay).
let ctx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function frequencyFromMidi(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Quick attack/decay/release envelope so notes don't click at the start or
// stop abruptly at the end -- a bare oscillator gain jump is audibly harsh.
function scheduleNote(audioCtx, midi, startTime, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequencyFromMidi(midi);
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const attack = 0.02;
  const release = 0.12;
  const peak = 0.25;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peak, startTime + attack);
  gain.gain.setValueAtTime(peak, startTime + Math.max(attack, duration - release));
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playNote(midi, { duration = 0.9 } = {}) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  scheduleNote(audioCtx, midi, audioCtx.currentTime, duration);
}

// Plays notes one after another (melodic) -- used for interval ear-training,
// so the two pitches are heard as a clear low-then-high sequence.
export function playSequence(midis, { noteDuration = 0.7, gap = 0.15 } = {}) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  let t = audioCtx.currentTime;
  midis.forEach((midi) => {
    scheduleNote(audioCtx, midi, t, noteDuration);
    t += noteDuration + gap;
  });
}

// Plays notes together (harmonic) -- used for chord ear-training.
export function playChord(midis, { duration = 1.4 } = {}) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  midis.forEach((midi) => scheduleNote(audioCtx, midi, t, duration));
}
