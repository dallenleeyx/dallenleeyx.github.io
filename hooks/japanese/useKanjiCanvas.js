'use client';
// hooks/japanese/useKanjiCanvas.js — owns the actual CanvasRenderingContext2D
// calls; the DPR-sizing/coordinate math itself lives in
// lib/japanese/kanjiCanvas.js as pure functions.
import { useCallback, useRef } from 'react';
import { computeCanvasBackingSize, pointerToCanvasCoords } from '../../lib/japanese/kanjiCanvas';

export function useKanjiCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);

  // Canvas backing-store size has to be set in real pixels (not CSS ones) for
  // crisp strokes on high-DPI screens, which also resets the context's scale/
  // stroke style -- so this needs re-running on load, on resize, and whenever
  // the tab becomes visible again (a canvas sized while display:none reports
  // a 0x0 rect).
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
    const inkColor = getComputedStyle(canvas).getPropertyValue('--jp-ink').trim();
    ctx.strokeStyle = inkColor || '#23241F';
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
  }, []);

  const onPointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    drawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const p = pointerToCanvasCoords(rect, e.clientX, e.clientY);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
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
    e.preventDefault();
  }, []);

  const onPointerUp = useCallback(() => { drawingRef.current = false; }, []);

  return { canvasRef, setup, clear, onPointerDown, onPointerMove, onPointerUp };
}
