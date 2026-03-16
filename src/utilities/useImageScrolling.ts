import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// import { useRafScrollEngine } from "./useRafScrollEngine";
import { useVelocityFingerScroll } from "./useVelocotyFingerScroll";
import { projectsStore } from "../stores/projecrStore";

/**
 * useImageScrolling
 *
 * Custom scroll engine for the portfolio desktop layout.
 *
 * The page contains two independent vertical scroll layers:
 *
 * 1. Main section (top content)
 *    - Scrolls upward until it collapses.
 *
 * 2. Image columns (bottom section)
 *    - Each column contains a vertical list of images.
 *    - Images can scroll independently.
 *
 * Scroll routing depends on:
 * - pointer location (middle / column / outside)
 * - whether the middle section is collapsed
 * - which layer currently "owns" the scroll interaction
 *
 * Special UX behavior:
 * When the pointer is over an image column and the user scrolls
 * upward to reveal the previous image, the column may scroll even
 * before the middle section collapses.
 */

export type ScrollAreaType = undefined | "middle" | 1 | 2 | 3;
type ActiveScrollTarget = "main" | "images";

interface ImageScrollingProps {
  middledRef: React.RefObject<HTMLDivElement | null>;
  imageContainerRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
  middleSectionHeight: number;
}

/**
 * Encodes scroll routing state.
 *
 * Format: "<pointerArea>_<collapseState>"
 *
 * pointerArea:
 *   none | middle | 1 | 2 | 3
 *
 * collapseState:
 *   open      -> middle section not yet collapsed
 *   collapsed -> middle section fully collapsed
 */
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

const USE_PARTIAL_SCROLL = true;

