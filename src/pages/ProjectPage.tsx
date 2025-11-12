import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseDb } from "../database/FirebaseDb";
import { getExceptionString, logException } from "../utilities/exceptionUtils";
import styled from "styled-components";
import type { DatabaseType, Project } from "../database/dbInterfaces";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 24px;
  min-height: 100vh;
`;

const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #222;
  text-align: center;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProjectImage = styled.img`
  max-width: 30rem;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const LoadingText = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  color: #444;
`;

const ErrorText = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  color: red;
`;


export const ProjectPage: React.FC = () => {

    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState<string | null>(null);
    const db: DatabaseType = FirebaseDb;

    useEffect(() => {
        if (!projectId) return;
        (async () => {
            try {
                const project = await db.fetchProjectById(projectId);
                setProject(project);
            } catch (err) {
                logException(err);
                setError(getExceptionString(err));
            }
        })();
    }, [projectId]);

    if (!projectId) return <ErrorText>❌ can not load project {projectId}</ErrorText>;
    if (error) return <ErrorText>❌ {error}</ErrorText>;
    if (!project) return <LoadingText>⏳ Loading…</LoadingText>;

    return (
    <PageContainer>
      <ProjectTitle>{project.projectName}</ProjectTitle>

      <ImagesContainer>
        {project.images?.map((img) => (
            <ProjectImage src={img.imageUrl} alt={`Image ${img.imageIndex}`} />
        ))}
      </ImagesContainer>
    </PageContainer>
  );

}