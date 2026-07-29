'use client';
// components/japanese/grammar/Practice.jsx — quiz the hand-written questions
// in grammarPractice.js, keyed by level+lesson. Unlike the other practice
// modes this one always shows the explanation after answering and waits for
// an explicit "Next" -- the point is to teach WHY まで beats までに here, not
// to drill for speed, so auto-advancing past the explanation would defeat
// the whole mode. Uses the shared mastery queue (see masteryQueue.js) plus
// an SM-2 review schedule (srs.js), gated to first-attempt-only.
import { useEffect, useRef, useState } from 'react';
import { GRAMMAR_PRACTICE } from '../../../lib/japanese/data/grammarPractice';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { useGrammarProgress } from '../../../lib/japanese/GrammarProgressContext';
import { useGrammarPractice } from '../../../hooks/japanese/useGrammarPractice';
import { furiganaToHtml } from '../../../lib/japanese/furiganaToHtml';
import { isLessonComplete, shuffle } from '../../../lib/japanese/masteryQueue';

const LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];

function levelsWithData() {
  return LEVEL_ORDER.filter((lv) => {
    const byLesson = GRAMMAR_PRACTICE[lv] || {};
    return Object.values(byLesson).some((qs) => (qs || []).length);
  });
}

function lessonsFor(level) {
  const byLesson = GRAMMAR_PRACTICE[level] || {};
  return Object.keys(byLesson).map(Number).filter((n) => (byLesson[n] || []).length).sort((a, b) => a - b);
}

function allQuestions(level, lessons) {
  const byLesson = GRAMMAR_PRACTICE[level] || {};
  const wanted = lessons && lessons.length ? lessons : lessonsFor(level);
  const out = [];
  wanted.forEach((n) => {
    (byLesson[n] || []).forEach((q) => out.push({ ...q, level, lesson: n }));
  });
  return out;
}

// Typed answers are compared loosely: trim, drop spaces, and treat the
// full-width blank characters as absent so pasting the sentence back in
// doesn't count as wrong.
function normalizeTyped(str) {
  return (str || '').trim().replace(/[\s　＿_]/g, '');
}

