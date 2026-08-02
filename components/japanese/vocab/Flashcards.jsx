'use client';
// components/japanese/vocab/Flashcards.jsx — quizzable word<->meaning with a
// mastery queue (see lib/japanese/masteryQueue.js) and a "practice weak
// words" mode. Flipping a card speaks its reading aloud via Google Cloud
// TTS (see lib/japanese/speak.js).
import { useEffect, useState } from 'react';
import { VOCAB_DATA } from '../../../lib/japanese/data/vocab';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { useVocabProgress } from '../../../lib/japanese/VocabProgressContext';
import { useMasteryQueue } from '../../../hooks/japanese/useMasteryQueue';
import { isLessonComplete } from '../../../lib/japanese/masteryQueue';
import { speakJapanese } from '../../../lib/japanese/speak';
import { cardFlipDelay } from '../../../lib/japanese/flipTiming';
import { LevelChips } from './LevelChips';
import { LessonChips } from './LessonChips';

function buildDeck(level, lessons, isolateMode, isWeak) {
  const levels = level === 'all' ? Object.keys(VOCAB_DATA) : [level];
  let items = levels.flatMap((l) => (VOCAB_DATA[l] || []).map((item) => ({ ...item, level: l })));
  if (lessons.length) items = items.filter((item) => lessons.includes(item.lesson));
  if (isolateMode) items = items.filter((item) => isWeak(item));
  return items;
}

export function Flashcards({ active }) {
  const { t, silentMode } = useJapaneseI18n();
  const { isWeak, recordSessionResult, fcMastery, resetProgressFor } = useVocabProgress();
  const [level, setLevel] = useState('all');
  const [lessons, setLessons] = useState([]);
  const [isolateMode, setIsolateMode] = useState(false);
  const [direction, setDirection] = useState('word-meaning');
  const [shuffleOn, setShuffleOn] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const queue = useMasteryQueue();

  const startSession = (lv, ls, iso) => {
    const items = buildDeck(lv, ls, iso, isWeak);
    queue.start(items, shuffleOn);
    setFlipped(false);
  };

  useEffect(() => {
    startSession('all', [], false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleFlip = () => {
    if (!queue.current || busy) return;
    const next = !flipped;
    setFlipped(next);
    if (next) speakJapanese(queue.current.reading || queue.current.word, silentMode);
  };

  // The card's content (queue.current) must not swap to the next item until
  // the flip-back animation has visually finished -- otherwise the back face
  // (still on-screen mid-rotation, since backface-visibility only hides it
  // past ~90 deg) briefly shows the NEXT card's answer instead of the one
  // just graded.
  const handleGrade = (isCorrect) => {
    if (!queue.current || !flipped || busy) return;
    setBusy(true);
    setFlipped(false);
    setTimeout(() => {
      queue.grade(isCorrect);
      setBusy(false);
    }, cardFlipDelay());
  };

  // grade()'s result comes back through queue.lastVerdict rather than a
  // callback -- see useMasteryQueue.js for why.
  useEffect(() => {
    const verdict = queue.lastVerdict;
    if (!verdict) return;
    recordSessionResult(verdict.item, verdict.mastered);
    if (!isolateMode && isLessonComplete(queue.sessionItems, verdict.item.level, verdict.item.lesson)) {
      fcMastery.markPassed(verdict.item.level, verdict.item.lesson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.lastVerdict]);

  const handleSkip = () => {
    if (!queue.current || busy) return;
    if (!flipped) {
      queue.skip();
      return;
    }
    setBusy(true);
    setFlipped(false);
    setTimeout(() => {
      queue.skip();
      setBusy(false);
    }, cardFlipDelay());
  };

  const handleResetProgress = () => {
    const msg = level === 'all' && lessons.length === 0
      ? 'This clears your right/wrong progress for EVERY word. Continue?'
      : 'This clears your right/wrong progress for the currently selected lessons. Continue?';
    if (!window.confirm(msg)) return;
    const targetItems = buildDeck(level, lessons, false, isWeak);
    resetProgressFor(targetItems);
    startSession(level, lessons, isolateMode);
  };

  useEffect(() => {
    if (!active) return;
    function onKey(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (flipped && e.code === 'ArrowRight') {
        handleGrade(true);
      } else if (flipped && e.code === 'ArrowLeft') {
        handleGrade(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, flipped, busy, queue.current, isolateMode]);

  const current = queue.current;
  const emptyText = queue.totalCount ? t('allMastered') : (isolateMode ? t('noWeakWords') : t('noCards'));
  const frontText = current ? (direction === 'word-meaning' ? current.word : current.meaning) : emptyText;
  const backText = current ? (direction === 'word-meaning' ? current.meaning : current.word) : '';
  const backReading = current ? current.reading : '';

  return (
    <>
      <div className="controls">
        <LevelChips value={level} onChange={handleLevelChange} />
        <div className="direction-toggle">
          <button className={`dir-btn${direction === 'word-meaning' ? ' active' : ''}`} onClick={() => setDirection('word-meaning')}>
            {t('dirWordMeaning')}
          </button>
          <button className={`dir-btn${direction === 'meaning-word' ? ' active' : ''}`} onClick={() => setDirection('meaning-word')}>
            {t('dirMeaningWord')}
          </button>
        </div>
      </div>

      <LessonChips
        level={level}
        selected={lessons}
        multiSelect
        onToggle={toggleLesson}
        statusClass={(lv, n) => (fcMastery.isPassed(lv, n) ? ' chip-passed' : '')}
      />

      <div className="study-options">
        <button className={`chip isolate-chip${isolateMode ? ' active' : ''}`} onClick={toggleIsolate}>{t('isolateWeak')}</button>
        <button className="text-link" onClick={handleResetProgress}>{t('resetProgress')}</button>
      </div>
      {isolateMode && <p className="isolate-note">{t('isolateNote')}</p>}

      <div className="card-stage">
        <button className={`card${flipped ? ' flipped' : ''}`} aria-live="polite" onClick={handleFlip}>
          <div className="card-face card-front">
            <span className="card-text">{frontText}</span>
          </div>
          <div className="card-face card-back">
            <span className="seal" aria-hidden="true">済</span>
            <span className="card-reading">{backReading}</span>
            <span className="card-text">{backText}</span>
          </div>
        </button>
        {!flipped && <p className="card-hint">{t('cardHint')}</p>}
        {flipped && (
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
