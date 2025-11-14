import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseDb } from "../database/FirebaseDb";
import { getExceptionString, logException } from "../utilities/exceptionUtils";
import styled from "styled-components";
import type { DatabaseType, Project, Image } from "../database/dbInterfaces";
import { Box, CircularProgress } from "@mui/material";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  min-height: 100vh;
`;

const ProjectTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
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

export const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

export const ProjectPage: React.FC = () => {

  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [numLoadedImages, setNumLoadedImages] = useState(0)
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




  }, [db, projectId]);

  const onImageLoaded = (): void => {
    setNumLoadedImages(v => v + 1);
    // console.log(`onImageLoaded index: ${image.imageIndex} numLoadedImages: ${loadedImages.size + 1} of ${project?.images?.length}`);


    // setLoadedImages(prev => {
    //   console.log("******************************");
    //   console.log("set BEFORE size:", loadedImages.size);
    //   const updated = new Set(prev);
    //   updated.add(image.imageUrl);
    //   console.log(`set AFTER: size: ${updated.size} `);
    //   console.log("******************************");

    //   return updated;
    // });
  }

  if (!projectId) return <ErrorText>❌ can not load project {projectId}</ErrorText>;
  if (error) return <ErrorText>❌ {error}</ErrorText>;
  //if (!project) return <LoadingText>⏳ Loading…</LoadingText>;
  if (!project) {
    console.log("waiting for project");
    //return CircularIndeterminate();
    // return <LoadingText>⏳ Waiting for project loading…</LoadingText>;
  }

  const allLoaded = Boolean(project && numLoadedImages === project.images?.length);

  return (
    
    <PageContainer>

      {!allLoaded && CircularIndeterminate()}

      {project && project.projectName && allLoaded && <ProjectTitle>{project.projectName}</ProjectTitle>}

      {project && 
      <ImagesContainer>
        {project.images?.map(
          (img, i) => {

            return (
              <div key={i}>
                <ProjectImage
                  $visible={allLoaded}
                  src={img.imageUrl} alt={`Image ${img.imageIndex}`} key={i}
                  onLoad={() => onImageLoaded()} onError={() => {
                    onImageLoaded();
                    console.log(`Got error for image number ${i}`)
                  }} />
              </div>);
          }

        )}
      </ImagesContainer>}

    </PageContainer>
  );

}