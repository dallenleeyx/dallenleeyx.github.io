'use client';
// lib/music/useDrill.js — the question/answer/score lifecycle shared by
// every drill (Intervals and Chords, both Staff and Ear): generate a
// question, record one answer against it, track a running session score,
// advance to a fresh question. What counts as "the answer" and how it's
// rendered is entirely up to each drill -- this just owns the bookkeeping
// so it isn't re-implemented four times.
// `question` starts null and is only filled in by the effect below, which
// runs post-mount (client-only). Generating it straight from useState's
// initializer would call generate()'s Math.random() once during the
// server render and again during the client's hydration pass -- two
// different results for the same node, which React flags as a hydration
// mismatch (and, worse, would make the *server's* random question the one
// briefly visible before React patches it). Callers render a placeholder
// while question is null (one extra frame, invisible in practice).
import { useCallback, useEffect, useState } from 'react';

export function useDrill(generate) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setQuestion(generate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = useCallback((value, isCorrect) => {
    if (selected !== null) return; // callers also disable their buttons post-answer; this is the backstop
    setSelected(value);
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  }, [selected]);

  const next = useCallback(() => {
    setQuestion(generate());
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { question, selected, score, submit, next };
}