export function Practice({ active }) {
  const { t } = useJapaneseI18n();
  const { srs, gpMastery } = useGrammarProgress();
  const [level, setLevel] = useState('N4');
  const [lessons, setLessons] = useState([]);
  const [srsOn, setSrsOn] = useState(true);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [displayedItem, setDisplayedItem] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [verdict, setVerdict] = useState(null); // 'correct' | 'wrong' | null
  const [chosenPos, setChosenPos] = useState(null);
  const [correctPos, setCorrectPos] = useState(null);
  const [optionOrder, setOptionOrder] = useState([]);
  const [typedValue, setTypedValue] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const queue = useGrammarPractice();
  const fieldRef = useRef(null);
  const nextBtnRef = useRef(null);

  const levels = levelsWithData();

  const buildDeck = (lv, ls, srsFlag) => {
    const items = allQuestions(lv, ls);
    return srsFlag ? items.filter((q) => srs.isCardDue(q.id)) : items;
  };

  const startSession = (lv, ls, srsFlag) => {
    queue.start(buildDeck(lv, ls, srsFlag), shuffleOn);
    setAnswered(false);
  };

  useEffect(() => {
    startSession('N4', [], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The card on screen stays put while feedback is shown (the whole point of
  // this mode); it only advances to whatever the queue moved on to once
  // "Next" is clicked (or on skip, which isn't gated by `answered`).
  useEffect(() => {
    if (!answered) setDisplayedItem(queue.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.current, answered]);

  // Fresh per-card setup whenever a (possibly re-shown) question lands on
  // screen: options are reshuffled every time, per the original's comment
  // that a fixed order would itself be a hint.
  useEffect(() => {
    setChosenPos(null);
    setVerdict(null);
    setTypedValue('');
    setShowAnswer(false);
    if (displayedItem && displayedItem.type === 'choice') {
      const order = shuffle(displayedItem.options.map((_, i) => i));
      setOptionOrder(order);
      setCorrectPos(order.indexOf(displayedItem.correct));
    } else {
      setOptionOrder([]);
      setCorrectPos(null);
    }
    if (active && displayedItem && displayedItem.type === 'fill') {
      const id = setTimeout(() => fieldRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedItem, active]);

  useEffect(() => {
    if (answered) nextBtnRef.current?.focus();
  }, [answered]);

  const handleLevelChange = (lv) => {
    setLevel(lv);
    setLessons([]);
    startSession(lv, [], srsOn);
  };

  const toggleLesson = (n) => {
    const next = n === null ? [] : (lessons.includes(n) ? lessons.filter((x) => x !== n) : [...lessons, n].sort((a, b) => a - b));
    setLessons(next);
    startSession(level, next, srsOn);
  };

  const toggleSrs = () => {
    const next = !srsOn;
    setSrsOn(next);
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
  };

  const handleResetProgress = () => {
    if (!window.confirm("This clears your grammar-practice review schedule AND the green 'lesson passed' marks. Continue?")) return;
    srs.reset();
    gpMastery.reset();
    startSession(level, lessons, srsOn);
  };

  const handleAnswer = (isCorrect, chosenIdx = null) => {
    const item = displayedItem;
    if (!item || answered) return;
    setAnswered(true);
    setChosenPos(chosenIdx);
    setVerdict(isCorrect ? 'correct' : 'wrong');
    if (item.type === 'fill' && !isCorrect) setShowAnswer(true);

    queue.grade(isCorrect);
  };

  // grade()'s result comes back through queue.lastGrade rather than a
  // callback -- see useGrammarPractice.js for why.
  useEffect(() => {
    const g = queue.lastGrade;
    if (!g) return;
    if (g.firstAttemptItem) srs.recordResult(g.firstAttemptItem.id, g.isCorrect);
    if (g.verdict && isLessonComplete(queue.sessionItems, g.verdict.item.level, g.verdict.item.lesson)) {
      gpMastery.markPassed(g.verdict.item.level, g.verdict.item.lesson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.lastGrade]);

  const handleSubmitTyped = () => {
    const item = displayedItem;
    if (!item || answered || item.type !== 'fill') return;
    const given = normalizeTyped(typedValue);
    if (!given) return;
    handleAnswer(item.answers.some((a) => normalizeTyped(a) === given));
  };

  const handleNext = () => setAnswered(false);

  const lessonNums = lessonsFor(level);
  const dueNote = srsOn ? srs.dueCounts(allQuestions(level, lessons)) : null;
  const totalAll = allQuestions(level, lessons).length;
  const emptyPromptText = queue.totalCount
    ? t('allMastered')
    : (srsOn && totalAll ? t('gpAllCaughtUp') : t('gpNoQuestions'));

  return (
    <>
      <div className="controls">
        <div className="level-chips">
          {levels.map((lv) => (
            <button
              key={lv}
              className={`chip ${lv.toLowerCase()}${level === lv ? ' active' : ''}`}
              onClick={() => handleLevelChange(lv)}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>

      {!!lessonNums.length && (
        <div className="lesson-chips">
          <button className={`chip lesson-chip${lessons.length === 0 ? ' active' : ''}`} onClick={() => toggleLesson(null)}>
            {t('allLessons')}
          </button>
          {lessonNums.map((n) => (
            <button
              key={n}
              className={`chip lesson-chip${lessons.includes(n) ? ' active' : ''}${gpMastery.isPassed(level, n) ? ' chip-passed' : ''}`}
              onClick={() => toggleLesson(n)}
            >
              {n}課
            </button>
          ))}
        </div>
      )}

      <div className="study-options">
        <button className={`ghost-btn isolate-chip${srsOn ? ' active' : ''}`} onClick={toggleSrs}>
          {t(srsOn ? 'gpSrsOn' : 'gpSrsOff')}
        </button>
      </div>
      {dueNote && <p className="gp-due-note">{t('gpDueNote', { due: dueNote.due, fresh: dueNote.fresh })}</p>}

      <div className="card-stage">
        <div className="gp-card">
          {answered && displayedItem && <p className="gp-pattern-tag">{displayedItem.tag || ''}</p>}
          <p className="gp-prompt">{displayedItem ? displayedItem.prompt : emptyPromptText}</p>
          {displayedItem && (
            <p className="gp-sentence" dangerouslySetInnerHTML={{ __html: displayedItem.jp ? furiganaToHtml(displayedItem.jp) : '' }} />
          )}
          <p className="gp-hint">{displayedItem ? (displayedItem.en || '') : ''}</p>

          {displayedItem && displayedItem.type === 'choice' && (
            <div className="gp-options">
              {optionOrder.map((srcIdx, pos) => {
                let cls = 'gp-option-btn';
                if (answered) {
                  if (pos === correctPos) cls += ' correct';
                  else if (pos === chosenPos) cls += ' wrong';
                }
                return (
                  <button
                    key={pos}
                    className={cls}
                    disabled={answered}
                    onClick={() => handleAnswer(srcIdx === displayedItem.correct, pos)}
                  >
                    {displayedItem.options[srcIdx]}
                  </button>
                );
              })}
            </div>
          )}

          {displayedItem && displayedItem.type === 'fill' && (
            <div className="gp-input-row">
              <input
                ref={fieldRef}
                type="text"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder={t('gpPlaceholder')}
                value={typedValue}
                disabled={answered}
                className={answered ? (verdict === 'correct' ? 'fg-input-correct' : 'fg-input-wrong') : undefined}
                onChange={(e) => setTypedValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmitTyped(); } }}
              />
              <button className="ghost-btn btn-primary" onClick={handleSubmitTyped}>{t('submit')}</button>
            </div>
          )}

          {answered && displayedItem && (
            <div className="gp-feedback">
              <p className={`gp-verdict ${verdict === 'correct' ? 'gp-verdict-correct' : 'gp-verdict-wrong'}`}>
                {t(verdict === 'correct' ? 'gpCorrect' : 'gpWrong')}
              </p>
              {showAnswer && <p className="gp-answer">{t('gpAnswerLabel')} {displayedItem.answers[0]}</p>}
              <p className="gp-explain">{displayedItem.explain || ''}</p>
              <button ref={nextBtnRef} className="ghost-btn btn-primary" onClick={handleNext}>{t('next')}</button>
            </div>
          )}
        </div>
      </div>

      <div className="deck-controls">
        <div className="nav-group">
          <button className={`ghost-btn shuffle-toggle${shuffleOn ? ' active' : ''}`} onClick={toggleShuffle}>
            {t(shuffleOn ? 'shuffleOn' : 'shuffleOff')}
          </button>
          <button className="ghost-btn" onClick={handleSkip}>{t('skip')}</button>
          <button className="ghost-btn" onClick={handleResetProgress}>{t('resetProgress')}</button>
        </div>
        <span className="progress">
          {queue.totalCount ? t('masteredProgress', { n: queue.masteredCount, total: queue.totalCount }) : '0 / 0'}
        </span>
      </div>
    </>
  );
}
