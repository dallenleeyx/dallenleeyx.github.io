'use client';
// components/math/ReorderList.jsx — hold-and-drag manual reordering for a
// flat list of ids. Deliberately pointer-events based rather than native
// HTML5 drag-and-drop: the native ghost-image drag looks clunky and barely
// works on touch, while pointer events give full control over both and let
// us animate the displaced rows ourselves.
//
// Rows sit at a fixed height, so a row's slot is just index * ROW_HEIGHT --
// the dragged row follows the pointer directly (no transition, so it feels
// physically attached), swapping into a neighbor's slot the moment it's
// dragged a full row-height past it; every other row glides into its new
// slot via a CSS transform transition. The dragged row also gets a small
// scale/rotate/shadow lift while held, with a springy overshoot back to
// rest on release, so picking a block up and dropping it actually feels
// like picking something up rather than just re-sorting a list.
import { useEffect, useRef, useState } from 'react';

const ROW_HEIGHT = 62; // 52px visible row + 10px gap, matching .math-item-list's gap
const MAX_TILT = 6; // degrees

export function ReorderList({ ids, renderRow, onChange }) {
  const [order, setOrder] = useState(ids);
  const [dragId, setDragId] = useState(null);
  const [dragY, setDragY] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [settling, setSettling] = useState(false);

  const dragStartRef = useRef(0);
  const lastClientYRef = useRef(0);
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    setOrder(ids);
  }, [ids]);

  function handlePointerDown(e, id) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = e.clientY;
    lastClientYRef.current = e.clientY;
    setSettling(false);
    setDragId(id);
    setDragY(0);
    setTilt(0);
  }

  function handlePointerMove(e) {
    if (!dragId) return;
    const velocity = e.clientY - lastClientYRef.current;
    lastClientYRef.current = e.clientY;
    setTilt(Math.max(-MAX_TILT, Math.min(MAX_TILT, velocity * 0.8)));

    const delta = e.clientY - dragStartRef.current;
    setDragY(delta);

    const currentOrder = orderRef.current;
    const idx = currentOrder.indexOf(dragId);
    const shift = Math.round(delta / ROW_HEIGHT);
    if (shift !== 0) {
      const targetIdx = Math.max(0, Math.min(currentOrder.length - 1, idx + shift));
      if (targetIdx !== idx) {
        const next = currentOrder.slice();
        next.splice(idx, 1);
        next.splice(targetIdx, 0, dragId);
        setOrder(next);
        dragStartRef.current += shift * ROW_HEIGHT;
        setDragY(delta - shift * ROW_HEIGHT);
      }
    }
  }

  function endDrag() {
    if (!dragId) return;
    setSettling(true);
    setDragId(null);
    setDragY(0);
    setTilt(0);
    onChange?.(orderRef.current);
    setTimeout(() => setSettling(false), 320);
  }

  return (
    <div
      className="math-reorder-list"
      style={{ height: order.length * ROW_HEIGHT }}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {order.map((id, idx) => {
        const isDragging = id === dragId;
        const y = isDragging ? idx * ROW_HEIGHT + dragY : idx * ROW_HEIGHT;
        const transform = isDragging
          ? `translateY(${y}px) scale(1.03) rotate(${tilt}deg)`
          : `translateY(${y}px)`;
        return (
          <div
            key={id}
            className={`math-reorder-row${isDragging ? ' dragging' : ''}`}
            style={{
              transform,
              transition: isDragging
                ? 'none'
                : settling
                  ? 'transform 320ms cubic-bezier(.34,1.56,.64,1)'
                  : 'transform 260ms cubic-bezier(.2,.8,.2,1)',
              zIndex: isDragging ? 5 : 1,
            }}
            onPointerDown={(e) => handlePointerDown(e, id)}
          >
            {renderRow(id)}
          </div>
        );
      })}
    </div>
  );
}
