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
  background-color: #0000ff36;
  grid-template-columns: ${IMAGE_WIDTH_PERCENT}% 1fr 10px;
  grid-template-rows: ${TOP_GAP}% ${IMAG_HEIGHT}% ${IMAGE_TO_NAME_GAP}% auto;
  height: 50vh;
  width: 100%;
  position: relative;
  overflow: visible;
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
  background-color: #ffff00;
  grid-row: 4;
  grid-column: 1 / -1;
  position: relative;
`;

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

`

const ColumnWrapper = styled.div`
  display: flex;  
`;

const VerticalLine = styled.div`
  border-left: 1px solid black;
  height: 100%;
`;

const LeftImageDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
  transform: translate(7px, -3px);
  z-index: 100;
  grid-column: 3;
  grid-row: 3; 
  position: relative;

`;

const ProjectImage: React.FC<{ project: Project }> = ({ project }) => {

  // console.log(project);

  return (
    <ColumnWrapper>
      <Wrapper>
        <ImageWrapper><ImageStyled src={project.projectImageUrl} /></ImageWrapper>
        <ProjectNameWrapper>

          <LabelText fontSize="0.9em">
            {project.projectName}
          </LabelText>


        </ProjectNameWrapper>
        
        <LeftImageDot/>
        
        
      </Wrapper>

      <VerticalLine/>
      
    </ColumnWrapper>
  )
}

export default ProjectImage;