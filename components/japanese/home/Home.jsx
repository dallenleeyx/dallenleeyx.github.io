'use client';
// components/japanese/home/Home.jsx — the study-timeline/pace planner: a
// two-phase plan built backwards from the exam date (see
// lib/japanese/timeline.js for the date math and phase rules). Shows
// countdown cards, today's checklist, per-track progress bars, a clickable
// lesson map, a 7-day forecast, and pace controls.
//
// Opening a task from here switches to the right top-level tab (Vocab or
// Grammar) but doesn't deep-link the exact subview/level/lesson selection --
// that would need VocabSection/GrammarSection's local subview state lifted
// into a shared context, which is out of scope for this phase.
import { useEffect, useMemo, useState } from 'react';
import { VOCAB_DATA, VOCAB_LESSONS } from '../../../lib/japanese/data/vocab';
import { GRAMMAR_DATA } from '../../../lib/japanese/data/grammar';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';
import { usePlan } from '../../../lib/japanese/PlanContext';
import { useJapaneseView } from '../JapaneseTabs';
import { useMidnightRollover } from '../../../hooks/japanese/useMidnightRollover';
import {
  PLAN_LEVELS, REVIEW_HABITS, buildLessonQueue, taskKey, isTaskDone, doneOn, doneCount, doneTodayCount,
  nextUndone, projectDays, finishDateFor, planPhase, recalculatePace, daysBetween, addDaysISO, fmtDate, fmtDateShort, fmtShort,
} from '../../../lib/japanese/timeline';

function vocabLessonTitle(level, lesson) {
  const titles = VOCAB_LESSONS[level] || {};
  return titles[lesson] ? `${level} ${lesson}課 ${titles[lesson]}` : `${level} ${lesson}課`;
}
function vocabWordCount(level, lesson) {
  return (VOCAB_DATA[level] || []).filter((i) => i.lesson === lesson).length;
}
function grammarPatternCount(level, lesson) {
  return (GRAMMAR_DATA[level] || []).filter((i) => i.lesson === lesson).length;
}

// Today's row set = whatever's already ticked today (kept on screen so the
// day can actually be finished) + enough new lessons to fill the quota +
// one optional bonus once the quota is met.
function slotsFor(queue, planDone, perDay, today) {
  const doneToday = queue.filter((x) => doneOn(planDone, x) === today);
  const quotaLeft = Math.max(0, perDay - doneToday.length);
  const upcoming = nextUndone(queue, planDone, quotaLeft || 1);
  const rows = doneToday.concat(upcoming.slice(0, quotaLeft));
  const bonus = quotaLeft === 0 && upcoming.length ? [upcoming[0]] : [];
  return { rows, bonus };
}

