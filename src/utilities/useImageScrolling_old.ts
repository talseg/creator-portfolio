import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
//import { useRafScrollEngine } from "./useRafScrollEngine";
import { useVelocityFingerScroll } from "./useVelocotyFingerScroll";
import { projectsStore } from "../stores/projecrStore";

// NOTE:
// This implementation favors simplicity and clarity.
// Sub-pixel quantization and delta gating were tested and
// did not provide meaningful UX improvement for this design.

export type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;

interface ImageScrollingProps {
  // Top moving container
  middledRef: React.RefObject<HTMLDivElement | null>;
  // bottom images containers
  imageContainerRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  // moving images inside the bottom container
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middleSectionHeight: number;
}

type MachineStateType = { scrollArea: ScrollAreaType, isMiddleCollapsed: boolean};

export const useImageScrolling = (props: ImageScrollingProps) => {

  const getInitialState = (): MachineStateType => {
    return { scrollArea: undefined, isMiddleCollapsed: false };
  }

  const { imageRefs, imageContainerRefs, middledRef, middleSectionHeight } = props;
  const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);
  const [machineState, setMachineState] = useState<MachineStateType>(getInitialState())
  const scrollValues = useRef<[number, number, number]>([0, 0, 0]);
  const mainScrollValue = useRef(0);
  const shouldUpdateImages = useRef(false);
  const rafScheduledRef = useRef(false);


  const applyScrollTransforms = useCallback((
  ) => {
    if (!middledRef.current) return;
    if (mainScrollValue.current === undefined) return;
    if (scrollValues.current === undefined) return;

    // const getRemOffsetByScrollValue = (scrollValue: number): number => {
    //   return ((-31 / 466.666666) * scrollValue - 3);
    // }
    // const remOffset = getRemOffsetByScrollValue(mainScrollValue.current);
    // middledRef.current.style.background =
    //   `linear-gradient(180deg, #96BFC5 ${remOffset}rem, #FFF 78rem)`;


    middledRef.current.style.transform = `translateY(${mainScrollValue.current}px)`;

    imageContainerRefs.current.forEach((element, index) => {
      const val = scrollValues.current[index];
      if (!element.current || val === undefined) return;
      element.current.style.transform = `translateY(${mainScrollValue.current}px)`;
    });

    imageRefs.current.forEach((element, index) => {
      const val = scrollValues.current[index];
      if (!element.current || val === undefined) return;
      element.current.style.transform = `translateY(${val}px)`;
    });

  }, [imageRefs, imageContainerRefs, middledRef]);

  useLayoutEffect(() => {

    // update scroll values from MobX
    mainScrollValue.current = projectsStore.mainScrollValue;
    scrollValues.current = [...projectsStore.imagesScrollValues];
    applyScrollTransforms();

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
    const refs = imageContainerRefs.current;
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
  }, [imageContainerRefs, middledRef]);

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

  const scheduleDomUpdate = () => {
    if (rafScheduledRef.current) return;
    rafScheduledRef.current = true;
    requestAnimationFrame(() => {
      rafScheduledRef.current = false;
      applyScrollTransforms();
    });
  };

  if (!middledRef.current) return;

  const delta = deltaY;

  const rem = getPixelSizeByRem();
  const collapseHeight = middleSectionHeight * rem;

  const direction = delta > 0 ? "up" : "down";

  // ------------------------------------
  // Determine pointer area
  // ------------------------------------
  let pointerArea: ScrollAreaType;

  if (!isTouchGestureActive) {
    pointerArea = detectAreaUnderPointer();
    if (pointerArea !== scrollArea) {
      setScrollArea(pointerArea);
    }
  } else {
    pointerArea = scrollArea;
  }

  const columnIndex =
    pointerArea === 1 || pointerArea === 2 || pointerArea === 3
      ? pointerArea - 1
      : undefined;

  const newMain = mainScrollValue.current - delta;

  const isCollapsed = mainScrollValue.current <= -collapseHeight;

  const stateKey =
    `${pointerArea ?? "none"}_${isCollapsed ? "collapsed" : "open"}`;

  // ------------------------------------
  // STATE MACHINE
  // ------------------------------------

  switch (stateKey) {

    //------------------------------------
    // Pointer outside / undefined
    //------------------------------------

    case "none_open":
    case "none_collapsed":
    case "middle_open":
    case "middle_collapsed": {

      // 3-b collapse
      if (newMain < -collapseHeight) {
        mainScrollValue.current = -collapseHeight;
        shouldUpdateImages.current = true;
        setMachineState({ scrollArea: pointerArea, isMiddleCollapsed: true });
      }

      // 3-c top reached
      else if (newMain > 0) {
        mainScrollValue.current = 0;
      }

      // normal main scroll
      else {
        mainScrollValue.current -= delta;
        shouldUpdateImages.current = false;
      }

      break;
    }

    //------------------------------------
    // Pointer inside column while
    // middle NOT collapsed
    //------------------------------------

    case "1_open":
    case "2_open":
    case "3_open": {

      // same behaviour as original code
      if (newMain < -collapseHeight) {
        mainScrollValue.current = -collapseHeight;
        shouldUpdateImages.current = true;
        setMachineState({
          scrollArea: pointerArea,
          isMiddleCollapsed: true
        });
      }

      else if (newMain > 0) {
        mainScrollValue.current = 0;
      }

      else {
        mainScrollValue.current -= delta;
        shouldUpdateImages.current = false;
      }

      break;
    }

    //------------------------------------
    // Pointer inside column
    // and middle collapsed
    //------------------------------------

    case "1_collapsed":
    case "2_collapsed":
    case "3_collapsed": {

      if (columnIndex === undefined) break;

      const current = scrollValues.current[columnIndex];
      if (current === undefined) break;

      const proposed = current - delta;

      // hit upper bound -> switch back to main scroll
      if (proposed > 0) {

        scrollValues.current[columnIndex] = 0;

        shouldUpdateImages.current = false;

        if (mainScrollValue.current - delta >= 0) {
          mainScrollValue.current = 0;
        } else {
          mainScrollValue.current -= delta;
        }

      } else {

        let scrollValue = proposed;

        if (direction === "down") {
          scrollValue = getScrollUpValue(columnIndex, proposed, current);
        }

        scrollValues.current[columnIndex] = scrollValue;
      }

      break;
    }

  }

  scheduleDomUpdate();

}, [
  detectAreaUnderPointer,
  getScrollUpValue,
  isTouchGestureActive,
  middleSectionHeight,
  scrollArea,
  applyScrollTransforms, middledRef
]);
  
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

  const onResetScrolls = () => {
    if (mainScrollValue.current === undefined) return;
    if (scrollValues.current === undefined) return;
    mainScrollValue.current = 0;
    scrollValues.current = [0, 0, 0];
    shouldUpdateImages.current = false;
    applyScrollTransforms();
  }

  return {
    scrollArea,
    onMouseEnter,
    onMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel,
    onResetScrolls
  };
};

