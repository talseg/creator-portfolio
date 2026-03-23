import styled from "styled-components";
import type { Project } from "../../database/dbInterfaces";
import LabelText from "../labeltext/LabelText";
import errorImage from "../../images/cats.png";

const TOP_GAP = 0;
const IMAG_HEIGHT = 70;
const IMAGE_TO_NAME_GAP = 3;
export const IMAGE_WIDTH_PERCENT = 100;

const Wrapper = styled.div`
  display: grid;
  align-items: start;
  justify-content: flex-end;
  grid-template-columns: 1fr ${IMAGE_WIDTH_PERCENT}% 1fr;
  grid-template-rows: ${TOP_GAP}% ${IMAG_HEIGHT}% ${IMAGE_TO_NAME_GAP}% auto;
  height: 50vh;
  width: 100%;
  position: relative;
  overflow: visible;
`;

const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
  grid-row: 2;
  grid-column: 2;
  cursor: pointer;
`
const ProjectNameWrapper = styled(LabelText)`
  display: flex;
  width: 100%;
  justify-content: start;
  grid-row: 4;
  grid-column: 2 / -1;
  position: relative;
  align-items: center;
  color: black;
`;

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProjectYearStyled = styled.span`
  padding: 0 0 0 0.8rem;
  font-style: normal;
`;
interface ProjectImageProps {
  project: Project;
  className?: string;
  onProjectSelected?: (projectId: string) => undefined;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ project, className, onProjectSelected }) => {

  const url = project.projectImageUrl ? project.projectImageUrl : errorImage;
  return (
    <div style={{ display: "flex" }}
      onClick={() => onProjectSelected && onProjectSelected(project.id)}
      className={className + " image-column-wrapper"}>

      <Wrapper>
        <ImageWrapper><ImageStyled src={url} /></ImageWrapper>
        <ProjectNameWrapper>
          <span>
            {project.projectName}
            {(project.projectYear !== 0) && <ProjectYearStyled>{project.projectYear}</ProjectYearStyled>}
          </span>
        </ProjectNameWrapper>
      </Wrapper>

    </div>
  )
}

export default ProjectImage;