import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
//import { useRafScrollEngine } from "./useRafScrollEngine";
import { useVelocityFingerScroll } from "./useVelocotyFingerScroll";
import { projectsStore } from "../stores/projecrStore";




// NOTE:
// This implementation favors simplicity and clarity.
// Sub-pixel quantization and delta gating were tested and
// did not provide meaningful UX improvement for this design.

export type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;

const applyScrollTransforms = (
  middleEl: HTMLDivElement | null,
  imageEls: (HTMLDivElement | null)[],
  mainScrollValue: number,
  imageOffsets: [number, number, number]
) => {
  if (!middleEl) return;

  middleEl.style.transform = `translateY(${mainScrollValue}px)`;
  const getRemOffsetByScrollValue = (scrollValue: number): number => {
    return ((-31 / 466.666666) * scrollValue - 3);
  }
  const remOffset = getRemOffsetByScrollValue(mainScrollValue);
  middleEl.style.background =
    `linear-gradient(180deg, #96BFC5 ${remOffset}rem, #FFF 78rem)`;

  imageEls.forEach((element, index) => {
    const val = imageOffsets[index];
    if (!element || val === undefined) return;
    element.style.transform = `translateY(${mainScrollValue + val}px)`;
  });

}

interface ImageScrollingProps {
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middledRef: React.RefObject<HTMLDivElement | null>;
  middleSectionHeight: number;
}



export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, middledRef, middleSectionHeight } = props;

  const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);
  const scrollValues = useRef<[number, number, number]>([0, 0, 0]);
  const mainScrollValue = useRef(0);
  const shouldUpdateImages = useRef(false);
  const rafScheduledRef = useRef(false);


  const compApplyScrollTransforms = useCallback((
  ) => {
    if (!middledRef.current) return;
    if (mainScrollValue.current === undefined) return;
    if (scrollValues.current === undefined) return;


    middledRef.current.style.transform = `translateY(${mainScrollValue.current}px)`;
    const getRemOffsetByScrollValue = (scrollValue: number): number => {
      return ((-31 / 466.666666) * scrollValue - 3);
    }
    const remOffset = getRemOffsetByScrollValue(mainScrollValue.current);
    middledRef.current.style.background =
      `linear-gradient(180deg, #96BFC5 ${remOffset}rem, #FFF 78rem)`;

    imageRefs.current.forEach((element, index) => {
      const val = scrollValues.current[index];
      if (!element.current || val === undefined) return;
      element.current.style.transform = `translateY(${mainScrollValue.current + val}px)`;
    });

  }, [imageRefs, middledRef])


  useLayoutEffect(() => {

    // update scroll values from MobX
    mainScrollValue.current = projectsStore.mainScrollValue;
    scrollValues.current = [...projectsStore.imagesScrollValues];

    
    compApplyScrollTransforms();

    // applyScrollTransforms(middledRef.current, 
    //   imageRefs.current.map(ref => ref.current),
    //   mainScrollValue.current, scrollValues.current);

    return (() => {
      // Save scroll values to MobX
      projectsStore.setMainScrollValue(mainScrollValue.current);
      projectsStore.setImageScrollValues(scrollValues.current)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } = useVelocityFingerScroll({
    onDeltaYScroll: (delta) => applyScroll(delta)
  });

  // const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } = useRafScrollEngine({
  //   onDeltaYScroll: (delta) => applyScroll(delta)
  // });

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
    if (!refs) return;
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (!ref?.current) continue;
      const el = ref.current;
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

    // Make sure the update run only once in each update frame
    const scheduleDomUpdate = () => {
      if (rafScheduledRef.current) return;
      rafScheduledRef.current = true;
      requestAnimationFrame(() => {
        rafScheduledRef.current = false;

        compApplyScrollTransforms();
        // applyScrollTransforms(middledRef.current, 
        //   imageRefs.current.map(ref => ref.current),
        //   mainScrollValue.current, scrollValues.current);
      });
    };

    const delta = deltaY;
    if (!middledRef.current) return;
    if (scrollValues.current === undefined) return;
    if (mainScrollValue.current === undefined) return;
    const newMain = mainScrollValue.current - delta;

    const rem = getPixelSizeByRem();
    const collapseHeight = middleSectionHeight * rem;

    // 👉 ALWAYS recompute scroll area based on pointer location

    let pointerArea: ScrollAreaType;
    if (!isTouchGestureActive) {
      pointerArea = detectAreaUnderPointer();
      if (pointerArea !== scrollArea) {
        setScrollArea(pointerArea);
      }
    }
    else {
      pointerArea = scrollArea;
    }

    const isImageScroll =
      shouldUpdateImages.current &&
      pointerArea &&
      pointerArea !== "middle";

    // 3-a: Scrolling inside image column
    if (isImageScroll) {

      const index = Number(pointerArea) - 1; // 1→0, 2→1, 3→2

      const current = scrollValues.current[index];
      if (current === undefined) return;

      const newValue = current - delta;

      // Hit upper limit → switch back to main scroll
      if (newValue > 0) {

        scrollValues.current[index] = 0;

        shouldUpdateImages.current = false;

        if (mainScrollValue.current - delta >= 0) {
          mainScrollValue.current = 0;
        }
        else {
          mainScrollValue.current = mainScrollValue.current - delta;
        }
      } else {

        const current = scrollValues.current[index];
        if (current === undefined) return;
        const proposed = current - delta;
        let scrollValue = proposed;

        if (proposed < current) {
          // Don't allow scrolling up the images too much
          // the last image must not go upeer from the window end
          scrollValue = getScrollUpValue(index, proposed, current);
        }

        scrollValues.current[index] = scrollValue;
      }
    }

    // 3-b: Middle section collapses
    else if (newMain < -collapseHeight) {
      mainScrollValue.current = -collapseHeight;
      shouldUpdateImages.current = true;
      setScrollArea(pointerArea); // recompute once more
    }

    // 3-c: Top reached
    else if (newMain > 0) {
      mainScrollValue.current = 0;
    }

    // 3-d: Normal scroll of middle section
    else {
      mainScrollValue.current = mainScrollValue.current - delta;
      shouldUpdateImages.current = false;
    }
    scheduleDomUpdate();
  }, [detectAreaUnderPointer, getScrollUpValue, isTouchGestureActive, middleSectionHeight, middledRef, scrollArea, shouldUpdateImages, compApplyScrollTransforms ]);

  // -------------------------------------------
  // 5. Handlers (same API as before)
  // -------------------------------------------
  const onMouseEnter = (area: ScrollAreaType) => {
    setScrollArea(area);
  };

  const onMouseLeave = () => {
    setScrollArea(undefined);
  };

  const handleTouchStart = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    setScrollArea(area);
    onTouchStart(e);
  }

  return {
    scrollArea,
    onMouseEnter,
    onMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel
  };
};

