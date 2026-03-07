import { useEffect, useState } from "react";
import { DesktopPage } from "./DesktopPage";
import { MobilePage } from "./MobilePage";

export type InteractionMode = "desktop-columns" | "mobile-swipe";

export const MainPage: React.FC = () => {

  // This is the implementation according to view size
  // const [mode, setMode] = useState<InteractionMode>(() =>
  //   window.innerWidth > window.innerHeight ? "desktop-columns" : "mobile-swipe"
  // );

  // useEffect(() => {
  //   const onResize = () => {
  //     const next =
  //       window.innerWidth > window.innerHeight
  //         ? "desktop-columns"
  //         : "mobile-swipe";

  //     if (next !== mode) {
  //       setMode(next);
  //     }
  //   };

  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // }, [mode]);

  // this implements the request desktp site.
  function isMobileDevice() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uaData = (navigator as any).userAgentData;

  if (uaData?.mobile !== undefined) {
    return uaData.mobile;
  }

  return /Android|iPhone|Mobi/i.test(navigator.userAgent);
  }


  return (
    //mode === "desktop-columns" ?
    isMobileDevice() ?
      <MobilePage /> : 
      <DesktopPage /> 
  );
}