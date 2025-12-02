import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import myImage from "../images/MainPicture.jpg";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { fetchProjects } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";
import type { Project } from "../database/dbInterfaces";
import { useImageScrolling } from "../utilities/useImageScrolling";

const WrapperStyled = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;

const TitleText = styled.div`
  font-family: EditorSans;
  font-size: 0.9375rem;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.02813rem;
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

const HeaderTextBox = styled.div<{ $color?: string }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const LogoBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
const StyledLogo = styled(OrSegalSvg)`
  width: 100%;
  height: auto;
  max-width: 10rem;
`;

const MainGridStyled = styled.div`
  display: grid;
  font-size: 20px;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 4.625rem auto auto;
  justify-items: center;

  overflow: hidden;
  height: 100vh;
  position: relative;

    /* hide scrollbars */
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* old Edge */
  &::-webkit-scrollbar {
    display: none;             /* Chrome, Safari */
  }
`;

const HeaderRow = styled.div`
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr auto;
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  height: calc(100% + 5px);
`;

const HeaderBox = styled.div`
  display: flex;
  background: #6205db53;
  width: 100%;
  height: 100%;
  background: white;
`

const HorizontalLongLine = styled.div`
  width: 100%;
  background: black;
  height: 1px;
  grid-column: 1 / -1;
`;

const MIDDLE_SECTION_REM_HEIGHT = 30;
const MiddleSection = styled.div`
  display: flex;
  width: 100%;
  height: ${MIDDLE_SECTION_REM_HEIGHT}rem;
  grid-column: 2 / -1;
  background: white;
  margin-left: -8rem;
  z-index: 10;
  justify-self: self-end;
`;

const MainImage = styled.img`
  object-fit: cover;
  justify-content: center;
`;

const ImagesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;;
`;

const ImagesColumn = styled.div<{ $column: number }>`
  grid-row: 3;
  grid-column: ${({ $column }) => $column};
  display: flex;
  width: 100%;
`

const ProjectImage = styled.img`
  width: 100%;
  object-fit: cover;
  margin-right: 10px;
`;

const VerticalLine = styled.div`
  border-left: 1px solid black;
  height: 100%;
`;

const SimpleDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
  transform: translate(2px, -3px);
`;

const renderProjectImages = (projects: Project[], option?: "reverse" | "alternate") => {

  const images: ReactElement[] = [];


  if (option === "reverse") {
    for (let i = projects.length - 1; i >= 0; i--) {
      const project = projects[i];
      if (!project) break;
      const image = <ProjectImage key={i} src={project.projectImageUrl} alt={project.projectName}></ProjectImage>
      images.push(image);
    }
    return images;
  }
  if (option === "alternate") {
    for (let i = 0; i < projects.length; i++) {
      if (i % 2 === 1) continue;
      const project = projects[i];
      if (!project) break;
      const image = <ProjectImage key={i} src={project.projectImageUrl} alt={project.projectName}></ProjectImage>
      images.push(image);
    }
    return images;
  }

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project) break;
    const image = <ProjectImage key={i} src={project.projectImageUrl} alt={project.projectName}></ProjectImage>
    images.push(image);
  }
  return images;
}

export const StartPage1: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const middledRef = useRef<HTMLDivElement>(null);
  const imageRef1 = useRef<HTMLDivElement>(null);
  const imageRef2 = useRef<HTMLDivElement>(null);
  const imageRef3 = useRef<HTMLDivElement>(null);
  const imageRefs = useRef([imageRef1, imageRef2, imageRef3]);

  const { onMouseEnter, onMouseLeave } = useImageScrolling(
    {
      imageRefs,
      middledRef,
      middleSectionHeight: MIDDLE_SECTION_REM_HEIGHT
    }
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        console.log(`num projects: `, projectsData.length);
      } catch (err) {
        logException(err);
      }
    }
    loadProjects();
  }, []);


  return (
    <WrapperStyled>

      <MainGridStyled >

        <HeaderRow>

          <HeaderBox>
            <LogoBox>
              <LogoLinkWrapper href="https://www.orsegal.net"><StyledLogo /></LogoLinkWrapper>
            </LogoBox>
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox style={{ background: "#FFFDB4" }}>
              <TitleText>Designer</TitleText>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox>
              <TitleText>Artist</TitleText>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox>
              <TitleText>Illustrator</TitleText>
            </HeaderTextBox>
          </HeaderBox>

          <HorizontalLongLine></HorizontalLongLine>
          <SimpleDot style={{
            gridColumn: 2,
            justifySelf: "flex-end"
          }}></SimpleDot>
          <SimpleDot style={{
            gridColumn: 3,
            justifySelf: "flex-end"
          }}></SimpleDot>

        </HeaderRow>

        <MiddleSection ref={middledRef}
          onMouseEnter={() => onMouseEnter("middle")}
          onMouseLeave={() => onMouseLeave()}
        >
          <MainImage src={myImage}></MainImage>
        </MiddleSection>

        <ImagesColumn ref={imageRef1}
          $column={2}
          onMouseEnter={() => onMouseEnter(1)}
          onMouseLeave={() => onMouseLeave()}
        >
          <ImagesContainer>
            {
              renderProjectImages(projects)
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn ref={imageRef2}
          $column={3}
          onMouseEnter={() => onMouseEnter(2)}
          onMouseLeave={() => onMouseLeave()}
        >
          <ImagesContainer>
            {
              renderProjectImages(projects, "alternate")
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn ref={imageRef3}
          $column={4}
          onMouseEnter={() => onMouseEnter(3)}
          onMouseLeave={() => onMouseLeave()}
        >
          <ImagesContainer>
            {
              renderProjectImages(projects, "reverse")
            }
          </ImagesContainer>
        </ImagesColumn>

      </MainGridStyled>

    </WrapperStyled>
  )
}