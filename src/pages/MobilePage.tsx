import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components"
import OrSegalSvg from "../assets/orSegal.svg?react";
import type { CategoryType } from "../database/dbInterfaces";
import { renderProjectImages } from "../utilities/projectUtils";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

const StyledLogo = styled(OrSegalSvg)`
  height: 36px;
`;

const LogoBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  margin-left: 20px;
`

const ColumnsWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  -webkit-overflow-scrolling: touch;
`

const VerticalLine = styled.div`
  position: sticky;
  top: 0;
  border-left: 1.0px solid black;
  height: 100%;
  grid-column: 4;
`;

const VerticalLine1 = styled.div`
  border-left: 1.0px solid black;
  height: 100%;
  grid-column: 4;
  grid-row: 2;
`;

const Column = styled.div<{ $isActive: boolean }>`
  flex: 0 0 85vw;   /* ← THIS is the key line */

  display: grid;
  /*                     left gap  image  right gap  line      */ 
  grid-template-columns: 4.4vw     1fr    4.4vw      2px;
  grid-template-rows: 1fr 1fr;

  height: 100vh;
  overflow-x: hidden;
  /* padding-left: 16px; */

  /* display: flex;
  flex-direction: column; */
  
  scroll-snap-align: center;

  -webkit-overflow-scrolling: touch;

  /* hide scrollbar */
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE / old Edge */

  &::-webkit-scrollbar {
    display: none;              /* Chrome / Safari / iOS */
  }

  img {
    filter: grayscale(100%) brightness(0.9);
  };

  ${({ $isActive }) => $isActive && css`
   img {
    filter: grayscale(0%);
    transition: filter 1000ms ease;
   }
  `}
  
`;

const Header = styled.div<{ $isActive: boolean }>`
  width: 100%;
  /* margin-left: 4vw; */
  height: 50px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  transition: background-color 800ms ease-out;
  ${({ $isActive }) =>
    $isActive ? css`
       background-color: #FFFDB4;` :
      css`
       transition: none;`
  }
`

const HeaderRow = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  grid-column: 2;
`;

export const MobilePage: React.FC = observer(() => {

  const columnRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const projects = projectsStore.projects;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {

          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      {
        root: wrapperRef.current, // viewport
        threshold: 0.9            // mostly visible
      }
    );

    columnRefs.current.forEach(col => {
      if (col) observer.observe(col);
    });

    return () => observer.disconnect();
  }, []);

  return (

    <Page>

      <LogoBox>
        <LogoLinkWrapper href="https://www.orsegal.net"><StyledLogo /></LogoLinkWrapper>
      </LogoBox>

      <ColumnsWrapper ref={wrapperRef}>

        {(["designer", "artist", "illustrator"] as CategoryType[]).map(
          (category, index) => {
            const isActive = activeIndex === index;
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            return (
              <Column
                $isActive={isActive}
                key={category}
                ref={(el) => {
                  if (el) columnRefs.current[index] = el;
                }}
                data-index={index}
              >
                <HeaderRow>
                  <Header $isActive={isActive}>{categoryName}</Header>
                </HeaderRow>

                <VerticalLine />

                <div style={{ gridColumn: 2 }}>
                  {renderProjectImages(projects, category, isActive, "1rem")}
                </div>

                <VerticalLine1 />

              </Column>
            )
          }
        )}
      </ColumnsWrapper>

    </Page>
  )
});