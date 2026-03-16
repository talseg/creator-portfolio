import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useRafScrollEngine } from "./useRafScrollEngine";
import { useVelocityFingerScroll } from "./useVelocotyFingerScroll";
import { projectsStore } from "../stores/projecrStore";

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
  pointerArea: ScrollAreaType;
  activeColumnIndex: number | undefined;
  collapseHeight: number;
  isMiddleCollapsed: boolean;
  proposedMainScrollValue: number;
  stateKey: StateKey;
}

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, imageContainerRefs, middledRef, middleSectionHeight } = props;

  // UI-facing hover state
  const [hoveredArea, setHoveredArea] = useState<ScrollAreaType>(undefined);

  // High-frequency motion values stay in refs
  const mainScrollValueRef = useRef(0);
  const imageScrollValuesRef = useRef<[number, number, number]>([0, 0, 0]);

  // Keeps the old behavior explicit:
  // after the main area fully collapses, scrolling can move to image columns.
  const activeScrollTargetRef = useRef<ActiveScrollTarget>("main");

  const rafScheduledRef = useRef(false);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const getPixelSizeByRem = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize);

  const applyScrollTransforms = useCallback(() => {
    if (!middledRef.current) return;

    middledRef.current.style.transform = `translateY(${mainScrollValueRef.current}px)`;

    imageContainerRefs.current.forEach((containerRef) => {
      if (!containerRef.current) return;
      containerRef.current.style.transform = `translateY(${mainScrollValueRef.current}px)`;
    });

    imageRefs.current.forEach((imageRef, index) => {
      const imageScrollValue = imageScrollValuesRef.current[index];
      if (!imageRef.current || imageScrollValue === undefined) return;
      imageRef.current.style.transform = `translateY(${imageScrollValue}px)`;
    });
  }, [imageContainerRefs, imageRefs, middledRef]);

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

    for (let index = 0; index < imageContainerRefs.current.length; index++) {
      const containerRef = imageContainerRefs.current[index];
      if (!containerRef?.current) continue;

      const rect = containerRef.current.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return (index + 1) as ScrollAreaType;
      }
    }

    return undefined;
  }, [imageContainerRefs, middledRef]);

  const getStateKey = useCallback(
    (area: ScrollAreaType, isMiddleCollapsed: boolean): StateKey => {
      const areaKey = area ?? "none";
      return `${areaKey}_${isMiddleCollapsed ? "collapsed" : "open"}` as StateKey;
    },
    []
  );

  const buildScrollContext = useCallback(
    (deltaY: number, pointerArea: ScrollAreaType): ScrollContext => {
      const collapseHeight = middleSectionHeight * getPixelSizeByRem();
      const activeColumnIndex =
        pointerArea === 1 || pointerArea === 2 || pointerArea === 3
          ? pointerArea - 1
          : undefined;
      const isMiddleCollapsed = mainScrollValueRef.current <= -collapseHeight;
      const proposedMainScrollValue = mainScrollValueRef.current - deltaY;

      return {
        delta: deltaY,
        pointerArea,
        activeColumnIndex,
        collapseHeight,
        isMiddleCollapsed,
        proposedMainScrollValue,
        stateKey: getStateKey(pointerArea, isMiddleCollapsed),
      };
    },
    [getStateKey, middleSectionHeight]
  );

  const getClampedImageScrollValue = useCallback(
    (
      columnIndex: number,
      proposedImageScrollValue: number,
      currentImageScrollValue: number
    ): number => {
      const columnRef = imageRefs.current[columnIndex];
      if (!columnRef?.current) return currentImageScrollValue;

      const rect = columnRef.current.getBoundingClientRect();

      // Do not scroll short image lists.
      if (rect.height < window.innerHeight) {
        return currentImageScrollValue;
      }

      const projectedBottom =
        rect.bottom + (proposedImageScrollValue - currentImageScrollValue);

      if (projectedBottom >= window.innerHeight) {
        return proposedImageScrollValue;
      }

      return window.innerHeight - rect.bottom + currentImageScrollValue;
    },
    [imageRefs]
  );

  const scheduleDomUpdate = useCallback(() => {
    if (rafScheduledRef.current) return;

    rafScheduledRef.current = true;
    requestAnimationFrame(() => {
      rafScheduledRef.current = false;
      applyScrollTransforms();
    });
  }, [applyScrollTransforms]);

  const setMainScrollToTop = useCallback(() => {
    mainScrollValueRef.current = 0;
    activeScrollTargetRef.current = "main";
  }, []);

  const setMainScrollToCollapseLimit = useCallback((collapseHeight: number) => {
    mainScrollValueRef.current = -collapseHeight;
    activeScrollTargetRef.current = "images";
  }, []);

  const setMainScrollNormally = useCallback((proposedMainScrollValue: number) => {
    mainScrollValueRef.current = proposedMainScrollValue;
    activeScrollTargetRef.current = "main";
  }, []);

  const applyMainScroll = useCallback(
    (proposedMainScrollValue: number, collapseHeight: number) => {
      if (proposedMainScrollValue < -collapseHeight) {
        setMainScrollToCollapseLimit(collapseHeight);
      } else if (proposedMainScrollValue > 0) {
        setMainScrollToTop();
      } else {
        setMainScrollNormally(proposedMainScrollValue);
      }
    },
    [setMainScrollNormally, setMainScrollToCollapseLimit, setMainScrollToTop]
  );

  const switchFromImageScrollToMain = useCallback((columnIndex: number, delta: number) => {
    imageScrollValuesRef.current[columnIndex] = 0;
    activeScrollTargetRef.current = "main";

    const proposedMainScrollValue = mainScrollValueRef.current - delta;
    if (proposedMainScrollValue >= 0) {
      mainScrollValueRef.current = 0;
    } else {
      mainScrollValueRef.current = proposedMainScrollValue;
    }
  }, []);

  const scrollActiveImageColumn = useCallback(
    (columnIndex: number, delta: number) => {
      const currentImageScrollValue = imageScrollValuesRef.current[columnIndex];
      if (currentImageScrollValue === undefined) return;

      const proposedImageScrollValue = currentImageScrollValue - delta;

      // When image scroll crosses back above zero, return control to main scroll.
      if (proposedImageScrollValue > 0) {
        switchFromImageScrollToMain(columnIndex, delta);
        return;
      }

      let nextImageScrollValue = proposedImageScrollValue;

      // Keep the original behavior:
      // clamp upward image movement so the last image does not overshoot upward.
      if (proposedImageScrollValue < currentImageScrollValue) {
        nextImageScrollValue = getClampedImageScrollValue(
          columnIndex,
          proposedImageScrollValue,
          currentImageScrollValue
        );
      }

      imageScrollValuesRef.current[columnIndex] = nextImageScrollValue;
    },
    [getClampedImageScrollValue, switchFromImageScrollToMain]
  );

  const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } =
    useVelocityFingerScroll({
      onDeltaYScroll: (delta) => applyScroll(delta),
    });

  const getEffectivePointerArea = useCallback((): ScrollAreaType => {
    if (isTouchGestureActive) {
      return hoveredArea;
    }

    return detectAreaUnderPointer();
  }, [detectAreaUnderPointer, hoveredArea, isTouchGestureActive]);

  const applyScroll = useCallback(
    (deltaY: number) => {
      if (!middledRef.current) return;

      const pointerArea = getEffectivePointerArea();

      // Keep the render-facing hover state in sync with the latest pointer detection.
      if (!isTouchGestureActive && pointerArea !== hoveredArea) {
        setHoveredArea(pointerArea);
      }

      const scrollContext = buildScrollContext(deltaY, pointerArea);
      const {
        delta,
        pointerArea: contextPointerArea,
        activeColumnIndex,
        collapseHeight,
        proposedMainScrollValue,
        stateKey,
      } = scrollContext;

      switch (stateKey) {
        // Pointer is outside the image columns, or over the middle area:
        // scrolling always affects the main section.
        case SCROLL_STATE.NONE_OPEN:
        case SCROLL_STATE.NONE_COLLAPSED:
        case SCROLL_STATE.MIDDLE_OPEN:
        case SCROLL_STATE.MIDDLE_COLLAPSED: {
          applyMainScroll(proposedMainScrollValue, collapseHeight);
          break;
        }

        // Pointer is over a column, but the middle section is not collapsed yet:
        // old behavior says main still owns the scroll.
        case SCROLL_STATE.COLUMN_1_OPEN:
        case SCROLL_STATE.COLUMN_2_OPEN:
        case SCROLL_STATE.COLUMN_3_OPEN: {
          applyMainScroll(proposedMainScrollValue, collapseHeight);
          break;
        }

        // Pointer is over a column and the middle section is collapsed:
        // image scrolling is allowed only when the current runtime mode says so.
        case SCROLL_STATE.COLUMN_1_COLLAPSED:
        case SCROLL_STATE.COLUMN_2_COLLAPSED:
        case SCROLL_STATE.COLUMN_3_COLLAPSED: {
          if (activeColumnIndex === undefined) {
            break;
          }

          const shouldScrollImages =
            activeScrollTargetRef.current === "images" &&
            contextPointerArea !== undefined &&
            contextPointerArea !== "middle";

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
      buildScrollContext,
      getEffectivePointerArea,
      hoveredArea,
      isTouchGestureActive,
      middledRef,
      scheduleDomUpdate,
      scrollActiveImageColumn,
    ]
  );

  const onMouseEnter = (area: ScrollAreaType) => {
    setHoveredArea(area);
  };

  const onMouseLeave = () => {
    setHoveredArea(undefined);
  };

  const handleTouchStart = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    setHoveredArea(area);
    onTouchStart(e);
  };

  const onResetScrolls = () => {
    mainScrollValueRef.current = 0;
    imageScrollValuesRef.current = [0, 0, 0];
    activeScrollTargetRef.current = "main";
    setHoveredArea(undefined);
    applyScrollTransforms();
  };

  return {
    scrollArea: hoveredArea,
    onMouseEnter,
    onMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel,
    onResetScrolls,
  };
};