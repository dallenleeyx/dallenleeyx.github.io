'use client';
// components/japanese/vocab/KanjiWriting.jsx — recall and draw a word's
// kanji from its reading/meaning on a touch-friendly canvas, then reveal to
// self-grade (no OCR -- honor system, same as Flashcards). A miss restarts
// the whole run (see lib/japanese/cleanRunQueue.js), but is still banked as
// weak first.
import { useEffect, useState } from 'react';
import { VOCAB_DATA } from '../../../lib/japanese/data/vocab';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { useVocabProgress } from '../../../lib/japanese/VocabProgressContext';
import { useCleanRunQueue } from '../../../hooks/japanese/useCleanRunQueue';
import { useKanjiCanvas } from '../../../hooks/japanese/useKanjiCanvas';
import { isLessonComplete } from '../../../lib/japanese/masteryQueue';
import { speakJapanese } from '../../../lib/japanese/speak';
import { LevelChips } from './LevelChips';
import { LessonChips } from './LessonChips';

function hasKanji(word) {
  return /[一-龯]/.test(word || '');
}
function buildKwDeck(level, lessons, isolateMode, isWeak) {
  const levels = level === 'all' ? Object.keys(VOCAB_DATA) : [level];
  let items = levels.flatMap((l) => (VOCAB_DATA[l] || []).map((item) => ({ ...item, level: l })));
  if (lessons.length) items = items.filter((item) => lessons.includes(item.lesson));
  items = items.filter((item) => hasKanji(item.word));
  if (isolateMode) items = items.filter((item) => isWeak(item));
  return items;
}

