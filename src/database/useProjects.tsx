import { useEffect, useState } from "react";
import type { Project } from "./dbInterfaces";
import { fetchProjects } from "./FirebaseDb";
import { logException } from "../utilities/exceptionUtils";


export const useProjects = () => {

  const [projects, setProjects] = useState<Project[]>([]);

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

  return { projects }
}


