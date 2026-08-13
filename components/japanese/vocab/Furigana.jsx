'use client';
// components/japanese/vocab/Furigana.jsx — recall and type a word's reading
// from its kanji, auto-graded against the word's own reading (no self-
// honesty needed). Same clean-run semantics as Writing: a miss restarts the
// whole run, banked as weak first.
import { useEffect, useRef, useState } from 'react';
import { VOCAB_DATA } from '../../../lib/japanese/data/vocab';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { useVocabProgress } from '../../../lib/japanese/VocabProgressContext';
import { useCleanRunQueue } from '../../../hooks/japanese/useCleanRunQueue';
import { isLessonComplete } from '../../../lib/japanese/masteryQueue';
import { normalizeReading } from '../../../lib/japanese/normalizeReading';
import { LevelChips } from './LevelChips';
import { LessonChips } from './LessonChips';

function buildFgDeck(level, lessons, isolateMode, isWeak) {
  const levels = level === 'all' ? Object.keys(VOCAB_DATA) : [level];
  let items = levels.flatMap((l) => (VOCAB_DATA[l] || []).map((item) => ({ ...item, level: l })));
  if (lessons.length) items = items.filter((item) => lessons.includes(item.lesson));
  items = items.filter((item) => item.reading && item.reading.trim());
  if (isolateMode) items = items.filter((item) => isWeak(item));
  return items;
}

export function Furigana({ active }) {
  const { t } = useJapaneseI18n();
  const { furigana, fgMastery } = useVocabProgress();
  const [level, setLevel] = useState('all');
  const [lessons, setLessons] = useState([]);
  const [isolateMode, setIsolateMode] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [verdictClass, setVerdictClass] = useState(null); // 'fg-input-correct' | 'fg-input-wrong' | null
  const [showAnswer, setShowAnswer] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const [fixMastery, setFixMastery] = useState(false);
  const queue = useCleanRunQueue();
  const fieldRef = useRef(null);

  const startSession = (lv, ls, iso) => {
    const items = buildFgDeck(lv, ls, iso, furigana.isWeak);
    queue.start(items, shuffleOn);
    setValue('');
    setSubmitted(false);
    setVerdictClass(null);
    setShowAnswer(false);
    setJustReset(false);
  };

  useEffect(() => {
    startSession('all', [], false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (active && queue.current) {
      const id = setTimeout(() => fieldRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, queue.current]);

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

  const handleSkip = () => {
    if (!queue.current) return;
    queue.skip();
    setValue('');
    setSubmitted(false);
    setVerdictClass(null);
    setShowAnswer(false);
  };

  const handleResetProgress = () => {
    const msg = level === 'all' && lessons.length === 0
      ? 'This clears your furigana-practice progress for EVERY word. Continue?'
      : 'This clears your furigana-practice progress for the currently selected lessons. Continue?';
    if (!window.confirm(msg)) return;
    const targetItems = buildFgDeck(level, lessons, false, furigana.isWeak);
    furigana.resetProgressFor(targetItems);
    startSession(level, lessons, isolateMode);
  };

  const handleSubmit = () => {
    const item = queue.current;
    if (!item || submitted) return;
    setSubmitted(true);
    setJustReset(false);
    const isCorrect = normalizeReading(value) === normalizeReading(item.reading);
    setVerdictClass(isCorrect ? 'fg-input-correct' : 'fg-input-wrong');
    if (!isCorrect) setShowAnswer(true);

    queue.grade(isCorrect);
  };

  // grade()'s result comes back through queue.lastResult rather than a
  // callback -- see useCleanRunQueue.js for why. verdict is null whenever
  // this correct answer wasn't the item's second (mastering) rep yet -- the
  // per-question UI still needs to reset for the next card in that case, so
  // that reset must NOT be gated behind `verdict` (only the mastery-recording
  // below should be).
  useEffect(() => {
    const result = queue.lastResult;
    if (!result) return;
    const { verdict, restart } = result;
    if (verdict) {
      furigana.recordResult(verdict.item, verdict.mastered);
    }
    if (restart) {
      setTimeout(() => {
        startSession(level, lessons, isolateMode);
        setJustReset(true);
      }, 1500);
      return;
    }
    if (verdict && !isolateMode && isLessonComplete(queue.sessionItems, verdict.item.level, verdict.item.lesson)) {
      fgMastery.markPassed(verdict.item.level, verdict.item.lesson);
    }
    setTimeout(() => {
      setValue('');
      setSubmitted(false);
      setVerdictClass(null);
      setShowAnswer(false);
    }, 350);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.lastResult]);

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
        statusClass={(lv, n) => (fgMastery.isPassed(lv, n) ? ' chip-passed' : '')}
        editMode={fixMastery}
        onTogglePassed={(lv, n) => (fgMastery.isPassed(lv, n) ? fgMastery.unmarkPassed(lv, n) : fgMastery.markPassed(lv, n))}
      />

      <div className="study-options">
        <button className={`chip isolate-chip${isolateMode ? ' active' : ''}`} onClick={toggleIsolate}>{t('isolateWeak')}</button>
        <button className="text-link" onClick={handleResetProgress}>{t('resetProgress')}</button>
        <button className={`text-link${fixMastery ? ' active' : ''}`} onClick={() => setFixMastery((v) => !v)}>
          {fixMastery ? t('fixMasteryDone') : t('fixMasteryStart')}
        </button>
      </div>
      {fixMastery && <p className="isolate-note">{t('fixMasteryNote')}</p>}
      {isolateMode && <p className="isolate-note">{t('isolateNote')}</p>}

      <div className="fg-stage">
        <p className="fg-hint">{t('fgHint')}</p>
        <p className="fg-word">{current ? current.word : emptyText}</p>

        <div className="fg-input-row">
          <input
            ref={fieldRef}
            type="text"
            autoComplete="off"
            spellCheck="false"
            placeholder={t('fgPlaceholder')}
            value={value}
            disabled={submitted}
            className={verdictClass || undefined}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
          />
          <button className="ghost-btn btn-primary" onClick={handleSubmit}>{t('submit')}</button>
        </div>

        {justReset && <p className="run-reset-note">{t('runReset')}</p>}
        {showAnswer && current && (
          <div className="fg-answer">
            <span className="fg-answer-word">{current.reading}</span>
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