export function KanjiWriting({ active }) {
  const { t, silentMode } = useJapaneseI18n();
  const { writing, kwMastery } = useVocabProgress();
  const [level, setLevel] = useState('all');
  const [lessons, setLessons] = useState([]);
  const [isolateMode, setIsolateMode] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const queue = useCleanRunQueue();
  const canvas = useKanjiCanvas();

  const startSession = (lv, ls, iso) => {
    const items = buildKwDeck(lv, ls, iso, writing.isWeak);
    queue.start(items, shuffleOn);
    setRevealed(false);
    setJustReset(false);
  };

  useEffect(() => {
    startSession('all', [], false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)size the canvas whenever a fresh card is shown, and whenever this
  // subview becomes visible/resizes -- a canvas sized while display:none
  // reports a 0x0 rect.
  useEffect(() => {
    canvas.setup();
    canvas.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.current]);

  useEffect(() => {
    if (!active) return;
    canvas.setup();
    function onResize() { canvas.setup(); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleLevelChange = (l) => {
    setLevel(l);
    setLessons([]);
    startSession(l, [], isolateMode);
  };

  const toggleLesson = (n) => {
    const next = n === null ? [] : (lessons.includes(n) ? lessons.filter((x) => x !== n) : [...lessons, n].sort((a, b) => a - b));
    setLessons(next);
    startSession(level, next, isolateMode);
  };

  const toggleIsolate = () => {
    const next = !isolateMode;
    setIsolateMode(next);
    startSession(level, lessons, next);
  };

  const toggleShuffle = () => {
    const next = !shuffleOn;
    setShuffleOn(next);
    if (next) queue.reshuffleQueue();
  };

  const handleReveal = () => {
    if (!queue.current) return;
    setRevealed(true);
    speakJapanese(queue.current.reading || queue.current.word, silentMode);
  };

  const handleGrade = (isCorrect) => {
    if (!queue.current || !revealed) return;
    setJustReset(false);
    queue.grade(isCorrect);
    setRevealed(false);
  };

  // grade()'s result comes back through queue.lastResult rather than a
  // callback -- see useCleanRunQueue.js for why.
  useEffect(() => {
    const result = queue.lastResult;
    if (!result || !result.verdict) return;
    const { verdict, restart } = result;
    writing.recordResult(verdict.item, verdict.mastered);
    if (restart) {
      startSession(level, lessons, isolateMode);
      setJustReset(true);
      return;
    }
    if (!isolateMode && isLessonComplete(queue.sessionItems, verdict.item.level, verdict.item.lesson)) {
      kwMastery.markPassed(verdict.item.level, verdict.item.lesson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.lastResult]);

  const handleSkip = () => {
    if (!queue.current) return;
    queue.skip();
    setRevealed(false);
  };

  const handleResetProgress = () => {
    const msg = level === 'all' && lessons.length === 0
      ? 'This clears your kanji-writing progress for EVERY word. Continue?'
      : 'This clears your kanji-writing progress for the currently selected lessons. Continue?';
    if (!window.confirm(msg)) return;
    const targetItems = buildKwDeck(level, lessons, false, writing.isWeak);
    writing.resetProgressFor(targetItems);
    startSession(level, lessons, isolateMode);
  };

  const current = queue.current;
  const emptyText = queue.totalCount ? t('allMastered') : (isolateMode ? t('noWeakWords') : t('noCards'));

  return (
    <>
      <div className="controls">
        <LevelChips value={level} onChange={handleLevelChange} />
      </div>
      <LessonChips
        level={level}
        selected={lessons}
        multiSelect
        onToggle={toggleLesson}
        statusClass={(lv, n) => (kwMastery.isPassed(lv, n) ? ' chip-passed' : '')}
      />

      <div className="study-options">
        <button className={`chip isolate-chip${isolateMode ? ' active' : ''}`} onClick={toggleIsolate}>{t('isolateWeak')}</button>
        <button className="text-link" onClick={handleResetProgress}>{t('resetProgress')}</button>
      </div>
      {isolateMode && <p className="isolate-note">{t('kwIsolateNote')}</p>}

      <div className="kw-stage">
        <p className="kw-hint">{t('kwHint')}</p>
        <p className="kw-reading">{current ? current.reading : emptyText}</p>
        <p className="kw-meaning">{current ? current.meaning : ''}</p>

        <div className="kw-canvas-wrap">
          <canvas
            ref={canvas.canvasRef}
            className="kw-canvas"
            onPointerDown={canvas.onPointerDown}
            onPointerMove={canvas.onPointerMove}
            onPointerUp={canvas.onPointerUp}
            onPointerCancel={canvas.onPointerUp}
            onPointerLeave={canvas.onPointerUp}
          />
          <button className="kw-canvas-clear" aria-label={t('kwClear')} title="clear" onClick={canvas.clear}>↺</button>
        </div>

        {justReset && <p className="run-reset-note">{t('runReset')}</p>}

        {revealed && current && (
          <div className="kw-answer">
            <span className="kw-answer-word">{current.word}</span>
            <span className="kw-answer-reading">{current.reading}</span>
          </div>
        )}

        {!revealed && current && (
          <button className="ghost-btn btn-primary kw-reveal-btn" onClick={handleReveal}>{t('showAnswer')}</button>
        )}

        {revealed && (
          <div className="grade-buttons">
            <button className="grade-btn grade-wrong" onClick={() => handleGrade(false)}>{t('didntKnow')}</button>
            <button className="grade-btn grade-right" onClick={() => handleGrade(true)}>{t('knewIt')}</button>
          </div>
        )}
      </div>

      <div className="deck-controls">
        <div className="nav-group">
          <button className={`ghost-btn shuffle-toggle${shuffleOn ? ' active' : ''}`} onClick={toggleShuffle}>
            {t(shuffleOn ? 'shuffleOn' : 'shuffleOff')}
          </button>
          <button className="ghost-btn" onClick={handleSkip}>{t('skip')}</button>
        </div>
        <span className="progress">
          {queue.totalCount ? t('masteredProgress', { n: queue.masteredCount, total: queue.totalCount }) : '0 / 0'}
        </span>
      </div>
    </>
  );
}
