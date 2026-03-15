
import type { Image } from "./../../database/dbInterfaces";
import { useEffect, useState } from "react";
import { useImagesPreload } from "./useImagePreload";
import styled, { keyframes } from "styled-components";
import { NextButton } from "../nextButton/NextButton";

const SWAP_INTERVAL = 2500;

const NextWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  transition: opacity 250ms ease, transform 250ms ease;
  color: black;

  /* default: visible, for touch devices */
  opacity: 1;
  pointer-events: auto;

  /* only devices that truly support hover get the hover behavior */
  @media (hover: hover) and (pointer: fine) {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(10px);
  }
`;

const ImagesWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;

  &:hover ${NextWrapper} {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
    pointer-events: auto;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const SlidingImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${slideIn} 500ms ease-out forwards;
`;

const FirstImage = styled.img`
  width: 100%;
  height: auto;
`

const SingleImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const SizerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;        /* invisible */
  pointer-events: none;
`;

export interface ImageSwapperProps {
  images: Image[];
  className?: string;
}

export const ImageSwapper: React.FC<ImageSwapperProps> = ({ images, className }) => {

  // Image index is the index of the currently displayed index
  const [imageIndex, setimageIndex] = useState(0);
  const [displayTwoImages, setDisplayTwoImages] = useState(false);
  const [doNext, setDoNext] = useState(false);

  const shouldDecode = true;
  const { successImages, status } = useImagesPreload(images, shouldDecode);

  // Startup
  useEffect(() => {
    const n = successImages.length;
    if (n <= 1) return;

    const triggerAnimation = () => {
      setDisplayTwoImages(true);
      setimageIndex(prev => {
        const next = prev + 1;
        return next >= n ? 0 : next;
      });
    }

    if (doNext) {
      triggerAnimation();
      setDoNext(false);
      return;
    }

    const id = setTimeout(triggerAnimation, SWAP_INTERVAL);

    return () => clearTimeout(id);
  }, [successImages.length, imageIndex, doNext]);


  // until all images are loaded and the first image height was set - display just the first one
  if (status !== "done" || successImages.length === 1)
    return (
      <ImagesWrapper>
        <FirstImage src={images[0]?.imageUrl}
          key={"first-image-" + images[0]?.id} />
      </ImagesWrapper>
    );

  let prevImageIndex: number = 0;
  if (displayTwoImages)
    prevImageIndex = imageIndex === 0 ? successImages.length - 1 : imageIndex - 1;

  const handleAnimationEnd = () => {
    setDisplayTwoImages(false);
  }

  const showNextButton = successImages.length >= 2;

  return (
    <ImagesWrapper className={className}>
      <SizerImage src={images[0]?.imageUrl ?? images[0]?.imageUrl} />
      {
        displayTwoImages ?
          <div >
            <SingleImage src={successImages[prevImageIndex]?.imageUrl} key={successImages[prevImageIndex]?.id} />
            <SlidingImage
              src={successImages[imageIndex]?.imageUrl}
              onAnimationEnd={handleAnimationEnd}
              key={successImages[imageIndex]?.id} />
          </div>
          :
          <SingleImage src={successImages[imageIndex]?.imageUrl}
            key={successImages[imageIndex]?.id} />
      }

      { showNextButton &&
        <NextWrapper className="next-wrapper">
          <NextButton onClick={() => { setDoNext(true) }} />
        </NextWrapper>
      }

    </ImagesWrapper>
  );
};