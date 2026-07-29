// lib/japanese/speak.js — pronunciation audio via the browser's built-in
// Web Speech API (no key, no backend). Shared by Flashcards, Writing, and
// Furigana's reveal.
export function speakJapanese(text, silentMode) {
  if (silentMode || !text || typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel(); // don't stack up overlapping utterances
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    window.speechSynthesis.speak(utter);
  } catch (e) {
    // speech synthesis unavailable on this browser -- silently skip
  }
}
