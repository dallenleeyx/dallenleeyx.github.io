'use client';
// components/japanese/vocab/Reading.jsx — a short passage per lesson for
// seeing words in context (initial learning), plus a cloze practice mode
// on that same passage (retrieval practice) -- distinct from Flashcards/
// Writing/Furigana, which are all revision drills for words you've
// already met once.
import { Fragment, useMemo, useState } from 'react';
import { VOCAB_LESSONS } from '../../../lib/japanese/data/vocab';
import { PASSAGES } from '../../../lib/japanese/data/passages';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { shuffle } from '../../../lib/japanese/masteryQueue';
import { LessonChips, lessonNumbersFor } from './LessonChips';

// Splits "...{kanji|reading}..." into a flat token list: plain-text chunks
// interleaved with { kanji, reading } word tokens. Every word token is, by
// this file's own authoring convention (see passages.js), one of the
// lesson's target vocab words -- no cross-referencing VOCAB_DATA needed.
const TOKEN_RE = /\{([^|}]+)\|([^}]+)\}/g;
function tokenize(text) {
  const out = [];
  let last = 0, m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ kanji: m[1], reading: m[2] });
    last = TOKEN_RE.lastIndex;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

function ReadingParagraphs({ tokens, showFurigana }) {
  // Blank lines in the source (between paragraphs) split into separate <p>s.
  const paragraphs = [[]];
  tokens.forEach((t) => {
    if (t.text?.includes('\n\n')) {
      const parts = t.text.split('\n\n');
      parts.forEach((part, i) => {
        if (i > 0) paragraphs.push([]);
        if (part) paragraphs[paragraphs.length - 1].push({ text: part });
      });
    } else {
      paragraphs[paragraphs.length - 1].push(t);
    }
  });
  return paragraphs.map((toks, pi) => (
    <p key={pi} className="passage-jp">
      {toks.map((t, i) => t.text !== undefined
        ? <Fragment key={i}>{t.text}</Fragment>
        : t.kanji === t.reading
          ? <Fragment key={i}>{t.kanji}</Fragment>
          : <ruby key={i}>{t.kanji}{showFurigana && <rt>{t.reading}</rt>}</ruby>)}
    </p>
  ));
}

function buildCloze(tokens) {
  const seen = new Set();
  const blanks = [];
  const displayTokens = tokens.map((t, i) => {
    if (t.text !== undefined) return t;
    if (seen.has(t.kanji)) return t;
    seen.add(t.kanji);
    blanks.push({ tokenIndex: i, kanji: t.kanji });
    return { ...t, blankIndex: blanks.length - 1 };
  });
  return { displayTokens, blanks };
}

function ClozePassage({ displayTokens, blanks, answers, activeBlank, checked, onBlankClick }) {
  const paragraphs = [[]];
  displayTokens.forEach((t) => {
    if (t.text?.includes('\n\n')) {
      t.text.split('\n\n').forEach((part, i) => {
        if (i > 0) paragraphs.push([]);
        if (part) paragraphs[paragraphs.length - 1].push({ text: part });
      });
    } else {
      paragraphs[paragraphs.length - 1].push(t);
    }
  });
  return paragraphs.map((toks, pi) => (
    <p key={pi} className="passage-jp">
      {toks.map((t, i) => {
        if (t.text !== undefined) return <Fragment key={i}>{t.text}</Fragment>;
        if (t.blankIndex === undefined) return <Fragment key={i}>{t.kanji}</Fragment>;
        const filled = answers[t.blankIndex];
        const isActive = activeBlank === t.blankIndex;
        const correct = checked ? filled === blanks[t.blankIndex].kanji : null;
        const cls = ['cloze-blank', isActive && 'active', checked && (correct ? 'correct' : 'incorrect')].filter(Boolean).join(' ');
        return (
          <button key={i} type="button" className={cls} onClick={() => onBlankClick(t.blankIndex)} disabled={checked}>
            {filled || '    '}
            {checked && !correct && <span className="cloze-reveal">{blanks[t.blankIndex].kanji}</span>}
          </button>
        );
      })}
    </p>
  ));
}

