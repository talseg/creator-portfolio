import { useEffect, useRef, useState, useMemo } from "react";
import type { Image } from "./../../database/dbInterfaces";

type PreloadStatus = "idle" | "loading" | "done";

interface UseImagesPreloadResult {
  status: PreloadStatus;
  successImages: Image[];
  failedImages: Image[];
  handled: number;
  total: number;
}

export function useImagesPreload(
  imagesToLoadList: Image[],
  decode: boolean = false
): UseImagesPreloadResult {

  const total = imagesToLoadList.length;

  const [handled, setHandled] = useState(0);
  const [successIds, setSuccessIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  // Stable container: we mutate this array, we never replace it
  const createdImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    setHandled(0);
    setSuccessIds(new Set());
    setFailedIds(new Set());

    let cancelled = false;

    // Clear without replacing the array object
    createdImagesRef.current.length = 0;

    const cleanup = () => {
      cancelled = true;
      for (const el of createdImagesRef.current) {
        el.onload = null;
        el.onerror = null;
      }
      // Clear without replacing (keeps the container stable)
      createdImagesRef.current.length = 0;
    };

    if (total === 0) {
      return cleanup;
    }

    const markHandled = (el: HTMLImageElement) => {
      // prevent any double-fire
      el.onload = null;
      el.onerror = null;
      setHandled(h => h + 1);
    };

    const markSuccess = (id: string) => {
      setSuccessIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    };

    const markFail = (id: string) => {
      setFailedIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    };

    for (const img of imagesToLoadList) {
      const el = new Image();
      createdImagesRef.current.push(el);

      el.onload = async () => {

        if (cancelled) return;
        if (decode) {
          try {
            await el.decode();
          } catch {
            if (cancelled) return;
            markFail(img.id);
            markHandled(el);
            return;
          }
          if (cancelled) return;
        }
        markSuccess(img.id);
        markHandled(el);
      };

      el.onerror = () => {
        if (cancelled) return;
        markFail(img.id);
        markHandled(el);
      };

      el.src = img.imageUrl;
    }

    return cleanup;
  }, [imagesToLoadList, total, decode]);

  const { successImages, failedImages } = useMemo(() => {
    const success: Image[] = [];
    const failed: Image[] = [];

    for (const img of imagesToLoadList) {
      if (successIds.has(img.id)) success.push(img);
      else if (failedIds.has(img.id)) failed.push(img);
    }

    return { successImages: success, failedImages: failed };
  }, [imagesToLoadList, successIds, failedIds]);

  const status: PreloadStatus =
    total === 0 ? "done" :
      handled < total ? "loading" :
        "done";

  return { status, successImages, failedImages, handled, total };
}