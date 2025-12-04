import styled from "styled-components";
import type { Project } from "../../database/dbInterfaces";
import LabelText from "../labeltext/LabelText";
import { useNavigate } from "react-router-dom";
import errorImage from "../../images/cats.png";

const TOP_GAP = 0;
const IMAG_HEIGHT = 70;
const IMAGE_TO_NAME_GAP = 3;
const IMAGE_WIDTH_PERCENT = 90;

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
`
const ProjectNameWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  grid-row: 4;
  grid-column: 2 / -1;
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

// const LeftImageDot = styled.div`
//   width: 5px;
//   height: 5px;
//   background: black;
//   border-radius: 50%;
//   transform: translate(7px, -3px);
//   z-index: 100;
//   grid-column: 3;
//   grid-row: 3; 
//   position: relative;
// `;

const ProjectImage: React.FC<{ project: Project }> = ({ project }) => {

  // console.log(project);
  const navigate = useNavigate();

  const url = project.projectImageUrl ? project.projectImageUrl : errorImage;
  return (
    <ColumnWrapper onClick={() => navigate(`/project/${project.id}`)}>
      <Wrapper>
        <ImageWrapper><ImageStyled src={url} /></ImageWrapper>
        <ProjectNameWrapper>

          <LabelText fontSize="1vw">
            {project.projectName}
          </LabelText>

        </ProjectNameWrapper>
        
      </Wrapper>

      <VerticalLine/>
      
    </ColumnWrapper>
  )
}

export default ProjectImage;