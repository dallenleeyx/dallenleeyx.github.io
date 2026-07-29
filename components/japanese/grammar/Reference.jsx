'use client';
// components/japanese/grammar/Reference.jsx — browse grammar patterns by
// JLPT level: a list on the left, the selected pattern's full writeup on the
// right. Supports both the new `uses: [{label, explanation, examples}]`
// shape and the older flat `usage`/`examples` shape some entries still use.
import { useState } from 'react';
import { GRAMMAR_DATA } from '../../../lib/japanese/data/grammar';
import { useJapaneseI18n } from '../../../lib/japanese/I18nProvider';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

function Examples({ examples }) {
  if (!examples || !examples.length) return null;
  return (
    <div className="examples">
      {examples.map((ex, i) => (
        <div className="example" key={i}>
          <p className="example-jp">{ex.jp}</p>
          <p className="example-en">{ex.en}</p>
        </div>
      ))}
    </div>
  );
}

export function Reference() {
  const { t } = useJapaneseI18n();
  const [level, setLevel] = useState('N5');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const items = GRAMMAR_DATA[level] || [];
  const item = selectedIndex !== null ? items[selectedIndex] : null;

  const handleLevelChange = (l) => {
    setLevel(l);
    setSelectedIndex(null);
  };

  return (
    <>
      <div className="controls">
        <div className="level-chips">
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`chip ${l.toLowerCase()}${level === l ? ' active' : ''}`}
              onClick={() => handleLevelChange(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grammar-layout">
        <ul className="grammar-list">
          {items.map((it, i) => (
            <li
              key={it.pattern + i}
              className={`grammar-item${selectedIndex === i ? ' active' : ''}`}
              tabIndex={0}
              onClick={() => setSelectedIndex(i)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedIndex(i); }}
            >
              {it.lesson !== undefined ? `${it.lesson}課　${it.pattern}` : it.pattern}
            </li>
          ))}
        </ul>

        <div className="grammar-detail">
          {!item && <p className="grammar-empty">{t('selectPattern')}</p>}
          {item && (
            <>
              {item.lesson !== undefined && <span className="grammar-lesson-tag">{item.lesson}課</span>}
              <p className="grammar-pattern">{item.pattern}</p>
              <p className="grammar-meaning">{item.meaning}</p>
              <div className="grammar-uses">
                <h4 className="grammar-section-heading">{t('grammarUsesHeading')}</h4>
                {item.uses
                  ? item.uses.map((use, i) => (
                      <div className="grammar-use" key={i}>
                        <p className="grammar-use-label">{use.label}</p>
                        <p className="grammar-use-explanation">{use.explanation}</p>
                        <Examples examples={use.examples} />
                      </div>
                    ))
                  : (
                    <>
                      <p className="grammar-usage">{item.usage || ''}</p>
                      <Examples examples={item.examples} />
                    </>
                  )}
              </div>
              {!!(item.commonMistakes || []).length && (
                <div className="grammar-mistakes">
                  <h4 className="grammar-section-heading">{t('grammarMistakesHeading')}</h4>
                  {item.commonMistakes.map((m, i) => (
                    <div className="grammar-mistake" key={i}>
                      <p className="grammar-mistake-wrong">✗ {m.wrong}</p>
                      <p className="grammar-mistake-explanation">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
