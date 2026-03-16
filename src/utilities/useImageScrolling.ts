import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useRafScrollEngine } from "./useRafScrollEngine";
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
  // Bottom image containers
  imageContainerRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  // Moving images inside the bottom containers
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middleSectionHeight: number;
}

type StateKey =
  | "none_open"
  | "none_collapsed"
  | "middle_open"
  | "middle_collapsed"
  | "1_open"
  | "1_collapsed"
  | "2_open"
  | "2_collapsed"
  | "3_open"
  | "3_collapsed";

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, imageContainerRefs, middledRef, middleSectionHeight } = props;

  const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);

  const scrollValues = useRef<[number, number, number]>([0, 0, 0]);
  const mainScrollValue = useRef(0);
  const shouldUpdateImages = useRef(false);
  const rafScheduledRef = useRef(false);

  const applyScrollTransforms = useCallback(() => {
    if (!middledRef.current) return;

    middledRef.current.style.transform = `translateY(${mainScrollValue.current}px)`;

    imageContainerRefs.current.forEach((element) => {
      if (!element.current) return;
      element.current.style.transform = `translateY(${mainScrollValue.current}px)`;
    });

    imageRefs.current.forEach((element, index) => {
      const val = scrollValues.current[index];
      if (!element.current || val === undefined) return;
      element.current.style.transform = `translateY(${val}px)`;
    });
  }, [imageRefs, imageContainerRefs, middledRef]);

  useLayoutEffect(() => {
    // Restore scroll values from MobX
    mainScrollValue.current = projectsStore.mainScrollValue;
    scrollValues.current = [...projectsStore.imagesScrollValues];
    applyScrollTransforms();

    return () => {
      // Save scroll values to MobX
      projectsStore.setMainScrollValue(mainScrollValue.current);
      projectsStore.setImageScrollValues(scrollValues.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } =
    useVelocityFingerScroll({
      onDeltaYScroll: (delta) => applyScroll(delta),
    });

  // const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } =
  //   useRafScrollEngine({
  //     onDeltaYScroll: (delta) => applyScroll(delta),
  //   });

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

      const r = ref.current.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return (i + 1) as ScrollAreaType;
      }
    }

    return undefined;
  }, [imageContainerRefs, middledRef]);

  const getScrollUpValue = useCallback(
    (index: number, proposedValue: number, currentValue: number): number => {
      const colRef = imageRefs.current[index];
      if (!colRef?.current) return currentValue;

      const rect = colRef.current.getBoundingClientRect();

      // Prevent a short list of images from scrolling
      if (rect.height < window.innerHeight) {
        return currentValue;
      }

      const projectedBottom = rect.bottom + (proposedValue - currentValue);

      // Regular image scrolling - accept the proposed value
      if (projectedBottom >= window.innerHeight) {
        return proposedValue;
      }

      // Return the max allowed scroll up
      return window.innerHeight - rect.bottom + currentValue;
    },
    [imageRefs]
  );

  const getStateKey = useCallback(
    (area: ScrollAreaType, isMiddleCollapsed: boolean): StateKey => {
      const areaKey = area ?? "none";
      return `${areaKey}_${isMiddleCollapsed ? "collapsed" : "open"}` as StateKey;
    },
    []
  );

  const applyMainScroll = useCallback(
    (
      newMain: number,
      collapseHeight: number,
      nextShouldUpdateImages: boolean = false
    ) => {
      if (newMain < -collapseHeight) {
        mainScrollValue.current = -collapseHeight;
        shouldUpdateImages.current = true;
      } else if (newMain > 0) {
        mainScrollValue.current = 0;
        shouldUpdateImages.current = false;
      } else {
        mainScrollValue.current = newMain;
        shouldUpdateImages.current = nextShouldUpdateImages;
      }
    },
    []
  );

  const applyScroll = useCallback(
    (deltaY: number) => {
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
      const newMain = mainScrollValue.current - delta;

      const rem = getPixelSizeByRem();
      const collapseHeight = middleSectionHeight * rem;

      // Always recompute scroll area from pointer, except during touch gesture
      let pointerArea: ScrollAreaType;
      if (!isTouchGestureActive) {
        pointerArea = detectAreaUnderPointer();
        if (pointerArea !== scrollArea) {
          setScrollArea(pointerArea);
        }
      } else {
        pointerArea = scrollArea;
      }

      const isMiddleCollapsed = mainScrollValue.current <= -collapseHeight;
      const stateKey = getStateKey(pointerArea, isMiddleCollapsed);

      const columnIndex =
        pointerArea === 1 || pointerArea === 2 || pointerArea === 3
          ? pointerArea - 1
          : undefined;

      switch (stateKey) {
        // -------------------------------------------
        // Pointer is not in an image column
        // -------------------------------------------
        case "none_open":
        case "none_collapsed":
        case "middle_open":
        case "middle_collapsed": {
          applyMainScroll(newMain, collapseHeight, false);
          break;
        }

        // -------------------------------------------
        // Pointer is in an image column,
        // but middle area is not collapsed yet.
        // Old behavior: still scroll main area.
        // -------------------------------------------
        case "1_open":
        case "2_open":
        case "3_open": {
          if (newMain < -collapseHeight) {
            mainScrollValue.current = -collapseHeight;
            shouldUpdateImages.current = true;
          } else if (newMain > 0) {
            mainScrollValue.current = 0;
            shouldUpdateImages.current = false;
          } else {
            mainScrollValue.current = newMain;
            shouldUpdateImages.current = false;
          }

          break;
        }

        // -------------------------------------------
        // Pointer is in an image column
        // and middle is collapsed
        // -------------------------------------------
        case "1_collapsed":
        case "2_collapsed":
        case "3_collapsed": {
          if (columnIndex === undefined) {
            break;
          }

          const current = scrollValues.current[columnIndex];
          if (current === undefined) {
            break;
          }

          const isImageScroll =
            shouldUpdateImages.current && pointerArea !== undefined && pointerArea !== "middle";

          // Match old behavior:
          // if shouldUpdateImages is false, continue scrolling main
          if (!isImageScroll) {
            applyMainScroll(newMain, collapseHeight, false);
            break;
          }

          const proposed = current - delta;

          // Hit upper limit -> switch back to main scroll
          if (proposed > 0) {
            scrollValues.current[columnIndex] = 0;
            shouldUpdateImages.current = false;

            if (mainScrollValue.current - delta >= 0) {
              mainScrollValue.current = 0;
            } else {
              mainScrollValue.current = mainScrollValue.current - delta;
            }
          } else {
            let nextImageScrollValue = proposed;

            // Keep original behavior:
            // when the proposed value moves the image further up,
            // clamp it so the last image does not scroll too far.
            if (proposed < current) {
              nextImageScrollValue = getScrollUpValue(columnIndex, proposed, current);
            }

            scrollValues.current[columnIndex] = nextImageScrollValue;
          }

          break;
        }
      }

      scheduleDomUpdate();
    },
    [
      applyMainScroll,
      applyScrollTransforms,
      detectAreaUnderPointer,
      getScrollUpValue,
      getStateKey,
      isTouchGestureActive,
      middleSectionHeight,
      middledRef,
      scrollArea,
    ]
  );

  // -------------------------------------------
  // 5. Handlers
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
  };

  const onResetScrolls = () => {
    mainScrollValue.current = 0;
    scrollValues.current = [0, 0, 0];
    shouldUpdateImages.current = false;
    setScrollArea(undefined);
    applyScrollTransforms();
  };

  return {
    scrollArea,
    onMouseEnter,
    onMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel,
    onResetScrolls,
  };
};