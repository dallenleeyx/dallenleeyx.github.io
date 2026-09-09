'use client';
// components/math/LatexEditor.jsx — a plain textarea for writing statements/
// proofs, with a live side-by-side render of whatever LaTeX it contains.
// Reused for both the "statement" and "proof" fields in ItemEditor.
import { LatexText } from './LatexText';

export function LatexEditor({ value, onChange, placeholder, minRows = 3 }) {
  return (
    <div className="math-editor">
      <textarea
        className="math-editor-input"
        rows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="math-editor-preview">
        {value.trim() ? <LatexText text={value} /> : <span className="math-editor-preview-empty">preview</span>}
      </div>
    </div>
  );
}
