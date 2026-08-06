// lib/dashboard/speak.js — speak-on-demand audio for the assistant's
// replies (English, via app/api/dashboard/tts). Structurally close to
// lib/japanese/speak.js (object-URL cache, stop-before-play), plus a
// `token`-based tracking so AssistantPanel can show which specific
// message is currently speaking and let a second click stop it.
let currentAudio = null;
let currentToken = null;
const cache = new Map();

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentToken = null;
}

export function isSpeaking(token) {
  return currentToken === token;
}

export function speakText(text, token, { onEnd } = {}) {
  if (!text || typeof window === 'undefined') return;
  stopSpeaking();
  currentToken = token;
  const finish = () => {
    if (currentToken === token) currentToken = null;
    onEnd && onEnd();
  };
  const play = (url) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = finish;
    audio.play().catch(finish); // e.g. autoplay blocked -- silently skip
  };
  const cached = cache.get(text);
  if (cached) { play(cached); return; }
  fetch(`/api/dashboard/tts?text=${encodeURIComponent(text)}`)
    .then((res) => (res.ok ? res.blob() : Promise.reject()))
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      cache.set(text, url);
      play(url);
    })
    .catch(finish);
}
