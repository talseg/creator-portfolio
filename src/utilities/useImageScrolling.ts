import { useCallback, useEffect, useRef, useState } from "react";

interface ImageScrollingProps {
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middledRef: React.RefObject<HTMLDivElement | null>;
  middleSectionHeight: number;
}

export type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, middledRef, middleSectionHeight } = props;

  const [scrollArea, setScrollArea1] = useState<ScrollAreaType>(undefined);
  const [mainScrollValue, setMainScrollValue] = useState(0);
  const [scrollValues, setScrollValues] = useState([0, 0, 0]);
  const [shouldUpdateImages, setShouldUpdateImages] = useState(false);
  const lastTouchY = useRef<undefined | number>(undefined);

  const setScrollArea = (area: ScrollAreaType, from?: string) => {
    console.log(`Got setScrollArea to ${area} from: ${from}`)
    setScrollArea1(area);
  }



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












  const detectAreaUnderPointer = useCallback((): ScrollAreaType => {
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
  }, [imageRefs, middledRef]);

  const getScrollUpValue = useCallback((
    index: number,
    proposedValue: number,
    currentValue: number
  ): number => {
    const colRef = imageRefs.current[index];
    if (!colRef?.current) return currentValue;

    const rect = colRef.current.getBoundingClientRect();

    // Prevent a short list of images from scrolling
    if (rect.height < window.innerHeight)
      return currentValue;

    const projectedBottom = rect.bottom + (proposedValue - currentValue);

    // regular Image scrolling - accept the proposed value
    if (projectedBottom >= window.innerHeight)
      return proposedValue;

    // return the max allowed scroll up
    return window.innerHeight - rect.bottom + currentValue;
  }, [imageRefs]);

  const applyScroll = useCallback((deltaY: number) => {

    console.log(`Got applyScroll deltaY:${deltaY} scrollArea:${scrollArea}`);


    const delta = deltaY;
    if (!middledRef.current) return;
    const newMain = mainScrollValue - delta;

    const rem = getPixelSizeByRem();
    const collapseHeight = middleSectionHeight * rem;

    // 👉 ALWAYS recompute scroll area based on pointer location

    let pointerArea: ScrollAreaType;
    if (lastTouchY.current === undefined) {
      pointerArea = detectAreaUnderPointer();
      if (pointerArea !== scrollArea) {
        setScrollArea(pointerArea, "detectAreaUnderPointer");
      }
    }
    else {
      pointerArea = scrollArea;
    }



    const isImageScroll =
      shouldUpdateImages &&
      pointerArea &&
      pointerArea !== "middle";


    // 3-a: Scrolling inside image column
    if (isImageScroll) {



      const index = Number(pointerArea) - 1; // 1→0, 2→1, 3→2



      const current = scrollValues[index];
      if (current === undefined) return;
      const newValue = current - delta;


      console.log(`Scrolling Images of ${index} current:${current} delta:${delta} new:${newValue}`);

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

        console.log(`setScrollValues of ${index} to ${newValue}`);
        setScrollValues(prev => {

          const current = prev[index] ?? 0;
          let scrollValue = newValue;

          if (newValue < current) {
            // Don't allow scrolling up the images too much
            // the last image must not go upeer from the window end
            scrollValue = getScrollUpValue(index, newValue, current);
          }

          const copy = [...prev];
          copy[index] = scrollValue;
          return copy;
        });
      }
    }

    // 3-b: Middle section collapses
    else if (newMain < -collapseHeight) {
      setMainScrollValue(-collapseHeight);
      setShouldUpdateImages(true);
      setScrollArea(pointerArea, "middle Section "); // recompute once more
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
  }, [detectAreaUnderPointer, getScrollUpValue, mainScrollValue,
    middleSectionHeight, middledRef, scrollArea, scrollValues, shouldUpdateImages]);



  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    applyScroll(e.deltaY);
  }, [applyScroll]);

  const onTouchStart = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    setScrollArea(area, "onTouchStart");
    if (e.touches.length === 2) {
      lastTouchY.current = e.touches[0]?.clientY;
      //console.log(`touchStarted on area ${area}`);
    }
  }

  const onTouchMove = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    if (lastTouchY.current === undefined) return;
    if (e.touches.length !== 2 || e.touches[0] === undefined) return;
    const currentY = e.touches[0].clientY;
    const delta = lastTouchY.current - currentY;
    if (delta === 0) return;
    lastTouchY.current = currentY;
    console.log(`applyScroll(${delta})`);
    applyScroll(delta);
  }


  const onTouchEnd = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    lastTouchY.current = undefined;
  }

  // -------------------------------------------
  // 3. Wheel scroll: main logic
  // -------------------------------------------
  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onWheel]);


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
    setScrollArea(area, "onMouseEnter ");
  };

  const onMouseLeave = () => {
    setScrollArea(undefined, "onMouseLeave");
  };






  return { onMouseEnter, onMouseLeave, scrollArea, onTouchStart, onTouchEnd, onTouchMove };
};
