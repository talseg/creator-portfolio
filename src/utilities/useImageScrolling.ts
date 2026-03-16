import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useRafScrollEngine } from "./useRafScrollEngine";
import { useVelocityFingerScroll } from "./useVelocotyFingerScroll";
import { projectsStore } from "../stores/projecrStore";

// NOTE:
// This implementation favors simplicity and clarity.
// Sub-pixel quantization and delta gating were tested and
// did not provide meaningful UX improvement for this design.

export type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;
type ActiveScrollTarget = "main" | "images";

interface ImageScrollingProps {
  // Top moving container
  middledRef: React.RefObject<HTMLDivElement | null>;
  // Bottom image containers
  imageContainerRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  // Moving images inside the bottom containers
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middleSectionHeight: number;
}

const SCROLL_STATE = {
  NONE_OPEN: "none_open",
  NONE_COLLAPSED: "none_collapsed",
  MIDDLE_OPEN: "middle_open",
  MIDDLE_COLLAPSED: "middle_collapsed",
  COLUMN_1_OPEN: "1_open",
  COLUMN_1_COLLAPSED: "1_collapsed",
  COLUMN_2_OPEN: "2_open",
  COLUMN_2_COLLAPSED: "2_collapsed",
  COLUMN_3_OPEN: "3_open",
  COLUMN_3_COLLAPSED: "3_collapsed",
} as const;

type StateKey = (typeof SCROLL_STATE)[keyof typeof SCROLL_STATE];

