import { useEffect, useState } from "react";
import { StartPage1 } from "./StartPage1";
import { fetchProjects } from "../database/FirebaseDb";
import type { Project } from "../database/dbInterfaces";
import { logException } from "../utilities/exceptionUtils";
import { MobilePage } from "./MobilePage";

export type InteractionMode = "desktop-columns" | "mobile-swipe";

export const MainPage: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);

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

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (err) {
        logException(err);
      }
    }
    loadProjects();
  }, []);


  return (
    mode === "desktop-columns" ?
      <StartPage1 projects={projects} /> :
      <MobilePage projects={projects} />
  );
}