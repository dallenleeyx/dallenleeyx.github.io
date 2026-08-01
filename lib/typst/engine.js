'use client';
// lib/typst/engine.js — a thin wrapper around @myriaddreamin/typst.ts,
// compiling real Typst source (a modern LaTeX-alternative typesetting
// language) to SVG for a live preview or PDF for a real, vector-quality
// export -- unlike the old raster (html2canvas) PDF export, this is an
// actual document compiler, so text stays crisp at any zoom and the file
// is small.
//
// The compiler/renderer WASM modules (~28MB / ~1MB) are dynamically
// imported so they only load the first time someone actually opens the
// Typst editor. Served same-origin straight out of node_modules (see
// app/api/typst-wasm/[file]/route.js) rather than committed into this
// repo (would balloon it by ~29MB with no way to shrink back down) or
// pulled from a third-party CDN (one more thing that has to stay up).
const COMPILER_WASM = '/api/typst-wasm/compiler.wasm';
const RENDERER_WASM = '/api/typst-wasm/renderer.wasm';

let readyPromise = null;

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const { $typst } = await import('@myriaddreamin/typst.ts');
      $typst.setCompilerInitOptions({ getModule: () => COMPILER_WASM });
      $typst.setRendererInitOptions({ getModule: () => RENDERER_WASM });
      // Default font assets (New Computer Modern -- the actual modern
      // revival of LaTeX's original Computer Modern font -- plus
      // Libertinus Serif) are fetched from jsDelivr's GitHub mirror on
      // first use; left as the library default rather than overridden.
      return $typst;
    })();
  }
  return readyPromise;
}

export async function compileSvg(mainContent) {
  const $typst = await ensureReady();
  return $typst.svg({ mainContent });
}

export async function compilePdf(mainContent) {
  const $typst = await ensureReady();
  const bytes = await $typst.pdf({ mainContent });
  if (!bytes) throw new Error('Typst compile produced no PDF output');
  return bytes;
}