export const useImageScrolling = (props: ImageScrollingProps) => {
  const { imageRefs, imageContainerRefs, middledRef, middleSectionHeight } = props;

  const [hoveredArea, setHoveredArea] = useState<ScrollAreaType>(undefined);

  // Current vertical offset of the middle section
  const mainScrollValueRef = useRef(0);

  // Vertical offsets of each image column
  const imageScrollValuesRef = useRef<[number, number, number]>([0, 0, 0]);

  /**
   * Determines which layer currently "owns" scrolling.
   *
   * "main"   -> scrolling affects the middle section
   * "images" -> scrolling affects image columns
   */
  const activeScrollTargetRef = useRef<ActiveScrollTarget>("main");

  const rafScheduledRef = useRef(false);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const getPixelSizeByRem = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize);

  /**
   * Applies the current scroll offsets to the DOM.
   *
   * The middle section and image containers move together,
   * while the images inside the containers move independently.
   */
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

  /**
   * Initialize scroll values from MobX store
   */
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

  /**
   * Track pointer position globally so scroll routing can
   * detect which element is under the pointer.
   */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  /**
   * Determines which layout area is currently under the pointer.
   *
   * Wheel events themselves do not provide reliable element
   * information when custom scrolling is used.
   */
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

  /**
   * Prevents an image column from scrolling beyond its last image.
   */
  const getClampedImageScrollValue = useCallback(
    (columnIndex: number, proposedImageScrollValue: number, currentImageScrollValue: number) => {
      const columnRef = imageRefs.current[columnIndex];
      if (!columnRef?.current) return currentImageScrollValue;

      const rect = columnRef.current.getBoundingClientRect();

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

  /**
   * Handles normal middle-section scrolling.
   */
  const applyMainScroll = useCallback((proposedMainScrollValue: number, collapseHeight: number) => {
    if (proposedMainScrollValue < -collapseHeight) {
      mainScrollValueRef.current = -collapseHeight;
      activeScrollTargetRef.current = "images";
    } else if (proposedMainScrollValue > 0) {
      mainScrollValueRef.current = 0;
      activeScrollTargetRef.current = "main";
    } else {
      mainScrollValueRef.current = proposedMainScrollValue;
      activeScrollTargetRef.current = "main";
    }
  }, []);

  const switchFromImageScrollToMain = useCallback((columnIndex: number, delta: number) => {
    imageScrollValuesRef.current[columnIndex] = 0;
    activeScrollTargetRef.current = "main";

    const proposedMainScrollValue = mainScrollValueRef.current - delta;
    mainScrollValueRef.current = proposedMainScrollValue >= 0 ? 0 : proposedMainScrollValue;
  }, []);

  /**
   * Scrolls an active image column.
   */
  const scrollActiveImageColumn = useCallback(
    (columnIndex: number, delta: number) => {
      const currentImageScrollValue = imageScrollValuesRef.current[columnIndex];
      if (currentImageScrollValue === undefined) return;

      const proposedImageScrollValue = currentImageScrollValue - delta;

      if (proposedImageScrollValue > 0) {
        switchFromImageScrollToMain(columnIndex, delta);
        return;
      }

      let nextImageScrollValue = proposedImageScrollValue;

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

  /**
   * Partial scroll behavior.
   *
   * Allows scrolling the image column upward even before the
   * middle section collapses.
   */
  const canRevealPreviousImageBeforeCollapse = useCallback(
    (columnIndex: number | undefined, delta: number): boolean => {
      if (!USE_PARTIAL_SCROLL) return false;
      if (columnIndex === undefined) return false;
      if (delta >= 0) return false;

      const currentImageScrollValue = imageScrollValuesRef.current[columnIndex];
      if (currentImageScrollValue === undefined) return false;

      const proposedImageScrollValue = currentImageScrollValue - delta;
      return proposedImageScrollValue <= 0;
    },
    []
  );

  const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, isTouchGestureActive } =
    useVelocityFingerScroll({
      onDeltaYScroll: (delta) => applyScroll(delta),
    });

  const getEffectivePointerArea = useCallback((): ScrollAreaType => {
    return isTouchGestureActive ? hoveredArea : detectAreaUnderPointer();
  }, [detectAreaUnderPointer, hoveredArea, isTouchGestureActive]);

  /**
   * Core scroll routing algorithm.
   *
   * Determines whether the scroll should affect:
   * - the middle section
   * - an image column
   */
  const applyScroll = useCallback(
    (deltaY: number) => {
      if (!middledRef.current) return;

      const pointerArea = getEffectivePointerArea();

      if (!isTouchGestureActive && pointerArea !== hoveredArea) {
        setHoveredArea(pointerArea);
      }

      const collapseHeight = middleSectionHeight * getPixelSizeByRem();

      const activeColumnIndex =
        pointerArea === 1 || pointerArea === 2 || pointerArea === 3
          ? pointerArea - 1
          : undefined;

      const isMiddleCollapsed = mainScrollValueRef.current <= -collapseHeight;
      const proposedMainScrollValue = mainScrollValueRef.current - deltaY;

      const stateKey =
        `${pointerArea ?? "none"}_${isMiddleCollapsed ? "collapsed" : "open"}` as StateKey;

      switch (stateKey) {

        // Pointer outside image columns or over middle section.
        case SCROLL_STATE.NONE_OPEN:
        case SCROLL_STATE.NONE_COLLAPSED:
        case SCROLL_STATE.MIDDLE_OPEN:
        case SCROLL_STATE.MIDDLE_COLLAPSED: {
          applyMainScroll(proposedMainScrollValue, collapseHeight);
          break;
        }

        // Pointer over column while middle still open.
        case SCROLL_STATE.COLUMN_1_OPEN:
        case SCROLL_STATE.COLUMN_2_OPEN:
        case SCROLL_STATE.COLUMN_3_OPEN: {
          if (canRevealPreviousImageBeforeCollapse(activeColumnIndex, deltaY)) {
            scrollActiveImageColumn(activeColumnIndex!, deltaY);
          } else {
            applyMainScroll(proposedMainScrollValue, collapseHeight);
          }
          break;
        }

        // Pointer over column and middle collapsed.
        case SCROLL_STATE.COLUMN_1_COLLAPSED:
        case SCROLL_STATE.COLUMN_2_COLLAPSED:
        case SCROLL_STATE.COLUMN_3_COLLAPSED: {
          if (activeColumnIndex === undefined) break;

          const shouldScrollImages =
            activeScrollTargetRef.current === "images" &&
            pointerArea !== undefined &&
            pointerArea !== "middle";

          if (!shouldScrollImages) {
            applyMainScroll(proposedMainScrollValue, collapseHeight);
            break;
          }

          scrollActiveImageColumn(activeColumnIndex, deltaY);
          break;
        }
      }

      scheduleDomUpdate();
    },
    [
      applyMainScroll,
      canRevealPreviousImageBeforeCollapse,
      getEffectivePointerArea,
      hoveredArea,
      isTouchGestureActive,
      middleSectionHeight,
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
