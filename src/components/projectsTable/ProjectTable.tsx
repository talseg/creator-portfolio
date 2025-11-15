import type { Project } from "../../database/dbInterfaces";

export interface ProjectTableProps {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = () => {


    return (
        <> 
            Projects Table
        </>
    )
}