export function Home({ active }) {
  const { t, lang } = useJapaneseI18n();
  const { plan, planDone, planDaily, updatePlan, toggleTaskDone, toggleHabitDone, resetPlan } = usePlan();
  const { setActiveView } = useJapaneseView();
  const today = useMidnightRollover();
  const [paceInputs, setPaceInputs] = useState({ vocab: plan.vocabPerDay, grammar: plan.grammarPerDay });

  // This whole view is built from locale-formatted dates (fmtDate/fmtShort/
  // etc.), which can render slightly differently between the server's ICU
  // and the browser's (a comma after the weekday, for one) -- a guaranteed
  // hydration mismatch if rendered during SSR. Deferring to client-only
  // avoids it; the brief blank frame on first load is a fair trade since
  // Home is now the default tab.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const vocabQueue = useMemo(() => buildLessonQueue(VOCAB_DATA, 'vocab'), []);
  const grammarQueue = useMemo(() => buildLessonQueue(GRAMMAR_DATA, 'grammar'), []);

  const phase = planPhase(plan, today);
  const toExam = daysBetween(today, plan.examDate);
  const toStudyEnd = daysBetween(today, plan.studyEnd);

  const vDone = doneCount(vocabQueue, planDone);
  const gDone = doneCount(grammarQueue, planDone);
  const vTotal = vocabQueue.length;
  const gTotal = grammarQueue.length;
  const vLeft = vTotal - vDone;
  const gLeft = gTotal - gDone;
  const vTodayCount = doneTodayCount(vocabQueue, planDone, today);
  const gTodayCount = doneTodayCount(grammarQueue, planDone, today);

  const vFinish = finishDateFor(vLeft, plan.vocabPerDay, vTodayCount, today);
  const gFinish = finishDateFor(gLeft, plan.grammarPerDay, gTodayCount, today);
  const worstFinish = daysBetween(vFinish, gFinish) > 0 ? gFinish : vFinish;
  const limiterIsGrammar = daysBetween(vFinish, gFinish) > 0;
  const slack = daysBetween(worstFinish, plan.studyEnd);
  const allDone = !vLeft && !gLeft;

  const openTask = (task) => setActiveView(task.kind === 'vocab' ? 'vocab' : 'grammar');
  const openHabit = (habit) => setActiveView(habit.view);

  const handlePaceCommit = () => {
    const v = Math.max(1, Math.min(20, Number(paceInputs.vocab) || 1));
    const g = Math.max(1, Math.min(20, Number(paceInputs.grammar) || 1));
    updatePlan({ vocabPerDay: v, grammarPerDay: g });
    setPaceInputs({ vocab: v, grammar: g });
  };

  const handleReschedule = () => {
    const { vocabPerDay, grammarPerDay } = recalculatePace(vLeft, gLeft, today, plan.studyEnd);
    updatePlan({ vocabPerDay, grammarPerDay });
    setPaceInputs({ vocab: vocabPerDay, grammar: grammarPerDay });
  };

  const handleReset = () => {
    if (!window.confirm('This clears every tick on your study plan and restarts it from today. Continue?')) return;
    resetPlan();
    setPaceInputs({ vocab: 3, grammar: 2 });
  };

  // ---- today's checklist ----
  let taskItems = [];
  let statusText = '';
  let statusClass = 'tl-ok';
  if (phase === 'learn') {
    const vs = slotsFor(vocabQueue, planDone, plan.vocabPerDay, today);
    const gs = slotsFor(grammarQueue, planDone, plan.grammarPerDay, today);
    const ordered = vs.rows.concat(vs.bonus).concat(gs.rows).concat(gs.bonus);
    const bonusKeys = new Set(vs.bonus.concat(gs.bonus).map(taskKey));
    taskItems = ordered.map((task) => {
      const key = taskKey(task);
      const isBonus = bonusKeys.has(key);
      return {
        key,
        done: isTaskDone(planDone, task),
        bonus: isBonus,
        title: task.kind === 'vocab' ? vocabLessonTitle(task.level, task.lesson) : `${task.level} ${task.lesson}課`,
        meta: task.kind === 'vocab'
          ? t('tlVocabTaskMeta', { n: vocabWordCount(task.level, task.lesson) })
          : t('tlGrammarTaskMeta', { n: grammarPatternCount(task.level, task.lesson) }),
        badge: isBonus ? t('tlBonus') : t(task.kind === 'vocab' ? 'tabVocab' : 'tabGrammar'),
        badgeKind: isBonus ? 'bonus' : task.kind,
        toggle: () => toggleTaskDone(task, key, today),
        open: () => openTask(task),
      };
    });

    const elapsed = Math.max(0, daysBetween(plan.startDate, today));
    const expectedV = Math.min(vocabQueue.length, elapsed * plan.vocabPerDay);
    const expectedG = Math.min(grammarQueue.length, elapsed * plan.grammarPerDay);
    const behind = expectedV - vDone + (expectedG - gDone);
    const quotaMet = vTodayCount >= plan.vocabPerDay && gTodayCount >= plan.grammarPerDay;
    const ahead = quotaMet ? Math.max(0, vTodayCount - plan.vocabPerDay) + Math.max(0, gTodayCount - plan.grammarPerDay) : 0;
    if (behind > 0) {
      statusText = t('tlBehind', { n: behind }); statusClass = 'tl-warn';
    } else if (ahead > 0) {
      statusText = t('tlAhead', { n: ahead, v: vTodayCount, g: gTodayCount });
    } else if (quotaMet) {
      statusText = t('tlQuotaMet');
    } else {
      statusText = t('tlTodayQuota', { v: Math.max(0, plan.vocabPerDay - vTodayCount), g: Math.max(0, plan.grammarPerDay - gTodayCount) });
    }
  } else if (phase === 'review') {
    const day = planDaily[today] || {};
    taskItems = REVIEW_HABITS.map((h) => ({
      key: h.id,
      done: !!day[h.id],
      bonus: false,
      title: h.label,
      meta: '',
      badge: t('tlPhaseReview'),
      badgeKind: 'review',
      toggle: () => toggleHabitDone(h.id, today),
      open: () => openHabit(h),
    }));
    statusText = t('tlReviewStatus');
  } else {
    statusText = t('tlAfterExam');
  }
  const band = (it) => (it.done ? 2 : it.bonus ? 1 : 0);
  taskItems = taskItems.slice().sort((a, b) => band(a) - band(b));

  // ---- week ahead ----
  const weekRows = [];
  if (phase === 'learn') {
    const vLeftQ = vocabQueue.filter((x) => !isTaskDone(planDone, x));
    const gLeftQ = grammarQueue.filter((x) => !isTaskDone(planDone, x));
    const vDays = projectDays(vLeftQ, plan.vocabPerDay, vTodayCount, 7);
    const gDays = projectDays(gLeftQ, plan.grammarPerDay, gTodayCount, 7);
    for (let i = 0; i < 7; i++) {
      const iso = addDaysISO(today, i);
      if (daysBetween(iso, plan.studyEnd) < 0) break;
      const v = vDays[i] || [];
      const g = gDays[i] || [];
      if (!v.length && !g.length) {
        if (i === 0) weekRows.push({ iso, text: t('tlQuotaMetShort'), today: true });
        else break;
        continue;
      }
      const parts = [];
      if (v.length) parts.push(`${t('tabVocab')} ${v.map((x) => `${x.level} ${x.lesson}課`).join(', ')}`);
      if (g.length) parts.push(`${t('tabGrammar')} ${g.map((x) => `${x.level} ${x.lesson}課`).join(', ')}`);
      weekRows.push({ iso, text: parts.join(' · '), today: i === 0 });
    }
  } else if (phase === 'review') {
    for (let i = 0; i < 7; i++) {
      const iso = addDaysISO(today, i);
      if (daysBetween(iso, plan.examDate) < 0) break;
      weekRows.push({ iso, text: t('tlReviewDayLine'), today: i === 0 });
    }
  }

  if (!mounted) return null;

  return (
    <>
      <div className="tl-countdown">
        <div className="tl-count-card tl-count-exam">
          <span className="tl-count-num">{toExam >= 0 ? toExam : '—'}</span>
          <span className="tl-count-label">{t('tlDaysToExam')}</span>
          <span className="tl-count-sub">{fmtDate(plan.examDate, lang)}</span>
        </div>
        <div className={`tl-count-card${allDone ? ' tl-finish-ok' : slack < 0 ? ' tl-finish-late' : ' tl-finish-ok'}`}>
          <span className="tl-count-num">{allDone ? '🎉' : fmtDateShort(worstFinish, lang)}</span>
          <span className="tl-count-label">{t('tlProjectedFinish')}</span>
          {!allDone && (
            <span className="tl-finish-split">
              <span className={`tl-fs${!limiterIsGrammar ? ' tl-fs-limit' : ''}`}>{t('tabVocab')} {vLeft ? fmtDateShort(vFinish, lang) : '✓'}</span>
              <span className={`tl-fs${limiterIsGrammar ? ' tl-fs-limit' : ''}`}>{t('tabGrammar')} {gLeft ? fmtDateShort(gFinish, lang) : '✓'}</span>
            </span>
          )}
          <span className="tl-count-sub">
            {allDone ? t('tlForecastComplete') : (slack >= 0 ? t('tlFinishSlack', { slack, deadline: fmtDateShort(plan.studyEnd, lang) }) : t('tlFinishLate', { over: -slack, deadline: fmtDateShort(plan.studyEnd, lang) }))}
          </span>
        </div>
        <div className={`tl-count-card${phase === 'learn' ? (vTodayCount >= plan.vocabPerDay && gTodayCount >= plan.grammarPerDay ? ' tl-quota-met' : '') : ''}`}>
          {phase !== 'learn' ? (
            <>
              <span className="tl-count-num">{t(phase === 'review' ? 'tlPhaseReview' : 'tlPhaseDone')}</span>
              <span className="tl-count-label">{t('tlQuotaLabel')}</span>
              <span className="tl-count-sub">{t(phase === 'review' ? 'tlPhaseReviewSub' : 'tlPhaseDoneSub')}</span>
            </>
          ) : (
            <>
              <span className="tl-count-num">{vTodayCount + gTodayCount}</span>
              <span className="tl-count-label">{t('tlQuotaLabel')}</span>
              <span className="tl-quota-split">
                <span className={`tl-qs${vTodayCount >= plan.vocabPerDay ? ' tl-qs-ok' : ''}`}>{t('tabVocab')} {vTodayCount}/{plan.vocabPerDay}</span>
                <span className={`tl-qs${gTodayCount >= plan.grammarPerDay ? ' tl-qs-ok' : ''}`}>{t('tabGrammar')} {gTodayCount}/{plan.grammarPerDay}</span>
              </span>
              <span className="tl-count-sub">
                {(() => {
                  const met = vTodayCount >= plan.vocabPerDay && gTodayCount >= plan.grammarPerDay;
                  const extra = met ? Math.max(0, vTodayCount - plan.vocabPerDay) + Math.max(0, gTodayCount - plan.grammarPerDay) : 0;
                  return extra > 0 ? t('tlQuotaOver', { n: extra }) : met ? t('tlQuotaDone') : t('tlQuotaRemaining', { n: plan.vocabPerDay + plan.grammarPerDay - vTodayCount - gTodayCount });
                })()}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="tl-panel">
        <div className="tl-panel-head">
          <h2 className="tl-h2">{t('tlTodayHeading')}</h2>
          <span className="tl-today-date">{fmtShort(today, lang)}</span>
        </div>
        <p className={`tl-status ${statusClass}`}>{statusText}</p>
        <ul className="tl-tasks">
          {taskItems.map((it) => (
            <li key={it.key} className={`tl-task${it.done ? ' tl-task-done' : ''}${it.bonus ? ' tl-task-bonus' : ''}`}>
              <button className="tl-check" aria-pressed={it.done} onClick={it.toggle}>{it.done ? '✓' : ''}</button>
              <button className="tl-task-body" onClick={it.open}>
                <span className="tl-task-title">{it.title}</span>
                {it.meta && <span className="tl-task-meta">{it.meta}</span>}
              </button>
              <span className={`tl-badge tl-badge-${it.badgeKind}`}>{it.badge}</span>
            </li>
          ))}
        </ul>
        {taskItems.length === 0 && <p className="tl-empty-note">{t('tlAllDoneToday')}</p>}
      </div>

      <div className="tl-progress-grid">
        <div className="tl-panel">
          <h2 className="tl-h2">{t('tlVocabProgress')}</h2>
          <div className="tl-bar"><span className="tl-bar-fill" style={{ width: vTotal ? `${Math.round((vDone / vTotal) * 100)}%` : '0%' }} /></div>
          <p className="tl-bar-label">{t('tlLessonsDone', { done: vDone, total: vTotal })}</p>
        </div>
        <div className="tl-panel">
          <h2 className="tl-h2">{t('tlGrammarProgress')}</h2>
          <div className="tl-bar"><span className="tl-bar-fill" style={{ width: gTotal ? `${Math.round((gDone / gTotal) * 100)}%` : '0%' }} /></div>
          <p className="tl-bar-label">{t('tlLessonsDone', { done: gDone, total: gTotal })}</p>
        </div>
      </div>

      <div className="tl-panel">
        <div className="tl-panel-head">
          <h2 className="tl-h2">{t('tlMapHeading')}</h2>
          <button className="ghost-btn" onClick={handleReschedule}>{t('tlReschedule')}</button>
        </div>
        <div className="tl-pace-row">
          <label className="tl-pace">
            <span>{t('tlVocabPerDay')}</span>
            <input
              type="number" min="1" max="20" step="1"
              value={paceInputs.vocab}
              onChange={(e) => setPaceInputs((p) => ({ ...p, vocab: e.target.value }))}
              onBlur={handlePaceCommit}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            />
          </label>
          <label className="tl-pace">
            <span>{t('tlGrammarPerDay')}</span>
            <input
              type="number" min="1" max="20" step="1"
              value={paceInputs.grammar}
              onChange={(e) => setPaceInputs((p) => ({ ...p, grammar: e.target.value }))}
              onBlur={handlePaceCommit}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            />
          </label>
        </div>
        {!allDone && slack < 0 && (
          <p className="tl-forecast tl-warn">
            {t('tlForecastLate', {
              date: fmtDate(worstFinish, lang),
              over: -slack,
              v: Math.ceil(vLeft / Math.max(1, toStudyEnd + 1)),
              g: Math.ceil(gLeft / Math.max(1, toStudyEnd + 1)),
            })}
          </p>
        )}
        <p className="tl-map-hint">{t('tlMapHint')}</p>
        <div className="tl-map">
          {PLAN_LEVELS.map((lvl) => {
            const tracks = [
              { kind: 'vocab', label: t('tabVocab'), queue: vocabQueue.filter((x) => x.level === lvl) },
              { kind: 'grammar', label: t('tabGrammar'), queue: grammarQueue.filter((x) => x.level === lvl) },
            ].filter((tr) => tr.queue.length);
            if (!tracks.length) return null;
            return (
              <section className="tl-map-level" key={lvl}>
                <h3 className="tl-map-level-title">{lvl}</h3>
                {tracks.map((tr) => {
                  const done = tr.queue.filter((x) => isTaskDone(planDone, x)).length;
                  return (
                    <div className="tl-track" key={tr.kind}>
                      <div className="tl-track-head">
                        <span className="tl-track-name">{tr.label}</span>
                        <span className="tl-track-count">{done} / {tr.queue.length}</span>
                      </div>
                      <div className="tl-dots">
                        {tr.queue.map((task) => {
                          const isDone = isTaskDone(planDone, task);
                          const title = task.kind === 'vocab' ? vocabLessonTitle(task.level, task.lesson) : `${task.level} ${task.lesson}課`;
                          return (
                            <button
                              key={taskKey(task)}
                              className={`tl-dot${isDone ? ' tl-dot-done' : ''}`}
                              title={title}
                              aria-pressed={isDone}
                              onClick={() => toggleTaskDone(task, taskKey(task), today)}
                            >
                              {task.lesson}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>

      <div className="tl-panel">
        <h2 className="tl-h2">{t('tlWeekHeading')}</h2>
        <ul className="tl-week">
          {weekRows.length
            ? weekRows.map((r) => (
                <li className={`tl-week-row${r.today ? ' tl-week-today' : ''}`} key={r.iso}>
                  <span className="tl-week-date">{fmtShort(r.iso, lang)}</span>
                  <span className="tl-week-text">{r.text}</span>
                </li>
              ))
            : <li className="tl-week-row"><span className="tl-week-text">{t('tlNothingScheduled')}</span></li>}
        </ul>
      </div>

      <p className="tl-reset-row">
        <button className="text-link" onClick={handleReset}>{t('tlReset')}</button>
      </p>
    </>
  );
}
