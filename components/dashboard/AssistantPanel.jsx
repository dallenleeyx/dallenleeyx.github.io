'use client';
// components/dashboard/AssistantPanel.jsx — the "Claude voice" at the top
// of the Dashboard: typed chat (streamed replies) plus voice input (mic,
// via the browser's native SpeechRecognition -- free, and unlike TTS
// output quality doesn't need to be beautiful, just usable) and
// speak-on-demand voice output (a speaker icon per reply, via
// lib/dashboard/speak.js's Google TTS pipeline -- see that file's
// comment for why output specifically reuses the proven Google TTS
// pattern instead of native SpeechSynthesis).
import { useCallback, useEffect, useRef, useState } from 'react';
import { speakText, stopSpeaking, isSpeaking } from '../../lib/dashboard/speak';

function useSpeechRecognition(onResult) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResultRef.current(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    if (!recRef.current || listening) return;
    setListening(true);
    try { recRef.current.start(); } catch (e) { setListening(false); }
  }, [listening]);

  return { start, listening, supported };
}

export function AssistantPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const send = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    setSending((wasSending) => {
      if (wasSending || !trimmed) return wasSending;
      return true;
    });
    if (!trimmed) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    const assistantId = `a-${Date.now()}`;
    setMessages((m) => [...m, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');

    try {
      const res = await fetch('/api/dashboard/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });
      if (!res.ok || !res.body) throw new Error('request failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: snapshot } : msg)));
      }
    } catch (e) {
      setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: "Sorry, I couldn't reach the assistant just now." } : msg)));
    } finally {
      setSending(false);
    }
  }, [messages]);

  const { start: startListening, listening, supported: micSupported } = useSpeechRecognition((text) => {
    send(text);
  });

  const toggleSpeak = (msg) => {
    if (isSpeaking(msg.id)) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(msg.id);
    speakText(msg.content, msg.id, { onEnd: () => setSpeakingId((cur) => (cur === msg.id ? null : cur)) });
  };

  const submit = () => send(input);

  return (
    <div className="dash-assistant">
      <div className="dash-assistant-head">
        <span className="dash-assistant-title">Ask Claude anything about your site</span>
      </div>

      {messages.length === 0 ? (
        <div className="dash-assistant-empty">
          Type a question, or tap the mic — it knows your courses, assignments, Japanese progress, and 6-month plan.
        </div>
      ) : (
        <div className="dash-assistant-messages">
          {messages.map((m) => (
            <div key={m.id} className={`dash-msg dash-msg-${m.role}`}>
              {m.role === 'assistant' ? (
                <>
                  <div className="dash-msg-text">{m.content || '…'}</div>
                  {m.content && (
                    <button
                      className={`dash-speak-btn${speakingId === m.id ? ' speaking' : ''}`}
                      onClick={() => toggleSpeak(m)}
                      title="Read aloud"
                      aria-label="Read aloud"
                    >
                      {speakingId === m.id ? '■' : '🔊'}
                    </button>
                  )}
                </>
              ) : (
                m.content
              )}
            </div>
          ))}
        </div>
      )}

      <div className="dash-assistant-row">
        <input
          className="tk-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Ask about your assignments, plan, progress…"
          disabled={sending}
        />
        {micSupported && (
          <button
            className={`dash-mic-btn${listening ? ' listening' : ''}`}
            onClick={startListening}
            disabled={sending || listening}
            title="Speak your question"
            aria-label="Speak your question"
          >
            🎙
          </button>
        )}
        <button className="tk-btn tk-btn-primary tk-btn-sm" disabled={sending || !input.trim()} onClick={submit}>
          {sending ? '…' : 'Ask'}
        </button>
      </div>
      <div className="dash-assistant-hint">Replies aren&rsquo;t spoken automatically — tap 🔊 on a reply to hear it.</div>
    </div>
  );
}
