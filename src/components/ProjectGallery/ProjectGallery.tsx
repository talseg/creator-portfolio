import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../database/firebaseConfig";
import styled from "styled-components";

interface Image {
    imageUrl: string;
    imageIndex: number;
}

interface Project {
    id: string;
    projectName: string;
    header: string;
    projectImageUrl: string;
    projectIndex: number;
    images?: Image[];
}


// ---------- Styled Components ----------
const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
`;

const ProjectCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectInfo = styled.div`
  padding: 16px;
`;

const ProjectTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
`;

const ProjectHeader = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #444;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #ff0000;
`;

export const ProjectGallery: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, "projects"), orderBy("projectIndex", "asc"));
                const snapshot = await getDocs(q);

                const projectsData: Project[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Project, "id">),
                }));
                setProjects(projectsData);
            } catch (error) {
                const errorMsg = (error as Error).message;
                console.error("Error loading projects:", errorMsg);
                setError(errorMsg)
            }
            finally {
                setLoading(false);
            }
        };

        // Simulate loading time
        setTimeout(fetchProjects, 3000);

    }, []);

    if (error) return (
        <ErrorText>Error: {error}</ErrorText>
    )
    if (loading) return (
        <LoadingText>⏳Loading Projects...</LoadingText>
    );




    return (
        <GalleryContainer>
            {projects.map((project) => (
                <ProjectCard key={project.id}>
                    <ProjectImage src={project.projectImageUrl} alt={project.projectName} />
                    <ProjectInfo>
                        <ProjectTitle>{project.projectName}</ProjectTitle>
                        <ProjectHeader>{project.header}</ProjectHeader>
                    </ProjectInfo>
                </ProjectCard>
            ))}
        </GalleryContainer>
    );
}
