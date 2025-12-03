import styled from "styled-components";
import type { Project } from "../../database/dbInterfaces";
import LabelText from "../labeltext/LabelText";

const TOP_GAP = 10;
const IMAG_HEIGHT = 70;
const IMAGE_TO_NAME_GAP = 10;

const IMAGE_WIDTH_PERCENT = 90;

const Wrapper = styled.div`
  display: grid;
  align-items: start;
  justify-content: flex-end;
  background-color: blue;
  grid-template-columns: ${IMAGE_WIDTH_PERCENT}% 1fr;
  grid-template-rows: ${TOP_GAP}% ${IMAG_HEIGHT}% ${IMAGE_TO_NAME_GAP}% auto;
  height: 50vh;
`;

const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
  background-color: orange;
  grid-row: 2;
  grid-column: 1;
`
const ProjectNameWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  background-color: yellow;
  grid-row: 4;
  grid-column: 1 / -1;
`;

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`


const ProjectImage: React.FC<{ project: Project }> = ({ project }) => {

  console.log(project);

  return (
    <Wrapper>
      <ImageWrapper><ImageStyled src={project.projectImageUrl} /></ImageWrapper>
      <ProjectNameWrapper>

          <LabelText fontSize="0.9em">
            {project.projectName}
          </LabelText>


      </ProjectNameWrapper>
    </Wrapper>
  )
}

export default ProjectImage;