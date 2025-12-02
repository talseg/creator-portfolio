import { useEffect, useState } from "react";

interface ImageScrollingProps {
    imageRefs: React.RefObject<React.RefObject<HTMLDivElement | null>[]>;
    middledRef: React.RefObject<HTMLDivElement | null>;
    middleSectionHeight: number;
  }

type ScrollAreaType = undefined | "all" | 1 | 2 | 3;

export const useImageScrolling = (props: ImageScrollingProps) : { 
    onMouseEnter: (area: ScrollAreaType) => void,
    onMouseLeave: () => void
} => {

    const { imageRefs, middledRef, middleSectionHeight } = props;
    const [scrollArea, setScrollArea] = useState<ScrollAreaType>(undefined);
    const [mainScrollValue, setMainScrollValue] = useState<number>(0);
    const [scrollValues, setScrollValues] = useState<number[]>([0, 0, 0]);
    const [shouldUpdateImages, setShouldUpdateImages] = useState(false);

    const getPixelSizeByRem = (): number =>
        parseFloat(getComputedStyle(document.documentElement).fontSize);

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    useEffect(() => {

        function onWheel(e: WheelEvent) {
            e.preventDefault();
            if (!middledRef.current) return;
            const delta = e.deltaY;
            const newMain = mainScrollValue - delta;
            console.log(newMain);
            const rem = getPixelSizeByRem();
            const collapseHeight = middleSectionHeight * rem

            // In one of the three scroll areas and in scroll area mode
            // (the top is fully collapsed)
            if (shouldUpdateImages && scrollArea && scrollArea !== "all") {
                const index = scrollArea - 1; // 1→0, 2→1, 3→2
                const current = scrollValues[index] ?? 0;
                const newValue = current - delta;

                // Reached the limit → freeze child, resume main scroll
                if (newValue > 0) {
                    setScrollValues(prev => {
                        const copy = [...prev];
                        copy[index] = 0;
                        return copy;
                    });
                    setShouldUpdateImages(false);
                    setMainScrollValue(v => v - delta);
                }
                else {
                    // Continue scrolling the inner column
                    setScrollValues(prev => {
                        const copy = [...prev];
                        copy[index] = newValue;
                        return copy;
                    });
                }
            }
            // scroll passsed the middle section entering scroll image mode
            else if (newMain < -collapseHeight) {
                console.log("Images are at the top");
                setMainScrollValue(-collapseHeight);
                setShouldUpdateImages(true);
            }
            // all page scrolled to the top
            else if (newMain > 0) {
                console.log("all page scrolled to the top");
                setMainScrollValue(0);
            }
            else {
                console.log("scrolling the middle section");
                setMainScrollValue(v => v - delta);
                setShouldUpdateImages(false);
            }
        }

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => window.removeEventListener("wheel", onWheel);

    }, [mainScrollValue, middleSectionHeight, middledRef, scrollArea, scrollValues, shouldUpdateImages]);


    useEffect(() => {

        const updateTransforms = () => {
            if (!middledRef.current) return;
            middledRef.current.style.transform = `translateY(${mainScrollValue}px)`;

            imageRefs.current.forEach((ref, index) => {
                if (!ref.current) return;
                if (scrollValues[index] === undefined) return; // satisfy typescript 
                ref.current.style.transform = `translateY(${mainScrollValue + scrollValues[index]}px)`;
            });
        }
        updateTransforms();

    }, [imageRefs, mainScrollValue, middledRef, scrollValues])

  const onMouseEnter = (area: ScrollAreaType): void => {
    setScrollArea(area);
  }

  const onMouseLeave = (): void => {
    setScrollArea(undefined);
  }

  return { onMouseEnter, onMouseLeave };

}