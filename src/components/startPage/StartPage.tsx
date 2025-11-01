
import styled from "styled-components";
import pkg from "../../../package.json";
import cats from "../../images/cats.png";

const WrapperStyled = styled.div`
       display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 1280px;
      text-align: center;
      margin: 0;
`;


export const StartPage: React.FC = () => {

  return (
    <WrapperStyled>
      <h1>
        <a href="https://www.orsegal.net">
          <div style={{
            fontSize: "50px", 
            margin: "0px",
            textDecoration: "underline"
          }}>Or Segal 1</div>
        </a>
      </h1>
      <h1 style={{ margin: "0px" }}>Portfolio</h1>
      <div>
        <button onClick={() => {}}>
          Upload
        </button>
      </div>
      <img src={cats} alt="Portfolio Image" 
        style={{ width: "90%", maxWidth: "600px" }}
      />
      <p
        style={{
          color: "#888"
        }}>
        version: {pkg.version}
      </p>
    </WrapperStyled>
  )
}