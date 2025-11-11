import { useEffect, useState } from "react"
import type { Project } from "../../database/dbInterfaces";
  import { FirebaseDb } from "../../database/FirebaseDb";
import { getExceptionString, logException } from "../../utilities/exceptionUtils";



export const AdminPage: React.FC = () => {

    const [projects, setProjects] = useState<Project[]>([]);


    useEffect(() => {

        const loadProjects = async () => {
            try {
                const projectsData = await FirebaseDb.fetchProjects();
                setProjects(projectsData);
            } catch (err) {
                logException(err);
                // ToDo - remove, just for first dev
                alert(getExceptionString(err))
            }
        }
        loadProjects();
    }, []);

    return (
        <div 

        style={{ 
            color: "black", fontSize: "30px"
            
            }}>
            Admin Page num projects: {projects.length}
        </div>
    )
}