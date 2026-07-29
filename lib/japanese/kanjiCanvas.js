// lib/japanese/kanjiCanvas.js — pure arithmetic for the kanji-writing
// canvas, isolated from the imperative CanvasRenderingContext2D calls so the
// DPR-sizing logic can be reasoned about (and tested) without a browser.
export function computeCanvasBackingSize(rect, dpr) {
  return { width: rect.width * dpr, height: rect.height * dpr };
}

export function pointerToCanvasCoords(rect, clientX, clientY) {
  return { x: clientX - rect.left, y: clientY - rect.top };
}
