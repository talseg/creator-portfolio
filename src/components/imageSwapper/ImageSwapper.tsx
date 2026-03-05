
import type { Image } from "./../../database/dbInterfaces";
import { useEffect, useRef, useState } from "react";
import { useImagesPreload } from "./useImagePreload";
import styled, { keyframes } from "styled-components";

const SWAP_INTERVAL = 2500;


// Adjust all the images height to the first image height
const ImagesWrapper = styled.div<{ $height: number | undefined }>`
  display: flex;
  width: 100%;

  ${({ $height }) => $height ? `height: ${$height}px;` : ""}
  position: relative;
  overflow: hidden;
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
  height: 100%;
`

const SingleImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

export interface ImageSwapperProps {
  images: Image[];
  showNext?: boolean;
  showNextDone?: () => void;
}

export const ImageSwapper: React.FC<ImageSwapperProps> = ({ images, showNext, showNextDone }) => {

  // Image index is the index of the currently displayed index
  const [imageIndex, setimageIndex] = useState(0);
  const [displayTwoImages, setDisplayTwoImages] = useState(false);
  const [firstImageHeight, setFirstImageHeight] = useState<number | undefined>(undefined);

  const shouldDecode = true;
  const { successImages, status } = useImagesPreload(images, shouldDecode);
  const firstImageRef = useRef<HTMLImageElement | null>(null);

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

    if (showNext) {
      triggerAnimation();
      showNextDone?.();
      return;
    }

    const id = setTimeout(triggerAnimation, SWAP_INTERVAL);

    return () => clearTimeout(id);
  }, [successImages.length, imageIndex, showNext, showNextDone]);


  const handleFirstImageLoad = () => {
    if (firstImageRef.current) {
      setFirstImageHeight(firstImageRef.current.clientHeight);
    }
  }

  // until all images are loaded and the first image height was set - display just the first one
  if (status !== "done" || firstImageHeight === undefined || successImages.length === 1)
    return (
      <ImagesWrapper $height={firstImageHeight}>
        <FirstImage src={images[0]?.imageUrl} 
          ref={firstImageRef} 
          key={images[0]?.id}
          onLoad={handleFirstImageLoad} />
      </ImagesWrapper>
    );

  let prevImageIndex: number = 0;
  if (displayTwoImages)
    prevImageIndex = imageIndex === 0 ? successImages.length - 1 : imageIndex - 1;

  const handleAnimationEnd = () => {
    setDisplayTwoImages(false);
  }

  return (
    <ImagesWrapper $height={firstImageHeight}>
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
    </ImagesWrapper>
  );
};