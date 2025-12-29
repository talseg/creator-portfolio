import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components"
import OrSegalSvg from "../assets/orSegal.svg?react";
import type { CategoryType, Project } from "../database/dbInterfaces";
import { renderProjectImages } from "../utilities/projectUtils";

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
  gap: 10px;
`

const Column = styled.div<{ $isActive: boolean }>`
  flex: 0 0 85vw;   /* ← THIS is the key line */
  margin-left: 0vw;
  margin-right: 0vw;

  height: 100vh;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  
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
  margin-left: 4vw;
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

const VerticalLine = styled.div`
  border-left: 1.0px solid black;
  height: 100%;
  margin-left: 4.4vw;
`;

const HeaderRow = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
`;

interface MobilePageProps {
  projects: Project[];
}

export const MobilePage: React.FC<MobilePageProps> = ({ projects }) => {

  const columnRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
                  <VerticalLine />
                </HeaderRow>

                {renderProjectImages(projects, category, isActive, "1rem")}
              </Column>
            )
          }
        )}
      </ColumnsWrapper>

    </Page>
  )
}