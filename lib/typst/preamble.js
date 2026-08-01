// lib/typst/preamble.js — the fixed document setup every course's notes
// compile inside, wrapping the user's body content so they only ever write
// the body (headings, prose, math, theorem/definition/proof calls) and
// never have to touch page setup or font selection. Mirrors the same
// visual convention as the old markdown-shorthand renderer: a bold running
// number shared across all theorem-like/definition-like environments,
// italic body for the "plain" amsthm style (theorem/proposition/lemma/
// corollary), upright body for the "definition" style (definition/
// example/remark), and an unnumbered italic "Proof." ending in a QED mark.
// Real, fixed A4 page size (not height: auto) so notes paginate like an
// actual document/PDF instead of one continuous strip -- both the SVG
// preview and the PDF export are one compile, so this is the single place
// that decides page breaks for both. lib/typst/pagedSvg.js reconstructs
// the page boundaries in the preview by dividing the compiled SVG's total
// height by PAGE_HEIGHT_MM/PAGE_WIDTH_MM (see PAGE_WIDTH_MM/PAGE_HEIGHT_MM
// exported below) -- keep those two constants and this page(...) call in
// sync if either ever changes.
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;

const PREAMBLE = `
#set page(width: ${PAGE_WIDTH_MM}mm, height: ${PAGE_HEIGHT_MM}mm, margin: 2.2cm, numbering: "1")
#set text(size: 11pt)
#set par(justify: false, leading: 0.75em)
#set heading(numbering: none)

#let thm-counter = counter("theorem")

#let theorem-block(kind: "Theorem", name: none, italic: true, body) = block(below: 1em)[
  #thm-counter.step()
  #context {
    let n = thm-counter.display()
    if name != none {
      [*#kind #n* (#emph(name)). ]
    } else {
      [*#kind #n*. ]
    }
  }
  #if italic { emph(body) } else { body }
]

#let theorem(name: none, body) = theorem-block(kind: "Theorem", name: name, italic: true, body)
#let proposition(name: none, body) = theorem-block(kind: "Proposition", name: name, italic: true, body)
#let lemma(name: none, body) = theorem-block(kind: "Lemma", name: name, italic: true, body)
#let corollary(name: none, body) = theorem-block(kind: "Corollary", name: name, italic: true, body)
#let definition(name: none, body) = theorem-block(kind: "Definition", name: name, italic: false, body)
#let example(name: none, body) = theorem-block(kind: "Example", name: name, italic: false, body)
#let remark(name: none, body) = theorem-block(kind: "Remark", name: name, italic: false, body)

#let proof(body) = block(below: 1em, width: 100%)[
  _Proof._ #body #h(1fr) $qed$
]

// Used by both hand-written notes (the editor's "Flag" toolbar button) and
// the one-time migration of old notes (lib/typst/migrate.js), so a flagged
// passage looks identical either way. Deliberately no emoji/pictographic
// glyph here -- that would depend on a color-emoji font being resolved for
// what's otherwise plain, always-available text, for a purely decorative
// flourish.
#let flag(body) = text(fill: rgb("#dc2626"), style: "italic")[[FLAG] #body]

// Old notes could contain LaTeX-style math ($...$/$$...$$), which has no
// reliable 1:1 Typst equivalent -- migrate.js carries it over as literal,
// unrendered text here instead of guessing at a translation that could
// silently produce wrong mathematics.
#let math-todo(src) = text(fill: rgb("#b45309"), style: "italic")[[TODO MATH] #raw(src)]

`;

export function wrapWithPreamble(body) {
  return PREAMBLE + (body || '');
}
