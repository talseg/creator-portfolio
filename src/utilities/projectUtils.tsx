import type { ReactElement } from "react";
import ProjectImage from "../components/projectImage/ProjectImage";
import type { CategoryType, Project } from "../database/dbInterfaces"

export const renderProjectImages = (projects: Project[], category: CategoryType, 
  isActive: boolean, fontSize?: string,
  onProjectSelected?: (projectId: string) => undefined
): ReactElement[] =>
  projects.filter((proj, index) => proj.category === category && index !== 11).map<ReactElement>(
    (proj) =>
      <ProjectImage project={proj}
        key={`project-${proj.id}`}
        isActive={isActive}
        fontSize={fontSize}
        onProjectSelected={onProjectSelected}/>
  );