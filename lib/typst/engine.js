'use client';
// lib/typst/engine.js — a thin wrapper around a dedicated Web Worker
// (compileWorker.js) that runs @myriaddreamin/typst.ts, compiling real
// Typst source (a modern LaTeX-alternative typesetting language) to SVG for
// a live preview or PDF for a real, vector-quality export -- unlike the old
// raster (html2canvas) PDF export, this is an actual document compiler, so
// text stays crisp at any zoom and the file is small.
//
// The actual $typst.svg()/.pdf() calls used to run right here on the main
// thread. They're synchronous WASM calls under the hood -- once invoked,
// they block until done, no matter that the JS wrapper is async -- so on
// a several-page document, every auto-compile froze typing itself for
// however long typesetting took. Delegating the call to a worker (see
// compileWorker.js) means compiling, however long it takes, can never
// block the main thread's input handling.
//
// The compiler/renderer WASM modules (~28MB / ~1MB) the worker loads are
// served same-origin as plain static files under public/ (copied from
// node_modules at build/dev time by scripts/copy-typst-wasm.js) rather
// than committed into this repo (would balloon it by ~29MB with no way to
// shrink back down), pulled from a third-party CDN (one more thing that
// has to stay up), or -- as this used to do -- streamed through a Route
// Handler: Vercel's Serverless Function responses are capped at 4.5MB,
// which silently truncated the 28MB compiler and surfaced client-side as
// "WebAssembly compilation aborted: Network error: Response body loading
// was aborted". Static files under public/ are served off Vercel's CDN
// instead, with no such limit.
//
// Default font assets (New Computer Modern -- the actual modern revival of
// LaTeX's original Computer Modern font -- plus Libertinus Serif) are
// fetched from jsDelivr's GitHub mirror on first use inside the worker;
// left as the library default rather than overridden.

let worker = null;
let reqId = 0;
const pending = new Map();

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./compileWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const { id, result, error } = e.data;
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (error) p.reject(new Error(error));
      else p.resolve(result);
    };
    worker.onerror = (e) => {
      for (const p of pending.values()) p.reject(new Error(e.message || 'Typst worker error'));
      pending.clear();
    };
  }
  return worker;
}

function callWorker(kind, mainContent) {
  return new Promise((resolve, reject) => {
    const id = ++reqId;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, kind, mainContent });
  });
}

export function compileSvg(mainContent) {
  return callWorker('svg', mainContent);
}

export function compilePdf(mainContent) {
  return callWorker('pdf', mainContent);
}
