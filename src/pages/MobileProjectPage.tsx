import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";
import { ImageSwapper } from "../components/imageSwapper/ImageSwapper";
import LabelText from "../components/labeltext/LabelText";
import styled from "styled-components";

const PageWrapper = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background: inherit;
`

const StyledSpinner = styled(CircularProgress)`
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  justify-self: center;
`;

const ErrorWrapper = styled.div`
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  justify-self: center;
  color: red;
  font-size: 50px; 
`

const ImagesSwapperStyled = styled(ImageSwapper)`
  width: 100%;
  height: inherit;
  margin-top: 1rem;
`;

const ProjectInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: .8rem;
`

const renderSpinner = () => {
  return (
    <PageWrapper>
      <StyledSpinner />
    </PageWrapper>
  );
}

const renderError = () => {
  return (
    <PageWrapper>
      <ErrorWrapper>Error</ErrorWrapper>
    </PageWrapper>
  );
}

export const MobileProjectPage: React.FC = observer(() => {

  const { projectId } = useParams<{ projectId: string }>();

  const displayProject = projectsStore.allLoaded && projectId;

  if (!displayProject) return renderSpinner();

  const project = projectsStore.projects.find((proj) => proj.id === projectId);
  if (!project || !project.images) return renderError();

  return (
    <PageWrapper>
      <div>
        <ProjectInfoStyled>
          <LabelText>{project.projectName} {project.projectYear}</LabelText>
          <LabelText>{project.header}</LabelText>
        </ProjectInfoStyled>
        <ImagesSwapperStyled images={project.images} key={"swapper-" + project.id} />
      </div>
    </PageWrapper>
  );
});