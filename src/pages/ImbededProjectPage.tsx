import { CircularProgress } from "@mui/material";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";
import StarSvg from "../assets/star.svg?react";
import styled from "styled-components";

const PageWrapper = styled.div<{ $pageWidthVw: number }>`
  display: grid;
  
  width: ${({ $pageWidthVw }) => `${$pageWidthVw}vw`};
  height: 100%;
  background: linear-gradient(
    to right,
    #96BFC5 0%,
    #a3cfd5 100%
  );
`;

const StyledSpinner = styled(CircularProgress)`
  grid-row: 1;
  grid-column: 1;
  height: 100%;
  width: 100%;
  align-self: center;
  justify-self: center;
`;

const DataWrapper = styled.div`
  grid-row: 1;
  grid-column: 1;
  align-self: start;
  justify-self: start;

  display: grid;
  grid-template-columns:  7.6fr 10fr;
  column-gap: 0rem;
  row-gap: 0.5rem;
  width: 100%;
  padding: 1.2% 1.2% 7% 3.7%;
  box-sizing: border-box;
`;

const ProjectImage = styled.img<{ $visible: boolean }>`
  width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 1.5s ease;
  grid-column: 2;
`;

const ErrorText = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 1.2rem;
  color: red;
`;

const ProjectInfoWrapper = styled.div<{ $visible: boolean }>`
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 2.5s ease;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  height: auto;
  font-family: EditorSans;
  /* background-color: red; */
  max-height: 80vh;
  
`;

const InfoWrapper = styled.div`
  align-self: flex-end;
  width: 100%;
  padding: 0 5% 0 0;
  /* background-color: red; */
`;

const InfoBox = styled.div`
  display: flex;
  max-width: 33vw;
  height: auto;
  flex-direction: column;
 
`
const ProjectTitle = styled.div`
  color: #222;
  font-size: 0.9375rem;
  font-style: italic;
  font-weight: bold;
  margin-left: 0.5rem;
`;

const ProjectHeader = styled.div`
  color: #222;
  font-size: 0.9375rem;
  font-style: italic;
  margin: 0.4rem 0;
`;

const HorizontalLine = styled.div`
  border-bottom: 1px solid black;
  width: 100%;
`;

const YearSection = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 .6em;
`

const PreYearLine = styled.div`
  border-bottom: 1px solid black;
  width: 1.1em;
`;

const PreYearDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
`;

const YearText = styled.div`
  font-size: 0.9375rem;
  font-style: italic;
  font-weight: bold;
  margin-left: .6em;
`;

const DesignedAt = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  margin: 0.4rem 0;
`

const SimpleDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
  transform: translate(0px, 2px);
  align-self: flex-end;
`;

interface ImbededProjectPageProps {
  projectId: string | undefined;
  pageWidthVw: number;
}

export const ImbededProjectPage: React.FC<ImbededProjectPageProps> = observer(({ projectId, pageWidthVw }) => {

  const projects = projectsStore.projects;
  const project = projects.find((proj) => proj.id === projectId);

  if (!projectId) return <ErrorText>❌ Wrong project ID: {projectId}</ErrorText>;

  //const allLoaded = Boolean(projectsStore.allLoaded && project && numLoadedImages === project.images?.length);
  const allLoaded = projectsStore.allLoaded;

  return (

    <PageWrapper $pageWidthVw={pageWidthVw} className="imbeded-project-page">

      {allLoaded &&
        <DataWrapper className="imbeded-project-data-wrapper">

          <ProjectInfoWrapper $visible={Boolean(project?.projectName)}>

            <InfoWrapper>

              <InfoBox className="info-box">

                <div style={{ display: "flex", marginLeft: "-1.7rem" }} className="title-wrapper">
                  <StarSvg />
                  <ProjectTitle>{project && project.projectName}</ProjectTitle>

                  {project && project.projectYear !== 0 &&
                    <YearSection>
                      <PreYearDot className="dot" />
                      <PreYearLine />
                      <PreYearDot className="dot" />
                      <YearText>{project.projectYear}</YearText>
                    </YearSection>
                  }

                </div>

                {/* this is for debug, identifiying the project */}
                {/* {project && project.id} */}

                <ProjectHeader>{project && project.header}</ProjectHeader>
              </InfoBox>

              <div style={{ display: "flex" }}>
                <HorizontalLine />
                <SimpleDot className="dot" />
              </div>
              {project && project.designedAt &&
                <DesignedAt>
                  <div>Designed at</div>
                  <div style={{ width: "1rem" }}></div>
                  <PreYearDot className="dot" />
                  <PreYearLine />
                  <PreYearDot className="dot" />
                  <div style={{ width: "1rem" }}></div>
                  <div>{project.designedAt}</div>
                </DesignedAt>
              }

              {project && project.designedAt &&
                <div style={{ display: "flex" }}>
                  <HorizontalLine />
                  <SimpleDot className="dot" />
                </div>
              }

            </InfoWrapper>

          </ProjectInfoWrapper>

          {project && project.images?.map((img) => {
            return <ProjectImage
              $visible={allLoaded}
              src={img.imageUrl} alt={`Image ${img.imageIndex}`} key={img.id} />
          }
          )}
        </DataWrapper>
      }

      {!allLoaded && <StyledSpinner />}

    </PageWrapper>
  );

});