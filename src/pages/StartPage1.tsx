
import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import myImage from "../images/MainPicture.jpg";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { fetchProjects } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";
import type { Project } from "../database/dbInterfaces";
import { imageListClasses } from "@mui/material";


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
  height: 25rem;
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

type scrollAreaType = undefined | "middle" | "designer" | "artist" | "illustrator";

export const StartPage1: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);
  const [scrollArea, setScrollArea] = useState<scrollAreaType>(undefined);
  const [mainScrollValue, setMainScrollValue] = useState<number>(0);
  const [scrollValue1, set1scrollValue1] = useState(0);
  const [scrollValue2, set1scrollValue2] = useState(0);
  const [scrollValue3, set1scrollValue3] = useState(0);

  const middledRef = useRef<HTMLDivElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);


useEffect(() => {

  const updateTransforms = () => {
    if (!middledRef.current || !image1Ref.current || 
      !image2Ref.current || !image3Ref.current) return;

    //const gridRef = mainGridRef as unknown as HTMLDivElement
    
    middledRef.current.style.transform = `translateY(${mainScrollValue}px)`;
    image1Ref.current.style.transform = `translateY(${mainScrollValue}px)`;
    image2Ref.current.style.transform = `translateY(${mainScrollValue}px)`;
    image3Ref.current.style.transform = `translateY(${mainScrollValue}px)`;
  }


  function onWheel(e: WheelEvent) {
    e.preventDefault();
    if (!middledRef.current) return;
    const scrollAmount = e.deltaY;
    console.log(`scrollValue : `, scrollAmount);
    console.log(`mainScrollValue : `, mainScrollValue);
    const newMainScrollValue = mainScrollValue - scrollAmount;
    
    if (newMainScrollValue < -408) {
      setMainScrollValue(-408);
      //console.log(`scrollAmount was more then : -408 keeping it -408`);
      //set1scrollValue1((value) => value - scrollAmount);
      //set1scrollValue2(scrollValue2 - scrollAmount);
      //set1scrollValue3(scrollValue3 - scrollAmount);

    }
    else {
      setMainScrollValue((newMainScrollValue));
      console.log(`scrollAmount after fix : `, newMainScrollValue);
    }
    updateTransforms();
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  return () => window.removeEventListener("wheel", onWheel);
  
}, [mainScrollValue]);


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

  const switchToScrollArea = (area: scrollAreaType): void => {
    setScrollArea(area);
    console.log(`switched to scroll area: ${area}`);
  }

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
          onMouseEnter={() => switchToScrollArea("middle")}
          onMouseLeave={() => switchToScrollArea(undefined)}
        >
          <MainImage src={myImage}></MainImage>
        </MiddleSection>

        <ImagesColumn ref={image1Ref}
          $column={2}
          onMouseEnter={() => switchToScrollArea("designer")}
          onMouseLeave={() => switchToScrollArea(undefined)}
        >
          <ImagesContainer>
            {
              renderProjectImages(projects)
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn ref={image2Ref}
          $column={3}
          onMouseEnter={() => switchToScrollArea("artist")}
          onMouseLeave={() => switchToScrollArea(undefined)}
        >
          <ImagesContainer>
            {
              renderProjectImages(projects, "alternate")
            }
          </ImagesContainer>
          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn ref={image3Ref}
          $column={4}
          onMouseEnter={() => switchToScrollArea("illustrator")}
          onMouseLeave={() => switchToScrollArea(undefined)}
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