import { createContext, useContext } from "react";
import type { Project } from "../../database/dbInterfaces";

interface ProjectTableContextValue {
  // ******** ToDo - Get the projected from here
  projects: Project[];
  updateProject: (project: Project) => void;

  //***** ToDo - Remove */
  setDirty: () => void;
}

export const ProjectTableContext = createContext<ProjectTableContextValue | null>(null);

export const useProjectTable = () => {
  const ctx = useContext(ProjectTableContext);
  if (!ctx) throw new Error("useProjectTable must be used inside ProjectTableProvider");
  return ctx;
};

interface ProviderProps extends ProjectTableContextValue, React.PropsWithChildren {}

export const ProjectTableProvider: React.FC<ProviderProps> = ({
  children,
  projects,
  updateProject,
  setDirty
}) => {

  return (
    <ProjectTableContext.Provider
      value={{
        projects,
        updateProject,
        setDirty
      }}
    >
      {children}
    </ProjectTableContext.Provider>
  );
};
