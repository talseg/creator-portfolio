import styled from "styled-components";
import StarSvg from "../assets/star.svg?react";
import MainImagePng from "../images/MainPicture.png";


const MainImageWrapper = styled.div<{ $height: string }>`
    display: grid;
    grid-template-columns: 25% auto 1fr; 
    grid-template-rows: 5fr 50fr 5fr;
    height: ${({ $height }) => $height};
`;

const MainInfoWrapper = styled.div`
  grid-row: 2;
  grid-column: 3;
  display: grid;
  grid-template-rows: 2fr auto auto auto auto 1fr;
  grid-template-columns: minmax(3.5rem, 15%) auto;
  margin-right: 1.5rem;
`;

const HorizontalLongLine = styled.div`
  width: 100%;
  background: black;
  height: 1px;
  grid-column: 1 / -1;
`;

const IsMyBlock = styled.div`
  width: 100%;
  height: 100%;
  grid-row: 2;
  grid-column: 2;
  font-family: "EditorSans";
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
`;

const ProjectText = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff01;
  grid-row: 3;
  grid-column: 2;
  font-family: "EditorSans";
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  max-height: 50vh;
  overflow: hidden;
`;

const FirstLineWrapper = styled.div`
  width: 100%;
  grid-column: 1 / -1;
  grid-row: 4;
`;

const CollegeText = styled.div`
  height: 3rem;
  background-color: #ffffff01;
  grid-row: 4;
  grid-column: 2;
  font-family: "EditorSans";
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const SimpleDot = styled.div`
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 50%;
  transform: translate(2px, -3px);
`;

const SecondLineWrapper = styled.div`
  width: 100%;
  grid-column: 1 / -1;
  grid-row: 5;
`;

const MainImage = styled.img`
  object-fit: cover;
  justify-content: center;
  grid-column: 2;
  grid-row: 2;
  height: 100%;
  min-height: 0;
`;

interface DesktopStaticInfoProps {
  className?: string;
  height: string;
}

export const DesktopStaticInfo: React.FC<DesktopStaticInfoProps> = ({ height, className }) => 

    <MainImageWrapper $height={height} className={`main-image-wrapper ${className}`} >

      <MainInfoWrapper>

        <div style={{ display: "flex", alignItems: "center", gridColumn: 1, gridRow: 2 }}>
          <HorizontalLongLine />
          <StarSvg style={{ marginTop: 2, paddingRight: "1rem" }} />
        </div>

        <IsMyBlock>
          Is My
        </IsMyBlock>

        <ProjectText>
          <p>
            IS MY is a project of wandering and research in cemeteries.
            In London I discovered that cemeteries are located within the city.
            People cycle through them, read on benches, and sometimes there
            are even cafés inside. Since I grew up with the Jewish perception that
            the cemetery is an impure place (where one must wash their hands upon leaving),
            I was fascinated by the perception of death as part of life.
          </p>
        </ProjectText>

        <FirstLineWrapper>

          <div style={{ display: "flex" }}>
            <HorizontalLongLine />
            <SimpleDot style={{ marginLeft: "-5px", marginTop: "1px" }} />
          </div>
        </FirstLineWrapper>

        <CollegeText>
          Royal College of Art, 2024
        </CollegeText>

        <SecondLineWrapper>
          <div style={{ display: "flex" }}>
            <HorizontalLongLine />
            <SimpleDot style={{ marginLeft: "-5px", marginTop: "1px" }} />
          </div>
        </SecondLineWrapper>
      </MainInfoWrapper>

      <MainImage src={MainImagePng}/>

    </MainImageWrapper>