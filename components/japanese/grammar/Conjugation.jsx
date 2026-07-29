'use client';
// components/japanese/grammar/Conjugation.jsx — Reference (browse the 9
// conjugation topics) and Practice (By form / By verb / Sentences), all
// mounted simultaneously with CSS-driven visibility, same rationale as
// every other tab/subview in this app. Practice is deliberately session-only
// (not persisted) -- a lighter-weight warm-up drill, not a graded mode.
import { useEffect, useState } from 'react';
import { CONJUGATION_TOPICS, CONJUGATION_PRACTICE_VERBS } from '../../../lib/japanese/data/conjugation';
import { CONJUGATION_SENTENCES } from '../../../lib/japanese/data/conjugationSentences';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { FORM_LABELS, FORM_SEQUENCE } from '../../../lib/japanese/conjugationForms';
import { useLeakyQueue } from '../../../hooks/japanese/useLeakyQueue';
import { useVerbFormCycle } from '../../../hooks/japanese/useVerbFormCycle';
import { furiganaToHtml } from '../../../lib/japanese/furiganaToHtml';

function buildFormDeck(form) {
  const forms = form === 'all' ? FORM_SEQUENCE : [form];
  const items = [];
  CONJUGATION_PRACTICE_VERBS.forEach((verb) => {
    forms.forEach((f) => {
      items.push({ dict: verb.dict, reading: verb.reading, meaning: verb.meaning, group: verb.group, form: f, answer: verb[f] });
    });
  });
  return items;
}

function sentencesFormsWithData() {
  return FORM_SEQUENCE.filter((f) => (CONJUGATION_SENTENCES[f] || []).length);
}

function buildSentenceDeck(form) {
  const forms = form === 'all' ? Object.keys(CONJUGATION_SENTENCES) : [form];
  const items = [];
  forms.forEach((f) => {
    (CONJUGATION_SENTENCES[f] || []).forEach((q) => items.push({ ...q, tag: FORM_LABELS[f] || f }));
  });
  return items;
}

