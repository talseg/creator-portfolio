import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseDb } from "../database/FirebaseDb";
import { getExceptionString, logException } from "../utilities/exceptionUtils";
import styled from "styled-components";
import type { Project } from "../database/dbInterfaces";
import { CircularProgress } from "@mui/material";


const PageWrapper = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
`;

const StyledSpinner = styled(CircularProgress)`
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  justify-self: center;
`;

const DataWrapper = styled.div`
  grid-row: 1;
  grid-column: 1;
  align-self: start;
  justify-self: start;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  min-height: 100vh;
`;

const TitleWrapper = styled.div<{ $visible: boolean }>`
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 2.5s ease;
`;

const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  max-width: 33rem;
  text-align: center;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProjectImage = styled.img<{ $visible: boolean }>`
  max-width: 30rem;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 1.5s ease;

  &:hover {
    transform: scale(1.03);
  }
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
  const [numLoadedImages, setNumLoadedImages] = useState(0)
  const db = FirebaseDb;

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
  }, [db, projectId]);

  const onImageLoaded = (): void => {
    setNumLoadedImages(v => v + 1);
  }

  if (!projectId) return <ErrorText>❌ Wrong project ID: {projectId}</ErrorText>;
  if (error) return <ErrorText>❌ {error}</ErrorText>;

  const allLoaded = Boolean(project && numLoadedImages === project.images?.length);

  return (

    <PageWrapper>

      {project &&
        <DataWrapper>

          <TitleWrapper $visible={allLoaded}>
            <ProjectTitle>{project.projectName}</ProjectTitle>
          </TitleWrapper>

          <ImagesContainer>
            {project.images?.map((img, i) =>
              <ProjectImage
                $visible={allLoaded}
                src={img.imageUrl} alt={`Image ${img.imageIndex}`} key={i}
                onLoad={() => onImageLoaded()} onError={() => {
                  onImageLoaded();
                  console.log(`Got error for image number ${i}`)
                }} />
            )}
          </ImagesContainer>
        </DataWrapper>
      }

      {!allLoaded && <StyledSpinner />}

    </PageWrapper>
  );

}