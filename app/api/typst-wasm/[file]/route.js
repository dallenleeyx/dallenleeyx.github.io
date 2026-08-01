// app/api/typst-wasm/[file]/route.js — serves the Typst compiler/renderer
// WASM binaries straight out of node_modules (present at deploy time as an
// npm dependency) instead of pointing at a third-party CDN. Avoids both
// committing ~29MB of binary into this repo and depending on an external
// host's uptime for a core feature.
import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

// Two literal, statically-written readFile calls (rather than one call fed
// a path built from a lookup table) so Next's file tracer can see exactly
// which two files this route needs at build time -- a dynamically-assembled
// path here would make the tracer unable to prove which files are reachable,
// and it falls back to bundling far more than these two ~29MB binaries.
async function readCompiler() {
  return readFile(path.join(process.cwd(), 'node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'));
}
async function readRenderer() {
  return readFile(path.join(process.cwd(), 'node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm'));
}

export async function GET(request, { params }) {
  const { file } = await params;
  let bytes;
  if (file === 'compiler.wasm') bytes = await readCompiler();
  else if (file === 'renderer.wasm') bytes = await readRenderer();
  else return NextResponse.json({ error: 'not found' }, { status: 404 });

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'application/wasm',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
