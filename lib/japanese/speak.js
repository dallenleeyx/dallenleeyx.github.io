// lib/japanese/speak.js — pronunciation audio via Google Cloud
// Text-to-Speech (Neural2 voices, see app/api/japanese/tts/route.js),
// replacing the old browser Web Speech API version: browser TTS quality
// for Japanese depends entirely on whatever voice pack the OS happens to
// ship, generally the weakest tier available, where Neural2 is Google's
// most natural. Shared by Flashcards and Writing's reveal. Same exported
// signature as the old version, so neither call site needed to change.
let currentAudio = null;
// text -> object URL, so replaying the same card (very common -- the same
// word comes back around in the queue) doesn't re-hit the API every time.
const cache = new Map();

export function speakJapanese(text, silentMode) {
  if (silentMode || !text || typeof window === 'undefined') return;
  if (currentAudio) {
    currentAudio.pause(); // don't stack up overlapping playback
    currentAudio = null;
  }
  const play = (url) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.play().catch(() => {}); // e.g. autoplay blocked before any user gesture -- silently skip
  };
  const cached = cache.get(text);
  if (cached) { play(cached); return; }
  fetch(`/api/japanese/tts?text=${encodeURIComponent(text)}`)
    .then((res) => (res.ok ? res.blob() : Promise.reject()))
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      cache.set(text, url);
      play(url);
    })
    .catch(() => {
      // TTS unavailable (network issue, missing/invalid key, etc.) -- silently skip
    });
}
