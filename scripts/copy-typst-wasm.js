// scripts/copy-typst-wasm.js — copies the Typst compiler/renderer WASM
// binaries from node_modules into public/typst-wasm/ so Next serves them
// as plain static files off Vercel's CDN, not through a Serverless
// Function response. Function responses are capped at 4.5MB there; these
// are ~28MB (compiler) and ~1MB (renderer), so the compiler load was
// silently truncated mid-stream, which is what
// "WebAssembly compilation aborted: Network error: Response body loading
// was aborted" actually was.
//
// Runs as a build/dev step rather than committing the binaries into the
// repo (would balloon it by ~29MB with no way to shrink back down) --
// node_modules already has them after `npm install`, this just copies
// them somewhere Next's static file serving can reach.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'public', 'typst-wasm');

const FILES = [
  {
    src: path.join(process.cwd(), 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'),
    dest: path.join(OUT_DIR, 'compiler.wasm'),
  },
  {
    src: path.join(process.cwd(), 'node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm'),
    dest: path.join(OUT_DIR, 'renderer.wasm'),
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
FILES.forEach(({ src, dest }) => {
  fs.copyFileSync(src, dest);
  console.log(`copied ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`);
});
