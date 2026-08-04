// lib/typst/compileWorker.js — runs the actual Typst WASM compile inside a
// dedicated Web Worker instead of the main thread.
//
// $typst.svg()/.pdf() are synchronous WASM calls under the hood: once
// invoked, they run to completion before yielding back to the event loop,
// no matter that the JS wrapper around them is async. Calling them directly
// on the main thread (as this used to) means every auto-compile freezes the
// *entire tab* -- including keystroke handling -- for however long
// typesetting takes, which scales with document size. That's a real,
// document-size-scaling source of lag independent of the two earlier fixes
// (the auto-compile toggle and the localStorage/state-update debouncing),
// since neither of those changes how long an individual compile call blocks
// once it does fire. Moving the call itself into a worker means however
// long it takes, it can never block typing.
const COMPILER_WASM = '/typst-wasm/compiler.wasm';
const RENDERER_WASM = '/typst-wasm/renderer.wasm';

let readyPromise = null;
async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const { $typst } = await import('@myriaddreamin/typst.ts');
      $typst.setCompilerInitOptions({ getModule: () => COMPILER_WASM });
      $typst.setRendererInitOptions({ getModule: () => RENDERER_WASM });
      return $typst;
    })();
  }
  return readyPromise;
}

// Same single-shared-instance, one-at-a-time-only invariant as before (see
// engine.js's history) -- now enforced inside the worker, which is where
// the shared $typst instance actually lives.
let queueTail = Promise.resolve();
function enqueue(task) {
  const run = queueTail.then(task, task);
  queueTail = run.then(() => {}, () => {});
  return run;
}

self.onmessage = async (e) => {
  const { id, kind, mainContent } = e.data;
  try {
    const result = await enqueue(async () => {
      const $typst = await ensureReady();
      if (kind === 'pdf') {
        const bytes = await $typst.pdf({ mainContent });
        if (!bytes) throw new Error('Typst compile produced no PDF output');
        return bytes;
      }
      return $typst.svg({ mainContent });
    });
    self.postMessage({ id, result });
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};