function ConjTable({ topic, group }) {
  if (topic.type === 'classification') {
    return (
      <table className="conjugation-table">
        <thead><tr><th>ます形 → 辞書形</th><th>例</th></tr></thead>
        <tbody>
          {group.rows.map((row, i) => (
            <tr key={i}>
              <td className="conj-rule">{row.masu} → {row.dict}</td>
              <td className="conj-examples">{row.examples.join('、')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <table className="conjugation-table">
      <thead><tr><th>dictionary form</th>{topic.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {group.examples.map((ex, i) => (
          <tr key={i}>
            <td className="conj-dict">{ex.dict}</td>
            {ex.values.map((v, j) => <td key={j}>{v}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ConjugationReference() {
  const { t } = useJapaneseI18n();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const topic = selectedIndex !== null ? CONJUGATION_TOPICS[selectedIndex] : null;

  return (
    <div className="grammar-layout">
      <ul className="grammar-list">
        {CONJUGATION_TOPICS.map((tp, i) => (
          <li
            key={tp.id}
            className={`grammar-item${selectedIndex === i ? ' active' : ''}`}
            tabIndex={0}
            onClick={() => setSelectedIndex(i)}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedIndex(i); }}
          >
            {tp.number}. {tp.title}
          </li>
        ))}
      </ul>
      <div className="grammar-detail">
        {!topic && <p className="grammar-empty">{t('selectForm')}</p>}
        {topic && (
          <>
            <p className="grammar-pattern">{topic.title}</p>
            <p className="grammar-meaning">{topic.englishTitle}</p>
            {topic.intro && <p className="grammar-usage">{topic.intro}</p>}
            {topic.groups.map((group, i) => (
              <div className="conjugation-group" key={i}>
                <h4 className="conjugation-group-label">
                  Group {group.label}{group.rule && <span className="conj-rule-note"> ({group.rule})</span>}
                </h4>
                <ConjTable topic={topic} group={group} />
              </div>
            ))}
            {topic.note && <p className="conjugation-note">{topic.note}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function ByFormPractice({ active }) {
  const { t } = useJapaneseI18n();
  const [form, setForm] = useState('all');
  const [shuffleOn, setShuffleOn] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const queue = useLeakyQueue();

  const startSession = (f, shuffleFlag) => {
    queue.start(buildFormDeck(f), shuffleFlag);
    setFlipped(false);
  };

  useEffect(() => {
    startSession('all', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (f) => {
    setForm(f);
    startSession(f, shuffleOn);
  };

  const toggleShuffle = () => {
    const next = !shuffleOn;
    setShuffleOn(next);
    if (next) queue.reshuffleQueue();
  };

  const handleFlip = () => {
    if (!queue.current) return;
    setFlipped((f) => !f);
  };

  const handleGrade = (isCorrect) => {
    if (!queue.current || !flipped) return;
    queue.grade(isCorrect);
    setFlipped(false);
  };

  const handleSkip = () => {
    if (!queue.current) return;
    queue.skip();
    setFlipped(false);
  };

  useEffect(() => {
    if (!active) return;
    function onKey(e) {
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      else if (flipped && e.code === 'ArrowRight') handleGrade(true);
      else if (flipped && e.code === 'ArrowLeft') handleGrade(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, flipped, queue.current]);

  const current = queue.current;
  const emptyText = queue.totalCount ? t('allMastered') : t('noVerbs');

  return (
    <>
      <div className="controls">
        <div className="level-chips">
          <button className={`chip${form === 'all' ? ' active' : ''}`} onClick={() => handleFormChange('all')}>{t('allForms')}</button>
          {FORM_SEQUENCE.map((f) => (
            <button key={f} className={`chip${form === f ? ' active' : ''}`} onClick={() => handleFormChange(f)}>{FORM_LABELS[f]}</button>
          ))}
        </div>
      </div>

      <div className="card-stage">
        <button className={`card${flipped ? ' flipped' : ''}`} aria-live="polite" onClick={handleFlip}>
          <div className="card-face card-front">
            <span className="conj-form-label">{current ? FORM_LABELS[current.form] : ''}</span>
            <span className="conj-reading">{current ? current.reading : ''}</span>
            <span className="card-text">{current ? current.dict : emptyText}</span>
            <span className="conj-meaning">{current ? current.meaning : ''}</span>
          </div>
          <div className="card-face card-back">
            <span className="seal" aria-hidden="true">済</span>
            <span className="card-text">{current ? current.answer : ''}</span>
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

function ByVerbPractice({ active }) {
  const { t } = useJapaneseI18n();
  const cycle = useVerbFormCycle(CONJUGATION_PRACTICE_VERBS[0]);

  const handleFlip = () => cycle.flip();
  const handleGrade = (isCorrect) => cycle.grade(isCorrect);

  useEffect(() => {
    if (!active) return;
    function onKey(e) {
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      else if (cycle.flipped && e.code === 'ArrowRight') handleGrade(true);
      else if (cycle.flipped && e.code === 'ArrowLeft') handleGrade(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, cycle.flipped, cycle.formIndex]);

  const verbs = CONJUGATION_PRACTICE_VERBS;
  const byGroup = { I: [], II: [], III: [] };
  verbs.forEach((v, i) => { if (byGroup[v.group]) byGroup[v.group].push(i); });
  const currentVerbIdx = verbs.indexOf(cycle.verb);

  const handleVerbChange = (idx) => cycle.start(verbs[Number(idx)]);
  const handleNextVerb = () => cycle.start(verbs[(currentVerbIdx + 1) % verbs.length]);

  const done = cycle.formIndex >= FORM_SEQUENCE.length;
  const correctCount = cycle.results.filter((r) => r === true).length;
  const form = !done ? FORM_SEQUENCE[cycle.formIndex] : null;

  return (
    <>
      <div className="controls">
        <select className="verb-select" aria-label={t('chooseVerb')} value={currentVerbIdx} onChange={(e) => handleVerbChange(e.target.value)}>
          {['I', 'II', 'III'].filter((g) => byGroup[g].length).map((g) => (
            <optgroup label={`Group ${g}`} key={g}>
              {byGroup[g].map((i) => (
                <option key={i} value={i}>{verbs[i].dict}（{verbs[i].reading}）— {verbs[i].meaning}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button className="ghost-btn" onClick={handleNextVerb}>{t('nextVerb')}</button>
      </div>

      <div className="form-breadcrumb">
        {FORM_SEQUENCE.map((f, i) => {
          let cls = 'breadcrumb-item';
          if (i === cycle.formIndex) cls += ' current';
          else if (cycle.results[i] === true) cls += ' done-correct';
          else if (cycle.results[i] === false) cls += ' done-wrong';
          else cls += ' upcoming';
          return <span className={cls} key={f}>{FORM_LABELS[f]}</span>;
        })}
      </div>

      <div className="card-stage">
        <button className={`card${cycle.flipped ? ' flipped' : ''}`} aria-live="polite" onClick={handleFlip}>
          <div className="card-face card-front">
            <span className="conj-form-label">{!done ? FORM_LABELS[form] : ''}</span>
            <span className="conj-reading">{!done ? cycle.verb.reading : ''}</span>
            <span className="card-text">{!done ? cycle.verb.dict : t('doneWithVerb', { verb: cycle.verb.dict, n: correctCount })}</span>
            <span className="conj-meaning">{!done ? cycle.verb.meaning : ''}</span>
          </div>
          <div className="card-face card-back">
            <span className="seal" aria-hidden="true">済</span>
            <span className="card-text">{!done ? cycle.verb[form] : ''}</span>
          </div>
        </button>
        {!done && !cycle.flipped && <p className="card-hint">{t('cardHint')}</p>}
        {!done && cycle.flipped && (
          <div className="grade-buttons">
            <button className="grade-btn grade-wrong" onClick={() => handleGrade(false)}>{t('didntKnow')}</button>
            <button className="grade-btn grade-right" onClick={() => handleGrade(true)}>{t('knewIt')}</button>
          </div>
        )}
      </div>

      <div className="deck-controls">
        <span className="progress">{done ? t('verbProgress', { n: correctCount }) : `${cycle.formIndex + 1} / 8`}</span>
      </div>
    </>
  );
}

function ConjugationSentences() {
  const { t } = useJapaneseI18n();
  const [form, setForm] = useState('all');
  const [shuffleOn, setShuffleOn] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [choiceLock, setChoiceLock] = useState(false);
  const [chosenIdx, setChosenIdx] = useState(null);
  const queue = useLeakyQueue();

  const startSession = (f, shuffleFlag) => {
    queue.start(buildSentenceDeck(f), shuffleFlag);
  };

  useEffect(() => {
    startSession('all', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A fresh card is always shown immediately after grading (no "hold for
  // Next" here) -- reset the per-card UI whenever queue.current changes.
  useEffect(() => {
    setRevealed(false);
    setChoiceLock(false);
    setChosenIdx(null);
  }, [queue.current]);

  const forms = sentencesFormsWithData();

  const handleFormChange = (f) => {
    setForm(f);
    startSession(f, shuffleOn);
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

  const handleReveal = () => {
    if (!queue.current || revealed) return;
    setRevealed(true);
  };

  const handleGrade = (isCorrect) => {
    if (!queue.current) return;
    queue.grade(isCorrect);
  };

  const handleChoice = (idx) => {
    const item = queue.current;
    if (!item || choiceLock) return;
    setChoiceLock(true);
    setChosenIdx(idx);
    setTimeout(() => queue.grade(idx === item.correct), 700);
  };

  const current = queue.current;
  const emptyText = queue.totalCount ? t('allMastered') : t('noQuestions');
  const answered = revealed || choiceLock;

  return (
    <>
      <div className="level-chips">
        <button className={`chip${form === 'all' ? ' active' : ''}`} onClick={() => handleFormChange('all')}>{t('allForms')}</button>
        {forms.map((f) => (
          <button key={f} className={`chip${form === f ? ' active' : ''}`} onClick={() => handleFormChange(f)}>{FORM_LABELS[f]}</button>
        ))}
      </div>

      <div className="card-stage">
        <div className="gp-card">
          {answered && current && <p className="gp-pattern-tag">{current.tag || ''}</p>}
          {current
            ? <p className="gp-sentence" dangerouslySetInnerHTML={{ __html: furiganaToHtml(current.jp) }} />
            : <p className="gp-sentence">{emptyText}</p>}
          <p className="gp-hint">{current ? (current.en || '') : ''}</p>

          {current && current.type === 'choice' && (
            <div className="gp-options">
              {current.options.map((opt, idx) => {
                let cls = 'gp-option-btn';
                if (choiceLock) {
                  if (idx === current.correct) cls += ' correct';
                  else if (idx === chosenIdx) cls += ' wrong';
                }
                return (
                  <button key={idx} className={cls} disabled={choiceLock} onClick={() => handleChoice(idx)}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {current && current.type !== 'choice' && !revealed && (
            <button className="ghost-btn" onClick={handleReveal}>{t('showAnswer')}</button>
          )}
          {current && current.type !== 'choice' && revealed && (
            <>
              <p className="gp-answer">{current.answer}</p>
              <div className="grade-buttons">
                <button className="grade-btn grade-wrong" onClick={() => handleGrade(false)}>{t('didntKnow')}</button>
                <button className="grade-btn grade-right" onClick={() => handleGrade(true)}>{t('knewIt')}</button>
              </div>
            </>
          )}
        </div>
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

export function Conjugation({ active }) {
  const { t } = useJapaneseI18n();
  const [mode, setMode] = useState('reference'); // 'reference' | 'practice'
  const [practiceMode, setPracticeMode] = useState('by-form'); // 'by-form' | 'by-verb' | 'sentences'

  return (
    <>
      <div className="direction-toggle">
        <button className={`dir-btn${mode === 'reference' ? ' active' : ''}`} onClick={() => setMode('reference')}>{t('refModeReference')}</button>
        <button className={`dir-btn${mode === 'practice' ? ' active' : ''}`} onClick={() => setMode('practice')}>{t('refModePractice')}</button>
      </div>

      <div className={`conj-mode${mode === 'reference' ? ' active' : ''}`}>
        <ConjugationReference />
      </div>

      <div className={`conj-mode${mode === 'practice' ? ' active' : ''}`}>
        <div className="direction-toggle">
          <button className={`dir-btn${practiceMode === 'by-form' ? ' active' : ''}`} onClick={() => setPracticeMode('by-form')}>{t('byForm')}</button>
          <button className={`dir-btn${practiceMode === 'by-verb' ? ' active' : ''}`} onClick={() => setPracticeMode('by-verb')}>{t('byVerb')}</button>
          <button className={`dir-btn${practiceMode === 'sentences' ? ' active' : ''}`} onClick={() => setPracticeMode('sentences')}>{t('bySentence')}</button>
        </div>

        <div className={`conj-practice-mode${practiceMode === 'by-form' ? ' active' : ''}`}>
          <ByFormPractice active={active && mode === 'practice' && practiceMode === 'by-form'} />
        </div>
        <div className={`conj-practice-mode${practiceMode === 'by-verb' ? ' active' : ''}`}>
          <ByVerbPractice active={active && mode === 'practice' && practiceMode === 'by-verb'} />
        </div>
        <div className={`conj-practice-mode${practiceMode === 'sentences' ? ' active' : ''}`}>
          <ConjugationSentences />
        </div>
      </div>
    </>
  );
}
