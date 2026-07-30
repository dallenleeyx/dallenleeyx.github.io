'use client';
// hooks/japanese/useKanjiCanvas.js — owns the actual CanvasRenderingContext2D
// calls; the DPR-sizing/coordinate math itself lives in
// lib/japanese/kanjiCanvas.js as pure functions. Also records every stroke's
// raw points (in CSS-pixel canvas coordinates, with a timestamp) so a
// caller can send them off for handwriting recognition -- see
// lib/japanese/handwriting.js and KanjiWriting.jsx's auto-check mode.
import { useCallback, useRef } from 'react';
import { computeCanvasBackingSize, pointerToCanvasCoords } from '../../lib/japanese/kanjiCanvas';

export function useKanjiCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const strokesRef = useRef([]); // Array<Array<{x, y, t}>>
  const strokeStartRef = useRef(0);

  // Canvas backing-store size has to be set in real pixels (not CSS ones) for
  // crisp strokes on high-DPI screens, which also resets the context's scale/
  // stroke style -- so this needs re-running on load, on resize, and whenever
  // the tab becomes visible again (a canvas sized while display:none reports
  // a 0x0 rect). The ink *color* is deliberately NOT captured here -- see
  // onPointerDown, which re-reads it fresh on every stroke so a theme toggle
  // made mid-session (without a resize) still takes effect immediately.
  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = computeCanvasBackingSize(rect, dpr);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current = [];
  }, []);

  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    drawingRef.current = true;
    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--jp-ink').trim() || '#23241F';
    strokeStartRef.current = Date.now();
    const rect = canvas.getBoundingClientRect();
    const p = pointerToCanvasCoords(rect, e.clientX, e.clientY);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    strokesRef.current.push([{ x: p.x, y: p.y, t: 0 }]);
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const p = pointerToCanvasCoords(rect, e.clientX, e.clientY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (stroke) stroke.push({ x: p.x, y: p.y, t: Date.now() - strokeStartRef.current });
    e.preventDefault();
  }, []);

  const onPointerUp = useCallback(() => { drawingRef.current = false; }, []);

  const getStrokes = useCallback(() => strokesRef.current, []);
  const hasInk = useCallback(() => strokesRef.current.length > 0, []);
  const getSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: 0 };
    const rect = canvas.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  return { canvasRef, setup, clear, onPointerDown, onPointerMove, onPointerUp, getStrokes, hasInk, getSize };
}
