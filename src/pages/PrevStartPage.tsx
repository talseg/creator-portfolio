import pkg from "../../package.json";
import { ProjectGallery } from "../components/projectGallery/ProjectGallery";
import styled from "styled-components";

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  text-align: center;
  min-height: 100vh;
  min-width: 98vw;
`;

const NameStyled = styled.div`
  font-size: 30px;
  text-decoration: underline;
  color: black;
`;

export const PrevStartPage: React.FC = () => {

  return (
    <WrapperStyled>
      <h1>
        <a href="https://www.orsegal.net">
          <NameStyled>Or Segal</NameStyled>
        </a>
      </h1>
      <h1>Portfolio</h1>
      <ProjectGallery />

      <p
        style={{
          color: "#888"
        }}>
        version: {pkg.version}
      </p>
    </WrapperStyled>
  )
}