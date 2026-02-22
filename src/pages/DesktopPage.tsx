import styled, { css } from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import myImage from "../images/MainPicture.png";
import type { CategoryType } from "../database/dbInterfaces";
import { useImageScrolling, type ScrollAreaType } from "../utilities/useImageScrolling";
import LabelText from "../components/labeltext/LabelText";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { renderProjectImages } from "../utilities/projectUtils";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";
import { ImbededProjectPage } from "./ImbededProjectPage";

const WrapperStyled = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

const HeaderTextBox = styled.div<{ $isActive: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  background-color: ${({ $isActive }) => $isActive ? "#FFFDB4" : "transparent"};
  transition: background-color 400ms ease-out;
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

  touch-action: none;
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

const HeaderTextStyled = styled(LabelText) <{ $isActive: boolean }>`
  font-weight: ${({ $isActive }) =>
    $isActive ? "bold" : "normal"};
`;

const HeaderBox = styled.div`
  display: flex;
  background: #6205db53;
  width: 100%;
  height: 100%;
  background: white;

  &:hover  ${HeaderTextBox} {
    background: #FFFDB4;
  }

  &:hover ${HeaderTextStyled} {
    font-weight: bold;
  }
  cursor: pointer;
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
  grid-column: 1 / -1;
  z-index: 10;
  justify-self: end;
`;

const MainImage = styled.img`
  object-fit: cover;
  justify-content: center;
`;

const ImagesContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  grid-column: 1;
  flex-direction: column;
  padding: 0 5% 0 5%;
  
  img {
    filter: grayscale(100%) brightness(0.9);
  };

  ${({ $isActive }) => $isActive && css`
   img {
    filter: grayscale(0%);
    transition: filter 250ms ease;
   }
  `}
`;

const ImagesColumn = styled.div<{ $column: number }>`
  grid-row: 3;
  grid-column: ${({ $column }) => $column};
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
   align-self: flex-start;
`

const VerticalLine = styled.div<{ gridColumn?: number }>`
  border-left: 1px solid black;
  height: 100%;
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
`;

const SimpleDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
  transform: translate(2px, -3px);
`;




export const DesktopPage: React.FC = observer(() => {

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const middledRef = useRef<HTMLDivElement>(null);
  const imageRef1 = useRef<HTMLDivElement>(null);
  const imageRef2 = useRef<HTMLDivElement>(null);
  const imageRef3 = useRef<HTMLDivElement>(null);
  const imageRefs = useRef([imageRef1, imageRef2, imageRef3]);
  const [middleSectionHeightRem, setMiddleSectionHeightRem] = useState(window.innerHeight / 30);

  useLayoutEffect(() => {
    const el = middledRef.current;
    if (!el || !selectedProject) {
      setMiddleSectionHeightRem(window.innerHeight / 30);
      return;
    }

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const update = () => {
      const hPx = el.getBoundingClientRect().height;
      const hRem = hPx / rem;
      setMiddleSectionHeightRem(hRem);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, [selectedProject, windowHeight]);

  const projects = projectsStore.projects;

  useEffect(() => {
    const onResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  const { onMouseEnter, onMouseLeave, scrollArea,
    onTouchStart, onTouchEnd,
    onTouchMove, onTouchCancel, onResetScrolls } = useImageScrolling(
      {
        imageRefs,
        middledRef,
        middleSectionHeight: middleSectionHeightRem
      }
    );

  const isColumnActive = (area: CategoryType): boolean => {
    if (area === "designer") return scrollArea === 1;
    if (area === "artist") return scrollArea === 2;
    if (area === "illustrator") return scrollArea === 3;
    return false;
  }

  const handleTouchStart = (area: ScrollAreaType, e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onTouchStart(area, e);
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onTouchEnd(e);
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onTouchMove(e);
  }

  const onProjectSelected = (projectId: string): undefined => {
    setSelectedProject(projectId);
    onResetScrolls();
  }

  const removeSelectedProject = () => {
    setSelectedProject(undefined);
    onResetScrolls();
  }

  return (
    <WrapperStyled>

      <MainGridStyled className="main-page-grid"
        onTouchStart={(e) => handleTouchStart(undefined, e)}
        onTouchEnd={(e) => handleTouchEnd(e)}
        onTouchMove={(e) => handleTouchMove(e)}
      >

        <HeaderRow>

          <HeaderBox>
            <LogoBox>
              <LogoLinkWrapper href="https://www.orsegal.net"><StyledLogo /></LogoLinkWrapper>
            </LogoBox>
          </HeaderBox>

          <HeaderBox onClick={() => removeSelectedProject()}>
            <HeaderTextBox $isActive={isColumnActive("designer")}>
              <HeaderTextStyled $isActive={isColumnActive("designer")}>Designer</HeaderTextStyled>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox onClick={() => removeSelectedProject()}>
            <HeaderTextBox $isActive={isColumnActive("artist")}>
              <HeaderTextStyled $isActive={isColumnActive("artist")}>Artist</HeaderTextStyled>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox onClick={() => removeSelectedProject()}>
            <HeaderTextBox $isActive={isColumnActive("illustrator")}>
              <HeaderTextStyled $isActive={isColumnActive("illustrator")}>Illustrator</HeaderTextStyled>
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

        <MiddleSection ref={middledRef} className="middle-section"
          onMouseEnter={() => onMouseEnter("middle")}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart("middle", e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}
        >
          {
            selectedProject ? <ImbededProjectPage projectId={selectedProject} pageWidthVw={100} /> :
              <div style={{
                height: `${middleSectionHeightRem}rem`, display: "flex",
                width: "100%",
                background: "linear-gradient(to right,#96BFC5 0%,#a3cfd5 100%)"
              }}>
                <MainImage src={myImage} />
              </div>
          }
        </MiddleSection>

        <ImagesColumn ref={imageRef1}
          $column={2}
          onMouseEnter={() => onMouseEnter(1)}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart(1, e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}
        >
          <ImagesContainer $isActive={scrollArea === 1}>
            {
              renderProjectImages(projects, "designer",
                isColumnActive("designer"), undefined, onProjectSelected)
            }
          </ImagesContainer>

          <VerticalLine />
        </ImagesColumn>

        <ImagesColumn ref={imageRef2}
          $column={3}
          onMouseEnter={() => onMouseEnter(2)}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart(2, e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}
        >

          <ImagesContainer $isActive={scrollArea === 2}>
            {
              renderProjectImages(projects, "artist", isColumnActive("artist"), undefined, onProjectSelected)
            }
          </ImagesContainer>

          <VerticalLine />

        </ImagesColumn>

        <ImagesColumn ref={imageRef3}
          $column={4}
          onMouseEnter={() => onMouseEnter(3)}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart(3, e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}
        >
          <ImagesContainer $isActive={scrollArea === 3}>
            {
              renderProjectImages(projects, "illustrator", isColumnActive("illustrator"), undefined, onProjectSelected)
            }

          </ImagesContainer>
        </ImagesColumn>

      </MainGridStyled>

    </WrapperStyled>
  )
});