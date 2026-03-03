import { useEffect, useRef, useState } from "react";
import type { Image } from "./../../database/dbInterfaces";

interface ImagesPreloadProps {
  imagesToLoadList: Image[];
  onAllLoaded: (successImages: Image[], failedImages: Image[]) => void;
}

interface ImageInfo {
  image: Image;
  isLoadedOK: boolean;
}

// hold images for one crousel;
// loads the images one by one and updates a loaded images array.
// for now - notify the user when all images are loaded.

// startup
export const useImagesPreload = (props: ImagesPreloadProps) => {

  const { imagesToLoadList, onAllLoaded } = props;
  const [loadedOrErrorImages, setLoadedOrErrorImages] = useState<Map<string, ImageInfo>>(new Map());
  const imageObjects = useRef<Map<string, HTMLImageElement | undefined>>(new Map());
  const done = useRef<boolean>(false);

  // startup
  useEffect(() => {
    const handleImageLoadedOrError = (image: Image, isOK: boolean) => {
      if (done.current) return;
      setLoadedOrErrorImages((prev) => {
        const newImageInfo: ImageInfo = {
          image: image,
          isLoadedOK: isOK
        }
        const next = new Map(prev);
        next.set(image.id, newImageInfo);
        return next;
      });
    }

    const registerOnImageUpdate = (image: Image, imageData: HTMLImageElement) => {
      imageData.onload = () => handleImageLoadedOrError(image, true);
      imageData.onerror = () => handleImageLoadedOrError(image, false);
    }
    const unregisterOnImageUpdates = (imageData: HTMLImageElement) => {
      imageData.onload = null;
      imageData.onerror = null;
    }

    const cleanup = () => {
      done.current = true;
      imageObjects.current.forEach((img) => img && unregisterOnImageUpdates(img));
      imageObjects.current.clear();
    }

    done.current = false;
    imagesToLoadList.forEach((image) => {
      const imageData: HTMLImageElement = new Image();
      registerOnImageUpdate(image, imageData);
      imageData.src = image.imageUrl;
      imageObjects.current.set(image.id, imageData)
    });

    return cleanup;

  }, [imagesToLoadList]);

  // exit condition
  useEffect(() => {
    if (done.current) return;
    if (loadedOrErrorImages.size === imagesToLoadList.length) {
      const successImages: Image[] = [];
      const failedImages: Image[] = [];
      imagesToLoadList.forEach(img => {
        const info = loadedOrErrorImages.get(img.id);
        if (!info) return;
        (info.isLoadedOK ? successImages : failedImages).push(info.image);
      });
      onAllLoaded(successImages, failedImages);
      done.current = true;
    }

  }, [imagesToLoadList, loadedOrErrorImages, onAllLoaded]);
}