import { useCallback, useEffect, useRef, useState } from "react";

interface RafScrollEngineProps {
  onDeltaYScroll: (delta: number) => void;
}

export function useRafScrollEngine({
  onDeltaYScroll,
}: RafScrollEngineProps) {
  const [isTouchGestureActive, setIsTouchGestureActive] = useState(false);

  const isDraggingRef = useRef(false);
  const lastTouchYRef = useRef<number | null>(null);
  const lastDeltaRef = useRef(0);

  const velocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // ---------- tuning ----------
  const TOUCH_GAIN = 1;
  const FRICTION = 0.98;
  const STOP_EPSILON = 0.1;
  const MAX_VELOCITY = 40;
  // ----------------------------

  const stopRaf = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const startRaf = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const tick = () => {
      // ❗ inertia must stop if finger goes down
      if (isDraggingRef.current) {
        rafIdRef.current = null;
        return;
      }

      velocityRef.current *= FRICTION;

      if (Math.abs(velocityRef.current) < STOP_EPSILON) {
        velocityRef.current = 0;
        rafIdRef.current = null;
        return;
      }

      onDeltaYScroll(velocityRef.current);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [onDeltaYScroll]);

  // ---------------- Touch ----------------

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;

    stopRaf();

    isDraggingRef.current = true;
    setIsTouchGestureActive(true);

    velocityRef.current = 0;
    if ( e.touches[0] === undefined) 
      lastTouchYRef.current = 0;
    else
      lastTouchYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    if (e.touches.length !== 1) return;

    if ( e.touches[0] === undefined) return;
    const y = e.touches[0].clientY;
    const lastY = lastTouchYRef.current;
    if (lastY == null) return;

    const delta = (lastY - y) * TOUCH_GAIN;

    lastTouchYRef.current = y;
    lastDeltaRef.current = delta;

    // 🔑 direct, exact scroll
    onDeltaYScroll(delta);
  };

  const onTouchEnd = () => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsTouchGestureActive(false);

    lastTouchYRef.current = null;

    // seed inertia from last actual movement
    velocityRef.current = Math.max(
      -MAX_VELOCITY,
      Math.min(MAX_VELOCITY, lastDeltaRef.current)
    );

    if (Math.abs(velocityRef.current) > STOP_EPSILON) {
      startRaf();
    }
  };

  const onTouchCancel = () => {
    isDraggingRef.current = false;
    setIsTouchGestureActive(false);

    lastTouchYRef.current = null;
    velocityRef.current = 0;
    stopRaf();
  };

  // ---------------- Wheel ----------------

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Ignore wheel while finger is down
      if (isDraggingRef.current) return;

      e.preventDefault();

      stopRaf();
      velocityRef.current += e.deltaY;
      velocityRef.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, velocityRef.current)
      );
      startRaf();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [startRaf]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    isTouchGestureActive,
  };
}
