import { useEffect, useState } from "react";
import { DesktopPage } from "./DesktopPage";
import { MobilePage } from "./MobilePage";

export type InteractionMode = "desktop-columns" | "mobile-swipe";

export const MainPage: React.FC = () => {

  const [mode, setMode] = useState<InteractionMode>(() =>
    window.innerWidth > window.innerHeight ? "desktop-columns" : "mobile-swipe"
  );

  useEffect(() => {
    const onResize = () => {
      const next =
        window.innerWidth > window.innerHeight
          ? "desktop-columns"
          : "mobile-swipe";

      if (next !== mode) {
        setMode(next);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mode]);


  return (
    mode === "desktop-columns" ?
      <DesktopPage /> :
      <MobilePage />
  );
}