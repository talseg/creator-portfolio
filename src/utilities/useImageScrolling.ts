import { useEffect, useRef, useState } from "react";

interface ImageScrollingProps {
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middledRef: React.RefObject<HTMLDivElement | null>;
  middleSectionHeight: number;
}

type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, middledRef, middleSectionHeight } = props;

  const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);
  const [mainScrollValue, setMainScrollValue] = useState(0);
  const [scrollValues, setScrollValues] = useState([0, 0, 0]);
  const [shouldUpdateImages, setShouldUpdateImages] = useState(false);

  // Store last mouse position so we can use it on scroll
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const getPixelSizeByRem = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize);


  // -------------------------------
  // 1. Keep mouse position updated
  // -------------------------------
  const onMouseMove = (e: MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);


  // -------------------------------------------
  // 3. Wheel scroll: main logic
  // -------------------------------------------
  useEffect(() => {

    // ------------------------------------------------------------
    // 2. Helper: detect the area UNDER the pointer right now
    // ------------------------------------------------------------
    const detectAreaUnderPointer = (): ScrollAreaType => {
      const pos = mousePosRef.current;
      if (!pos) return undefined;
      const { x, y } = pos;

      // Middle section
      if (middledRef.current) {
        const r = middledRef.current.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return "middle";
        }
      }

      // Image columns
      const refs = imageRefs.current;
      for (let i = 0; i < refs.length; i++) {
        if (!refs) return;
        const ref = refs[i];
        if (!ref?.current) return;
        const el = ref.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return (i + 1) as ScrollAreaType; // 1, 2, 3
        }
      }

      return undefined;
    };

    const canScrollUp = (
      index: number,
      proposedValue: number
    ): boolean => {
      const colRef = imageRefs.current[index];
      if (!colRef?.current) return true;

      const rect = colRef.current.getBoundingClientRect();

      if (scrollValues[index] === undefined)
        return false;

      const projectedBottom = rect.bottom + (proposedValue - scrollValues[index]);

      return projectedBottom >= window.innerHeight;
    };

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (!middledRef.current) return;

      const delta = e.deltaY;
      const newMain = mainScrollValue - delta;

      const rem = getPixelSizeByRem();
      const collapseHeight = middleSectionHeight * rem;

      // 👉 ALWAYS recompute scroll area based on pointer location
      const pointerArea = detectAreaUnderPointer();
      if (pointerArea !== scrollArea) {
        setScrollArea(pointerArea);
      }

      const isImageScroll =
        shouldUpdateImages &&
        pointerArea &&
        pointerArea !== "middle";

      // 3-a: Scrolling inside image column
      if (isImageScroll) {
        const index = pointerArea! - 1; // 1→0, 2→1, 3→2
        const current = scrollValues[index];
        if (current === undefined) return;
        const newValue = current - delta;

        // Hit upper limit → switch back to main scroll
        if (newValue > 0) {
          setScrollValues(prev => {
            const copy = [...prev];
            copy[index] = 0;
            return copy;
          });
          setShouldUpdateImages(false);
          setMainScrollValue(v => v - delta);
        } else {

          setScrollValues(prev => {
            const current = prev[index] ?? 0;

            if (newValue < current) {
              if (!canScrollUp(index, newValue)) {
                return prev; // hard stop
              }
            }

            const copy = [...prev];
            copy[index] = newValue;
            return copy;
          });


        }
      }

      // 3-b: Middle section collapses
      else if (newMain < -collapseHeight) {
        setMainScrollValue(-collapseHeight);
        setShouldUpdateImages(true);
        setScrollArea(pointerArea); // recompute once more
      }

      // 3-c: Top reached
      else if (newMain > 0) {
        setMainScrollValue(0);
      }

      // 3-d: Normal scroll of middle section
      else {
        setMainScrollValue(v => v - delta);
        setShouldUpdateImages(false);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [imageRefs, mainScrollValue, middleSectionHeight, middledRef, scrollArea, scrollValues, shouldUpdateImages]);


  // -------------------------------------------
  // 4. Update DOM transforms
  // -------------------------------------------
  useEffect(() => {
    if (!middledRef.current) return;
    middledRef.current.style.transform = `translateY(${mainScrollValue}px)`;

    const getRemOffsetByScrollValue = (scrollValue: number): number => {
      return ((-31 / 466.666666) * scrollValue - 3);
    }
    const remOffset = getRemOffsetByScrollValue(mainScrollValue);

    middledRef.current.style.background =
      `linear-gradient(180deg, #96BFC5 ${remOffset}rem, #FFF 78rem)`;

    imageRefs.current.forEach((ref, index) => {
      if (!ref.current) return;
      const val = scrollValues[index];
      if (val === undefined) return;
      ref.current.style.transform = `translateY(${mainScrollValue + val}px)`;
    });
  }, [imageRefs, mainScrollValue, middledRef, scrollValues]);


  // -------------------------------------------
  // 5. Handlers (same API as before)
  // -------------------------------------------
  const onMouseEnter = (area: ScrollAreaType) => {
    setScrollArea(area);
  };

  const onMouseLeave = () => {
    setScrollArea(undefined);
  };

  return { onMouseEnter, onMouseLeave };
};
