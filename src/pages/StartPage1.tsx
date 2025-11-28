
import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import myImage from "../images/MainPicture.jpg";
import { useEffect, useState, type ReactElement } from "react";
import { fetchProjects } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";
import type { Project } from "../database/dbInterfaces";


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
  grid-template-rows: 4.625rem auto;
  justify-items: center;

  height: 100vh;
  overflow-y: auto;

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
  height: 100%;
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

const MiddleSection = styled.div`
  display: flex;
  width: 100%;
  height: 45rem;
  grid-column: 2 / -1;
  background: white;
  margin-left: -8rem;
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

export const StartPage1: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);


  const renderProjectImages = (option?: "reverse" | "alternate") => {

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

      <MainGridStyled>

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

        <MiddleSection>
          <MainImage src={myImage}></MainImage>
        </MiddleSection>

        <ImagesColumn $column={2}>
          <ImagesContainer>
            {
              renderProjectImages()
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn $column={3}>
          <ImagesContainer>
            {
              renderProjectImages("alternate")
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn $column={4}>
          <ImagesContainer>
            {
              renderProjectImages("reverse")
            }
          </ImagesContainer>
        </ImagesColumn>

      </MainGridStyled>

    </WrapperStyled>
  )
}