interface ScrollContext {
  delta: number;
  proposedMainScrollValue: number;
  collapseHeight: number;
  pointerArea: ScrollAreaType;
  activeColumnIndex: number | undefined;
  isMiddleCollapsed: boolean;
  stateKey: StateKey;
}

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, imageContainerRefs, middledRef, middleSectionHeight } = props;

  const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);

  const imageScrollValuesRef = useRef<[number, number, number]>([0, 0, 0]);
  const mainScrollValueRef = useRef(0);
  const activeScrollTargetRef = useRef<ActiveScrollTarget>("main");
  const rafScheduledRef = useRef(false);

  const applyScrollTransforms = useCallback(() => {
    if (!middledRef.current) return;

    middledRef.current.style.transform = `translateY(${mainScrollValueRef.current}px)`;

    imageContainerRefs.current.forEach((elementRef) => {
      if (!elementRef.current) return;
      elementRef.current.style.transform = `translateY(${mainScrollValueRef.current}px)`;
    });

    imageRefs.current.forEach((elementRef, index) => {
      const imageScrollValue = imageScrollValuesRef.current[index];
      if (!elementRef.current || imageScrollValue === undefined) return;
      elementRef.current.style.transform = `translateY(${imageScrollValue}px)`;
    });
  }, [imageRefs, imageContainerRefs, middledRef]);

  useLayoutEffect(() => {
    mainScrollValueRef.current = projectsStore.mainScrollValue;
    imageScrollValuesRef.current = [...projectsStore.imagesScrollValues];
    applyScrollTransforms();

    return () => {
      projectsStore.setMainScrollValue(mainScrollValueRef.current);
      projectsStore.setImageScrollValues(imageScrollValuesRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } =
    useVelocityFingerScroll({
      onDeltaYScroll: (delta) => applyScroll(delta),
    });

  // Store last mouse position so we can use it on scroll
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const getPixelSizeByRem = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize);

  const onMouseMove = (e: MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const detectAreaUnderPointer = useCallback((): ScrollAreaType => {
    const position = mousePosRef.current;
    if (!position) return undefined;

    const { x, y } = position;

    if (middledRef.current) {
      const rect = middledRef.current.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return "middle";
      }
    }

    const refs = imageContainerRefs.current;
    for (let index = 0; index < refs.length; index++) {
      const ref = refs[index];
      if (!ref?.current) continue;

      const rect = ref.current.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return (index + 1) as ScrollAreaType;
      }
    }

    return undefined;
  }, [imageContainerRefs, middledRef]);

  const getClampedImageScrollValue = useCallback(
    (
      columnIndex: number,
      proposedImageScrollValue: number,
      currentImageScrollValue: number
    ): number => {
      const columnRef = imageRefs.current[columnIndex];
      if (!columnRef?.current) return currentImageScrollValue;

      const rect = columnRef.current.getBoundingClientRect();

      // Prevent a short list of images from scrolling
      if (rect.height < window.innerHeight) {
        return currentImageScrollValue;
      }

      const projectedBottom = rect.bottom + (proposedImageScrollValue - currentImageScrollValue);

      // Regular image scrolling - accept the proposed value
      if (projectedBottom >= window.innerHeight) {
        return proposedImageScrollValue;
      }

      // Return the maximum allowed upward scroll
      return window.innerHeight - rect.bottom + currentImageScrollValue;
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

  const getScrollContext = useCallback((): ScrollContext => {
    const rem = getPixelSizeByRem();
    const collapseHeight = middleSectionHeight * rem;

    let pointerArea: ScrollAreaType;

    if (!isTouchGestureActive) {
      pointerArea = detectAreaUnderPointer();
      if (pointerArea !== scrollArea) {
        setScrollArea(pointerArea);
      }
    } else {
      pointerArea = scrollArea;
    }

    const activeColumnIndex =
      pointerArea === 1 || pointerArea === 2 || pointerArea === 3
        ? pointerArea - 1
        : undefined;

    const isMiddleCollapsed = mainScrollValueRef.current <= -collapseHeight;
    const stateKey = getStateKey(pointerArea, isMiddleCollapsed);

    return {
      delta: 0,
      proposedMainScrollValue: 0,
      collapseHeight,
      pointerArea,
      activeColumnIndex,
      isMiddleCollapsed,
      stateKey,
    };
  }, [detectAreaUnderPointer, getStateKey, isTouchGestureActive, middleSectionHeight, scrollArea]);

  const scheduleDomUpdate = useCallback(() => {
    if (rafScheduledRef.current) return;
    rafScheduledRef.current = true;
    requestAnimationFrame(() => {
      rafScheduledRef.current = false;
      applyScrollTransforms();
    });
  }, [applyScrollTransforms]);

  const collapseMainToLimit = useCallback((collapseHeight: number) => {
    mainScrollValueRef.current = -collapseHeight;
    activeScrollTargetRef.current = "images";
  }, []);

  const clampMainToTop = useCallback(() => {
    mainScrollValueRef.current = 0;
    activeScrollTargetRef.current = "main";
  }, []);

  const scrollMainNormally = useCallback((proposedMainScrollValue: number) => {
    mainScrollValueRef.current = proposedMainScrollValue;
    activeScrollTargetRef.current = "main";
  }, []);

  const applyMainScroll = useCallback(
    (proposedMainScrollValue: number, collapseHeight: number) => {
      if (proposedMainScrollValue < -collapseHeight) {
        collapseMainToLimit(collapseHeight);
      } else if (proposedMainScrollValue > 0) {
        clampMainToTop();
      } else {
        scrollMainNormally(proposedMainScrollValue);
      }
    },
    [clampMainToTop, collapseMainToLimit, scrollMainNormally]
  );

  const switchFromImageScrollBackToMain = useCallback(
    (columnIndex: number, delta: number) => {
      imageScrollValuesRef.current[columnIndex] = 0;
      activeScrollTargetRef.current = "main";

      if (mainScrollValueRef.current - delta >= 0) {
        mainScrollValueRef.current = 0;
      } else {
        mainScrollValueRef.current = mainScrollValueRef.current - delta;
      }
    },
    []
  );

  const scrollActiveImageColumn = useCallback(
    (columnIndex: number, delta: number) => {
      const currentImageScrollValue = imageScrollValuesRef.current[columnIndex];
      if (currentImageScrollValue === undefined) return;

      const proposedImageScrollValue = currentImageScrollValue - delta;

      // Hit upper limit -> switch back to main scroll
      if (proposedImageScrollValue > 0) {
        switchFromImageScrollBackToMain(columnIndex, delta);
        return;
      }

      let nextImageScrollValue = proposedImageScrollValue;

      // Keep original behavior:
      // when the proposed value moves the image further up,
      // clamp it so the last image does not scroll too far.
      if (proposedImageScrollValue < currentImageScrollValue) {
        nextImageScrollValue = getClampedImageScrollValue(
          columnIndex,
          proposedImageScrollValue,
          currentImageScrollValue
        );
      }

      imageScrollValuesRef.current[columnIndex] = nextImageScrollValue;
    },
    [getClampedImageScrollValue, switchFromImageScrollBackToMain]
  );

  const applyScroll = useCallback(
    (deltaY: number) => {
      if (!middledRef.current) return;

      const baseContext = getScrollContext();

      const scrollContext: ScrollContext = {
        ...baseContext,
        delta: deltaY,
        proposedMainScrollValue: mainScrollValueRef.current - deltaY,
      };

      const {
        delta,
        proposedMainScrollValue,
        collapseHeight,
        pointerArea,
        activeColumnIndex,
        stateKey,
      } = scrollContext;

      switch (stateKey) {
        // -------------------------------------------
        // Main-area scrolling states
        // -------------------------------------------
        case SCROLL_STATE.NONE_OPEN:
        case SCROLL_STATE.NONE_COLLAPSED:
        case SCROLL_STATE.MIDDLE_OPEN:
        case SCROLL_STATE.MIDDLE_COLLAPSED: {
          applyMainScroll(proposedMainScrollValue, collapseHeight);
          break;
        }

        // -------------------------------------------
        // Column is hovered, but main still owns scrolling
        // -------------------------------------------
        case SCROLL_STATE.COLUMN_1_OPEN:
        case SCROLL_STATE.COLUMN_2_OPEN:
        case SCROLL_STATE.COLUMN_3_OPEN: {
          applyMainScroll(proposedMainScrollValue, collapseHeight);
          break;
        }

        // -------------------------------------------
        // Column is hovered, and image list may own scrolling
        // -------------------------------------------
        case SCROLL_STATE.COLUMN_1_COLLAPSED:
        case SCROLL_STATE.COLUMN_2_COLLAPSED:
        case SCROLL_STATE.COLUMN_3_COLLAPSED: {
          if (activeColumnIndex === undefined) {
            break;
          }

          const shouldScrollImages =
            activeScrollTargetRef.current === "images" &&
            pointerArea !== undefined &&
            pointerArea !== "middle";

          if (!shouldScrollImages) {
            applyMainScroll(proposedMainScrollValue, collapseHeight);
            break;
          }

          scrollActiveImageColumn(activeColumnIndex, delta);
          break;
        }
      }

      scheduleDomUpdate();
    },
    [
      applyMainScroll,
      getScrollContext,
      middledRef,
      scheduleDomUpdate,
      scrollActiveImageColumn,
    ]
  );

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
    mainScrollValueRef.current = 0;
    imageScrollValuesRef.current = [0, 0, 0];
    activeScrollTargetRef.current = "main";
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