export function Reading() {
  const { t } = useJapaneseI18n();
  const [level, setLevel] = useState('N4');
  const [lesson, setLesson] = useState(() => lessonNumbersFor('N4')[0] ?? null);
  const [mode, setMode] = useState('read'); // 'read' | 'practice'
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [activeBlank, setActiveBlank] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const lessonNums = lessonNumbersFor(level);
  const lessonTitles = VOCAB_LESSONS[level] || {};
  const passage = PASSAGES[level]?.[lesson];
  const tokens = useMemo(() => (passage ? tokenize(passage.jp) : []), [passage]);
  const { displayTokens, blanks } = useMemo(() => buildCloze(tokens), [tokens]);
  const wordBank = useMemo(() => shuffle(blanks.map((b) => b.kanji)), [blanks, attempt]);

  const selectLevel = (lv) => {
    setLevel(lv);
    setLesson(lessonNumbersFor(lv)[0] ?? null);
    resetPractice();
  };
  const selectLesson = (n) => {
    setLesson(n);
    resetPractice();
  };
  const resetPractice = () => {
    setMode('read');
    setAnswers({});
    setActiveBlank(null);
    setChecked(false);
    setAttempt((a) => a + 1);
  };

  const handleBlankClick = (blankIndex) => {
    if (checked) return;
    if (answers[blankIndex] !== undefined) {
      setAnswers((prev) => { const next = { ...prev }; delete next[blankIndex]; return next; });
      return;
    }
    setActiveBlank(blankIndex);
  };
  const handleWordBankClick = (word) => {
    if (checked || activeBlank === null) return;
    setAnswers((prev) => ({ ...prev, [activeBlank]: word }));
    setActiveBlank(null);
  };
  const usedWords = new Set(Object.values(answers));
  const allFilled = blanks.length > 0 && Object.keys(answers).length === blanks.length;
  const correctCount = checked ? blanks.filter((b, i) => answers[i] === b.kanji).length : 0;

  return (
    <div className="reading-view">
      <LevelChipsInline level={level} onSelect={selectLevel} />
      <LessonChips level={level} selected={lesson} multiSelect={false} onToggle={(n) => selectLesson(n ?? lessonNums[0] ?? null)} />

      {!passage ? (
        <p className="reading-empty">{t('readNoPassage')}</p>
      ) : (
        <div className="reading-card">
          <div className="reading-head">
            <h4 className="reading-lesson-title">{lesson}課 {lessonTitles[lesson] || ''}</h4>
            <div className="reading-mode-toggle">
              <button className={`chip${mode === 'read' ? ' active' : ''}`} onClick={() => setMode('read')}>{t('readModeRead')}</button>
              <button className={`chip${mode === 'practice' ? ' active' : ''}`} onClick={() => { setMode('practice'); setAnswers({}); setActiveBlank(null); setChecked(false); }}>{t('readModePractice')}</button>
            </div>
          </div>

          {mode === 'read' ? (
            <>
              <div className="reading-toolbar">
                <button className={`ghost-btn reading-toggle${showFurigana ? ' active' : ''}`} onClick={() => setShowFurigana((s) => !s)}>
                  {showFurigana ? t('readHideFurigana') : t('readShowFurigana')}
                </button>
                <button className={`ghost-btn reading-toggle${showTranslation ? ' active' : ''}`} onClick={() => setShowTranslation((s) => !s)}>
                  {showTranslation ? t('readHideTranslation') : t('readShowTranslation')}
                </button>
              </div>
              <ReadingParagraphs tokens={tokens} showFurigana={showFurigana} />
              {showTranslation && (
                <div className="reading-translation">
                  {passage.en.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="reading-hint">{t('readWordBankHint')}</p>
              <ClozePassage
                displayTokens={displayTokens}
                blanks={blanks}
                answers={answers}
                activeBlank={activeBlank}
                checked={checked}
                onBlankClick={handleBlankClick}
              />
              <div className="cloze-wordbank">
                {wordBank.map((w, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`chip cloze-word${usedWords.has(w) ? ' used' : ''}`}
                    disabled={checked || usedWords.has(w)}
                    onClick={() => handleWordBankClick(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="reading-toolbar">
                {!checked ? (
                  <button className="ghost-btn btn-primary" disabled={!allFilled} onClick={() => setChecked(true)}>
                    {t('readCheck')}
                  </button>
                ) : (
                  <>
                    <span className="cloze-score">
                      {correctCount === blanks.length ? t('readAllCorrect') : `${correctCount} / ${blanks.length}`}
                    </span>
                    <button className="ghost-btn" onClick={() => { setAnswers({}); setChecked(false); setAttempt((a) => a + 1); }}>
                      {t('readTryAgain')}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// A small level-only chip row (N4/N3) -- LessonChips itself only handles
// the per-level lesson row, so this mirrors its look for the level switch
// above it.
function LevelChipsInline({ level, onSelect }) {
  return (
    <div className="lesson-chips">
      {['N4', 'N3'].map((lv) => (
        <button key={lv} className={`chip ${lv.toLowerCase()}${level === lv ? ' active' : ''}`} onClick={() => onSelect(lv)}>
          {lv}
        </button>
      ))}
    </div>
  );
}
