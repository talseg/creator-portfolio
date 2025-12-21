import { useCallback, useEffect, useRef, useState } from "react";

interface FingerScrollProps {
  onDeltaYScroll: (delta: number) => void;
}

export const useFingerScroll = (props: FingerScrollProps) => {
  const { onDeltaYScroll } = props;
  const [isTouchGestureActive, setIsTouchGestureActive] = useState(false);

  const lastTouchY = useRef<undefined | number>(undefined);

  const onWheel = useCallback((e: WheelEvent) => {
    if (isTouchGestureActive) return;
    e.preventDefault();
    onDeltaYScroll(e.deltaY);
  }, [isTouchGestureActive, onDeltaYScroll]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length >= 1) {
      lastTouchY.current = e.touches[0]?.clientY;
      setIsTouchGestureActive(true);
    }
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lastTouchY.current === undefined) return;
    if (e.touches.length === 0 || e.touches[0] === undefined) return;
    const currentY = e.touches[0].clientY;
    const delta = lastTouchY.current - currentY;
    if (delta === 0) return;
    lastTouchY.current = currentY;
    onDeltaYScroll(delta);
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      lastTouchY.current = undefined;
      setIsTouchGestureActive(false);
    }
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
