
import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";

const WrapperStyled = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;


const MainGridStyled = styled.div`
  display: grid;
  font-size: 20px;
  width: 100%;
  grid-template-columns: 1fr 1fr auto 1fr auto 1fr;
  grid-template-rows: 4.625rem auto auto 1fr;
  justify-items: center;
`;

// const BigButton = styled.button`
//   width: 100%;
//   height: 100%;

//   background: transparent;
//   border: none;
//   padding: 0;
//   margin: 0;

//   cursor: pointer;

//   /* Remove outline on focus */
//   outline: none;

//   /* Optional: disable default focus ring */
//   &:focus {
//     outline: none;
//   }

// `;

const TitleText = styled.div`
  font-family: EditorSans;
  font-size: 0.9375rem;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.02813rem;
`;

const HeaderBox = styled.div<{ $color?: string }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const VerticalLine = styled.div`
  width: 1px;
  background: black;
  height: 100%;
`;

const VerticalLongLine = styled.div`
  width: 100%;
  background: black;
  height: 1px;
  grid-row: 2;
  grid-column-start: 1;
  grid-column-end:7;
`;

const DotStyled = styled.div`
  width: 6px;
  height: 6px;
  background: black;
  border-radius: 50%;
  align-self: end;
  margin-left: -3px;
  margin-bottom: -3px;
  grid-row: 1;
  grid-column: 1;
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

export const StartPage1: React.FC = () => {

  return (
    <WrapperStyled>

      <MainGridStyled>
        <LogoLinkWrapper href="https://www.orsegal.net"><OrSegalSvg/></LogoLinkWrapper>
        <HeaderBox style={{ background: "#FFFDB4", width: "100%", alignItems: "center", justifyItems: "center" }}>
          <TitleText>Designer</TitleText>
        </HeaderBox>
        <div style={{ display: "grid" }}>
          <VerticalLine style={{ gridRow: 1, gridColumn: 1 }}/>
          <DotStyled/>
        </div> 
        <HeaderBox>
          <TitleText>Artist</TitleText>
        </HeaderBox>
        <div style={{ display: "grid" }}>
          <VerticalLine style={{ gridRow: 1, gridColumn: 1 }}/>
          <DotStyled/>
        </div> 
        <HeaderBox>
          <TitleText>Illustrator</TitleText>
        </HeaderBox>
        <VerticalLongLine/>

      </MainGridStyled>

    </WrapperStyled>
  )
}