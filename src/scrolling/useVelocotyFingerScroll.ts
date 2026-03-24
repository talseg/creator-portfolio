import { useCallback, useEffect, useRef, useState } from "react";

interface VelocityFingerScrollProps {
  onDeltaYScroll: (delta: number) => void;
}

export const useVelocityFingerScroll = (props: VelocityFingerScrollProps) => {
  const { onDeltaYScroll } = props;
  const [isTouchGestureActive, setIsTouchGestureActive] = useState(false);

  const lastTouchY = useRef<undefined | number>(undefined);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastYRef = useRef<number | null>(null);
  const wheelPendingDeltaRef = useRef(0);
  const wheelRafRef = useRef<number | null>(null);


  const onWheel = useCallback((e: WheelEvent) => {
    if (isTouchGestureActive) return;
    e.preventDefault();

    wheelPendingDeltaRef.current += e.deltaY;

    if (wheelRafRef.current != null) return;

    wheelRafRef.current = requestAnimationFrame(() => {
      wheelRafRef.current = null;

      const delta = wheelPendingDeltaRef.current;
      wheelPendingDeltaRef.current = 0;

      if (delta !== 0) {
        onDeltaYScroll(delta);
      }
    });

  }, [isTouchGestureActive, onDeltaYScroll]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!e.touches[0]) return;
    velocityRef.current = 0;
    lastYRef.current = e.touches[0].clientY;
    setIsTouchGestureActive(true);
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {

    if (e.touches.length === 0 || e.touches[0] === undefined) return;
    const y = e.touches[0].clientY;
    const lastY = lastYRef.current;
    if (lastY === null) return;
    const delta = lastY - y;

    onDeltaYScroll(delta);          // immediate response
    velocityRef.current = delta;   // keep last frame velocity
    lastYRef.current = y;
  }


  const startInertia = () => {
    const friction = 0.95;
    const stopThreshold = 1;

    const tick = () => {
      const v = velocityRef.current;

      if (Math.abs(v) < stopThreshold) {
        velocityRef.current = 0;
        rafRef.current = null;
        setIsTouchGestureActive(false);
        return;
      }

      onDeltaYScroll(v);
      velocityRef.current *= friction;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const onTouchEnd = (_: React.TouchEvent<HTMLDivElement>) => {
    lastYRef.current = null;
    startInertia();
  }

  const onTouchCancel = () => {
    lastTouchY.current = undefined;
    setIsTouchGestureActive(false);
  }

  // -------------------------------------------
  // 3. Wheel scroll: main logic
  // -------------------------------------------
  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  return { onTouchStart, onTouchMove, onTouchEnd, isTouchGestureActive, onTouchCancel };
};
