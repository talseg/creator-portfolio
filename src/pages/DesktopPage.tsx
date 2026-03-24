import { createRef, useRef, useState } from "react";
import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import { useImageScrolling, type ScrollAreaType } from "../scrolling/useImageScrolling";
import { renderProjectImages } from "../utilities/projectUtils";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";
import { ImbededProjectPage } from "./ImbededProjectPage";
import { categoryToIndex, numberToScrollArea } from "../utilities/IndexMapUtils";
import { categories, type CategoryType } from "../database/dbInterfaces";
import { DesktopStaticInfo } from "./DesktopStaticInfo";
import pkg from '../../package.json';
import LabelText from "../components/labeltext/LabelText";

const WrapperStyled = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;

  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    #b8dde3 100%
  );
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

const TAB_BACKGROUND = "#B8DDE3"

const HeaderTextBox = styled.div<{ $isActive: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  background-color: ${({ $isActive }) => $isActive ? TAB_BACKGROUND : "transparent"};
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
  grid-template-columns: 5.4fr 10fr 10fr 10fr;
  grid-template-rows: 4.625rem auto;
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
  grid-template-columns: 5.4fr 10fr 10fr 10fr;
  grid-template-rows: 1fr auto;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  height: calc(100% + 5px);
`;

const HeaderTextStyled = styled(LabelText) <{ $isActive: boolean }>`
  font-weight: ${({ $isActive }) =>
    $isActive ? "bold" : "normal"};
`;

const HeaderBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: white;

  @media (hover: hover) and (pointer: fine) {
  &:hover  ${HeaderTextBox} {
    background: ${TAB_BACKGROUND};
  }

  &:hover ${HeaderTextStyled} {
    font-weight: bold;
  }
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
  justify-self: end;
`;

const ImagesContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  grid-column: 1;
  flex-direction: column;
  padding: 0 6% 0 6%;

  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.55)};
  transition: opacity 250ms ease;

  img {
    filter: ${({ $isActive }) =>
    $isActive ? "grayscale(0%)" : "grayscale(100%) brightness(0.9)"};
    transition: filter 250ms ease;
  }
`;

const ImagesColumn = styled.div<{ $column: number }>`
  grid-row: 3;
  grid-column: ${({ $column }) => $column};
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  align-self: flex-start;
  overflow: hidden;
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

const VersionStyled = styled(LabelText)`
  grid-row: 3;
  align-self: end;
  justify-self: start;
  margin:  0 0 4px 14px;
  font-size: 0.8rem;
`

const StaticInfoStyled = styled(DesktopStaticInfo)`
  height: 80vh;
`;

export const DesktopPage: React.FC = observer(() => {

  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
  const [hoveredTab, setHoveredTab] = useState<number | undefined>(undefined);
  const middledRef = useRef<HTMLDivElement>(null);
  const imageColumnRefs = useRef(categories.map(() => createRef<HTMLDivElement>()));
  const imageContainerRefs = useRef(categories.map(() => createRef<HTMLDivElement>()));
  const projects = projectsStore.projects;

  const { onMouseEnter, onMouseLeave, scrollArea,
    onTouchStart, onTouchEnd,
    onTouchMove, onTouchCancel, onResetScrolls } = useImageScrolling(
      {
        middledRef,
        imageColumnRefs,
        imageContainerRefs
      }
    );

  const isColumnActive = (category: CategoryType): boolean => categoryToIndex[category] === scrollArea;

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

  const renderProjectCategories = () => {

    return categories.map((category, i) => {
      const area = numberToScrollArea(i);
      const key = `images-column-${i}`;
      const isLastColumn = i === categories.length - 1;

      return (
        <ImagesColumn className={key} key={key}
          ref={imageColumnRefs.current[i]}
          $column={i + 2}
          onMouseEnter={() => onMouseEnter(area)}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart(area, e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}
        >
          <ImagesContainer $isActive={scrollArea === area || hoveredTab === area}
            ref={imageContainerRefs.current[i]}>
            {
              renderProjectImages(projects, category, onProjectSelected)
            }
          </ImagesContainer>

          {!isLastColumn && <VerticalLine />}

        </ImagesColumn>
      )
    })
  }

  return (
    <WrapperStyled>

      <MainGridStyled className="main-page-grid"
        onTouchStart={(e) => handleTouchStart(undefined, e)}
        onTouchEnd={(e) => handleTouchEnd(e)}
        onTouchMove={(e) => handleTouchMove(e)}
      >

        <HeaderRow className="header-row">

          <HeaderBox>
            <LogoBox>
              <LogoLinkWrapper href="https://www.orsegal.net"><StyledLogo /></LogoLinkWrapper>
            </LogoBox>
          </HeaderBox>

          <HeaderBox
            onClick={() => removeSelectedProject()}
            onMouseEnter={() => setHoveredTab(0)}
            onMouseLeave={() => setHoveredTab(undefined)}
          >
            <HeaderTextBox $isActive={isColumnActive("designer")}>
              <HeaderTextStyled $isActive={isColumnActive("designer")}>Designer</HeaderTextStyled>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox onClick={() => removeSelectedProject()}
            onMouseEnter={() => setHoveredTab(1)}
            onMouseLeave={() => setHoveredTab(undefined)}
          >
            <HeaderTextBox $isActive={isColumnActive("artist")}>
              <HeaderTextStyled $isActive={isColumnActive("artist")}>Artist</HeaderTextStyled>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox onClick={() => removeSelectedProject()}
            onMouseEnter={() => setHoveredTab(2)}
            onMouseLeave={() => setHoveredTab(undefined)}
          >
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

        <MiddleSection className="middle-section"
          // Top Moving section
          ref={middledRef}
          onMouseEnter={() => onMouseEnter("middle")}
          onMouseLeave={() => onMouseLeave()}
          onTouchStart={(e) => handleTouchStart("middle", e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchCancel={onTouchCancel}>
          {
            selectedProject ?
              <ImbededProjectPage projectId={selectedProject} pageWidthVw={100} />
              :
              <StaticInfoStyled />
          }
        </MiddleSection>

        {renderProjectCategories()}

        <VersionStyled>version:{pkg.version}</VersionStyled>

      </MainGridStyled>

    </WrapperStyled>
  )
});
