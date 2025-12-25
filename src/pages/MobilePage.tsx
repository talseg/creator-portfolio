import { useEffect, useState, type ReactElement } from "react";
import styled from "styled-components"
import { fetchProjects } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";
import type { CategoryType, Project } from "../database/dbInterfaces";
import ProjectImage from "../components/projectImage/ProjectImage";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  -webkit-overflow-scrolling: touch;
  gap: 30px;
`

const Column = styled.div`
  flex: 0 0 80vw;   /* ← THIS is the key line */
  margin-left: 10vw;
  margin-right: 10vw;

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
`;

const renderProjectImages = (projects: Project[], category: CategoryType, isActive: boolean): ReactElement[] =>
  projects.filter((proj, index) => proj.category === category && index !== 11).map<ReactElement>(
    (proj, i) =>
      <ProjectImage project={proj}
        key={`project-${i}`}
        isActive={isActive}
        fontSize="1rem"></ProjectImage>
  );

const Header = styled.div`
  background-color: #FFFDB4;
  width: 72vw;
  margin-left: 4vw;
  height: 50px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`

const VerticalLine = styled.div`
  border-left: 1px solid black;
  height: 100%;
  margin-left: 4vw;
`;

const HeaderRow = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
`;

export const MobilePage: React.FC = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (err) {
        logException(err);
      }
    }
    loadProjects();
  }, []);


  return (
    <Wrapper>
      <Column>
        <HeaderRow>
          <Header>Designer</Header>
          <VerticalLine/>
        </HeaderRow>
          {renderProjectImages(projects, "designer", true)}
      </Column>

      <Column>
        <HeaderRow>
          <Header>Artist</Header>
          <VerticalLine/>
        </HeaderRow>
          {renderProjectImages(projects, "artist", true)}
      </Column>

      <Column>
        <HeaderRow>
          <Header>Artist</Header>
          <VerticalLine/>
        </HeaderRow>
          {renderProjectImages(projects, "illustrator", true)}
      </Column>

    </Wrapper>
  )
}